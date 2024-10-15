import {
  Modal,
  TextInput,
  Switch,
  List,
  Alert,
  Tabs,
  Table,
  Tooltip,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import { IModelUser } from "@/models/ModelUser";
import { getCourse } from "@/services/course/course.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { COURSE_TYPE, TQF_STATUS } from "@/helpers/constants/enum";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { IModelCourse } from "@/models/ModelCourse";
import { getSectionNo, getUserName } from "@/helpers/functions/function";
import { updateProcessTqf3 } from "@/services/academicYear/academicYear.service";
import { setProcessTQF3 } from "@/store/academicYear";
import { IconInfoCircle } from "@tabler/icons-react";

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
      initialPayload.year = academicYear.year;
      initialPayload.semester = academicYear.semester;
      initialPayload.manage = true;
      setPayload(initialPayload);
      const res = await getCourse(initialPayload);
      if (res) {
        const courseList: any[] = [];
        console.log(res);

        res.forEach((course: IModelCourse) => {
          if (course.type === COURSE_TYPE.SEL_TOPIC.en) {
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
      size="60vw"
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        content:
          "flex flex-col justify-start bg-[#F6F7FA] text-[14px] item-center px-2 pb-2 overflow-y-auto ",
      }}
    >
      <div className="flex flex-col h-full gap-2   flex-1 ">
        <Alert
          variant="light"
          color="blue"
          title="Tips of TQF 5"
          classNames={{ icon: "size-6" }}
          icon={<IconInfoCircle />}
        >
          <div className="flex flex-col text-[13px] font-medium text-[#333333] gap-3">
            <li>
              If you've already turn on TQF 5 edit but need to make changes to a
              specific course's detail in TQF 3, you can do so in the "TQF 3
              Course Management" tab.
            </li>
            <li>
              Turn on TQF 5 does not affect courses that have not yet completed
              TQF 3. These courses are required to finalize TQF 3 before
              progressing to TQF 5.
            </li>
          </div>
        </Alert>

        <Tabs defaultValue="EnableTQF">
          <Tabs.List>
            <Tabs.Tab value="EnableTQF">TQF 3&5 Settings</Tabs.Tab>
            <Tabs.Tab value="EnableTQF3">TQF 3 Course Management</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="EnableTQF">
            <div className="flex flex-row w-full mt-4 items-end h-fit ">
              <div
                className="flex flex-col gap-2  p-3 px-3 w-full bg-white  rounded-md"
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
                        All courses in Faculty of Engineering, CMU instructors
                        will gain access to edit TQF 5.
                      </List.Item>
                      <List.Item>
                        <span className="text-secondary">
                          TQF 3 editing will automatically be disabled,
                        </span>{" "}
                        preventing further edits.
                      </List.Item>

                      <List.Item className="text-secondary font-semibold w-full">
                        You can enable TQF 3 editing for specific courses in the
                        'TQF 3 Course Management' tab.
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
                        All courses in Faculty of Engineering, CMU instructors
                        will gain access to edit TQF 3.
                      </List.Item>
                      <List.Item>
                        <span className="text-secondary">
                          TQF 5 editing will automatically be disabled,
                        </span>{" "}
                        As a result, instructors will not be able to edit TQF 5.
                      </List.Item>
                    </List>
                  </div>
                )}
              </div>
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="EnableTQF3">
            <TextInput
              leftSection={<TbSearch />}
              placeholder="Course No, Course name "
              size="xs"
              value={searchValue}
              onChange={(event: any) =>
                setSearchValue(event.currentTarget.value)
              }
              rightSectionPointerEvents="all"
              className="mt-4"
            />
            <div
              className="w-full  flex flex-col bg-white  mt-4 rounded-md overflow-clip"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              <Table.ScrollContainer className="h-[360px] p-0" minWidth={500}>
                <Table stickyHeader striped>
                  <Table.Thead>
                    <Table.Tr className="bg-[#e5e7f6]">
                      <Table.Th className=" w-[40%]">Course no.</Table.Th>
                      <Table.Th className=" w-[35%]">Instructor</Table.Th>

                      <Table.Th className="w-[25%] ">
                        <div className="flex flex-row items-center gap-2">
                          TQF3 Edit
                          <Tooltip
                            arrowOffset={10}
                            arrowSize={8}
                            arrowRadius={1}
                            transitionProps={{
                              transition: "fade",
                              duration: 300,
                            }}
                            multiline
                            withArrow
                            label={
                              <div className="text-default text-[12px] p-2 font-medium gap-2">
                                The button will be disabled if TQF3 editing is
                                turn on <br /> or the course has not completed
                                TQF3.
                              </div>
                            }
                            color="#FCFCFC"
                            className="w-fit border  rounded-md "
                            position="bottom-start"
                          >
                            <IconInfoCircle
                              size={16}
                              className="-ml-0 text-secondary"
                            />
                          </Tooltip>
                        </div>
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {courseList.map((e, index) => (
                      <Table.Tr key={index}>
                        <Table.Td>
                          <div className="flex flex-col">
                            <p className="font-semibold text-[14px] text-secondary">
                              {e.courseNo}
                              {e.type === COURSE_TYPE.SEL_TOPIC.en &&
                                ` (Section ${getSectionNo(e.sectionNo)})`}
                            </p>
                            <p className="text-[12px] font-medium text-[#4E5150]">
                              {e.type === COURSE_TYPE.SEL_TOPIC.en
                                ? e.topic
                                : e.courseName}
                            </p>
                          </div>
                        </Table.Td>
                        <Table.Td className="text-[#4E5150] text-[12px] font-medium">
                          {" "}
                          {e.instructor}
                        </Table.Td>
                        <Table.Td>
                          <Switch
                            size="md"
                            onLabel="ON"
                            offLabel="OFF"
                            disabled={academicYear?.isProcessTQF3}
                            checked={
                              academicYear.isProcessTQF3
                                ? true
                                : e.TQF3?.status !== TQF_STATUS.DONE
                            }
                            onChange={(event) => {
                              onClickToggleOne(
                                event.currentTarget.checked,
                                index
                              );
                            }}
                          />
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
    </Modal>
  );
}
