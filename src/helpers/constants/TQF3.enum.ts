import { IModelTQF3 } from "@/models/ModelTQF3";

export enum PartTopicTQF3 {
  part1 = "Part 1 - ข้อมูลกระบวนวิชา\nCourse Information",
  part2 = "Part 2 - คำอธิบายลักษณะกระบวนวิชาและแผนการสอน\nDescription and Planning",
  part3 = "Part 3 - การประเมินผลคะแนนกระบวนวิชา\nCourse Evaluation",
  part4 = "Part 4 - การเชื่อมโยงหัวข้อประเมิน\nAssessment Mapping",
  part5 = "Part 5 - ทรัพยากรประกอบการเรียนการสอน\nCourse Materials",
  part6 = "Part 6 - การประเมินกระบวนวิชาและกระบวนการปรับปรุง\nCourse Review and Improvement Processes",
  part7 = "Part 7 - การเชื่อมโยงหัวข้อประเมินวัตถุประสงค์การเรียนรู้\nCurriculum Mapping",
}

export type ValidPartTopics = keyof Pick<
  IModelTQF3,
  "part1" | "part2" | "part3" | "part4" | "part5" | "part6"
>;

export const getKeyPartTopicTQF3 = (
  value: string
): ValidPartTopics | undefined => {
  return (Object.keys(PartTopicTQF3) as Array<ValidPartTopics>).find(
    (key) => PartTopicTQF3[key] === value
  );
};
