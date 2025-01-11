import { IModelTQF5 } from "@/models/ModelTQF5";

export enum PartTopicTQF5 {
  part1 = "Part 1 - การประเมินกระบวนวิชา\nCourse Evaluation",
  part2 = "Part 2 - การเลือกหัวข้อประเมินตามวัตถุประสงค์ของกระบวนวิชา\nAssessment tool mapping to CLO",
  part3 = "Part 3 - เกณฑ์การประเมินตามวัตถุประสงค์เฉพาะของกระบวนวิชา\nRubrics for CLO evaluation",
}

export type ValidPartTopics = keyof Pick<
  IModelTQF5,
  "part1" | "part2" | "part3" 
>;

export const getKeyPartTopicTQF5 = (
  value: string
): ValidPartTopics | undefined => {
  return (Object.keys(PartTopicTQF5) as Array<ValidPartTopics>).find(
    (key) => PartTopicTQF5[key] === value
  );
};
