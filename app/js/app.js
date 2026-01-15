/**
 * Health Evaluation App
 * 
 * Main entry point. Renders the form and handles interactions.
 * Supports two modes: Entry (for data input) and Review (for observation).
 */

import { BRANCHES, SCALE_DEFINITIONS } from './schema.js';
import { getReferenceStatus, getRangeDisplayText } from './references.js';
import { 
  createEvaluation, 
  updatePerson, 
  setMeasurement,
  updateNotes,
  buildHealthState,
  saveEvaluation, 
  loadEvaluation,
  loadEvaluationByKey,
  listSavedEvaluations,
  deleteEvaluationByKey,
  downloadEvaluation,
  importEvaluationJSON,
  isEvaluationValid,
  formatMetricValue
} from './state.js';
import { openReportWindow } from './report.js';

// ============================================
// Application State
// ============================================

let evaluation = null;
let healthState = null;
let currentMode = 'entry'; // 'entry' or 'review'

// ============================================
// Status Display Config
// ============================================

const STATUS_CONFIG = {
  optimal: { icon: "●", label: "optimal", className: "status-optimal" },
  acceptable: { icon: "◐", label: "acceptable", className: "status-acceptable" },
  outside_range: { icon: "○", label: "outside", className: "status-outside" },
  concerning: { icon: "◉", label: "concerning", className: "status-concerning" },
  no_reference: { icon: "?", label: "no ref", className: "status-no-ref" },
  not_entered: { icon: "·", label: "", className: "status-empty" }
};

function getStatusDisplay(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.not_entered;
}

// ============================================
// Mode Switching
// ============================================

function setMode(mode) {
  currentMode = mode;
  document.body.dataset.mode = mode;
  
  // Update toggle buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  
  // Re-render
  render();
}

// ============================================
// Main Render
// ============================================

function render() {
  healthState = buildHealthState(evaluation);
  
  if (currentMode === 'entry') {
    renderEntryMode();
  } else {
    renderReviewMode();
  }
  
  renderSummary();
}

// ============================================
// Entry Mode (Form Input)
// ============================================

function renderEntryMode() {
  const container = document.getElementById('systems-container');
  container.innerHTML = '';
  container.className = 'systems-container entry-mode';
  
  for (const systemState of healthState.systems) {
    const section = createEntrySystemSection(systemState);
    container.appendChild(section);
  }
}

function createEntrySystemSection(systemState) {
  const section = document.createElement('section');
  section.className = 'system-section';
  section.dataset.branchId = systemState.branch_id;
  
  const header = document.createElement('div');
  header.className = 'system-header';
  
  const completeness = systemState.summary.completeness;
  const completenessClass = completeness === 0 ? 'empty' : completeness === 100 ? 'complete' : 'partial';
  
  header.innerHTML = `
    <h2>${systemState.branch_name}</h2>
    <div class="system-header-right">
      <span class="completion-badge ${completenessClass}">${completeness}%</span>
      <span class="toggle-icon">▼</span>
    </div>
  `;
  header.addEventListener('click', () => section.classList.toggle('collapsed'));
  
  const content = document.createElement('div');
  content.className = 'system-content';
  
  for (const observableState of systemState.observables) {
    const group = createEntryObservableGroup(observableState);
    content.appendChild(group);
  }
  
  section.appendChild(header);
  section.appendChild(content);
  
  return section;
}

function createEntryObservableGroup(observableState) {
  const group = document.createElement('div');
  group.className = 'observable-group';
  
  const importanceTitle = SCALE_DEFINITIONS.observable_importance.meaning[observableState.importance];
  const importanceDots = '●'.repeat(observableState.importance) + '○'.repeat(5 - observableState.importance);
  const description = observableState.description || '';
  
  group.innerHTML = `
    <div class="observable-header" title="${description}">
      <div class="observable-header-main">
        <h3>${observableState.observable_name}</h3>
        <span class="observable-importance" title="${importanceTitle}">${importanceDots}</span>
      </div>
      ${description ? `<p class="observable-description">${description}</p>` : ''}
    </div>
  `;
  
  for (const metricState of observableState.metrics) {
    const row = createEntryMetricRow(metricState);
    group.appendChild(row);
  }
  
  return group;
}

