# Tasks

Grouped tasks to build the MVP based on software specs.

---

## 1. Project Setup ✓

- [x] Create project folder structure
- [x] Set up HTML entry point
- [x] Set up basic CSS
- [x] Convert health_schema.json to usable JS module

---

## 2. Reference Ranges ✓

- [x] Define reference range data structure
- [x] Populate reference ranges for cardiovascular metrics
- [x] Populate reference ranges for metabolic metrics
- [x] Populate reference ranges for inflammatory metrics
- [x] Populate reference ranges for neural/cognitive metrics
- [x] Populate reference ranges for hormonal metrics
- [x] Populate reference ranges for structural/musculoskeletal metrics
- [x] Create function to look up reference status given (metric_id, value, age, sex)

---

## 3. Data Model & State ✓

- [x] Define Evaluation structure (id, person info, measurements)
- [x] Define Measurement structure (metric_id, value, context)
- [x] Create function to build HealthState from schema + measurements
- [x] Create function to compute reference_status for each metric value
- [x] Store/retrieve evaluation data (localStorage or JSON export)

---

## 4. Data Entry Forms ✓

- [x] Build form layout with 6 collapsible system sections
- [x] For each system, render observables as groups
- [x] For each observable, render metric input fields
- [x] Show optimal range hint for each metric
- [x] Show unit label for each metric
- [x] Add person info fields (age, sex, name)
- [x] Implement auto-save on input change
- [x] Show completion indicator per system (percentage badge)
- [x] Refined visual design with warm color palette
- [x] Observable importance shown as dot rating

---

## 5. Display View ✓

- [x] Add Entry ↔ Review mode toggle
- [x] Build "Foundations of Health" overview with 6 system cards
- [x] Render observables within each system with importance dots
- [x] Render metrics with value + unit + status indicator
- [x] Color-coded metric rows (optimal/acceptable/concerning)
- [x] Faded display for empty observables
- [x] System summary pills (X optimal, Y acceptable, etc.)

---

## 6. Report Generation ✓

- [x] Create report.js with analysis logic
- [x] Extract findings (concerns, patterns, notable values)
- [x] Identify high-importance unobserved areas ("Consider Measuring")
- [x] Show areas of strength (optimal high-importance metrics)
- [x] Build printable report modal with header, date, person info
- [x] Render detailed observations with status indicators
- [x] Add disclaimer footer
- [x] Style for print (clean, no UI chrome)
- [x] "Print Report" and "Close" buttons

---

## 7. Integration & Polish ✓

- [x] Add measurement protocol tooltips (hover to see protocol)
- [x] Add input validation with plausibility warnings
- [x] Test with sample data (one full evaluation)
- [x] Handle edge cases (missing values, extreme values)
- [x] Responsive layout for different screen sizes
- [x] Final styling pass

---

## 8. Vision Alignment Improvements ✓

- [x] Per-system state descriptions (non-diagnostic, stability-focused)
- [x] Stability labels ("Stable", "Some variation", "Review recommended")
- [x] Cross-system interaction explanations (how factors interact)
- [x] Stability guidance (general, non-prescriptive suggestions)
- [x] Measurement protocol tooltips (hover to see protocol)
- [x] Input validation with plausibility warnings

---

## 9. Schema Utilization ✓

- [x] Show observable_description inline below each observable
- [x] Rich tooltips with measurement_method + how_well_it_measures + fidelity
- [x] Descriptions visible in both Entry and Review modes

---

## Optional / Later

- [ ] Personal baselines (compare to individual history)
- [ ] Per-system doctor notes
- [ ] Export/import evaluation as JSON file
- [ ] Dark mode
