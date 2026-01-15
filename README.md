# Health Evaluation

A doctor-led tool for observing the objective health state of a patient at a point in time.

![Health Evaluation Screenshot](https://via.placeholder.com/800x500?text=Health+Evaluation+App)

## What is this?

This tool helps doctors assess health based on the **state and stability of core physiological systems**, rather than diagnosing disease. It provides a structured way to:

- Collect measurements across 6 key health systems
- Compare values against reference ranges (age/sex adjusted)
- Generate a summary report for clinical review

### The Six Systems

| System | What it covers |
|--------|----------------|
| **Cardiovascular & Circulatory** | Blood pressure, heart rate, vascular health |
| **Metabolic & Energy Regulation** | Blood sugar, lipids, metabolic markers |
| **Inflammatory & Immune Load** | Inflammation markers, immune indicators |
| **Neural & Cognitive Regulation** | Cognitive function, reaction time, sleep |
| **Hormonal & Regulatory Control** | Thyroid, cortisol, key hormones |
| **Structural & Musculoskeletal** | Strength, balance, mobility |

## Key Principles

- **Doctor-led**: Software supports, doesn't replace clinical judgment
- **Point-in-time**: Snapshot of current state, not long-term tracking
- **Non-diagnostic**: Describes system state, not disease
- **Stability-focused**: Emphasizes what's working well, not just problems

## Running the App

### Quick Start

```bash
cd app
python3 server.py
```

Then open http://localhost:8080 in your browser.

### Alternative (simple HTTP server)

```bash
cd app
python3 -m http.server 8080
```

## How It Works

1. **Enter person info** — Name, age, sex (for reference ranges)
2. **Add measurements** — Fill in metrics over time as they're collected
3. **Review status** — See which values are optimal, acceptable, or need attention
4. **Generate report** — Create a printable summary for clinical review

### Data Storage

- All data is saved automatically to browser localStorage
- Each person (name + age + sex) gets their own saved evaluation
- Data persists across browser sessions
- Click "Saved evaluations" to switch between patients

## Project Structure

```
health-observation/
├── app/
│   ├── index.html          # Main app
│   ├── css/styles.css      # Styling
│   ├── js/
│   │   ├── app.js          # Main application logic
│   │   ├── schema.js       # Health systems & metrics schema
│   │   ├── references.js   # Reference ranges (age/sex adjusted)
│   │   ├── state.js        # Data model & persistence
│   │   └── report.js       # Report generation
│   └── server.py           # Development server
├── health_schema.json      # Full schema definition
├── concept_note.md         # Project concept
├── project_description.md  # Detailed description
├── software_specs.md       # Technical specifications
└── tasks.md                # Development tasks
```

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (ES modules)
- **Storage**: Browser localStorage
- **Server**: Python HTTP server (development only)
- **No dependencies**: Runs entirely in the browser

## Intended Use

This is a **support tool for doctors**, not a consumer health app. It helps:

- Organize fragmented health data
- Provide context via reference ranges
- Generate structured summaries
- Support longer, more thoughtful patient conversations

**It does not**: Diagnose disease, recommend treatment, or replace standard medical care.

## License

Private project. All rights reserved.
