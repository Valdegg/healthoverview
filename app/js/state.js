/**
 * State Management
 * 
 * Defines the data model for evaluations and provides functions to:
 * - Create/update evaluations
 * - Build the full HealthState from schema + measurements
 * - Persist to localStorage
 * - Export/import as JSON
 */

import { BRANCHES } from './schema.js';
import { getReferenceStatus, getRangeDisplayText, REFERENCE_RANGES } from './references.js';

// ============================================
// Data Structures (as per software_specs.md)
// ============================================

/**
 * Evaluation — A single evaluation session for one person
 * 
 * @typedef {Object} Evaluation
 * @property {string} id - Unique identifier
 * @property {string} created_at - ISO datetime when created
 * @property {string} updated_at - ISO datetime when last updated
 * @property {string} [person_name] - Optional name/identifier
 * @property {number} person_age - Age in years
 * @property {"male"|"female"} person_sex - Biological sex for reference ranges
 * @property {Object.<string, Measurement>} measurements - Keyed by metric_id
 * @property {string} [notes] - Optional doctor notes
 */

/**
 * Measurement — A single metric value
 * 
 * @typedef {Object} Measurement
 * @property {string} metric_id - Matches health_schema
 * @property {number|string|null} value - The measured value
 * @property {string} [measured_at] - ISO date, defaults to today
 * @property {string} [context] - Optional context (fasting, morning, etc.)
 */

/**
 * HealthState — The full state vector (output view)
 * 
 * @typedef {Object} HealthState
 * @property {Object} person - { age, sex, name }
 * @property {SystemState[]} systems - All 6 systems with their observables
 * @property {Object} summary - Computed summary stats
 */

/**
 * SystemState — State of one system
 * 
 * @typedef {Object} SystemState
 * @property {string} branch_id
 * @property {string} branch_name
 * @property {ObservableState[]} observables
 * @property {Object} summary - { entered, total, optimal, acceptable, concerning }
 */

/**
 * ObservableState — State of one observable
 * 
 * @typedef {Object} ObservableState
 * @property {string} observable_id
 * @property {string} observable_name
 * @property {number} importance - 1-5
 * @property {string} description
 * @property {MetricState[]} metrics
 * @property {Object} summary - { entered, total, status }
 */

/**
 * MetricState — State of one metric
 * 
 * @typedef {Object} MetricState
 * @property {string} metric_id
 * @property {string} metric_name
 * @property {number|string|null} value
 * @property {string} unit
 * @property {number} fidelity - 1-5
 * @property {string} measurement_method
 * @property {string} reference_status - "optimal"|"acceptable"|"outside_range"|"concerning"|"no_reference"|"not_entered"
 * @property {string} [optimal_range] - Display text like "90–120"
 * @property {string} [context] - Measurement context
 */


// ============================================
// Storage Keys
// ============================================

const STORAGE_PREFIX = 'health-eval-';
const CURRENT_KEY = 'health-eval-current';

/**
 * Generate a storage key from person info
 */
export function getPersonKey(name, age, sex) {
  const namePart = (name || 'unnamed').toLowerCase().replace(/\s+/g, '-').substring(0, 20);
  const agePart = age || 'unknown';
  const sexPart = (sex || 'unknown').substring(0, 1);
  return `${STORAGE_PREFIX}${namePart}-${agePart}-${sexPart}`;
}

/**
 * List all saved evaluations
 */
export function listSavedEvaluations() {
  const evaluations = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX) && key !== CURRENT_KEY) {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        if (data && data.id) {
          evaluations.push({
            key,
            name: data.person_name || 'Unnamed',
            age: data.person_age,
            sex: data.person_sex,
            measurementCount: Object.keys(data.measurements || {}).length,
            updatedAt: data.updated_at
          });
        }
      } catch (e) {
        // Skip invalid entries
      }
    }
  }
  // Sort by most recently updated
  return evaluations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

/**
 * Load a specific evaluation by key
 */
export function loadEvaluationByKey(key) {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load evaluation:', e);
  }
  return null;
}

/**
 * Delete a saved evaluation
 */
export function deleteEvaluationByKey(key) {
  localStorage.removeItem(key);
}

// ============================================
// Evaluation Management
// ============================================

