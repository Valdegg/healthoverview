# Software Features — MVP

A simple tool for a doctor to collect measurements and assess one person's current health state across the 6 systems.

This is a **point-in-time evaluation**, not an ongoing tracker.

---

## What the software does

### 1. Enter measurements

- Input forms for each metric, grouped by system
- Shows measurement protocol inline (e.g., "seated, 5 min rest, average of 2–3")
- Supports entering multiple readings from a short collection period (e.g., a few days)
- Easy to fill out during or after a session

### 2. Display current state

- Single-page view of all systems
- Each system shows:
  - Its metrics with entered values
  - How values compare to reference ranges (age/sex)
- Clear visual for what's within expected range vs. outside

### 3. Generate system summary

- For each system, compute a state: `robust` | `stable` | `compensating` | `strained`
- Show which metrics are driving the assessment
- Rule-based, transparent logic

### 4. Export a report

- One-page summary the doctor can review and give to the person
- Per system: state + key metrics + plain-language note
- Overall: cross-system observations + suggested focus areas
- PDF or printable

---

## What it's not

- Not a tracker — no long-term history or trend analysis
- Not a dashboard to check daily
- Not a patient-facing app

It's a tool to support a single evaluation session and produce a clear output.

---

## Build order

1. **Data entry** — forms for one system (cardiovascular)
2. **Display** — show values with reference context
3. **Expand** — add remaining 5 systems
4. **Aggregation** — compute system states
5. **Report** — generate exportable summary
