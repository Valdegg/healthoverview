/**
 * Health Schema
 * 
 * Defines the 6 health systems, their observables, and metrics.
 * Converted from health_schema.json for use in the app.
 */

export const SCHEMA_VERSION = "0.1";

export const SCALE_DEFINITIONS = {
  observable_importance: {
    min: 1,
    max: 5,
    meaning: {
      1: "Nice-to-have context",
      2: "Useful supporting signal",
      3: "Important",
      4: "Very important",
      5: "Core driver / highest leverage"
    }
  },
  metric_fidelity: {
    min: 1,
    max: 5,
    meaning: {
      1: "Weak proxy / high noise",
      2: "Proxy with limitations",
      3: "Reasonable indicator",
      4: "Strong indicator",
      5: "Direct / highly reliable indicator"
    }
  }
};

export const BRANCHES = [
  {
    branch_id: "cardiovascular_circulatory",
    branch_name: "Cardiovascular & Circulatory",
    observables: [
      {
        observable_id: "cv_resting_load",
        observable_name: "Resting cardiovascular load",
        importance: 5,
        observable_description: "Baseline pressure and rate burden on heart and vasculature at rest; reflects sustained strain and sets the backdrop for recovery and long-term risk.",
        metrics: [
          {
            metric_id: "bp_resting_systolic",
            metric_name: "Resting systolic blood pressure",
            measurement_method: "BP cuff; seated, 5 min rest; average of 2–3 readings",
            unit: "mmHg",
            fidelity: 5
          },
          {
            metric_id: "bp_resting_diastolic",
            metric_name: "Resting diastolic blood pressure",
            measurement_method: "BP cuff; same protocol as systolic",
            unit: "mmHg",
            fidelity: 5
          },
          {
            metric_id: "hr_resting",
            metric_name: "Resting heart rate",
            measurement_method: "Wearable or manual pulse; morning, seated/rested",
            unit: "bpm",
            fidelity: 4
          }
        ]
      },
      {
        observable_id: "cv_atherogenic_load",
        observable_name: "Atherogenic (lipid) load",
        importance: 5,
        observable_description: "Chemical drivers of atherosclerotic burden; slow-changing but highly informative for long-term vascular stress.",
        metrics: [
          {
            metric_id: "apob",
            metric_name: "ApoB",
            measurement_method: "Finger-prick blood test (if available) or lab",
            unit: "mg/dL",
            fidelity: 5
          },
          {
            metric_id: "ldl_c",
            metric_name: "LDL-C",
            measurement_method: "Finger-prick lipid panel",
            unit: "mg/dL",
            fidelity: 4
          },
          {
            metric_id: "triglycerides",
            metric_name: "Triglycerides",
            measurement_method: "Finger-prick lipid panel; ideally fasting",
            unit: "mg/dL",
            fidelity: 3
          },
          {
            metric_id: "hdl_c",
            metric_name: "HDL-C",
            measurement_method: "Finger-prick lipid panel",
            unit: "mg/dL",
            fidelity: 2
          }
        ]
      },
      {
        observable_id: "cv_recovery_capacity",
        observable_name: "Cardiovascular recovery capacity",
        importance: 4,
        observable_description: "How quickly cardiovascular control returns toward baseline after a standardized stressor; reflects resilience and conditioning.",
        metrics: [
          {
            metric_id: "hrr_1min",
            metric_name: "Heart rate recovery (1-minute)",
            measurement_method: "Standardized step/stair test; HR drop after 60s rest",
            unit: "bpm drop",
            fidelity: 4
          },
          {
            metric_id: "hrr_2min",
            metric_name: "Heart rate recovery (2-minute)",
            measurement_method: "Same test; HR drop after 120s rest",
            unit: "bpm drop",
            fidelity: 4
          },
          {
            metric_id: "post_exertion_next_morning_rhr",
            metric_name: "Next-morning resting HR after exertion",
            measurement_method: "Wearable; compare to personal baseline",
            unit: "bpm delta",
            fidelity: 3
          }
        ]
      },
      {
        observable_id: "cv_autonomic_control",
        observable_name: "Autonomic cardiovascular control",
        importance: 4,
        observable_description: "Balance and responsiveness of autonomic regulation (sympathetic/parasympathetic) influencing HR/BP stability and stress reactivity.",
        metrics: [
          {
            metric_id: "hrv_rmssd_overnight",
            metric_name: "Overnight HRV (RMSSD or equivalent)",
            measurement_method: "Wearable; nightly average; trend vs baseline",
            unit: "ms",
            fidelity: 3
          },
          {
            metric_id: "orthostatic_hr_delta",
            metric_name: "Orthostatic HR change (lying to standing)",
            measurement_method: "Stopwatch + HR sensor; measure HR change over 1–3 minutes",
            unit: "bpm delta",
            fidelity: 4
          },
          {
            metric_id: "orthostatic_bp_delta",
            metric_name: "Orthostatic BP change (lying to standing)",
            measurement_method: "BP cuff; measure supine then standing",
            unit: "mmHg delta",
            fidelity: 4
          }
        ]
      }
    ]
  },
  {
    branch_id: "metabolic_energy",
    branch_name: "Metabolic & Energy Regulation",
    observables: [
      {
        observable_id: "met_glycemic_state",
        observable_name: "Glycemic state (baseline)",
        importance: 5,
        observable_description: "Baseline glucose regulation over short and longer horizons; central for metabolic health and downstream cardiovascular risk.",
        metrics: [
          {
            metric_id: "hba1c",
            metric_name: "HbA1c",
            measurement_method: "Finger-prick test",
            unit: "%",
            fidelity: 5
          },
          {
            metric_id: "fasting_glucose",
            metric_name: "Fasting glucose",
            measurement_method: "Finger-prick glucose meter; morning fasted",
            unit: "mg/dL",
            fidelity: 4
          }
        ]
      },
      {
        observable_id: "met_postprandial_response",
        observable_name: "Post-meal metabolic stress response",
        importance: 4,
        observable_description: "System load after typical meals; captures regulation quality beyond fasting values.",
        metrics: [
          {
            metric_id: "post_meal_glucose_60_90",
            metric_name: "Post-meal glucose (60–90 min)",
            measurement_method: "Finger-prick glucose meter after standardized meal",
            unit: "mg/dL",
            fidelity: 4
          },
          {
            metric_id: "post_meal_hr_delta",
            metric_name: "Post-meal heart rate elevation",
            measurement_method: "Wearable; compare to pre-meal baseline",
            unit: "bpm delta",
            fidelity: 2
          }
        ]
      },
      {
        observable_id: "met_adiposity_pattern",
        observable_name: "Adiposity distribution (metabolic load proxy)",
        importance: 4,
        observable_description: "Body fat distribution proxying insulin resistance and cardiometabolic strain; used cautiously and longitudinally.",
        metrics: [
          {
            metric_id: "waist_circumference",
            metric_name: "Waist circumference",
            measurement_method: "Measuring tape; standardized anatomical point",
            unit: "cm",
            fidelity: 4
          },
          {
            metric_id: "waist_to_height",
            metric_name: "Waist-to-height ratio",
            measurement_method: "Waist tape + height",
            unit: "ratio",
            fidelity: 4
          },
          {
            metric_id: "weight_trend",
            metric_name: "Weight trend",
            measurement_method: "Scale; morning; rolling average",
            unit: "kg/week",
            fidelity: 2
          }
        ]
      },
      {
        observable_id: "met_lipid_metabolic_signature",
        observable_name: "Metabolic lipid signature",
        importance: 3,
        observable_description: "Lipid pattern reflecting insulin resistance and hepatic lipid handling; bridges metabolic and cardiovascular branches.",
        metrics: [
          {
            metric_id: "triglycerides_met",
            metric_name: "Triglycerides (fasting preferred)",
            measurement_method: "Finger-prick lipid panel",
            unit: "mg/dL",
            fidelity: 4
          },
          {
            metric_id: "tg_hdl_ratio",
            metric_name: "TG/HDL ratio",
            measurement_method: "Derived from lipid panel",
            unit: "ratio",
            fidelity: 3
          }
        ]
      }
    ]
  },
  {
    branch_id: "inflammatory_immune",
    branch_name: "Inflammatory & Immune Load",
    observables: [
      {
        observable_id: "infl_baseline_inflammation",
        observable_name: "Baseline systemic inflammatory activity",
        importance: 5,
        observable_description: "General level of systemic inflammation; useful anchor signal to contextualize recovery, cardiovascular risk, and metabolic strain.",
        metrics: [
          {
            metric_id: "hs_crp",
            metric_name: "hs-CRP (or CRP)",
            measurement_method: "Finger-prick test",
            unit: "mg/L",
            fidelity: 5
          }
        ]
      },
      {
        observable_id: "infl_recovery_debt",
        observable_name: "Recovery debt / delayed restoration",
        importance: 4,
        observable_description: "How strongly the body 'stays activated' after stress; reflects combined inflammatory/autonomic load.",
        metrics: [
          {
            metric_id: "rhr_trend",
            metric_name: "Resting HR elevation vs baseline",
            measurement_method: "Wearable; morning trend",
            unit: "bpm delta",
            fidelity: 3
          },
          {
            metric_id: "hrv_suppression",
            metric_name: "HRV suppression vs baseline",
            measurement_method: "Wearable; overnight trend",
            unit: "% change",
            fidelity: 3
          },
          {
            metric_id: "sleep_fragmentation",
            metric_name: "Sleep fragmentation / awakenings",
            measurement_method: "Wearable + subjective sleep continuity note",
            unit: "awakenings/night",
            fidelity: 2
          }
        ]
      },
      {
        observable_id: "infl_illness_susceptibility_pattern",
        observable_name: "Illness susceptibility pattern (coarse)",
        importance: 2,
        observable_description: "Frequency of minor infections as a coarse, contextual signal; high noise and confounding, used cautiously.",
        metrics: [
          {
            metric_id: "minor_infections_count",
            metric_name: "Minor infection frequency (self-log)",
            measurement_method: "Structured self-report log (monthly)",
            unit: "count/month",
            fidelity: 1
          }
        ]
      }
    ]
  },
  {
    branch_id: "neural_cognitive",
    branch_name: "Neural & Cognitive",
    observables: [
      {
        observable_id: "neuro_sleep_regulation",
        observable_name: "Sleep regulation quality",
        importance: 5,
        observable_description: "Core restorative and regulatory process affecting cognition, metabolic control, inflammation, and autonomic balance.",
        metrics: [
          {
            metric_id: "sleep_duration",
            metric_name: "Sleep duration",
            measurement_method: "Wearable + time-in-bed log",
            unit: "hours",
            fidelity: 3
          },
          {
            metric_id: "sleep_efficiency",
            metric_name: "Sleep efficiency / awakenings",
            measurement_method: "Wearable",
            unit: "%",
            fidelity: 3
          },
          {
            metric_id: "sleep_timing_consistency",
            metric_name: "Sleep timing consistency",
            measurement_method: "Wearable or sleep log",
            unit: "std dev (min)",
            fidelity: 4
          }
        ]
      },
      {
        observable_id: "neuro_attention_speed",
        observable_name: "Attention speed and stability",
        importance: 4,
        observable_description: "Cognitive throughput and steadiness; best captured as variability across repeated simple tests.",
        metrics: [
          {
            metric_id: "reaction_time_mean",
            metric_name: "Reaction time (mean)",
            measurement_method: "Standardized phone/web test; same device/time",
            unit: "ms",
            fidelity: 3
          },
          {
            metric_id: "reaction_time_variability",
            metric_name: "Reaction time variability (std dev / lapses)",
            measurement_method: "Same test; repeated measurements",
            unit: "ms",
            fidelity: 4
          }
        ]
      },
      {
        observable_id: "neuro_autonomic_balance",
        observable_name: "Autonomic balance (neuro-cardiac interface)",
        importance: 3,
        observable_description: "Neural regulation of physiological state; overlaps with cardiovascular autonomic control but included here as a cognitive/stress-regulation lens.",
        metrics: [
          {
            metric_id: "hrv_neuro",
            metric_name: "Overnight HRV trend",
            measurement_method: "Wearable",
            unit: "ms",
            fidelity: 3
          },
          {
            metric_id: "orthostatic_symptoms_log",
            metric_name: "Orthostatic symptoms (structured log)",
            measurement_method: "Brief questionnaire during orthostatic test",
            unit: "score",
            fidelity: 2
          }
        ]
      }
    ]
  },
  {
    branch_id: "hormonal_regulatory",
    branch_name: "Hormonal & Regulatory",
    observables: [
      {
        observable_id: "horm_thyroid_axis_state",
        observable_name: "Thyroid axis state (regulatory baseline)",
        importance: 4,
        observable_description: "Key endocrine controller influencing energy, temperature regulation, and cardiovascular/metabolic tone; interpreted cautiously.",
        metrics: [
          {
            metric_id: "tsh",
            metric_name: "TSH",
            measurement_method: "Finger-prick (if available) or lab",
            unit: "mIU/L",
            fidelity: 4
          },
          {
            metric_id: "free_t4",
            metric_name: "Free T4 (if available)",
            measurement_method: "Finger-prick (limited availability) or lab",
            unit: "pmol/L",
            fidelity: 4
          },
          {
            metric_id: "morning_temp_trend",
            metric_name: "Morning temperature trend",
            measurement_method: "Oral thermometer; same time daily",
            unit: "°C",
            fidelity: 2
          }
        ]
      },
      {
        observable_id: "horm_stress_axis_tone",
        observable_name: "Stress-axis tone (diurnal stability proxy)",
        importance: 3,
        observable_description: "Regulatory stability across day; looks for dysregulated patterns rather than single values.",
        metrics: [
          {
            metric_id: "sleep_wake_consistency_horm",
            metric_name: "Sleep-wake consistency",
            measurement_method: "Wearable/log",
            unit: "std dev (min)",
            fidelity: 3
          },
          {
            metric_id: "am_resting_hr",
            metric_name: "Morning resting HR trend",
            measurement_method: "Wearable",
            unit: "bpm",
            fidelity: 2
          },
          {
            metric_id: "cortisol_optional",
            metric_name: "Cortisol (timed, optional)",
            measurement_method: "Finger-prick (limited) or saliva/lab; timing-critical",
            unit: "varies",
            fidelity: 2
          }
        ]
      },
      {
        observable_id: "horm_sex_hormone_context",
        observable_name: "Sex-hormone context (optional, context-dependent)",
        importance: 2,
        observable_description: "Contextual endocrine information relevant to energy, mood, recovery in some individuals; not core for everyone.",
        metrics: [
          {
            metric_id: "testosterone_optional",
            metric_name: "Testosterone (optional)",
            measurement_method: "Finger-prick (if available) or lab",
            unit: "ng/dL",
            fidelity: 3
          },
          {
            metric_id: "cycle_tracking_optional",
            metric_name: "Menstrual cycle tracking (optional)",
            measurement_method: "Structured log/app (if applicable)",
            unit: "cycle days",
            fidelity: 2
          }
        ]
      }
    ]
  },
  {
    branch_id: "structural_musculoskeletal",
    branch_name: "Structural & Musculoskeletal",
    observables: [
      {
        observable_id: "msk_strength_capacity",
        observable_name: "Strength capacity (functional)",
        importance: 5,
        observable_description: "Functional strength reserve and overall musculoskeletal capacity; highly actionable and strongly related to resilience and aging outcomes.",
        metrics: [
          {
            metric_id: "grip_strength",
            metric_name: "Grip strength",
            measurement_method: "Hand dynamometer; best of 3 attempts",
            unit: "kg",
            fidelity: 4
          },
          {
            metric_id: "sit_to_stand_30s",
            metric_name: "30-second sit-to-stand reps",
            measurement_method: "Standard chair + stopwatch",
            unit: "reps",
            fidelity: 4
          }
        ]
      },
      {
        observable_id: "msk_mobility_range",
        observable_name: "Mobility / range-of-motion sufficiency",
        importance: 3,
        observable_description: "Movement capability and joint range adequate for daily function and safe training; supports injury risk reduction.",
        metrics: [
          {
            metric_id: "rom_screen",
            metric_name: "Basic ROM screen (shoulder/hip/ankle)",
            measurement_method: "Clinician-guided screen; standardized positions",
            unit: "pass/limit",
            fidelity: 3
          },
          {
            metric_id: "deep_squat_assessment",
            metric_name: "Deep squat pattern screen (optional)",
            measurement_method: "Clinician observation",
            unit: "score",
            fidelity: 2
          }
        ]
      },
      {
        observable_id: "msk_balance_control",
        observable_name: "Balance and motor control",
        importance: 3,
        observable_description: "Postural control and neuromuscular coordination; bridges neural and musculoskeletal domains and is useful for fall/injury prevention framing.",
        metrics: [
          {
            metric_id: "single_leg_stance_eyes_open",
            metric_name: "Single-leg stance (eyes open)",
            measurement_method: "Stopwatch; both sides",
            unit: "seconds",
            fidelity: 3
          },
          {
            metric_id: "single_leg_stance_eyes_closed",
            metric_name: "Single-leg stance (eyes closed)",
            measurement_method: "Stopwatch; safety precautions",
            unit: "seconds",
            fidelity: 3
          }
        ]
      },
      {
        observable_id: "msk_pain_injury_burden",
        observable_name: "Pain/injury burden (contextual functional constraint)",
        importance: 2,
        observable_description: "Functional limitation due to pain or recurring injury; mainly used to shape safe recommendations rather than to score health.",
        metrics: [
          {
            metric_id: "injury_recurrence_log",
            metric_name: "Injury recurrence log (structured)",
            measurement_method: "Clinician interview + monthly log",
            unit: "episodes/quarter",
            fidelity: 2
          },
          {
            metric_id: "pain_interference_score",
            metric_name: "Pain interference (brief scale)",
            measurement_method: "Short questionnaire",
            unit: "score",
            fidelity: 2
          }
        ]
      }
    ]
  }
];

/**
 * Helper: Get all metrics as a flat list
 */
export function getAllMetrics() {
  const metrics = [];
  for (const branch of BRANCHES) {
    for (const observable of branch.observables) {
      for (const metric of observable.metrics) {
        metrics.push({
          ...metric,
          branch_id: branch.branch_id,
          branch_name: branch.branch_name,
          observable_id: observable.observable_id,
          observable_name: observable.observable_name,
          observable_importance: observable.importance
        });
      }
    }
  }
  return metrics;
}

/**
 * Helper: Get metric by ID
 */
export function getMetricById(metricId) {
  for (const branch of BRANCHES) {
    for (const observable of branch.observables) {
      for (const metric of observable.metrics) {
        if (metric.metric_id === metricId) {
          return {
            ...metric,
            branch_id: branch.branch_id,
            branch_name: branch.branch_name,
            observable_id: observable.observable_id,
            observable_name: observable.observable_name,
            observable_importance: observable.importance
          };
        }
      }
    }
  }
  return null;
}