function createEntryMetricRow(metricState) {
  const row = document.createElement('div');
  row.className = 'metric-row';
  row.dataset.metricId = metricState.metric_id;
  
  const rangeHint = metricState.optimal_range || '';
  const statusInfo = getStatusDisplay(metricState.reference_status);
  
  // Build rich tooltip with protocol + what it measures + fidelity
  const fidelityMeaning = SCALE_DEFINITIONS.metric_fidelity.meaning[metricState.fidelity] || '';
  let tooltipParts = [];
  if (metricState.measurement_method) {
    tooltipParts.push(`How to measure: ${metricState.measurement_method}`);
  }
  if (metricState.how_well_it_measures) {
    tooltipParts.push(`What it tells us: ${metricState.how_well_it_measures}`);
  }
  if (fidelityMeaning) {
    tooltipParts.push(`Reliability: ${fidelityMeaning} (${metricState.fidelity}/5)`);
  }
  const tooltip = tooltipParts.join(' • ');
  
  // Only show info icon if there's tooltip content
  const infoIcon = tooltip ? `<span class="metric-info-icon" title="${tooltip}">ⓘ</span>` : '';
  
  row.innerHTML = `
    <div class="metric-info">
      <span class="metric-name">${metricState.metric_name}${infoIcon}</span>
      <span class="metric-protocol">${rangeHint}</span>
    </div>
    <div class="metric-input">
      <input type="number" step="any" placeholder="—" 
             data-metric-id="${metricState.metric_id}"
             data-unit="${metricState.unit}"
             value="${metricState.value !== null ? metricState.value : ''}">
      <span class="metric-unit">${metricState.unit}</span>
    </div>
    <span class="metric-status ${statusInfo.className}">
      <span class="status-icon">${statusInfo.icon}</span>
      <span class="status-label">${statusInfo.label}</span>
    </span>
  `;
  
  const input = row.querySelector('input');
  input.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    
    // Check plausibility and show warning
    const warning = checkPlausibility(metricState.metric_id, value, metricState.unit);
    if (warning) {
      input.classList.add('input-warning');
      input.title = warning;
    } else {
      input.classList.remove('input-warning');
      input.title = '';
    }
    
    handleMetricInput(metricState.metric_id, e.target.value);
  });
  
  return row;
}

// Plausibility ranges for common metrics
const PLAUSIBILITY_RANGES = {
  bp_resting_systolic: { min: 60, max: 250, warn: 'Blood pressure outside plausible range (60-250)' },
  bp_resting_diastolic: { min: 30, max: 150, warn: 'Blood pressure outside plausible range (30-150)' },
  hr_resting: { min: 30, max: 200, warn: 'Heart rate outside plausible range (30-200)' },
  apob: { min: 20, max: 300, warn: 'ApoB outside plausible range (20-300)' },
  ldl_c: { min: 20, max: 400, warn: 'LDL-C outside plausible range (20-400)' },
  hdl_c: { min: 10, max: 150, warn: 'HDL-C outside plausible range (10-150)' },
  triglycerides: { min: 20, max: 1000, warn: 'Triglycerides outside plausible range' },
  fasting_glucose: { min: 30, max: 500, warn: 'Glucose outside plausible range' },
  hba1c: { min: 3, max: 15, warn: 'HbA1c outside plausible range (3-15%)' },
  body_fat_pct: { min: 3, max: 60, warn: 'Body fat % outside plausible range (3-60)' },
  bmi_calculated: { min: 12, max: 60, warn: 'BMI outside plausible range (12-60)' },
  grip_strength: { min: 5, max: 100, warn: 'Grip strength outside plausible range' },
};

function checkPlausibility(metricId, value, unit) {
  if (isNaN(value) || value === null) return null;
  
  const range = PLAUSIBILITY_RANGES[metricId];
  if (!range) return null;
  
  if (value < range.min || value > range.max) {
    return range.warn;
  }
  return null;
}

// ============================================
// Review Mode (Observation Display)
// ============================================

function renderReviewMode() {
  const container = document.getElementById('systems-container');
  container.innerHTML = '';
  container.className = 'systems-container review-mode';
  
  // Create foundation overview
  const overview = createFoundationsOverview();
  container.appendChild(overview);
  
  // Create detailed view for each system
  for (const systemState of healthState.systems) {
    const section = createReviewSystemSection(systemState);
    container.appendChild(section);
  }
}

