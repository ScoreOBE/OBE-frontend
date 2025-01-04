import { IModelTQF3Part4 } from "@/models/ModelTQF3";
import { partLabel } from "@/components/SaveTQFBar";
import { cloneDeep } from "lodash";
import { IModelSection } from "@/models/ModelCourse";
import { IModelTQF5, IModelTQF5Part3 } from "@/models/ModelTQF5";

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
      sections
        .filter((sec) => sec.isActive)
        .forEach(({ sectionNo, assignments, students }) => {
          const scoreRange = {
            score0: 0,
            score1: 0,
            score2: 0,
            score3: 0,
            score4: 0,
          };
          const assess = item.assignments.map((e) => {
            const fullScore = assignments
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
              .reduce((a, b) => a + b.fullScore, 0);
            return {
              eval: e.eval,
              sheet: e.questions.flatMap((s) =>
                s.substring(0, s.lastIndexOf("-"))
              ),
              fullScore,
              range: fullScore / 5.0,
              percent: cloEval.evals.find((c) => c.eval == e.eval)?.percent,
              score0: 0,
              score1: 0,
              score2: 0,
              score3: 0,
              score4: 0,
            };
          });
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
            const cloScores: number[] = [];
            assess.forEach((e) => {
              const score = assigns
                .filter((as) => e.sheet.includes(as.sheet))
                .reduce((a, b) => a + b.score, 0);
              if (0 <= score && score < e.range) {
                e.score0++;
                cloScores.push(0);
              } else if (e.range <= score && score < e.range * 2) {
                e.score1++;
                cloScores.push(1);
              } else if (e.range * 2 <= score && score < e.range * 3) {
                e.score2++;
                cloScores.push(2);
              } else if (e.range * 3 <= score && score < e.range * 4) {
                e.score3++;
                cloScores.push(3);
              } else {
                e.score4++;
                cloScores.push(4);
              }
            });
            const avgCloScore =
              cloScores.reduce((a: number, b: number) => a + b, 0) /
              cloScores.length;
            if (0 <= avgCloScore && avgCloScore < 1) scoreRange.score0++;
            else if (1 <= avgCloScore && avgCloScore < 2) scoreRange.score1++;
            else if (2 <= avgCloScore && avgCloScore < 3) scoreRange.score2++;
            else if (3 <= avgCloScore && avgCloScore < 4) scoreRange.score3++;
            else scoreRange.score4++;
          });
          sectionsData.push({
            sectionNo,
            assess,
            ...scoreRange,
          });
        });
      data.push({
        clo: cloEval.clo,
        sections: sectionsData,
      });
    });
    return { data };
  } else {
    return { data: [] };
  }
};
