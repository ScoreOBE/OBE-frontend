export const calStat = (scores: number[], totalStudent: number) => {
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);

  // calculate Mean
  const mean = scores.reduce((a, b) => a + b, 0) / totalStudent;

  // calculate Median
  let median = 0;
  const middle = (totalStudent + 1) / 2;
  if (totalStudent % 2 === 0) {
    const lwMid = scores[Math.floor(middle) - 1];
    const upMid = scores[Math.ceil(middle) - 1];
    median = (lwMid + upMid) / 2;
  } else {
    median = scores[middle - 1];
  }

  // calculate SD
  let sd = 0;
  let x = 0;
  scores.map((e) => (x += Math.pow(e - mean, 2)));
  sd = Math.sqrt(x / totalStudent);
  const Q1 = (totalStudent + 1) / 4 - 1;
  const Q3 = (3 * (totalStudent + 1)) / 4 - 1;
  const baseQ1 = Math.floor(Q1);
  const baseQ3 = Math.floor(Q3);

  // calculate Upper Quartile Q3
  let temp = Number(scores[baseQ3]?.toFixed(2));
  if (baseQ3 + 1 < scores.length) {
    temp = temp + (Q3 - baseQ3) * (scores[baseQ3 + 1] - scores[baseQ3]);
  }
  const q3 = temp;

  // calculate Lower Quartile Q1
  const q1 =
    scores[baseQ1] + (Q1 - baseQ1) * (scores[baseQ1 + 1] - scores[baseQ1]);

  return {
    mean: mean,
    sd: sd,
    median: median,
    maxScore,
    minScore,
    q1: q1,
    q3: q3,
  };
};

export const scrollToStudent = (
  studentRefs: React.MutableRefObject<Map<any, any>>,
  studentIds: string[]
) => {
  studentRefs.current.forEach((row) => {
    row.classList.remove("highlight-row");
  });
  studentIds.forEach((studentId, index) => {
    const studentRow = studentRefs.current.get(studentId);
    if (studentRow) {
      studentRow.classList.add("highlight-row");
      if (index == 0) {
        studentRow.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      setTimeout(() => {
        studentRow.classList.remove("highlight-row");
      }, 5000);
    }
  });
};

const recroot2pi = 1.0 / Math.sqrt(2.0 * Math.PI);
const gaussian = (x1: number, spread: number, x2: number): number => {
  const invSpread = 1.0 / spread;
  const offset = (x1 - x2) * invSpread;
  return recroot2pi * invSpread * Math.exp(-0.5 * offset * offset);
};
const apriori = (x: number, min: number, max: number) => {
  const p = (x - min) / (max - min);
  return p * (1.0 - p);
};

export const generateBellCurveData = (
  scores: number[],
  mean: number,
  sd: number,
  fullScore: number
): { x: number; y: number }[] => {
  const bins = fullScore <= 5 ? 100 : 200;
  const spread = 5;
  const bellCurveData: { x: number; y: number }[] = [];
  const precomputedApriori = Array.from({ length: bins }, (_, j) => {
    const frac = j / (bins - 1);
    return apriori(frac * fullScore, 0, fullScore);
  });
  let y = new Array(bins).fill(0);
  let bin = (mean / fullScore) * bins + 0.5;
  if (bin >= bins) bin = bins - 1;

  scores.forEach((x) => {
    const y1 = new Array(bins).fill(0);
    let weight = 0.0;
    for (let j = 0; j < bins; j++) {
      const x1 = (j / (bins - 1)) * fullScore;
      y1[j] = gaussian(x, spread, x1) * precomputedApriori[j];
      weight += y1[j];
    }
    const iweight = bins / fullScore / weight;
    for (let j = 0; j < bins; j++) {
      y[j] += y1[j] * iweight;
    }
  });
  for (let j = 0; j < bins; j++) {
    const x = (j / (bins - 1)) * fullScore;
    bellCurveData.push({ x, y: y[j] });
  }

  // for (let i = 0; i < numPoints; i++) {
  //   const x = i * step;
  //   const y =
  //     (1 / (sd * Math.sqrt(2 * Math.PI))) *
  //     Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(sd, 2)));
  //   bellCurveData.push({ x, y });
  // }

  return bellCurveData;
};
