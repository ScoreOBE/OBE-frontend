import { IModelCourse, IModelSection } from "@/models/ModelCourse";
import { IModelTQF3 } from "@/models/ModelTQF3";
import { IModelTQF5 } from "@/models/ModelTQF5";
import { IModelUser } from "@/models/ModelUser";
import { isEmpty } from "lodash";
import moment from "moment";
import { ROLE } from "../constants/enum";
import { ROUTE_PATH } from "../constants/route";
import { IModelPLORequire } from "@/models/ModelCourseManagement";

export const goToDashboard = (role: ROLE) => {
  switch (role) {
    case ROLE.STUDENT:
      window.location.replace(ROUTE_PATH.STD_DASHBOARD);
      return;
    case ROLE.SUPREME_ADMIN:
    case ROLE.ADMIN:
      window.location.replace(
        `${ROUTE_PATH.ADMIN_DASHBOARD}/${ROUTE_PATH.TQF}`
      );
      return;
    default:
      window.location.replace(ROUTE_PATH.INS_DASHBOARD);
      return;
  }
};

export const getSectionNo = (sectionNo: number | string | undefined) => {
  if (!sectionNo) return "";
  return ("000" + parseInt(sectionNo.toString())).slice(-3);
};
export const getUserName = (
  user: Partial<IModelUser> | undefined,
  format?: number
) => {
  if (!user) return;
  else if (
    (isEmpty(user.firstNameEN) || isEmpty(user.lastNameEN)) &&
    format !== 3
  )
    return user.email;
  switch (format) {
    case 1:
      return `${user.firstNameEN} ${user.lastNameEN}`; // John Doe
    case 2:
      return `${user.firstNameEN?.toLowerCase()} ${user.lastNameEN?.toLowerCase()}`; // john doe
    case 3:
      if (user.firstNameTH) {
        return `${user.firstNameTH} ${user.lastNameTH}`; // กข คง
      } else {
        return `${user.firstNameEN} ${user.lastNameEN}`; // ab cd
      }
    default:
      return `${user.firstNameEN} ${user.lastNameEN?.slice(0, 1)}.`; // John D.
  }
};

export const getUniqueInstructors = (
  sections: Partial<IModelSection>[],
  includesCoIns: boolean = false,
  formatName?: number
) => {
  return Array.from(
    new Set(
      sections
        .flatMap((sec) => {
          const instructors = [sec.instructor];
          if (includesCoIns && sec.coInstructors) {
            instructors.push(...(sec.coInstructors as IModelUser[]));
          }
          return instructors.filter(Boolean);
        })
        .map((instructor) => getUserName(instructor as IModelUser, formatName)!)
    )
  );
};

export const getUniqueTopicsWithTQF = (sections: Partial<IModelSection>[]) => {
  const uniqueTopics = new Map<
    string,
    {
      topic: string;
      TQF3?: IModelTQF3;
      TQF5?: IModelTQF5;
      ploRequire: IModelPLORequire[];
    }
  >();
  sections.forEach((sec) => {
    if (sec.topic && (sec.TQF3 || sec.TQF5)) {
      if (!uniqueTopics.has(sec.topic)) {
        uniqueTopics.set(sec.topic, {
          topic: sec.topic,
          TQF3: sec.TQF3,
          TQF5: sec.TQF5,
          ploRequire: sec.ploRequire || [],
        });
      }
    }
  });

  // Convert map values to an array
  return Array.from(uniqueTopics.values());
};

export const dateFormatter = (
  date: string | Date | undefined,
  format?: number
) => {
  if (!date) return;
  switch (format) {
    case 1:
      return moment(date).format("DD/MM/YYYY"); // 25/09/2024
    case 2:
      return moment(date).format("MMMM DD, YYYY HH:mm"); // September 25, 2024 14:17
    case 3:
      return moment(date).format("DD MMM YYYY"); // 8 Dec 2023
    default:
      return moment(date).format("MMM DD, YYYY HH:mm"); // Sep 25, 2024 14:42
  }
};

export const getKeyByValue = (object: any, value: any) => {
  return Object.keys(object).find(
    (key) => object[key] == value
  ) as keyof object;
};

export const getValueEnumByKey = (Enum: any, key: string): string => {
  return Enum[key as keyof typeof Enum] ?? "";
};

export const getKeyEnumByValue = (Enum: any, value: string): string => {
  return Object.keys(Enum)[Object.values(Enum).indexOf(value)] ?? "";
};

export const sortData = (
  data: any[] | undefined,
  key: string,
  typeKey: string = "number",
  typeSort: string = "asc"
) => {
  const isAscending = ["asc", "ASC"].includes(typeSort);
  data?.sort((a, b) => {
    const aValue =
      a[key] ?? (typeKey === "number" ? 0 : typeKey === "boolean" ? false : "");
    const bValue =
      b[key] ?? (typeKey === "number" ? 0 : typeKey === "boolean" ? false : "");
    if (typeKey === "number") {
      return isAscending ? aValue - bValue : bValue - aValue;
    } else if (typeKey === "string") {
      return isAscending
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeKey === "boolean") {
      return isAscending
        ? Number(bValue) - Number(aValue)
        : Number(aValue) - Number(bValue);
    } else return 0;
  });
};

export const findMostDuplicateCurriculum = (
  course: IModelCourse | undefined
): string | undefined => {
  const sections = course?.sections.map(({ curriculum }) => curriculum);
  return sections?.sort(
    (a, b) =>
      sections.filter((item) => item === b).length -
      sections.filter((item) => item === a).length
  )[0];
};
