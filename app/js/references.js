/**
 * Reference Ranges
 * 
 * Clinical reference ranges for each metric, organized by age and sex where relevant.
 * Sources: Mayo Clinic, Cleveland Clinic, AHA, CDC, Hopkins Medicine, clinical guidelines.
 */

export const REFERENCE_RANGES = {
  
  // ============================================
  // CARDIOVASCULAR & CIRCULATORY
  // ============================================
  
  bp_resting_systolic: {
    unit: "mmHg",
    direction: "lower_better",
    male: {
      "18-39": { optimal: [90, 120], acceptable: [120, 130], concerning: [130, 180] },
      "40-59": { optimal: [90, 120], acceptable: [120, 135], concerning: [135, 180] },
      "60+":   { optimal: [90, 125], acceptable: [125, 140], concerning: [140, 180] }
    },
    female: {
      "18-39": { optimal: [90, 120], acceptable: [120, 130], concerning: [130, 180] },
      "40-59": { optimal: [90, 120], acceptable: [120, 135], concerning: [135, 180] },
      "60+":   { optimal: [90, 125], acceptable: [125, 140], concerning: [140, 180] }
    }
  },
  
  bp_resting_diastolic: {
    unit: "mmHg",
    direction: "lower_better",
    male: {
      "18-39": { optimal: [60, 80], acceptable: [80, 85], concerning: [85, 120] },
      "40-59": { optimal: [60, 80], acceptable: [80, 90], concerning: [90, 120] },
      "60+":   { optimal: [60, 80], acceptable: [80, 90], concerning: [90, 120] }
    },
    female: {
      "18-39": { optimal: [60, 80], acceptable: [80, 85], concerning: [85, 120] },
      "40-59": { optimal: [60, 80], acceptable: [80, 90], concerning: [90, 120] },
      "60+":   { optimal: [60, 80], acceptable: [80, 90], concerning: [90, 120] }
    }
  },
  
  hr_resting: {
    unit: "bpm",
    direction: "lower_better",
    any: {
      "18-39": { optimal: [45, 65], acceptable: [65, 80], concerning: [80, 100] },
      "40-59": { optimal: [50, 68], acceptable: [68, 82], concerning: [82, 100] },
      "60+":   { optimal: [50, 70], acceptable: [70, 85], concerning: [85, 100] }
    }
  },
  
  apob: {
    unit: "mg/dL",
    direction: "lower_better",
    any: {
      "all": { optimal: [40, 80], acceptable: [80, 100], concerning: [100, 200] }
    }
  },
  
  ldl_c: {
    unit: "mg/dL",
    direction: "lower_better",
    any: {
      "all": { optimal: [40, 100], acceptable: [100, 130], concerning: [130, 250] }
    }
  },
  
  triglycerides: {
    unit: "mg/dL",
    direction: "lower_better",
    any: {
      "all": { optimal: [40, 100], acceptable: [100, 150], concerning: [150, 500] }
    }
  },
  
  hdl_c: {
    unit: "mg/dL",
    direction: "higher_better",
    male: {
      "all": { optimal: [60, 100], acceptable: [40, 60], concerning: [20, 40] }
    },
    female: {
      "all": { optimal: [60, 100], acceptable: [50, 60], concerning: [20, 50] }
    }
  },
  
  hrr_1min: {
    unit: "bpm drop",
    direction: "higher_better",
    any: {
      "18-39": { optimal: [25, 60], acceptable: [18, 25], concerning: [0, 18] },
      "40-59": { optimal: [22, 55], acceptable: [15, 22], concerning: [0, 15] },
      "60+":   { optimal: [18, 50], acceptable: [12, 18], concerning: [0, 12] }
    }
  },
  
  hrr_2min: {
    unit: "bpm drop",
    direction: "higher_better",
    any: {
      "18-39": { optimal: [35, 80], acceptable: [25, 35], concerning: [0, 25] },
      "40-59": { optimal: [30, 75], acceptable: [22, 30], concerning: [0, 22] },
      "60+":   { optimal: [25, 65], acceptable: [18, 25], concerning: [0, 18] }
    }
  },
  
  post_exertion_next_morning_rhr: {
    unit: "bpm delta",
    direction: "lower_better",
    any: {
      "all": { optimal: [-2, 3], acceptable: [3, 8], concerning: [8, 20] }
    }
  },
  
  hrv_rmssd_overnight: {
    unit: "ms",
    direction: "higher_better",
    any: {
      "18-39": { optimal: [40, 120], acceptable: [25, 40], concerning: [0, 25] },
      "40-59": { optimal: [30, 100], acceptable: [20, 30], concerning: [0, 20] },
      "60+":   { optimal: [20, 80], acceptable: [15, 20], concerning: [0, 15] }
    }
  },
  
  orthostatic_hr_delta: {
    unit: "bpm delta",
    direction: "lower_better",
    any: {
      "all": { optimal: [5, 20], acceptable: [20, 30], concerning: [30, 60] }
    }
  },
  
  orthostatic_bp_delta: {
    unit: "mmHg delta",
    direction: "lower_better",
    any: {
      "all": { optimal: [-10, 10], acceptable: [-20, -10], concerning: [-40, -20] }
    }
  },
  
  // ============================================
  // METABOLIC & ENERGY REGULATION
  // ============================================
  
  hba1c: {
    unit: "%",
    direction: "lower_better",
    any: {
      "all": { optimal: [4.0, 5.4], acceptable: [5.4, 5.7], concerning: [5.7, 10.0] }
    }
  },
  
  fasting_glucose: {
    unit: "mg/dL",
    direction: "lower_better",
    any: {
      "all": { optimal: [70, 90], acceptable: [90, 100], concerning: [100, 200] }
    }
  },
  
  post_meal_glucose_60_90: {
    unit: "mg/dL",
    direction: "lower_better",
    any: {
      "all": { optimal: [70, 120], acceptable: [120, 140], concerning: [140, 250] }
    }
  },
  
  post_meal_hr_delta: {
    unit: "bpm delta",
    direction: "lower_better",
    any: {
      "all": { optimal: [0, 10], acceptable: [10, 20], concerning: [20, 40] }
    }
  },
  
  waist_circumference: {
    unit: "cm",
    direction: "lower_better",
    male: {
      "all": { optimal: [60, 90], acceptable: [90, 102], concerning: [102, 150] }
    },
    female: {
      "all": { optimal: [55, 75], acceptable: [75, 88], concerning: [88, 130] }
    }
  },
  
  waist_to_height: {
    unit: "ratio",
    direction: "lower_better",
    any: {
      "all": { optimal: [0.35, 0.46], acceptable: [0.46, 0.53], concerning: [0.53, 0.80] }
    }
  },
  
  weight_trend: {
    unit: "kg/week",
    direction: "neutral",
    any: {
      "all": { optimal: [-0.5, 0.3], acceptable: [-1.0, 0.5], concerning: [-2.0, 1.0] }
    }
  },
  
  triglycerides_met: {
    unit: "mg/dL",
    direction: "lower_better",
    any: {
      "all": { optimal: [40, 100], acceptable: [100, 150], concerning: [150, 500] }
    }
  },
  
  tg_hdl_ratio: {
    unit: "ratio",
    direction: "lower_better",
    any: {
      "all": { optimal: [0.5, 1.5], acceptable: [1.5, 2.5], concerning: [2.5, 8.0] }
    }
  },
  
  // ============================================
  // INFLAMMATORY & IMMUNE LOAD
  // ============================================
  
  hs_crp: {
    unit: "mg/L",
    direction: "lower_better",
    any: {
      "all": { optimal: [0, 1.0], acceptable: [1.0, 3.0], concerning: [3.0, 20.0] }
    }
  },
  
  rhr_trend: {
    unit: "bpm delta",
    direction: "lower_better",
    any: {
      "all": { optimal: [-3, 3], acceptable: [3, 7], concerning: [7, 20] }
    }
  },
  
  hrv_suppression: {
    unit: "% change",
    direction: "higher_better",
    any: {
      "all": { optimal: [-10, 10], acceptable: [-25, -10], concerning: [-50, -25] }
    }
  },
  
  sleep_fragmentation: {
    unit: "awakenings/night",
    direction: "lower_better",
    any: {
      "18-39": { optimal: [0, 1], acceptable: [1, 3], concerning: [3, 10] },
      "40-59": { optimal: [0, 2], acceptable: [2, 4], concerning: [4, 10] },
      "60+":   { optimal: [0, 3], acceptable: [3, 5], concerning: [5, 12] }
    }
  },
  
  minor_infections_count: {
    unit: "count/month",
    direction: "lower_better",
    any: {
      "all": { optimal: [0, 0.5], acceptable: [0.5, 1], concerning: [1, 5] }
    }
  },
  
  // ============================================
  // NEURAL & COGNITIVE
  // ============================================
  
  sleep_duration: {
    unit: "hours",
    direction: "in_range",
    any: {
      "18-39": { optimal: [7, 9], acceptable: [6, 7], concerning: [0, 6] },
      "40-59": { optimal: [7, 8.5], acceptable: [6, 7], concerning: [0, 6] },
      "60+":   { optimal: [7, 8], acceptable: [6, 7], concerning: [0, 6] }
    }
  },
  
  sleep_efficiency: {
    unit: "%",
    direction: "higher_better",
    any: {
      "all": { optimal: [90, 100], acceptable: [80, 90], concerning: [0, 80] }
    }
  },
  
  sleep_timing_consistency: {
    unit: "std dev (min)",
    direction: "lower_better",
    any: {
      "all": { optimal: [0, 30], acceptable: [30, 60], concerning: [60, 180] }
    }
  },
  
  reaction_time_mean: {
    unit: "ms",
    direction: "lower_better",
    any: {
      "18-39": { optimal: [180, 250], acceptable: [250, 300], concerning: [300, 500] },
      "40-59": { optimal: [200, 280], acceptable: [280, 350], concerning: [350, 550] },
      "60+":   { optimal: [220, 320], acceptable: [320, 400], concerning: [400, 600] }
    }
  },
  
  reaction_time_variability: {
    unit: "ms",
    direction: "lower_better",
    any: {
      "18-39": { optimal: [20, 50], acceptable: [50, 80], concerning: [80, 200] },
      "40-59": { optimal: [25, 60], acceptable: [60, 100], concerning: [100, 220] },
      "60+":   { optimal: [30, 75], acceptable: [75, 120], concerning: [120, 250] }
    }
  },
  
  hrv_neuro: {
    unit: "ms",
    direction: "higher_better",
    any: {
      "18-39": { optimal: [40, 120], acceptable: [25, 40], concerning: [0, 25] },
      "40-59": { optimal: [30, 100], acceptable: [20, 30], concerning: [0, 20] },
      "60+":   { optimal: [20, 80], acceptable: [15, 20], concerning: [0, 15] }
    }
  },
  
  orthostatic_symptoms_log: {
    unit: "score",
    direction: "lower_better",
    any: {
      "all": { optimal: [0, 1], acceptable: [1, 3], concerning: [3, 10] }
    }
  },
  
  // ============================================
  // HORMONAL & REGULATORY
  // ============================================
  
  tsh: {
    unit: "mIU/L",
    direction: "in_range",
    any: {
      "all": { optimal: [0.5, 2.5], acceptable: [0.4, 4.0], concerning: [0, 0.4] }
    }
  },
  
  free_t4: {
    unit: "pmol/L",
    direction: "in_range",
    any: {
      "all": { optimal: [12, 18], acceptable: [10, 22], concerning: [0, 10] }
    }
  },
  
  morning_temp_trend: {
    unit: "°C",
    direction: "in_range",
    any: {
      "all": { optimal: [36.4, 36.8], acceptable: [36.0, 37.2], concerning: [35.0, 36.0] }
    }
  },
  
  sleep_wake_consistency_horm: {
    unit: "std dev (min)",
    direction: "lower_better",
    any: {
      "all": { optimal: [0, 30], acceptable: [30, 60], concerning: [60, 180] }
    }
  },
  
  am_resting_hr: {
    unit: "bpm",
    direction: "lower_better",
    any: {
      "18-39": { optimal: [45, 60], acceptable: [60, 75], concerning: [75, 100] },
      "40-59": { optimal: [50, 65], acceptable: [65, 80], concerning: [80, 100] },
      "60+":   { optimal: [50, 68], acceptable: [68, 82], concerning: [82, 100] }
    }
  },
  
  cortisol_optional: {
    unit: "varies",
    direction: "in_range",
    any: {
      "all": { optimal: null, acceptable: null, concerning: null }
    }
  },
  
  testosterone_optional: {
    unit: "ng/dL",
    direction: "higher_better",
    male: {
      "18-39": { optimal: [500, 900], acceptable: [350, 500], concerning: [0, 350] },
      "40-59": { optimal: [400, 800], acceptable: [300, 400], concerning: [0, 300] },
      "60+":   { optimal: [350, 700], acceptable: [250, 350], concerning: [0, 250] }
    },
    female: {
      "all": { optimal: [25, 70], acceptable: [15, 25], concerning: [0, 15] }
    }
  },
  
  cycle_tracking_optional: {
    unit: "cycle days",
    direction: "in_range",
    female: {
      "all": { optimal: [24, 35], acceptable: [21, 40], concerning: [0, 21] }
    }
  },
  
  // ============================================
  // STRUCTURAL & MUSCULOSKELETAL
  // ============================================
  
  grip_strength: {
    unit: "kg",
    direction: "higher_better",
    male: {
      "18-39": { optimal: [45, 70], acceptable: [35, 45], concerning: [0, 35] },
      "40-59": { optimal: [40, 65], acceptable: [30, 40], concerning: [0, 30] },
      "60+":   { optimal: [32, 55], acceptable: [25, 32], concerning: [0, 25] }
    },
    female: {
      "18-39": { optimal: [28, 45], acceptable: [22, 28], concerning: [0, 22] },
      "40-59": { optimal: [25, 40], acceptable: [20, 25], concerning: [0, 20] },
      "60+":   { optimal: [20, 35], acceptable: [15, 20], concerning: [0, 15] }
    }
  },
  
  sit_to_stand_30s: {
    unit: "reps",
    direction: "higher_better",
    male: {
      "18-39": { optimal: [18, 30], acceptable: [14, 18], concerning: [0, 14] },
      "40-59": { optimal: [15, 25], acceptable: [12, 15], concerning: [0, 12] },
      "60+":   { optimal: [12, 20], acceptable: [9, 12], concerning: [0, 9] }
    },
    female: {
      "18-39": { optimal: [16, 28], acceptable: [12, 16], concerning: [0, 12] },
      "40-59": { optimal: [13, 22], acceptable: [10, 13], concerning: [0, 10] },
      "60+":   { optimal: [10, 18], acceptable: [8, 10], concerning: [0, 8] }
    }
  },
  
  rom_screen: {
    unit: "pass/limit",
    direction: "categorical",
    any: {
      "all": { optimal: null, acceptable: null, concerning: null }
    }
  },
  
  deep_squat_assessment: {
    unit: "score",
    direction: "higher_better",
    any: {
      "all": { optimal: [3, 3], acceptable: [2, 3], concerning: [0, 2] }
    }
  },
  
  single_leg_stance_eyes_open: {
    unit: "seconds",
    direction: "higher_better",
    any: {
      "18-39": { optimal: [45, 60], acceptable: [30, 45], concerning: [0, 30] },
      "40-59": { optimal: [35, 60], acceptable: [20, 35], concerning: [0, 20] },
      "60+":   { optimal: [20, 45], acceptable: [10, 20], concerning: [0, 10] }
    }
  },
  
  single_leg_stance_eyes_closed: {
    unit: "seconds",
    direction: "higher_better",
    any: {
      "18-39": { optimal: [25, 45], acceptable: [15, 25], concerning: [0, 15] },
      "40-59": { optimal: [15, 35], acceptable: [8, 15], concerning: [0, 8] },
      "60+":   { optimal: [8, 25], acceptable: [4, 8], concerning: [0, 4] }
    }
  },
  
  injury_recurrence_log: {
    unit: "episodes/quarter",
    direction: "lower_better",
    any: {
      "all": { optimal: [0, 0], acceptable: [0, 1], concerning: [1, 10] }
    }
  },
  
  pain_interference_score: {
    unit: "score",
    direction: "lower_better",
    any: {
      "all": { optimal: [0, 2], acceptable: [2, 4], concerning: [4, 10] }
    }
  }
};


