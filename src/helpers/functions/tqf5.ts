import { IModelCLO, IModelTQF3Part4 } from "@/models/ModelTQF3";
import { partLabel } from "@/components/SaveTQFBar";
import { cloneDeep } from "lodash";
import { IModelSection } from "@/models/ModelCourse";

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
      return initialTqf5Part3(tqf3.part2.clo, sections!);
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
  part2: IModelCLO[] | undefined,
  sections: IModelSection[]
) => {
  return {
    data: !part2
      ? []
      : cloneDeep(
          part2?.map((item) => ({
            clo: item.id,
            sections: sections.map(({ sectionNo }) => ({
              sectionNo,
              score0: 0,
              score1: 0,
              score2: 0,
              score3: 0,
              score4: 0,
            })),
          }))
        ),
  };
};
