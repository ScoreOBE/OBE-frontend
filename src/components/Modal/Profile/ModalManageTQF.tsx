import {
  Button,
  Input,
  Modal,
  Select,
  TextInput,
  Switch,
  List,
} from "@mantine/core";
import checkedTQF3Completed from "@/assets/icons/checkedTQF3Completed.svg?react";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import Icon from "@/components/Icon";
import notCompleteIcon from "@/assets/icons/notComplete.svg?react";
import { IModelUser } from "@/models/ModelUser";
import { getCourse } from "@/services/course/course.service";
import { useAppSelector } from "@/store";
import { COURSE_TYPE, TQF_STATUS } from "@/helpers/constants/enum";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { IModelCourse } from "@/models/ModelCourse";
import { useSearchParams } from "react-router-dom";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import { getSectionNo, getUserName } from "@/helpers/functions/function";

type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalManageTQF({ opened, onClose }: Props) {
  const academicYear = useAppSelector((state) => state.academicYear);
  const [searchValue, setSearchValue] = useState("");
  const [payload, setPayload] = useState<any>({});
  const [term, setTerm] = useState<IModelAcademicYear>();
  const [checkedTQF3, setCheckedTQF3] = useState(true);
  const [checkedTQF5, setCheckedTQF5] = useState(false);
  const [notCompleteTQF3List, setnotCompleteTQF3List] = useState<any[]>([]);

  useEffect(() => {
    if (academicYear.length && opened) {
      setSearchValue("");
      fetchCourse();
    }
  }, [academicYear, opened]);

  const fetchCourse = async () => {
    const activeTerm = academicYear.find((e) => e.isActive);
    if (activeTerm) {
      const initialPayload = new CourseRequestDTO();
      initialPayload.academicYear = activeTerm.id;
      initialPayload.manage = true;
      setTerm(activeTerm);
      setPayload(initialPayload);
      const res = await getCourse(initialPayload);
      if (res) {
        const courseList: any[] = [];
        res.forEach((course: IModelCourse) => {
          if (!course.TQF3 || course.TQF3?.status !== TQF_STATUS.DONE) {
            if (course.type === COURSE_TYPE.SEL_TOPIC) {
              course.sections.forEach((section) => {
                courseList.push({
                  ...course,
                  ...section,
                  instructor: getUserName(section.instructor as IModelUser),
                });
              });
            } else {
              let temp = Array.from(
                new Set(
                  course.sections.map((section) =>
                    getUserName(section.instructor as IModelUser)
                  )
                )
              ).toString();

              courseList.push({ ...course, instructor: temp });
            }
          }
        });
        setnotCompleteTQF3List([...courseList]);
      }
    }
  };

  const onClickeToggleProcessTQF3 = (checked: any, index?: number) => {
    const updatedList = notCompleteTQF3List.map((item, idx) => {
      if (index === undefined || index === idx) {
        return {
          ...item,
          isProcessTQF3: checked,
          sections:
            item.type === COURSE_TYPE.SEL_TOPIC
              ? item.sections.map((section: any) => ({
                  ...section,
                  isProcessTQF3: checked,
                }))
              : item.sections,
        };
      }
      return item;
    });

    setnotCompleteTQF3List(updatedList);
  };

  const clickToggleTQF3 = (checked: any) => {
    setCheckedTQF3(checked);
    setCheckedTQF5(!checked);

    if (checked) {
      onClickeToggleProcessTQF3(true);
    } else {
      onClickeToggleProcessTQF3(false);
    }
  };

  const clickToggleTQF5 = (checked: any) => {
    setCheckedTQF5(checked);
    setCheckedTQF3(!checked);

  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
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
      <div className="flex flex-col h-full gap-4   flex-1 ">
        <div className="flex flex-row w-full mt-[2px] items-end h-fit ">
          <div
            className="flex flex-col gap-2  p-3 px-3 w-full   bg-white border-[1px]  rounded-md"
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="flex flex-col bg-[#F3F3F3] w-full rounded-md overflow-clip">
              <div className="flex flex-row justify-between items-center px-5 py-3 w-full">
                <p className="font-semibold text-[14px] text-tertiary">
                  TQF 3 Edit
                </p>
                <Switch
                  color="#5768d5"
                  size="lg"
                  onLabel="ON"
                  offLabel="OFF"
                  checked={checkedTQF3}
                  onChange={(event) =>
                    clickToggleTQF3(event.currentTarget.checked)
                  }
                />
              </div>
              <div className="flex flex-row justify-between items-center border-t-[1px] border-[#DADADA] px-5 py-3 w-full">
                <p className="font-semibold text-[14px] text-tertiary">
                  TQF 5 Edit
                </p>
                <Switch
                  color="#5768d5"
                  size="lg"
                  onLabel="ON"
                  offLabel="OFF"
                  checked={checkedTQF5}
                  onChange={(event) =>
                    clickToggleTQF5(event.currentTarget.checked)
                  }
                />
              </div>
            </div>
            {checkedTQF3 ? (
              <div className="w-full px-3 font-medium">
                <p className="font-semibold text-[13px] text-tertiary">
                  When turn on TQF 5 edit
                </p>
                <List
                  listStyleType="disc"
                  className="ml-2 flex flex-1 flex-col text-[12px] text-[#575757] "
                >
                  <List.Item>
                    All CPE course instructors will gain access to edit TQF 5.
                  </List.Item>
                  <List.Item>
                    <span className="text-secondary">
                      TQF 3 editing will automatically be disabled,
                    </span>{" "}
                    preventing further edits.
                  </List.Item>
                  
                  <List.Item className="text-secondary font-semibold w-full">
                    You can select specific courses below to enable TQF 3
                    editing.
                  </List.Item>
                </List>
              </div>
            ) : (
              <div className="w-full px-3 font-medium">
                <p className="font-semibold text-[13px] text-tertiary">
                  When turn on TQF 3 edit
                </p>
                <List
                  listStyleType="disc"
                  className="ml-2 flex flex-1 flex-col text-[12px] text-[#575757] "
                >
                  <List.Item>
                    All CPE course instructors will gain access to edit TQF 3.
                  </List.Item>
                  <List.Item>
                    <span className="text-secondary">
                      TQF 5 editing will automatically be disabled,
                    </span>{" "}
                    As a result, instructors will not be able to edit TQF 5.
                  </List.Item>
                  {/* <List.Item className="text-secondary w-full">
                    Courses without data or with incomplete TQF 3 will still be
                    editable.
                  </List.Item> */}
                </List>
              </div>
            )}
          </div>
        </div>

        <div
          className="w-full  flex flex-col bg-white border-secondary border-[1px]  rounded-md overflow-clip"
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          {!notCompleteTQF3List.length ? (
            <div className="bg-[#e6e9ff] flex items-center justify-between rounded-t-md  px-4 py-3 text-secondary font-semibold">
              <div className="flex items-center gap-2">
                <Icon
                  IconComponent={checkedTQF3Completed}
                  className="h-5 w-5"
                />
                <span>All courses have completed TQF 3</span>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-[#e6e9ff] flex items-center justify-between rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold">
                <div className="flex items-center gap-2">
                  <Icon IconComponent={notCompleteIcon} className="h-5 w-5" />
                  <span>List of Courses that are Incomplete TQF 3</span>
                </div>
                <p>
                  {`${notCompleteTQF3List.length} Course`}
                  {`${notCompleteTQF3List.length > 1 ? "s" : ""}`}
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full h-[350px] p-4 py-3 overflow-y-hidden">
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
                <div className="flex flex-col  overflow-y-scroll p-1">
                  {notCompleteTQF3List.map((e, index) => (
                    <div
                      key={index}
                      className="w-full items-center justify-between last:border-none border-b-[1px]  py-3 px-4  flex"
                    >
                      <div className="gap-3 flex items-center">
                        <div className="flex flex-col">
                          <p className="font-semibold text-[14px] text-secondary">
                            {e.courseNo}
                            {e.type === COURSE_TYPE.SEL_TOPIC &&
                              ` (Section ${getSectionNo(e.sectionNo)})`}
                          </p>
                          <p className="text-[12px] font-medium text-[#4E5150]">
                            {e.type === COURSE_TYPE.SEL_TOPIC
                              ? e.topic
                              : e.courseName}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-row items-center justify-between w-[50%]">
                        <p className="mr-1 text-[#4E5150] text-[12px] font-medium text-wrap">
                          {e.instructor}
                        </p>
                        {!checkedTQF3 && (
                          <Switch
                            color="#5768d5"
                            size="lg"
                            onLabel="ON"
                            offLabel="OFF"
                            checked={e.isProcessTQF3}
                            onChange={(event) =>
                              onClickeToggleProcessTQF3(
                                event.currentTarget.checked,
                                index
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
