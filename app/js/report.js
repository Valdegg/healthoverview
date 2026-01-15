/**
 * Report Generation
 * 
 * Analyzes health state and generates a structured report
 * with findings, patterns, and areas for doctor consideration.
 * 
 * Language Philosophy:
 * - Focus on "stability and recovery capacity" not just values
 * - Non-diagnostic, cautious phrasing
 * - Orientation and understanding, not alarm
 */

// ============================================
// System State Descriptions (Non-diagnostic)
// ============================================

/**
 * Generate a brief, non-diagnostic description of each system's state
 * Based on completeness and status distribution
 */
export function getSystemStateDescription(systemState) {
  const { summary } = systemState;
  const { entered, optimal, acceptable, concerning, outside, completeness } = summary;
  
  if (entered === 0) {
    return "Not yet observed — measurements needed to assess this foundation.";
  }
  
  if (completeness < 30) {
    return "Partial observation — additional measurements would provide a fuller picture.";
  }
  
  // Calculate proportions
  const stableCount = optimal + acceptable;
  const attentionCount = concerning + outside;
  const stableRatio = stableCount / entered;
  
  if (attentionCount === 0 && stableRatio === 1) {
    return "Observations suggest this system is functioning within expected parameters.";
  }
  
  if (attentionCount === 0 && stableRatio > 0.7) {
    return "Measurements are generally within expected ranges for stability.";
  }
  
  if (concerning > 0) {
    return "Some observations fall outside typical ranges — worth discussing with attention to context.";
  }
  
  if (outside > 0) {
    return "Some measurements are outside optimal ranges — may warrant closer observation.";
  }
  
  return "Mixed observations — doctor review recommended to assess overall picture.";
}

/**
 * Get a stability-focused label for a system
 */
export function getSystemStabilityLabel(systemState) {
  const { summary } = systemState;
  const { entered, optimal, acceptable, concerning, outside } = summary;
  
  if (entered === 0) return null;
  
  const attentionCount = concerning + outside;
  const stableCount = optimal + acceptable;
  const stableRatio = stableCount / entered;
  
  if (attentionCount === 0 && stableRatio === 1) {
    return { label: "Stable", className: "stability-stable" };
  }
  
  if (attentionCount === 0 && stableRatio > 0.7) {
    return { label: "Generally stable", className: "stability-stable" };
  }
  
  if (concerning > 0) {
    return { label: "Review recommended", className: "stability-attention" };
  }
  
  if (outside > 0) {
    return { label: "Some variation", className: "stability-mixed" };
  }
  
  return { label: "Mixed", className: "stability-mixed" };
}

// ============================================
// Cross-System Explanations
// ============================================

/**
 * Generate plain-language explanations of how systems may interact
 */
export function generateInteractionExplanations(healthState, findings) {
  const explanations = [];
  
  // Check for cardiovascular + metabolic overlap
  const cvConcerns = findings.concerning.filter(f => f.systemShort === 'Cardiovascular');
  const metConcerns = findings.concerning.filter(f => f.systemShort === 'Metabolic');
  
  if (cvConcerns.length > 0 && metConcerns.length > 0) {
    explanations.push({
      systems: ['Cardiovascular', 'Metabolic'],
      text: "Cardiovascular and metabolic systems often influence each other. Elevated blood pressure or lipids alongside glucose regulation changes may reflect shared factors such as activity level, diet patterns, or stress. These are often addressed together."
    });
  }
  
  // Inflammatory + other systems
  const infConcerns = findings.concerning.filter(f => f.systemShort === 'Inflammatory');
  if (infConcerns.length > 0 && (cvConcerns.length > 0 || metConcerns.length > 0)) {
    explanations.push({
      systems: ['Inflammatory', 'Cardiovascular/Metabolic'],
      text: "Inflammatory markers can reflect the body's response to metabolic or cardiovascular strain. Chronic low-grade inflammation is often connected to lifestyle factors and may improve when other systems stabilize."
    });
  }
  
  // Sleep/recovery + neural
  const neuralConcerns = findings.concerning.filter(f => f.systemShort === 'Neural');
  if (neuralConcerns.length > 0) {
    explanations.push({
      systems: ['Neural'],
      text: "Cognitive and mood-related observations are sensitive to sleep quality, recovery, and overall system load. These often improve when foundational factors like rest and activity are well-balanced."
    });
  }
  
  // Hormonal + structural
  const hormonalConcerns = findings.concerning.filter(f => f.systemShort === 'Hormonal');
  const structuralConcerns = findings.concerning.filter(f => f.systemShort === 'Structural');
  
  if (hormonalConcerns.length > 0 && structuralConcerns.length > 0) {
    explanations.push({
      systems: ['Hormonal', 'Structural'],
      text: "Hormonal regulation and musculoskeletal capacity are interconnected. Strength training and adequate recovery can support both hormone balance and physical resilience."
    });
  }
  
  return explanations;
}