/**
 * Get age band for a given age
 */
export function getAgeBand(age) {
  if (!age || age < 18) return "18-39";
  if (age < 40) return "18-39";
  if (age < 60) return "40-59";
  return "60+";
}

/**
 * Get reference range for a metric given age and sex
 */
export function getReferenceRange(metricId, age, sex) {
  const ranges = REFERENCE_RANGES[metricId];
  if (!ranges) return null;
  
  const ageBand = getAgeBand(age);
  
  // Try sex-specific ranges first
  if (ranges[sex] && ranges[sex][ageBand]) {
    return ranges[sex][ageBand];
  }
  if (ranges[sex] && ranges[sex]["all"]) {
    return ranges[sex]["all"];
  }
  
  // Fall back to "any" sex ranges
  if (ranges.any && ranges.any[ageBand]) {
    return ranges.any[ageBand];
  }
  if (ranges.any && ranges.any["all"]) {
    return ranges.any["all"];
  }
  
  return null;
}

/**
 * Get reference status for a value
 * Returns: "optimal" | "acceptable" | "outside_range" | "concerning" | "no_reference" | "not_entered"
 */
export function getReferenceStatus(metricId, value, age, sex) {
  if (value === null || value === undefined || value === "") {
    return "not_entered";
  }
  
  const range = getReferenceRange(metricId, age, sex);
  if (!range) return "no_reference";
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return "no_reference";
  
  // Check optimal first
  if (range.optimal && numValue >= range.optimal[0] && numValue <= range.optimal[1]) {
    return "optimal";
  }
  
  // Check acceptable
  if (range.acceptable && numValue >= range.acceptable[0] && numValue <= range.acceptable[1]) {
    return "acceptable";
  }
  
  // Check concerning
  if (range.concerning && numValue >= range.concerning[0] && numValue <= range.concerning[1]) {
    return "concerning";
  }
  
  // Outside all defined ranges
  return "outside_range";
}

/**
 * Get the range text for display
 */
export function getRangeDisplayText(metricId, age, sex) {
  const range = getReferenceRange(metricId, age, sex);
  if (!range || !range.optimal) return null;
  
  return `${range.optimal[0]}–${range.optimal[1]}`;
}
