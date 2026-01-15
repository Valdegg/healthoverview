# Software Specifications — MVP

Technical specifications for the health evaluation tool.

---

## 1. Data Model

### Evaluation

A single evaluation session for one person.

```
Evaluation {
  id: string
  created_at: datetime
  person_name: string (optional)
  person_age: number
  person_sex: "male" | "female"
  measurements: Measurement[]
  notes: string (optional)
}
```

### Measurement

A single metric value entered during the evaluation.

```
Measurement {
  metric_id: string (matches health_schema.json)
  value: number | string
  measured_at: date (optional, defaults to today)
  context: string (optional, e.g., "fasting", "post-meal")
}
```

### Health State (the output)

The health state is **not a single label** — it's the full collection of observables and their metric values. Think of it as a state vector.

```
HealthState {
  person: { age, sex }
  systems: SystemState[]
}

SystemState {
  branch_id: string
  branch_name: string
  observables: ObservableState[]
}

ObservableState {
  observable_id: string
  observable_name: string
  importance: 1-5
  metrics: MetricState[]
}

MetricState {
  metric_id: string
  metric_name: string
  value: number | string | null
  unit: string
  fidelity: 1-5
  reference_status: "optimal" | "acceptable" | "outside_range" | "concerning" | "no_reference" | "not_entered"
}
```

The state IS the vector of all these values. Any summary (like "stable" or "strained") is a derived view, not the state itself.

### Reference Ranges

Stored separately, keyed by metric_id + age band + sex.

```
ReferenceRange {
  metric_id: string
  age_min: number
  age_max: number
  sex: "male" | "female" | "any"
  range_optimal: [min, max]
  range_acceptable: [min, max]
  range_concerning: [min, max] (optional)
}
```

---

## 2. Data Entry

### Form Structure

- One form section per system (6 total)
- Within each system, group by observable
- Each metric shows:
  - Metric name
  - Input field (number or select, based on unit)
  - Unit label
  - Measurement protocol hint (from schema)
  - Optional context dropdown (fasting, morning, etc.)

### Input Validation

- Numeric fields: validate against plausible ranges (e.g., BP 60–250)
- Required vs. optional: mark high-importance metrics, allow partial completion
- Show warning if value seems implausible, but allow override

### Form Behavior

- Auto-save as user fills out
- Collapsible sections per system
- Progress indicator showing completion per system

---

## 3. Display View

### What We're Showing

The current health state = the full vector of observables and metrics, organized by system.

### Layout

Single scrollable page with 6 system sections.

### Per System Section