/**
 * Create a new empty evaluation
 */
export function createEvaluation() {
  const now = new Date().toISOString();
  return {
    id: `eval-${Date.now()}`,
    created_at: now,
    updated_at: now,
    person_name: '',
    person_age: null,
    person_sex: null,
    measurements: {},
    notes: ''
  };
}

/**
 * Update person info in evaluation
 */
export function updatePerson(evaluation, { name, age, sex }) {
  return {
    ...evaluation,
    updated_at: new Date().toISOString(),
    person_name: name !== undefined ? name : evaluation.person_name,
    person_age: age !== undefined ? age : evaluation.person_age,
    person_sex: sex !== undefined ? sex : evaluation.person_sex
  };
}

/**
 * Set a measurement value
 */
export function setMeasurement(evaluation, metricId, value, context = null) {
  const measurements = { ...evaluation.measurements };
  
  if (value === null || value === undefined || value === '') {
    delete measurements[metricId];
  } else {
    measurements[metricId] = {
      metric_id: metricId,
      value: typeof value === 'string' ? parseFloat(value) : value,
      measured_at: new Date().toISOString().split('T')[0],
      context: context
    };
  }
  
  return {
    ...evaluation,
    updated_at: new Date().toISOString(),
    measurements
  };
}

/**
 * Update doctor notes
 */
export function updateNotes(evaluation, notes) {
  return {
    ...evaluation,
    updated_at: new Date().toISOString(),
    notes
  };
}


// ============================================
// Health State Builder
// ============================================

/**
 * Build the full HealthState from an evaluation
 * This is the main "state vector" that represents the person's health
 */
export function buildHealthState(evaluation) {
  const { person_age, person_sex, person_name, measurements } = evaluation;
  
  // Build each system's state
  const systems = BRANCHES.map(branch => buildSystemState(branch, measurements, person_age, person_sex));
  
  // Compute overall summary
  const summary = computeOverallSummary(systems);
  
  return {
    person: {
      name: person_name,
      age: person_age,
      sex: person_sex
    },
    evaluation_id: evaluation.id,
    created_at: evaluation.created_at,
    updated_at: evaluation.updated_at,
    systems,
    summary,
    notes: evaluation.notes
  };
}

/**
 * Build state for one system
 */
function buildSystemState(branch, measurements, age, sex) {
  const observables = branch.observables.map(obs => 
    buildObservableState(obs, measurements, age, sex)
  );
  
  // Compute system summary
  const allMetrics = observables.flatMap(o => o.metrics);
  const summary = computeMetricsSummary(allMetrics);
  
  return {
    branch_id: branch.branch_id,
    branch_name: branch.branch_name,
    observables,
    summary
  };
}

/**
 * Build state for one observable
 */
function buildObservableState(observable, measurements, age, sex) {
  const metrics = observable.metrics.map(metric => 
    buildMetricState(metric, measurements, age, sex)
  );
  
  // Compute observable summary
  const summary = computeMetricsSummary(metrics);
  
  return {
    observable_id: observable.observable_id,
    observable_name: observable.observable_name,
    importance: observable.importance,
    description: observable.observable_description,
    metrics,
    summary
  };
}

/**
 * Build state for one metric
 */
function buildMetricState(metric, measurements, age, sex) {
  const measurement = measurements[metric.metric_id];
  const value = measurement?.value ?? null;
  const context = measurement?.context ?? null;
  
  const reference_status = getReferenceStatus(metric.metric_id, value, age, sex);
  const optimal_range = getRangeDisplayText(metric.metric_id, age, sex);
  
  return {
    metric_id: metric.metric_id,
    metric_name: metric.metric_name,
    value,
    unit: metric.unit,
    fidelity: metric.fidelity,
    measurement_method: metric.measurement_method,
    how_well_it_measures: metric.how_well_it_measures,
    reference_status,
    optimal_range,
    context
  };
}


// ============================================
// Summary Computation
// ============================================

/**
 * Compute summary stats for a set of metrics
 */
