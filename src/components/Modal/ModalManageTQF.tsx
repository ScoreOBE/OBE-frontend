import {
  Button,
  Input,
  Modal,
  Select,
  TextInput,
  Switch,
  List,
} from "@mantine/core";
import AddCoIcon from "@/assets/icons/addCo.svg?react";
import {
  IconChevronRight,
  IconChevronDown,
  IconUsers,
  IconUserCircle,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import Icon from "../Icon";
import notCompleteIcon from "@/assets/icons/notComplete.svg?react";
import { IModelUser } from "@/models/ModelUser";
import { getCourse } from "@/services/course/course.service";
import { useAppSelector } from "@/store";
import { COURSE_TYPE, ROLE, TQF_STATUS } from "@/helpers/constants/enum";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { IModelCourse } from "@/models/ModelCourse";
import { useSearchParams } from "react-router-dom";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import { RxEnterFullScreen } from "react-icons/rx";

type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalManageTQF({ opened, onClose }: Props) {
  const user = useAppSelector((state) => state.user);
  const [searchValue, setSearchValue] = useState("");
  const [adminList, setAdminList] = useState<IModelUser[]>([]);
  const [notCompleteTQF3List, setnotCompleteTQF3List] = useState<any[]>([]);
  const [payload, setPayload] = useState<any>();
  const [params, setParams] = useSearchParams({});
  const [term, setTerm] = useState<IModelAcademicYear>();
  const academicYear = useAppSelector((state) => state.academicYear);

  const loading = useAppSelector((state) => state.loading);

  useEffect(() => {
    const year = parseInt(params.get("year")!);
    const semester = parseInt(params.get("semester")!);
    if (year != term?.year && semester != term?.semester) {
      const acaYear = academicYear.find(
        (e) => e.semester == semester && e.year == year
      );
      if (acaYear) {
        setTerm(acaYear);
        setPayload({
          ...new CourseRequestDTO(),
          academicYear: acaYear.id,
          // hasMore: true,
        });
      }
    }
  }, [academicYear, params]);

  const fetchCourse = async () => {
    if (payload.academicYear) {
      payload.manage = true;
      const res = await getCourse({ ...payload });

      if (res.length) {
        const courseList: any[] = [];
        res.forEach((course: IModelCourse) => {
          if (!course.TQF3 || course.TQF3?.status !== TQF_STATUS.DONE) {
            if (course.type === COURSE_TYPE.SEL_TOPIC) {
              course.sections.forEach((section) => {
                courseList.push({
                  ...course,
                  ...section,
                  instructor: `${
                    section.instructor?.firstNameEN
                  } ${section.instructor?.lastNameEN.slice(0, 1)}.`,
                });
              });
            } else {
              let temp = Array.from(
                new Set(
                  course.sections.map(
                    (section) =>
                      `${
                        section.instructor?.firstNameEN
                      } ${section.instructor?.lastNameEN.slice(0, 1)}.`
                  )
                )
              ).toString();

              courseList.push({ ...course, instructor: temp });
            }
          }
        });
        setnotCompleteTQF3List(courseList);
      }
    }
  };

  useEffect(() => {
    if (opened) {
      setSearchValue("");
      fetchCourse();
      console.log(notCompleteTQF3List);
    }
  }, [opened]);

  // useEffect(() => {
  //   setAdminFilter(
  //     adminList.filter(
  //       (admin) =>
  //         `${admin.firstNameEN.toLowerCase()} ${admin.lastNameEN.toLowerCase()}`.includes(
  //           searchValue.toLowerCase()
  //         ) || admin.email.toLowerCase().includes(searchValue.toLowerCase())
  //     )
  //   );
  // }, [searchValue]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={false}
      title="Management TQF"
      size="45vw"
      radius={"12px"}
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        content:
          "flex flex-col justify-start bg-[#F6F7FA] text-[14px] item-center px-2 pb-2 overflow-hidden max-h-fit ",
      }}
    >
      <div className="flex flex-col h-full    flex-1 ">
        <div className="flex flex-row w-full mb-4 items-end h-fit ">
          <div
            className="flex flex-col gap-3  p-3 px-3 w-full   bg-white border-[1px]  rounded-md"
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="flex flex-col bg-[#F3F3F3] w-full rounded-xl overflow-clip">
              <div className="flex flex-row justify-between items-center px-5 py-3 w-full">
                <p className="font-semibold text-[14px] text-tertiary">
                  TQF 3 Edit
                </p>
                <Switch color="#5C55E5" size="lg" onLabel="ON" offLabel="OFF" />
              </div>
              <div className="flex flex-row justify-between items-center border-t-2 border-[#DADADA] px-5 py-3 w-full">
                <p className="font-semibold text-[14px] text-tertiary">
                  TQF 5 Edit
                </p>
                <Switch color="#5C55E5" size="lg" onLabel="ON" offLabel="OFF" />
              </div>
            </div>
            <div className="ml-4">
              <p className="font-semibold text-[13px] text-tertiary">
                Turn on TQF 5 edit
              </p>
              <List
                listStyleType="disc"
                className="ml-2 text-[12px] text-[#575757] "
              >
                <List.Item>
                  All CPE department course instructors will be able to edit TQF
                  5,
                </List.Item>
                <List.Item>
                  <span className="text-secondary">
                    TQF 3 edit will be automatically turn off.
                  </span>{" "}
                  As a result, instructors will not be able to edit TQF 3.
                </List.Item>
                <List.Item className="text-secondary">
                  Does not affect courses with no data or incomplete in TQF 3.
                  Instructors will still be able to edit TQF 3.
                </List.Item>
              </List>
            </div>
          </div>
        </div>

        {/* List of Courses that are Incomplete TQF 3 */}
        <div
          className="w-full  flex flex-col bg-white border-secondary border-[1px]  rounded-md"
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="bg-[#e6e9ff] flex items-center justify-between rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold">
            <div className="flex items-center gap-2">
              {/* <Icon className="ml-1" IconComponent={notCompleteIcon} /> */}
              <Icon IconComponent={notCompleteIcon} className="h-5 w-5" />
              <span>List of Courses that are Incomplete TQF 3</span>
            </div>
            <p>
              {`${notCompleteTQF3List.length}   Course`}
              {`${notCompleteTQF3List.length > 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Show List Of Manage TQF */}
          <div className="flex flex-col gap-2 w-full h-[350px]   p-4  overflow-y-hidden">
            <TextInput
              leftSection={<TbSearch />}
              placeholder="Course No, Course name "
              size="xs"
              value={searchValue}
              onChange={(event: any) =>
                setSearchValue(event.currentTarget.value)
              }
              rightSectionPointerEvents="all"
            />
            {/* List of Admin */}
            <div className="flex flex-col gap-2 overflow-y-scroll p-1">
              {notCompleteTQF3List.map((e, index) => (
                <div
                  key={index}
                  style={{
                    boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                  }}
                  className="w-full items-center justify-between mt-2 py-3 px-4 rounded-md flex"
                >
                  <div className="gap-3 flex items-center">
                    <div className="flex flex-col">
                      <p className="font-semibold text-[14px] text-secondary">
                        {e.courseNo}
                        {e.type === COURSE_TYPE.SEL_TOPIC &&
                          ` (Sec. ${("000" + e.sectionNo).slice(-3)})`}
                      </p>
                      <p className="text-[12px] font-normal text-[#4E5150]">
                        {e.type === COURSE_TYPE.GENERAL
                          ? e.courseName
                          : e.topic}
                      </p>
                    </div>
                  </div>

                  <p className="mr-1 text-[#4E5150] text-[12px] font-normal">
                    {e.instructor}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