// ============================================
// Stability Guidance (Non-prescriptive)
// ============================================

/**
 * Generate general, non-prescriptive suggestions for stability
 * These are conversation starters, not medical advice
 */
export function generateStabilityGuidance(healthState, findings) {
  const guidance = [];
  
  // General guidance based on overall state
  const overall = healthState.summary;
  
  if (overall.concerning > 0) {
    guidance.push({
      category: "Review",
      text: "Some observations warrant discussion. Consider what context might explain these findings before drawing conclusions."
    });
  }
  
  if (overall.completeness < 50) {
    guidance.push({
      category: "Observation",
      text: "A more complete set of measurements would provide better orientation. Consider which areas are most relevant to observe next."
    });
  }
  
  // If cardiovascular concerns
  const cvIssues = findings.concerning.filter(f => f.systemShort === 'Cardiovascular').length > 0;
  if (cvIssues) {
    guidance.push({
      category: "Cardiovascular",
      text: "Blood pressure and heart rate variability respond to movement, stress management, and sleep. Consider how these factors play out in daily life."
    });
  }
  
  // If metabolic concerns
  const metIssues = findings.concerning.filter(f => f.systemShort === 'Metabolic').length > 0;
  if (metIssues) {
    guidance.push({
      category: "Metabolic",
      text: "Glucose and lipid markers often reflect eating patterns, activity timing, and recovery. Small, consistent changes tend to be more sustainable than dramatic interventions."
    });
  }
  
  // General stability message
  if (guidance.length === 0) {
    guidance.push({
      category: "Stability",
      text: "Current observations suggest reasonable stability. Maintaining consistent routines for sleep, movement, and recovery supports ongoing resilience."
    });
  }
  
  return guidance;
}

// ============================================
// Finding Extraction
// ============================================

/**
 * Extract all notable findings from health state
 */
export function extractFindings(healthState) {
  const findings = {
    concerning: [],      // Red flags - need attention
    outsideOptimal: [],  // Amber - worth noting
    notable: [],         // Patterns or observations
    strengths: [],       // What's working well
    incomplete: []       // Important metrics not measured
  };
  
  // Analyze each system
  for (const system of healthState.systems) {
    for (const observable of system.observables) {
      for (const metric of observable.metrics) {
        analyzMetric(metric, observable, system, findings);
      }
      
      // Check for incomplete high-importance observables
      if (observable.importance >= 4) {
        const enteredCount = observable.metrics.filter(m => m.value !== null).length;
        if (enteredCount === 0) {
          findings.incomplete.push({
            type: 'missing_observable',
            system: system.branch_name,
            observable: observable.observable_name,
            importance: observable.importance,
            message: `${observable.observable_name} not measured (importance: ${observable.importance}/5)`
          });
        }
      }
    }
  }
  
  // Detect cross-system patterns
  const patterns = detectPatterns(healthState, findings);
  findings.notable.push(...patterns);
  
  return findings;
}