```
┌─────────────────────────────────────────────────────────────┐
│ CARDIOVASCULAR & CIRCULATORY                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ▸ Resting cardiovascular load (importance: 5)               │
│   ┌───────────────────────────────────────────────────────┐ │
│   │ Systolic BP      124 mmHg    ● optimal                │ │
│   │ Diastolic BP      78 mmHg    ● optimal                │ │
│   │ Resting HR        68 bpm     ● optimal                │ │
│   └───────────────────────────────────────────────────────┘ │
│                                                             │
│ ▸ Atherogenic (lipid) load (importance: 5)                  │
│   ┌───────────────────────────────────────────────────────┐ │
│   │ ApoB              95 mg/dL   ◐ acceptable             │ │
│   │ LDL-C            142 mg/dL   ○ outside range          │ │
│   │ Triglycerides    110 mg/dL   ● optimal                │ │
│   │ HDL-C             52 mg/dL   ◐ acceptable             │ │
│   └───────────────────────────────────────────────────────┘ │
│                                                             │
│ ▸ Cardiovascular recovery capacity (importance: 4)          │
│   ┌───────────────────────────────────────────────────────┐ │
│   │ HRR (1-min)       22 bpm     ● optimal                │ │
│   │ HRR (2-min)        —         · not entered            │ │
│   │ Next-morning RHR   —         · not entered            │ │
│   └───────────────────────────────────────────────────────┘ │
│                                                             │
│ ▸ Autonomic cardiovascular control (importance: 4)          │
│   ...                                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Value Display

For each metric value, show:
- Metric name
- The value with unit (or "—" if not entered)
- Status indicator based on reference range:
  - `● optimal` — green
  - `◐ acceptable` — neutral/amber
  - `○ outside range` — amber/orange
  - `◉ concerning` — red
  - `? no reference` — gray (value shown but no range defined)
  - `· not entered` — gray/empty

### Visual Hierarchy

- Systems are top-level sections
- Observables are collapsible groups within systems
- Observable importance (1–5) shown to indicate weight
- Metrics are rows within observables
- Metric fidelity (1–5) can be shown subtly (e.g., tooltip or small indicator)

---

## 4. Summary View (optional derived output)

If a quick summary is useful for the report, derive it from the state:

### Per System Summary

```
SystemSummary {
  branch_id: string
  data_completeness: percentage of metrics entered
  observables_summary: [
    { observable_name, status: "all_optimal" | "mixed" | "concerns" | "incomplete" }
  ]
}
```

### Overall Pattern Detection

Simple rules to surface cross-system observations:
- "Lipid markers elevated in both cardiovascular and metabolic systems"
- "Sleep-related metrics suggest recovery may be constrained"
- "Strength and balance metrics are strong"

This is **commentary on the state**, not a replacement for it.

---

## 5. Report Generation

### Format

PDF or HTML, printable.

### Structure

```
HEALTH EVALUATION
[Date] | [Person name/identifier] | [Age, Sex]

─────────────────────────────────────────

CARDIOVASCULAR & CIRCULATORY

Resting cardiovascular load
  Systolic BP: 124 mmHg (optimal)
  Diastolic BP: 78 mmHg (optimal)
  Resting HR: 68 bpm (optimal)

Atherogenic (lipid) load
  ApoB: 95 mg/dL (acceptable)
  LDL-C: 142 mg/dL (elevated)
  Triglycerides: 110 mg/dL (optimal)
  HDL-C: 52 mg/dL (acceptable)

Cardiovascular recovery capacity
  HRR (1-min): 22 bpm drop (optimal)
  [other metrics not measured]

Autonomic cardiovascular control
  ...

─────────────────────────────────────────

[Repeat for each system]

─────────────────────────────────────────

OBSERVATIONS (doctor notes)

[Free text field for doctor to add interpretation]

─────────────────────────────────────────

Note: This is a point-in-time observation, not a diagnosis.
Reviewed by: _______________
```

### Report Shows

- The full state: all systems → observables → metrics with values
- Reference status for each value
- Space for doctor observations (not auto-generated)

### Export Options

- View in browser
- Download as PDF
- Print directly

---

## 6. Tech Stack (suggested)

### Simple Option: Static Web App

- **Frontend**: HTML + vanilla JS (or Alpine.js/Vue)
- **Styling**: Tailwind CSS or simple custom CSS
- **Data**: localStorage or export/import JSON
- **PDF**: Browser print-to-PDF or jsPDF

### File Structure

```
/health-evaluation
  index.html
  /css
    styles.css
  /js
    schema.js         — health_schema as JS object
    references.js     — reference ranges
    app.js            — form handling, state computation, display
    report.js         — report generation
  /data
    health_schema.json
    reference_ranges.json
```

---

## 7. Reference Ranges (needed)

Need to define reference ranges for each metric. Example:

```json
{
  "bp_resting_systolic": {
    "male": {
      "18-39": { "optimal": [90, 120], "acceptable": [120, 130], "concerning": [130, 180] },
      "40-59": { "optimal": [90, 125], "acceptable": [125, 135], "concerning": [135, 180] },
      "60+": { "optimal": [90, 130], "acceptable": [130, 140], "concerning": [140, 180] }
    },
    "female": { ... }
  }
}
```

This needs clinical input to populate properly.

---

## 8. Not in Scope (MVP)

- User authentication
- Multiple stored evaluations
- Comparison between evaluations
- Wearable data import
- Auto-generated interpretive text
- Recommendation engine
