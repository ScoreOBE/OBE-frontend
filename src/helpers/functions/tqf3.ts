import { IModelCourse } from "@/models/ModelCourse";
import { IModelTQF3Part1, IModelTQF3Part2 } from "@/models/ModelTQF3";
import { IModelUser } from "@/models/ModelUser";
import { getUserName } from "./function";
import { partLabel } from "@/components/SaveTQFBar";
import { cloneDeep } from "lodash";

export const initialTqf3Part = (tqf3: any, part: any) => {
  switch (part) {
    case Object.keys(partLabel)[0]: // part 1
      return initialTqf3Part1(tqf3);
    case Object.keys(partLabel)[1]: // part 2
      return;
    case Object.keys(partLabel)[2]: // part 3
      return;
    case Object.keys(partLabel)[3]: // part 4
      return initialTqf3Part4(tqf3.part2);
    case Object.keys(partLabel)[4]: // part 5
      return initialTqf3Part5();
    case Object.keys(partLabel)[5]: // part 6
      return;
    case Object.keys(partLabel)[6]: // part 7
      return initialTqf3Part7(tqf3.part2);
  }
};

export const initialTqf3Part1 = (
  tqf3: IModelCourse
): Partial<IModelTQF3Part1> => {
  const uniqueInstructors = Array.from(
    new Set(
      (
        tqf3.sections?.flatMap((sec) => [
          sec.instructor,
          ...(sec.coInstructors as IModelUser[]),
        ]) as IModelUser[]
      )?.map((instructor) => getUserName(instructor, 3)!)
    )
  );
  const data = {
    consultHoursWk: 1,
    courseType: tqf3.type,
    mainInstructor: getUserName(tqf3.sections[0].instructor as IModelUser, 3),
    instructors: uniqueInstructors,
    teachingLocation: {},
  };
  return { ...data };
};
export const initialTqf3Part4 = (part2: IModelTQF3Part2 | undefined) => {
  return {
    data: !part2
      ? []
      : cloneDeep(
          part2.clo?.map((clo) => ({
            clo: clo.id,
            percent: 0,
            evals: [],
          }))
        ),
  };
};
export const initialTqf3Part5 = () => {
  return { mainRef: "", recDoc: "" };
};
export const initialTqf3Part7 = (part2: IModelTQF3Part2 | undefined) => {
  return {
    data: !part2
      ? []
      : cloneDeep(part2.clo.map(({ id }) => ({ clo: id, plos: [] }))),
  };
};
