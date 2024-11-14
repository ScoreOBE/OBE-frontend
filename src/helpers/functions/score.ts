export const calStat = (scores: number[], totalStudent: number) => {
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);

  // calculate Mean
  const mean = scores.reduce((a, b) => a + b, 0) / totalStudent;
  const middle = (totalStudent + 1) / 2;

  // calculate Median
  let median = 0;
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
    mean: mean?.toFixed(2),
    sd: sd?.toFixed(2),
    median: median?.toFixed(2),
    maxScore,
    minScore,
    q1: q1?.toFixed(2),
    q3: q3?.toFixed(2),
  };
};