function computeMetricsSummary(metrics) {
  const total = metrics.length;
  const entered = metrics.filter(m => m.reference_status !== 'not_entered').length;
  const optimal = metrics.filter(m => m.reference_status === 'optimal').length;
  const acceptable = metrics.filter(m => m.reference_status === 'acceptable').length;
  const concerning = metrics.filter(m => m.reference_status === 'concerning').length;
  const outside = metrics.filter(m => m.reference_status === 'outside_range').length;
  
  // Determine overall status
  let status = 'incomplete';
  if (entered === 0) {
    status = 'empty';
  } else if (concerning > 0) {
    status = 'concerns';
  } else if (outside > 0) {
    status = 'mixed';
  } else if (entered === total && optimal === entered) {
    status = 'all_optimal';
  } else if (entered > 0) {
    status = 'mixed';
  }
  
  return {
    total,
    entered,
    optimal,
    acceptable,
    concerning,
    outside,
    completeness: total > 0 ? Math.round((entered / total) * 100) : 0,
    status
  };
}

/**
 * Compute overall summary across all systems
 */
function computeOverallSummary(systems) {
  const allMetrics = systems.flatMap(s => s.observables.flatMap(o => o.metrics));
  const metricsSummary = computeMetricsSummary(allMetrics);
  
  // Per-system breakdown
  const systemBreakdown = systems.map(s => ({
    branch_id: s.branch_id,
    branch_name: s.branch_name,
    ...s.summary
  }));
  
  return {
    ...metricsSummary,
    systems: systemBreakdown
  };
}


// ============================================
// Persistence (localStorage)
// ============================================

/**
 * Save evaluation to localStorage
 */
export function saveEvaluation(evaluation) {
  try {
    // Always save to current key
    localStorage.setItem(CURRENT_KEY, JSON.stringify(evaluation));
    
    // Also save to person-specific key if we have person info
    if (evaluation.person_name || evaluation.person_age) {
      const personKey = getPersonKey(
        evaluation.person_name, 
        evaluation.person_age, 
        evaluation.person_sex
      );
      localStorage.setItem(personKey, JSON.stringify(evaluation));
    }
    
    return true;
  } catch (e) {
    console.error('Failed to save evaluation:', e);
    return false;
  }
}

/**
 * Load evaluation from localStorage
 * First tries current, then looks for matching person
 */
export function loadEvaluation() {
  try {
    const saved = localStorage.getItem(CURRENT_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load evaluation:', e);
  }
  return null;
}

/**
 * Clear saved evaluation
 */
export function clearEvaluation() {
  localStorage.removeItem(STORAGE_KEY);
}


// ============================================
// Export/Import (JSON file)
// ============================================

/**
 * Export evaluation as JSON string (for download)
 */
export function exportEvaluationJSON(evaluation) {
  const healthState = buildHealthState(evaluation);
  return JSON.stringify({
    version: '1.0',
    exported_at: new Date().toISOString(),
    evaluation,
    health_state: healthState
  }, null, 2);
}

/**
 * Import evaluation from JSON string
 */
export function importEvaluationJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.evaluation) {
      return data.evaluation;
    }
    throw new Error('Invalid evaluation format');
  } catch (e) {
    console.error('Failed to import evaluation:', e);
    return null;
  }
}

/**
 * Trigger download of evaluation as JSON file
 */
export function downloadEvaluation(evaluation) {
  const json = exportEvaluationJSON(evaluation);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `health-evaluation-${evaluation.id}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


// ============================================
// Utility Functions
// ============================================

/**
 * Get count of entered measurements
 */
export function getMeasurementCount(evaluation) {
  return Object.keys(evaluation.measurements).length;
}

/**
 * Check if evaluation has minimum required data
 */
export function isEvaluationValid(evaluation) {
  return evaluation.person_age !== null && 
         evaluation.person_sex !== null && 
         Object.keys(evaluation.measurements).length > 0;
}

/**
 * Get display text for a metric value
 */
export function formatMetricValue(metricState) {
  if (metricState.value === null || metricState.value === undefined) {
    return '—';
  }
  
  // Format number to reasonable precision
  const val = metricState.value;
  if (typeof val === 'number') {
    // If it's a whole number or close to it, show as integer
    if (Number.isInteger(val) || Math.abs(val - Math.round(val)) < 0.01) {
      return Math.round(val).toString();
    }
    // Otherwise show 1-2 decimal places
    return val.toFixed(1);
  }
  
  return String(val);
}