function analyzMetric(metric, observable, system, findings) {
  if (metric.value === null) return;
  
  const context = {
    system: system.branch_name,
    systemShort: getShortSystemName(system.branch_name),
    observable: observable.observable_name,
    metric: metric.metric_name,
    value: metric.value,
    unit: metric.unit,
    importance: observable.importance,
    fidelity: metric.fidelity
  };
  
  switch (metric.reference_status) {
    case 'concerning':
      findings.concerning.push({
        ...context,
        type: 'concerning',
        message: `${metric.metric_name}: ${metric.value} ${metric.unit} — concerning range`
      });
      break;
      
    case 'outside_range':
      findings.outsideOptimal.push({
        ...context,
        type: 'outside',
        message: `${metric.metric_name}: ${metric.value} ${metric.unit} — outside optimal`
      });
      break;
      
    case 'acceptable':
      findings.outsideOptimal.push({
        ...context,
        type: 'acceptable',
        message: `${metric.metric_name}: ${metric.value} ${metric.unit} — acceptable but not optimal`
      });
      break;
      
    case 'optimal':
      // Track strengths for high-importance observables
      if (observable.importance >= 4) {
        findings.strengths.push({
          ...context,
          type: 'optimal',
          message: `${metric.metric_name}: ${metric.value} ${metric.unit}`
        });
      }
      break;
  }
}

function getShortSystemName(name) {
  const map = {
    'Cardiovascular & Circulatory': 'Cardiovascular',
    'Metabolic & Energy Regulation': 'Metabolic',
    'Inflammatory & Immune Load': 'Inflammatory',
    'Neural & Cognitive Regulation': 'Neural',
    'Hormonal & Regulatory Control': 'Hormonal',
    'Structural & Musculoskeletal Capacity': 'Structural'
  };
  return map[name] || name;
}

// ============================================
// Pattern Detection
// ============================================

function detectPatterns(healthState, findings) {
  const patterns = [];
  
  // Group findings by system
  const systemConcerns = {};
  for (const f of [...findings.concerning, ...findings.outsideOptimal]) {
    systemConcerns[f.systemShort] = (systemConcerns[f.systemShort] || 0) + 1;
  }
  
  // Detect systems with multiple concerns
  for (const [system, count] of Object.entries(systemConcerns)) {
    if (count >= 2) {
      patterns.push({
        type: 'pattern',
        system: system,
        message: `Multiple observations outside optimal in ${system} system (${count} metrics)`
      });
    }
  }
  
  // Detect cardiovascular-metabolic overlap
  const cvConcerns = findings.concerning.filter(f => f.systemShort === 'Cardiovascular').length;
  const metConcerns = findings.concerning.filter(f => f.systemShort === 'Metabolic').length;
  if (cvConcerns > 0 && metConcerns > 0) {
    patterns.push({
      type: 'cross_system',
      message: 'Concerns in both cardiovascular and metabolic systems may indicate shared underlying factors'
    });
  }
  
  // Detect inflammation + other system concerns
  const infConcerns = findings.concerning.filter(f => f.systemShort === 'Inflammatory').length;
  if (infConcerns > 0 && (cvConcerns > 0 || metConcerns > 0)) {
    patterns.push({
      type: 'cross_system',
      message: 'Inflammatory markers combined with cardiovascular/metabolic findings warrant attention'
    });
  }
  
  return patterns;
}

// ============================================
// Report Summary
// ============================================

/**
 * Generate a structured report summary
 */
