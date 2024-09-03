import { Modal, TextInput, Switch, List, Alert, Tabs } from "@mantine/core";
import checkedTQF3Completed from "@/assets/icons/checkedTQF3Completed.svg?react";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import Icon from "@/components/Icon";
import CourseIcon from "@/assets/icons/course.svg?react";
import { IModelUser } from "@/models/ModelUser";
import { getCourse } from "@/services/course/course.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { COURSE_TYPE, TQF_STATUS } from "@/helpers/constants/enum";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { IModelCourse } from "@/models/ModelCourse";
import { getSectionNo, getUserName } from "@/helpers/functions/function";
import { updateProcessTqf3 } from "@/services/academicYear/academicYear.service";
import { setProcessTQF3 } from "@/store/academicYear";
import { IconExclamationCircle } from "@tabler/icons-react";

type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalManageTQF({ opened, onClose }: Props) {
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [payload, setPayload] = useState<any>({});
  const [courseList, setCourseList] = useState<any[]>([]);

  useEffect(() => {
    if (opened && !courseList.length) {
      setSearchValue("");
      fetchCourse();
    }
  }, [opened]);

  const fetchCourse = async () => {
    if (academicYear) {
      const initialPayload = new CourseRequestDTO();
      initialPayload.academicYear = academicYear.id;
      initialPayload.manage = true;
      setPayload(initialPayload);
      const res = await getCourse(initialPayload);
      if (res) {
        const courseList: any[] = [];
        console.log(res);

        res.forEach((course: IModelCourse) => {
          if (course.type === COURSE_TYPE.SEL_TOPIC) {
            course.sections.forEach((section) => {
              if (section.isActive) {
                courseList.push({
                  ...course,
                  ...section,
                  instructor: getUserName(section.instructor as IModelUser),
                });
              }
            });
          } else {
            let temp = Array.from(
              new Set(
                course.sections
                  .filter((sec) => sec.isActive)
                  .map((section) =>
                    getUserName(section.instructor as IModelUser)
                  )
              )
            ).join(", ");
            if (temp) {
              courseList.push({
                TQF3: {
                  status: TQF_STATUS.NO_DATA,
                },
                ...course,
                instructor: temp,
              });
            }
          }
        });
        setCourseList([...courseList]);
      }
    }
  };

  const onClickToggleProcessTQF = async (checked: any) => {
    const res = await updateProcessTqf3(academicYear.id, {
      isProcessTQF3: checked,
    });
    if (res) {
      dispatch(setProcessTQF3(res));
    }
  };

  const onClickToggleOne = (checked: any, index?: number) => {
    console.log(checked);
    const updatedList = courseList.map((item, idx) => {
      if (index === idx) {
        return {
          ...item,
          TQF3: { status: checked ? TQF_STATUS.IN_PROGRESS : TQF_STATUS.DONE },
        };
      }
      return item;
    });
    // Log updated list to ensure state changes
    console.log("Updated course list:", updatedList);

    setCourseList(updatedList);
  };
  return (
    <Modal
      opened={opened && !!courseList.length}
      onClose={onClose}
      title="Management TQF"
      size="45vw"
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        content:
          "flex flex-col justify-start bg-[#F6F7FA] text-[14px] item-center px-2 pb-2 overflow-y-auto ",
      }}
    >
      <div className="flex flex-col h-full gap-4   flex-1 ">
        <Alert
          variant="light"
          color="red"
          title="Lorem Ipsum."
          icon={<IconExclamationCircle />}
        ></Alert>

        <Tabs defaultValue="EnableTQF">
          <Tabs.List>
            <Tabs.Tab value="EnableTQF">Enable TQF</Tabs.Tab>
            <Tabs.Tab value="EnableTQF3">Enable TQF3 of Each Course</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="EnableTQF">
            <div className="flex flex-row w-full mt-5 items-end h-fit ">
              <div
                className="flex flex-col gap-2  p-3 px-3 w-full bg-white border-[1px]  rounded-md"
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
                      size="lg"
                      onLabel="ON"
                      offLabel="OFF"
                      checked={academicYear?.isProcessTQF3}
                      onChange={(event) =>
                        onClickToggleProcessTQF(event.currentTarget.checked)
                      }
                    />
                  </div>
                  <div className="flex flex-row justify-between items-center border-t-[1px] border-[#DADADA] px-5 py-3 w-full">
                    <p className="font-semibold text-[14px] text-tertiary">
                      TQF 5 Edit
                    </p>
                    <Switch
                      size="lg"
                      onLabel="ON"
                      offLabel="OFF"
                      checked={!academicYear?.isProcessTQF3}
                      onChange={(event) =>
                        onClickToggleProcessTQF(!event.currentTarget.checked)
                      }
                    />
                  </div>
                </div>
                {academicYear?.isProcessTQF3 ? (
                  <div className="w-full px-3 font-medium">
                    <p className="font-semibold text-[13px] text-tertiary">
                      When turn on TQF 5 edit
                    </p>
                    <List
                      listStyleType="disc"
                      className="ml-2 flex flex-1 flex-col text-[12px] text-[#575757] "
                    >
                      <List.Item>
                        All CPE course instructors will gain access to edit TQF
                        5.
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
                        All CPE course instructors will gain access to edit TQF
                        3.
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
          </Tabs.Panel>
          <Tabs.Panel value="EnableTQF3">
            <div
              className="w-full  flex flex-col bg-white border-secondary border-[1px] mt-5  rounded-md overflow-clip"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              {/* {!courseList.length ? (
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
                <> */}
              <div className="bg-[#e6e9ff] flex items-center justify-between rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold">
                <div className="flex items-center gap-2">
                  <Icon IconComponent={CourseIcon} className="h-5 w-5" />
                  <span>List of Courses</span>
                </div>
                <p>
                  {`${courseList.length} Course`}
                  {`${courseList.length > 1 ? "s" : ""}`}
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full h-[400px] p-4 py-3 overflow-y-hidden">
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
                  {courseList.map((e, index) => (
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
                      <div className="flex flex-row items-center justify-between w-[50%] gap-1">
                        <p className="mr-1 text-[#4E5150] text-[12px] font-medium">
                          {e.instructor}
                        </p>

                        {!academicYear?.isProcessTQF3 && (
                          <Switch
                            size="lg"
                            onLabel="ON"
                            offLabel="OFF"
                            checked={e.TQF3?.status !== TQF_STATUS.DONE}
                            onChange={(event) => {
                              onClickToggleOne(
                                event.currentTarget.checked,
                                index
                              );
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* </>
              )} */}
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
    </Modal>
  );
}