function createFoundationsOverview() {
  const overview = document.createElement('div');
  overview.className = 'foundations-overview';
  
  let cardsHTML = '';
  for (const systemState of healthState.systems) {
    const s = systemState.summary;
    const statusClass = s.concerning > 0 ? 'has-concerns' : 
                        s.outside > 0 ? 'has-outside' :
                        s.entered === 0 ? 'no-data' : 'stable';
    
    cardsHTML += `
      <div class="foundation-card ${statusClass}" data-branch="${systemState.branch_id}">
        <div class="foundation-name">${getShortName(systemState.branch_name)}</div>
        <div class="foundation-stats">
          <span class="stat-optimal">${s.optimal}</span>
          <span class="stat-acceptable">${s.acceptable}</span>
          <span class="stat-concerning">${s.concerning + s.outside}</span>
        </div>
        <div class="foundation-completeness">${s.completeness}% observed</div>
      </div>
    `;
  }
  
  overview.innerHTML = `
    <h2 class="foundations-title">Foundations of Health</h2>
    <p class="foundations-subtitle">Observations across six physiological systems</p>
    <div class="foundation-cards">${cardsHTML}</div>
  `;
  
  // Add click handlers to scroll to section
  overview.querySelectorAll('.foundation-card').forEach(card => {
    card.addEventListener('click', () => {
      const branchId = card.dataset.branch;
      const section = document.querySelector(`.review-system[data-branch-id="${branchId}"]`);
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  
  return overview;
}

function getShortName(branchName) {
  const shortNames = {
    'Cardiovascular & Circulatory': 'Cardiovascular',
    'Metabolic & Energy Regulation': 'Metabolic',
    'Inflammatory & Immune Load': 'Inflammatory',
    'Neural & Cognitive Regulation': 'Neural',
    'Hormonal & Regulatory Control': 'Hormonal',
    'Structural & Musculoskeletal Capacity': 'Structural'
  };
  return shortNames[branchName] || branchName;
}

function createReviewSystemSection(systemState) {
  const section = document.createElement('section');
  section.className = 'review-system';
  section.dataset.branchId = systemState.branch_id;
  
  const s = systemState.summary;
  
  section.innerHTML = `
    <div class="review-system-header">
      <h2>${systemState.branch_name}</h2>
      <div class="review-system-summary">
        <span class="stat-pill status-optimal">${s.optimal} optimal</span>
        <span class="stat-pill status-acceptable">${s.acceptable} acceptable</span>
        ${s.concerning + s.outside > 0 ? `<span class="stat-pill status-concerning">${s.concerning + s.outside} attention</span>` : ''}
      </div>
    </div>
  `;
  
  const content = document.createElement('div');
  content.className = 'review-system-content';
  
  for (const observableState of systemState.observables) {
    const group = createReviewObservableGroup(observableState);
    content.appendChild(group);
  }
  
  section.appendChild(content);
  
  return section;
}

function createReviewObservableGroup(observableState) {
  const group = document.createElement('div');
  group.className = 'review-observable';
  
  const hasData = observableState.metrics.some(m => m.value !== null);
  if (!hasData) {
    group.classList.add('no-data');
  }
  
  const importanceDots = '●'.repeat(observableState.importance) + '○'.repeat(5 - observableState.importance);
  
  let metricsHTML = '';
  for (const metricState of observableState.metrics) {
    const statusInfo = getStatusDisplay(metricState.reference_status);
    const valueDisplay = metricState.value !== null 
      ? `<span class="review-value">${metricState.value}</span><span class="review-unit">${metricState.unit}</span>`
      : `<span class="review-value empty">—</span>`;
    
    metricsHTML += `
      <div class="review-metric ${statusInfo.className}">
        <span class="review-metric-name">${metricState.metric_name}</span>
        <span class="review-metric-value">${valueDisplay}</span>
        <span class="review-metric-status">${statusInfo.icon}</span>
      </div>
    `;
  }
  
  const description = observableState.description || '';
  
  group.innerHTML = `
    <div class="review-observable-header" title="${description}">
      <span class="review-observable-name">${observableState.observable_name}</span>
      <span class="review-observable-importance">${importanceDots}</span>
    </div>
    ${description ? `<p class="review-observable-description">${description}</p>` : ''}
    <div class="review-metrics">${metricsHTML}</div>
  `;
  
  return group;
}

// ============================================
// Summary Rendering
// ============================================

function renderSummary() {
  const summaryEl = document.getElementById('summary-stats');
  if (!summaryEl) return;
  
  const s = healthState.summary;
  
  if (currentMode === 'review') {
    // Simpler summary for review mode
    summaryEl.innerHTML = `
      <div class="summary-stat">
        <span class="stat-value">${s.entered}</span>
        <span class="stat-label">observed</span>
      </div>
      <div class="summary-stat">
        <span class="stat-value status-optimal">${s.optimal}</span>
        <span class="stat-label">optimal</span>
      </div>
      <div class="summary-stat">
        <span class="stat-value status-concerning">${s.concerning + s.outside}</span>
        <span class="stat-label">attention</span>
      </div>
    `;
  } else {
    summaryEl.innerHTML = `
      <div class="summary-stat">
        <span class="stat-value">${s.entered}</span>
        <span class="stat-label">entered</span>
      </div>
      <div class="summary-stat">
        <span class="stat-value status-optimal">${s.optimal}</span>
        <span class="stat-label">optimal</span>
      </div>
      <div class="summary-stat">
        <span class="stat-value status-acceptable">${s.acceptable}</span>
        <span class="stat-label">acceptable</span>
      </div>
      <div class="summary-stat">
        <span class="stat-value status-concerning">${s.concerning + s.outside}</span>
        <span class="stat-label">attention</span>
      </div>
    `;
  }
}

// ============================================
// Event Handlers
// ============================================

function handleMetricInput(metricId, value) {
  evaluation = setMeasurement(evaluation, metricId, value);
  
  healthState = buildHealthState(evaluation);
  updateMetricDisplay(metricId);
  updateCompletionBadges();
  renderSummary();
  triggerAutoSave();
}

function updateMetricDisplay(metricId) {
  const row = document.querySelector(`.metric-row[data-metric-id="${metricId}"]`);
  if (!row) return;
  
  let metricState = null;
  for (const sys of healthState.systems) {
    for (const obs of sys.observables) {
      for (const met of obs.metrics) {
        if (met.metric_id === metricId) {
          metricState = met;
          break;
        }
      }
    }
  }
  
  if (!metricState) return;
  
  const statusInfo = getStatusDisplay(metricState.reference_status);
  const statusSpan = row.querySelector('.metric-status');
  statusSpan.className = `metric-status ${statusInfo.className}`;
  statusSpan.innerHTML = `<span class="status-icon">${statusInfo.icon}</span><span class="status-label">${statusInfo.label}</span>`;
}

function updateCompletionBadges() {
  for (const systemState of healthState.systems) {
    const section = document.querySelector(`.system-section[data-branch-id="${systemState.branch_id}"]`);
    if (!section) continue;
    
    const badge = section.querySelector('.completion-badge');
    if (!badge) continue;
    
    const completeness = systemState.summary.completeness;
    badge.textContent = `${completeness}%`;
    badge.className = 'completion-badge ' + 
      (completeness === 0 ? 'empty' : completeness === 100 ? 'complete' : 'partial');
  }
}

function handlePersonChange() {
  const ageInput = document.getElementById('person-age');
  const sexSelect = document.getElementById('person-sex');
  const nameInput = document.getElementById('person-name');
  
  evaluation = updatePerson(evaluation, {
    name: nameInput?.value || '',
    age: ageInput.value ? parseInt(ageInput.value) : null,
    sex: sexSelect.value || null
  });
  
  render();
  triggerAutoSave();
}

// ============================================
// Auto-Save Status
// ============================================

let saveTimeout = null;

function showSaveStatus(status) {
  const indicator = document.getElementById('save-indicator');
  const text = document.getElementById('save-status-text');
  
  if (!indicator || !text) return;
  
  if (status === 'saving') {
    indicator.className = 'save-indicator saving';
    text.textContent = 'Saving...';
  } else if (status === 'saved') {
    indicator.className = 'save-indicator saved';
    const count = Object.keys(evaluation.measurements || {}).length;
    const name = evaluation.person_name || 'Current evaluation';
    text.textContent = `${name} — ${count} measurements saved`;
  } else {
    indicator.className = 'save-indicator';
    text.textContent = 'Auto-saving enabled';
  }
}

function triggerAutoSave() {
  showSaveStatus('saving');
  
  // Debounce saves
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveEvaluation(evaluation);
    showSaveStatus('saved');
  }, 300);
}

async function showSavedEvaluationsModal() {
  const modal = document.getElementById('saved-evaluations-modal');
  const list = document.getElementById('saved-evaluations-list');
  
  if (!modal || !list) return;
  
  // Show loading state
  list.innerHTML = '<p class="no-saved">Loading...</p>';
  modal.style.display = 'flex';
  
  const saved = await listSavedEvaluations();
  
  if (saved.length === 0) {
    list.innerHTML = '<p class="no-saved">No saved evaluations yet.</p>';
  } else {
    list.innerHTML = saved.map(ev => `
      <div class="saved-evaluation-item" data-key="${ev.key}">
        <div class="saved-eval-info">
          <span class="saved-eval-name">${ev.name}</span>
          <span class="saved-eval-meta">${ev.age || '?'} years, ${ev.sex || '?'} — ${ev.measurementCount} measurements</span>
        </div>
        <div class="saved-eval-actions">
          <button class="btn btn-text btn-load-eval" data-key="${ev.key}">Load</button>
          <button class="btn btn-text btn-delete-eval" data-key="${ev.key}">Delete</button>
        </div>
      </div>
    `).join('');
    
    // Add event listeners
    list.querySelectorAll('.btn-load-eval').forEach(btn => {
      btn.addEventListener('click', () => loadSavedEvaluation(btn.dataset.key));
    });
    
    list.querySelectorAll('.btn-delete-eval').forEach(btn => {
      btn.addEventListener('click', () => deleteSavedEvaluation(btn.dataset.key));
    });
  }
}

function hideSavedEvaluationsModal() {
  const modal = document.getElementById('saved-evaluations-modal');
  if (modal) modal.style.display = 'none';
}

async function loadSavedEvaluation(key) {
  const loaded = await loadEvaluationByKey(key);
  if (!loaded) {
    alert('Could not load evaluation');
    return;
  }
  
  evaluation = loaded;
  saveEvaluation(evaluation);
  render();
  restoreFormValues();
  showSaveStatus('saved');
  hideSavedEvaluationsModal();
}

async function deleteSavedEvaluation(key) {
  if (!confirm('Delete this saved evaluation?')) return;
  await deleteEvaluationByKey(key);
  await showSavedEvaluationsModal(); // Refresh list
}

function updateFileStatus() {
  // Compatibility shim - now just updates save status
  showSaveStatus('saved');
}

function handleExport() {
  // Keep export for backup purposes
  const personName = evaluation.person_name || 'evaluation';
  const date = new Date().toISOString().split('T')[0];
  const filename = `health-${personName.replace(/\s+/g, '-').toLowerCase()}-${date}.json`;
  
  const json = JSON.stringify(evaluation, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


function handleClearData() {
  if (confirm('Clear all entered data? This cannot be undone.')) {
    evaluation = createEvaluation();
    saveEvaluation(evaluation);
    
    document.getElementById('person-age').value = '';
    document.getElementById('person-sex').value = '';
    const nameInput = document.getElementById('person-name');
    if (nameInput) nameInput.value = '';
    
    render();
  }
}

function handleGenerateReport() {
  if (!isEvaluationValid(evaluation)) {
    alert('Please enter age, sex, and at least one measurement before generating a report.');
    return;
  }
  
  // Rebuild health state with latest notes
  const notesEl = document.getElementById('doctor-notes');
  if (notesEl && notesEl.value) {
    evaluation = updateNotes(evaluation, notesEl.value);
    saveEvaluation(evaluation);
  }
  healthState = buildHealthState(evaluation);
  
  // Open report in new window
  openReportWindow(healthState);
}

// ============================================
// Initialization
// ============================================

function restoreFormValues() {
  const ageInput = document.getElementById('person-age');
  const sexSelect = document.getElementById('person-sex');
  const nameInput = document.getElementById('person-name');
  
  if (evaluation.person_age) ageInput.value = evaluation.person_age;
  if (evaluation.person_sex) sexSelect.value = evaluation.person_sex;
  if (nameInput && evaluation.person_name) nameInput.value = evaluation.person_name;
}

function init() {
  evaluation = loadEvaluation() || createEvaluation();
  healthState = buildHealthState(evaluation);
  
  render();
  restoreFormValues();
  
  // Mode toggle
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => setMode(btn.dataset.mode));
  });
  
  // Person info
  document.getElementById('person-age').addEventListener('input', handlePersonChange);
  document.getElementById('person-sex').addEventListener('change', handlePersonChange);
  
  const nameInput = document.getElementById('person-name');
  if (nameInput) nameInput.addEventListener('input', handlePersonChange);
  
  // Doctor notes
  const notesEl = document.getElementById('doctor-notes');
  if (notesEl) {
    // Restore notes from evaluation
    if (evaluation.notes) notesEl.value = evaluation.notes;
    
    // Save on change
    notesEl.addEventListener('input', () => {
      evaluation = updateNotes(evaluation, notesEl.value);
      saveEvaluation(evaluation);
    });
  }
  
  // Buttons
  document.getElementById('btn-generate-report')?.addEventListener('click', handleGenerateReport);
  document.getElementById('btn-clear')?.addEventListener('click', handleClearData);
  
  // Saved evaluations modal
  document.getElementById('btn-show-saved')?.addEventListener('click', showSavedEvaluationsModal);
  document.getElementById('btn-close-modal')?.addEventListener('click', hideSavedEvaluationsModal);
  
  // Close modal on backdrop click
  document.getElementById('saved-evaluations-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'saved-evaluations-modal') hideSavedEvaluationsModal();
  });
  
  // Show initial save status
  showSaveStatus('saved');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