export function generateReportSummary(healthState) {
  const findings = extractFindings(healthState);
  const summary = healthState.summary;
  
  // Prioritize findings
  const priorityFindings = [
    ...findings.concerning.map(f => ({ ...f, priority: 1 })),
    ...findings.outsideOptimal.filter(f => f.importance >= 4).map(f => ({ ...f, priority: 2 })),
    ...findings.outsideOptimal.filter(f => f.importance < 4).map(f => ({ ...f, priority: 3 }))
  ];
  
  // Get top strengths
  const topStrengths = findings.strengths
    .filter(f => f.importance >= 4)
    .slice(0, 5);
  
  // Get important missing data
  const criticalMissing = findings.incomplete
    .filter(f => f.importance >= 4)
    .slice(0, 3);
  
  // Generate system descriptions with stability labels
  const systemDescriptions = healthState.systems.map(sys => ({
    name: sys.branch_name,
    shortName: getShortSystemName(sys.branch_name),
    description: getSystemStateDescription(sys),
    stability: getSystemStabilityLabel(sys),
    summary: sys.summary
  }));
  
  // Generate interaction explanations
  const interactions = generateInteractionExplanations(healthState, findings);
  
  // Generate stability guidance
  const guidance = generateStabilityGuidance(healthState, findings);
  
  return {
    person: healthState.person,
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    overview: {
      totalMeasured: summary.entered,
      totalOptimal: summary.optimal,
      totalAcceptable: summary.acceptable,
      totalConcerning: summary.concerning + summary.outside,
      completeness: summary.completeness
    },
    priorityFindings,
    patterns: findings.notable.filter(f => f.type === 'pattern' || f.type === 'cross_system'),
    strengths: topStrengths,
    incomplete: criticalMissing,
    systemDescriptions,
    interactions,
    guidance,
    systems: healthState.systems,
    notes: healthState.notes || ''
  };
}

// ============================================
// Report HTML Generation
// ============================================

/**
 * Generate printable HTML report
 */
