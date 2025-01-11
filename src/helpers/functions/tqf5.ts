import { IModelTQF3Part4 } from "@/models/ModelTQF3";
import { partLabel } from "@/components/SaveTQFBar";
import { cloneDeep } from "lodash";
import { IModelSection } from "@/models/ModelCourse";
import { IModelTQF5, IModelTQF5Part3 } from "@/models/ModelTQF5";
import { METHOD_TQF5 } from "../constants/enum";

export const initialTqf5Part = (
  tqf5: any,
  part: any,
  tqf3?: any,
  sections?: IModelSection[]
) => {
  switch (part) {
    case Object.keys(partLabel)[0]: // part 1
      return;
    case Object.keys(partLabel)[1]: // part 2
      return initialTqf5Part2(tqf3.part4.data);
    case Object.keys(partLabel)[2]: // part 3
      return initialTqf5Part3(tqf5, tqf3.part4.data, sections!);
  }
};

export const initialTqf5Part2 = (part4: IModelTQF3Part4[] | undefined) => {
  return {
    data: !part4
      ? []
      : cloneDeep(
          part4?.map((item) => ({
            clo: item.clo,
            assignments: item.evals.map((e) => ({
              eval: e.eval,
              questions: [],
            })),
          }))
        ),
  };
};

export const initialTqf5Part3 = (
  tqf5: IModelTQF5,
  part4: IModelTQF3Part4[] | undefined,
  sections: IModelSection[]
) => {
  if (tqf5.part2?.updatedAt) {
    const data: IModelTQF5Part3[] = [];
    tqf5.part2.data.forEach((item) => {
      const sectionsData: any[] = [];
      const cloEval = part4?.find(({ clo }) => clo == item.clo)!;
      let assess: any[] = [];
      if (tqf5.method == METHOD_TQF5.SCORE_OBE) {
        const uniqueAssignments = [
          ...new Map(
            sections
              .flatMap(({ assignments }) => assignments)
              .map((assignment) => [assignment.name, assignment])
          ).values(),
        ];
        assess = item.assignments.map((e) => {
          const fullScore =
            uniqueAssignments
              .filter(({ name }) =>
                e.questions
                  .flatMap((s) => s.substring(0, s.lastIndexOf("-")))
                  .includes(name)
              )
              .flatMap((ques) =>
                ques.questions.map((question) => ({
                  sheet: ques.name,
                  ...question,
                }))
              )
              .filter((ques) =>
                e.questions.includes(`${ques.sheet}-${ques.name}`)
              )
              .reduce((a, b) => a + b.fullScore, 0) || 0;
          return {
            eval: e.eval,
            sheet: e.questions.flatMap((s) =>
              s.substring(0, s.lastIndexOf("-"))
            ),
            fullScore,
            range0: fullScore / 5.0,
            range1: (fullScore / 5.0) * 2,
            range2: (fullScore / 5.0) * 3,
            range3: (fullScore / 5.0) * 4,
            percent: cloEval.evals.find((c) => c.eval == e.eval)?.percent,
            score0: 0,
            score1: 0,
            score2: 0,
            score3: 0,
            score4: 0,
          };
        });
      }
      sections
        .filter((sec) => sec.isActive)
        .forEach(({ sectionNo, students }) => {
          const scoreRange = {
            score0: 0,
            score1: 0,
            score2: 0,
            score3: 0,
            score4: 0,
          };
          if (tqf5.method == METHOD_TQF5.SCORE_OBE) {
            students.forEach(({ scores }) => {
              const assigns = scores
                .filter(({ assignmentName }) =>
                  item.assignments.map((e) =>
                    e.questions
                      .flatMap((s) => s.substring(0, s.lastIndexOf("-")))
                      .includes(assignmentName)
                  )
                )
                .flatMap((e) =>
                  e.questions.map((question) => ({
                    sheet: e.assignmentName,
                    ...question,
                  }))
                )
                .filter((e) =>
                  item.assignments
                    .flatMap((s) => s.questions)
                    .includes(`${e.sheet}-${e.name}`)
                );
              const cloScores: { score: number; percent: number }[] = [];
              assess.forEach((e) => {
                const score = assigns
                  .filter((as) => e.sheet.includes(as.sheet))
                  .reduce((a, b) => a + b.score, 0);
                if (0 <= score && score < e.range0) {
                  e.score0++;
                  cloScores.push({ score: 0, percent: e.percent! });
                } else if (e.range0 <= score && score < e.range1) {
                  e.score1++;
                  cloScores.push({ score: 1, percent: e.percent! });
                } else if (e.range1 <= score && score < e.range2) {
                  e.score2++;
                  cloScores.push({ score: 2, percent: e.percent! });
                } else if (e.range2 <= score && score < e.range3) {
                  e.score3++;
                  cloScores.push({ score: 3, percent: e.percent! });
                } else {
                  e.score4++;
                  cloScores.push({ score: 4, percent: e.percent! });
                }
              });
              const avgCloScore =
                cloScores.reduce((a: number, b) => a + b.score * b.percent, 0) /
                cloScores.reduce((a: number, b) => a + b.percent, 0);
              if (0 <= avgCloScore && avgCloScore < 1) scoreRange.score0++;
              else if (1 <= avgCloScore && avgCloScore < 2) scoreRange.score1++;
              else if (2 <= avgCloScore && avgCloScore < 3) scoreRange.score2++;
              else if (3 <= avgCloScore && avgCloScore < 4) scoreRange.score3++;
              else scoreRange.score4++;
            });
            sectionsData.push({
              sectionNo,
              ...scoreRange,
            });
          } else {
            sectionsData.push({
              sectionNo,
              ...scoreRange,
            });
          }
        });
      const scoreTotal = ["score0", "score1", "score2", "score3", "score4"].map(
        (key) =>
          sectionsData.reduce(
            (sum, sec) => sum + ((sec as any)[key] || 0),
            0
          ) ?? 0
      );
      const score =
        scoreTotal.reduce((a, b, curIndex) => a + b * curIndex, 0) /
        scoreTotal.reduce((a, b) => a + b, 0);
      data.push({
        clo: cloEval.clo,
        assess,
        sections: sectionsData,
        score: Math.round(score * 100) / 100,
      });
    });
    return { data };
  } else {
    return { data: [] };
  }
};
