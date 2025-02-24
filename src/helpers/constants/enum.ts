export const SEMESTER = [1, 2, 3];

export enum NOTI_TYPE {
  SUCCESS = "Success",
  ERROR = "Error",
}

export enum ROLE {
  STUDENT = "Student",
  TA = "TA",
  INSTRUCTOR = "Instructor",
  CURRICULUM_ADMIN = "Curr. Admin",
  ADMIN = "Admin",
}
export enum TITLE_ROLE {
  CURR_ADMIN = "Curriculum Admin",
  CO_INS = "Co-Instructor (Optional)",
  OWNER_SEC = "Owner section",
}

export const COURSE_TYPE = {
  GENERAL: { en: "General Education", th: "วิชาศึกษาทั่วไป" },
  SPECIAL: { en: "Field of Specialization", th: "วิชาเฉพาะ" },
  SEL_TOPIC: { en: "Selected Topics", th: "กลุ่มวิชาเลือก" },
  FREE: { en: "Free Elective", th: "วิชาเลือกเสรี" },
};
export const TEACHING_METHOD = {
  LEC: { en: "Lecture", th: "บรรยาย" },
  LAB: { en: "Laboratory", th: "ปฏิบัติการ" },
  PRAC: { en: "Practice", th: "ฝึกปฏิบัติ" },
  COOP: { en: "Co-operative", th: "สหกิจศึกษา" },
};

export enum EVALUATE_TYPE {
  A_F = "A-F",
  S_U = "S/U",
  P = "P",
}

export enum TQF_STATUS {
  NO_DATA = "No Data",
  IN_PROGRESS = "In Progress",
  DONE = "Done",
}

export enum METHOD_TQF5 {
  SCORE_OBE = "ScoreOBE+",
  MANUAL = "Manual",
}

export const CLO_EVAL = {
  "0": "Very Poor",
  "1": "Poor",
  "2": "Average",
  "3": "Good",
  "4": "Excellent",
};