export function generateReportHTML(healthState) {
  const report = generateReportSummary(healthState);
  
  const personInfo = report.person.name 
    ? `${report.person.name} — ${report.person.age} years, ${report.person.sex}`
    : `${report.person.age} years, ${report.person.sex}`;
  
  // Build findings section
  let findingsHTML = '';
  
  if (report.priorityFindings.length > 0) {
    findingsHTML += `
      <div class="report-section findings-section">
        <h3>Findings Requiring Attention</h3>
        <div class="findings-list">
          ${report.priorityFindings.map(f => `
            <div class="finding priority-${f.priority}">
              <span class="finding-system">${f.systemShort}</span>
              <span class="finding-text">${f.message}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  // Patterns section
  if (report.patterns.length > 0) {
    findingsHTML += `
      <div class="report-section patterns-section">
        <h3>Patterns to Consider</h3>
        <ul class="patterns-list">
          ${report.patterns.map(p => `<li>${p.message}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  // Strengths section
  if (report.strengths.length > 0) {
    findingsHTML += `
      <div class="report-section strengths-section">
        <h3>Areas of Strength</h3>
        <div class="strengths-list">
          ${report.strengths.map(s => `
            <span class="strength-item">${s.metric}: ${s.value} ${s.unit}</span>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  // Incomplete section
  if (report.incomplete.length > 0) {
    findingsHTML += `
      <div class="report-section incomplete-section">
        <h3>Consider Measuring</h3>
        <ul class="incomplete-list">
          ${report.incomplete.map(i => `<li>${i.message}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  // Cross-system interactions section
  let interactionsHTML = '';
  if (report.interactions && report.interactions.length > 0) {
    interactionsHTML = `
      <div class="report-section interactions-section">
        <h3>How Systems May Interact</h3>
        ${report.interactions.map(i => `
          <div class="interaction-item">
            <p>${i.text}</p>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  // Stability guidance section
  let guidanceHTML = '';
  if (report.guidance && report.guidance.length > 0) {
    guidanceHTML = `
      <div class="report-section guidance-section">
        <h3>Considerations for Stability</h3>
        ${report.guidance.map(g => `
          <div class="guidance-item">
            <span class="guidance-category">${g.category}</span>
            <p>${g.text}</p>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  // Build systems overview (with stability descriptions)
  let systemOverviewHTML = '';
  if (report.systemDescriptions) {
    const observedSystems = report.systemDescriptions.filter(s => s.summary.entered > 0);
    if (observedSystems.length > 0) {
      systemOverviewHTML = `
        <div class="report-section systems-overview-section">
          <h3>System Overview</h3>
          ${observedSystems.map(sys => `
            <div class="system-overview-item">
              <div class="system-overview-header">
                <span class="system-overview-name">${sys.shortName}</span>
                ${sys.stability ? `<span class="system-stability ${sys.stability.className}">${sys.stability.label}</span>` : ''}
              </div>
              <p class="system-overview-desc">${sys.description}</p>
            </div>
          `).join('')}
        </div>
      `;
    }
  }
  
  // Build systems detail
  const systemsHTML = report.systems.map(system => {
    const enteredMetrics = system.observables.flatMap(o => o.metrics).filter(m => m.value !== null);
    if (enteredMetrics.length === 0) return '';
    
    return `
      <div class="report-system">
        <h3>${system.branch_name}</h3>
        ${system.observables.map(obs => {
          const metrics = obs.metrics.filter(m => m.value !== null);
          if (metrics.length === 0) return '';
          
          return `
            <div class="report-observable">
              <h4>${obs.observable_name}</h4>
              <div class="report-metrics">
                ${metrics.map(m => `
                  <div class="report-metric status-${m.reference_status}">
                    <span class="metric-name">${m.metric_name}</span>
                    <span class="metric-value">${m.value} ${m.unit}</span>
                    <span class="metric-status">${getStatusLabel(m.reference_status)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }).join('');
  
  return `
    <div class="report-container">
      <header class="report-header">
        <h1>Health Evaluation Report</h1>
        <p class="report-subtitle">Foundations of Health — Point-in-time Observation</p>
        <div class="report-meta">
          <span class="report-person">${personInfo}</span>
          <span class="report-date">${report.date}</span>
        </div>
      </header>
      
      <section class="report-overview">
        <div class="overview-stat">
          <span class="stat-number">${report.overview.totalMeasured}</span>
          <span class="stat-label">Measured</span>
        </div>
        <div class="overview-stat optimal">
          <span class="stat-number">${report.overview.totalOptimal}</span>
          <span class="stat-label">Optimal</span>
        </div>
        <div class="overview-stat acceptable">
          <span class="stat-number">${report.overview.totalAcceptable}</span>
          <span class="stat-label">Acceptable</span>
        </div>
        <div class="overview-stat concerning">
          <span class="stat-number">${report.overview.totalConcerning}</span>
          <span class="stat-label">Attention</span>
        </div>
      </section>
      
      ${findingsHTML}
      
      ${systemOverviewHTML}
      
      ${interactionsHTML}
      
      ${guidanceHTML}
      
      <section class="report-details">
        <h2>Detailed Observations</h2>
        ${systemsHTML}
      </section>
      
      <section class="report-notes">
        <h2>Clinical Observations</h2>
        <div class="notes-content">${report.notes || '<em>No notes recorded</em>'}</div>
      </section>
      
      <footer class="report-footer">
        <p class="disclaimer">This is a point-in-time health observation, not a diagnosis. 
        All findings should be interpreted in clinical context.</p>
        <p class="signature">Reviewed by: _______________________</p>
      </footer>
    </div>
  `;
}

function getStatusLabel(status) {
  const labels = {
    optimal: '●',
    acceptable: '◐',
    outside_range: '○',
    concerning: '◉',
    no_reference: '?',
    not_entered: '—'
  };
  return labels[status] || '—';
}

// ============================================
// Open Report in New Window
// ============================================

export function openReportWindow(healthState) {
  const reportHTML = generateReportHTML(healthState);
  
  // Try to open in new window, fall back to replacing current page
  const fullHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Health Evaluation Report</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;500;600&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
          font-family: 'DM Sans', -apple-system, sans-serif;
          font-size: 12px;
          line-height: 1.5;
          color: #2d2a26;
          background: white;
          padding: 40px;
        }
        
        .report-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .report-header {
          text-align: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid #e8e4de;
        }
        
        .report-header h1 {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        
        .report-subtitle {
          color: #9c9690;
          font-size: 13px;
          margin-bottom: 16px;
        }
        
        .report-meta {
          display: flex;
          justify-content: center;
          gap: 32px;
          font-size: 13px;
        }
        
        .report-person { font-weight: 500; }
        .report-date { color: #5c5752; }
        
        .report-overview {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-bottom: 32px;
          padding: 20px;
          background: #f8f7f4;
          border-radius: 8px;
        }
        
        .overview-stat {
          text-align: center;
        }
        
        .overview-stat .stat-number {
          font-family: 'JetBrains Mono', monospace;
          font-size: 28px;
          font-weight: 500;
          display: block;
        }
        
        .overview-stat .stat-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #9c9690;
        }
        
        .overview-stat.optimal .stat-number { color: #3d7a5f; }
        .overview-stat.acceptable .stat-number { color: #b8860b; }
        .overview-stat.concerning .stat-number { color: #b54040; }
        
        .report-section {
          margin-bottom: 24px;
          padding: 16px 20px;
          background: #fdfcfa;
          border: 1px solid #e8e4de;
          border-radius: 8px;
        }
        
        .report-section h3 {
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #5c5752;
        }
        
        .findings-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .finding {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          border-radius: 6px;
        }
        
        .finding.priority-1 { background: rgba(181, 64, 64, 0.08); }
        .finding.priority-2 { background: rgba(184, 134, 11, 0.08); }
        .finding.priority-3 { background: rgba(184, 134, 11, 0.05); }
        
        .finding-system {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          color: #9c9690;
          min-width: 80px;
        }
        
        .finding-text {
          font-size: 12px;
        }
        
        .patterns-list, .incomplete-list {
          padding-left: 20px;
        }
        
        .patterns-list li, .incomplete-list li {
          margin-bottom: 6px;
          color: #5c5752;
        }
        
        .strengths-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .strength-item {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          padding: 4px 10px;
          background: rgba(61, 122, 95, 0.1);
          color: #3d7a5f;
          border-radius: 12px;
        }
        
        .report-details {
          margin: 32px 0;
        }
        
        .report-details h2 {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 16px;
          margin-bottom: 20px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e8e4de;
        }
        
        .report-system {
          margin-bottom: 24px;
        }
        
        .report-system h3 {
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        
        .report-observable {
          margin-bottom: 16px;
        }
        
        .report-observable h4 {
          font-size: 11px;
          font-weight: 500;
          color: #5c5752;
          margin-bottom: 8px;
        }
        
        .report-metrics {
          display: grid;
          gap: 4px;
        }
        
        .report-metric {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px 12px;
          background: #f8f7f4;
          border-radius: 4px;
          font-size: 11px;
        }
        
        .report-metric .metric-name {
          flex: 1;
        }
        
        .report-metric .metric-value {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500;
        }
        
        .report-metric .metric-status {
          width: 16px;
          text-align: center;
        }
        
        .report-metric.status-optimal { border-left: 3px solid #3d7a5f; }
        .report-metric.status-acceptable { border-left: 3px solid #b8860b; }
        .report-metric.status-outside_range,
        .report-metric.status-concerning { border-left: 3px solid #b54040; }
        
        .report-notes {
          margin: 32px 0;
        }
        
        .report-notes h2 {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 16px;
          margin-bottom: 12px;
        }
        
        .notes-content {
          padding: 16px;
          background: #fdfcfa;
          border: 1px solid #e8e4de;
          border-radius: 8px;
          min-height: 80px;
          white-space: pre-wrap;
        }
        
        .notes-content em {
          color: #9c9690;
        }
        
        .report-footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #e8e4de;
          text-align: center;
        }
        
        .disclaimer {
          font-size: 10px;
          color: #9c9690;
          margin-bottom: 24px;
        }
        
        .signature {
          font-size: 12px;
          color: #5c5752;
        }
        
        @media print {
          body { padding: 0; }
          .report-section { break-inside: avoid; }
          .report-system { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      ${reportHTML}
      <script>
        // Auto-focus for printing
        window.onload = () => {
          window.print();
        };
      </script>
    </body>
    </html>
  `;
  
  // Create or get report modal
  let modal = document.getElementById('report-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'report-modal';
    modal.innerHTML = `
      <div class="report-modal-backdrop"></div>
      <div class="report-modal-content">
        <div class="report-modal-header">
          <button class="report-modal-print">Print Report</button>
          <button class="report-modal-close">Close</button>
        </div>
        <div class="report-modal-body"></div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Event listeners
    modal.querySelector('.report-modal-close').addEventListener('click', () => {
      modal.classList.remove('open');
    });
    
    modal.querySelector('.report-modal-backdrop').addEventListener('click', () => {
      modal.classList.remove('open');
    });
    
    modal.querySelector('.report-modal-print').addEventListener('click', () => {
      window.print();
    });
  }
  
  // Insert report content
  modal.querySelector('.report-modal-body').innerHTML = reportHTML;
  modal.classList.add('open');
  
  // Add styles if not already present
  if (!document.getElementById('report-modal-styles')) {
    const styles = document.createElement('style');
    styles.id = 'report-modal-styles';
    styles.textContent = `
      #report-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
      }
      
      #report-modal.open {
        display: flex;
        align-items: flex-start;
        justify-content: center;
      }
      
      .report-modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
      }
      
      .report-modal-content {
        position: relative;
        background: white;
        max-width: 850px;
        width: 100%;
        max-height: 90vh;
        margin: 32px 16px;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        display: flex;
        flex-direction: column;
      }
      
      .report-modal-header {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 12px 16px;
        border-bottom: 1px solid #e8e4de;
        background: #fdfcfa;
        border-radius: 12px 12px 0 0;
      }
      
      .report-modal-header button {
        font-family: inherit;
        font-size: 14px;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        border: none;
      }
      
      .report-modal-print {
        background: #3d6b5f;
        color: white;
      }
      
      .report-modal-close {
        background: #f2f0eb;
        color: #5c5752;
      }
      
      .report-modal-body {
        overflow-y: auto;
        padding: 24px 32px;
      }
      
      /* Report styles within modal */
      .report-container {
        font-family: 'DM Sans', -apple-system, sans-serif;
        font-size: 13px;
        line-height: 1.5;
        color: #2d2a26;
      }
      
      .report-header {
        text-align: center;
        margin-bottom: 24px;
        padding-bottom: 20px;
        border-bottom: 2px solid #e8e4de;
      }
      
      .report-header h1 {
        font-family: 'Source Serif 4', Georgia, serif;
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 4px;
      }
      
      .report-subtitle { color: #9c9690; font-size: 13px; margin-bottom: 12px; }
      .report-meta { display: flex; justify-content: center; gap: 24px; font-size: 13px; }
      .report-person { font-weight: 500; }
      .report-date { color: #5c5752; }
      
      .report-overview {
        display: flex;
        justify-content: center;
        gap: 32px;
        margin-bottom: 24px;
        padding: 16px;
        background: #f8f7f4;
        border-radius: 8px;
      }
      
      .overview-stat { text-align: center; }
      .overview-stat .stat-number { font-family: 'JetBrains Mono', monospace; font-size: 24px; font-weight: 500; display: block; }
      .overview-stat .stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #9c9690; }
      .overview-stat.optimal .stat-number { color: #3d7a5f; }
      .overview-stat.acceptable .stat-number { color: #b8860b; }
      .overview-stat.concerning .stat-number { color: #b54040; }
      
      .report-section { margin-bottom: 20px; padding: 14px 18px; background: #fdfcfa; border: 1px solid #e8e4de; border-radius: 8px; }
      .report-section h3 { font-size: 12px; font-weight: 600; margin-bottom: 10px; color: #5c5752; }
      
      .findings-list { display: flex; flex-direction: column; gap: 6px; }
      .finding { display: flex; align-items: center; gap: 10px; padding: 6px 10px; border-radius: 6px; }
      .finding.priority-1 { background: rgba(181, 64, 64, 0.08); }
      .finding.priority-2 { background: rgba(184, 134, 11, 0.08); }
      .finding.priority-3 { background: rgba(184, 134, 11, 0.05); }
      .finding-system { font-size: 10px; font-weight: 600; text-transform: uppercase; color: #9c9690; min-width: 70px; }
      .finding-text { font-size: 12px; }
      
      .patterns-list, .incomplete-list { padding-left: 18px; }
      .patterns-list li, .incomplete-list li { margin-bottom: 4px; color: #5c5752; font-size: 12px; }
      
      .strengths-list { display: flex; flex-wrap: wrap; gap: 6px; }
      .strength-item { font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 3px 8px; background: rgba(61, 122, 95, 0.1); color: #3d7a5f; border-radius: 10px; }
      
      /* System Overview */
      .systems-overview-section { background: #fdfcfa; }
      .system-overview-item { padding: 10px 0; border-bottom: 1px solid #f2f0eb; }
      .system-overview-item:last-child { border-bottom: none; }
      .system-overview-header { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
      .system-overview-name { font-weight: 600; font-size: 12px; }
      .system-stability { font-size: 10px; padding: 2px 8px; border-radius: 10px; }
      .stability-stable { background: rgba(61, 122, 95, 0.15); color: #3d6b5f; }
      .stability-mixed { background: rgba(184, 134, 11, 0.15); color: #8b6914; }
      .stability-attention { background: rgba(181, 64, 64, 0.15); color: #b54040; }
      .system-overview-desc { font-size: 11px; color: #5c5752; line-height: 1.5; margin: 0; }
      
      /* Interactions */
      .interactions-section { background: #f8f9fa; }
      .interaction-item { padding: 8px 0; }
      .interaction-item p { font-size: 11px; color: #5c5752; line-height: 1.6; margin: 0; }
      
      /* Guidance */
      .guidance-section { background: rgba(61, 107, 95, 0.04); border-color: rgba(61, 107, 95, 0.15); }
      .guidance-item { padding: 8px 0; border-bottom: 1px solid #f2f0eb; }
      .guidance-item:last-child { border-bottom: none; }
      .guidance-category { font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; color: #3d6b5f; font-weight: 600; }
      .guidance-item p { font-size: 11px; color: #5c5752; line-height: 1.5; margin: 4px 0 0 0; }
      
      .report-details { margin: 24px 0; }
      .report-details h2 { font-family: 'Source Serif 4', Georgia, serif; font-size: 15px; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 1px solid #e8e4de; }
      
      .report-system { margin-bottom: 20px; }
      .report-system h3 { font-size: 13px; font-weight: 600; margin-bottom: 10px; }
      
      .report-observable { margin-bottom: 12px; }
      .report-observable h4 { font-size: 11px; font-weight: 500; color: #5c5752; margin-bottom: 6px; }
      
      .report-metrics { display: grid; gap: 3px; }
      .report-metric { display: flex; align-items: center; gap: 10px; padding: 5px 10px; background: #f8f7f4; border-radius: 4px; font-size: 11px; }
      .report-metric .metric-name { flex: 1; }
      .report-metric .metric-value { font-family: 'JetBrains Mono', monospace; font-weight: 500; }
      .report-metric .metric-status { width: 14px; text-align: center; }
      
      .report-metric.status-optimal { border-left: 3px solid #3d7a5f; }
      .report-metric.status-acceptable { border-left: 3px solid #b8860b; }
      .report-metric.status-outside_range, .report-metric.status-concerning { border-left: 3px solid #b54040; }
      
      .report-notes { margin: 24px 0; }
      .report-notes h2 { font-family: 'Source Serif 4', Georgia, serif; font-size: 15px; margin-bottom: 10px; }
      .notes-content { padding: 12px; background: #fdfcfa; border: 1px solid #e8e4de; border-radius: 8px; min-height: 60px; white-space: pre-wrap; }
      .notes-content em { color: #9c9690; }
      
      .report-footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e8e4de; text-align: center; }
      .disclaimer { font-size: 10px; color: #9c9690; margin-bottom: 16px; }
      .signature { font-size: 12px; color: #5c5752; }
      
      @media print {
        #report-modal { display: block !important; position: static; }
        .report-modal-backdrop { display: none; }
        .report-modal-content { max-height: none; margin: 0; box-shadow: none; border-radius: 0; }
        .report-modal-header { display: none; }
        .report-modal-body { padding: 0; }
        .report-section { break-inside: avoid; }
        .report-system { break-inside: avoid; }
      }
    `;
    document.head.appendChild(styles);
  }
}
