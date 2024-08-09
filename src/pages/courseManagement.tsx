import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  Button,
  Checkbox,
  Group,
  Menu,
  Modal,
  Switch,
  TextInput,
} from "@mantine/core";
import { IconDots, IconTrash, IconEdit } from "@tabler/icons-react";
import ManageAdminIcon from "@/assets/icons/manageAdmin.svg?react";
import Icon from "@/components/Icon";
import { CourseManagementRequestDTO } from "@/services/courseManagement/dto/courseManagement.dto";
import { getCourseManagement } from "@/services/courseManagement/courseManagement.service";
import { setLoading } from "@/store/loading";
import InfiniteScroll from "react-infinite-scroll-component";
import { COURSE_TYPE, SEMESTER } from "@/helpers/constants/enum";
import { getSection } from "@/helpers/functions/function";
import { useDisclosure } from "@mantine/hooks";

export default function CourseManagement() {
  const [payload, setPayload] = useState<any>();
  const [courseManagement, setCourseManagement] = useState<any[]>([]);
  const [editCourse, setEditCourse] = useState<any>();
  const [
    modalEditSection,
    { open: openModalEditSection, close: closeModalEditSection },
  ] = useDisclosure(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const payloadCourse = {
      ...new CourseManagementRequestDTO(),
      hasMore: true,
    };
    setPayload(payloadCourse);
    fetchCourse(payloadCourse);
  }, []);

  const fetchCourse = async (payloadCourse: any) => {
    dispatch(setLoading(true));
    const res = await getCourseManagement(payloadCourse);
    if (res) {
      setCourseManagement(res);
      // dispatch(setCourseList(res));
    }
    dispatch(setLoading(false));
    console.log(courseManagement);
  };

  const onShowMore = async () => {
    const res = await getCourseManagement({
      ...payload,
      page: payload.page + 1,
    });
    if (res.length) {
      setCourseManagement([...courseManagement, ...res]);
      // dispatch(addLoadMoreCourse(res));
      setPayload({
        ...payload,
        page: payload.page + 1,
        hasMore: res.length >= payload.limit,
      });
    } else {
      setPayload({ ...payload, hasMore: false });
    }
  };

  function clickToggleTQF3(checked: boolean): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      {editCourse && (
        <Modal
          opened={modalEditSection}
          onClose={closeModalEditSection}
          closeOnClickOutside={false}
          title={`Edit section ${
            editCourse ? getSection(editCourse.sectionNo) : ""
          } in ${editCourse ? editCourse.courseNo : ""}`}
          size="30vw"
          centered
          transitionProps={{ transition: "pop" }}
          classNames={{
            content:
              "flex flex-col justify-start bg-[#F6F7FA] text-[14px] item-center px-2 pb-2 overflow-hidden max-h-fit ",
          }}
        >
          {" "}
          <div className="flex flex-col gap-6">
            <div className="text-primary font-semibold">
              <p className="text-[#3E3E3E]">Course No.</p>
              {editCourse.courseNo}
            </div>
            <div className="text-primary font-semibold">
              <p className="text-[#3E3E3E]">Course Name</p>
              {editCourse.courseName}
            </div>

            {/* Text Input */}
            {editCourse.type === COURSE_TYPE.SEL_TOPIC && (
              <TextInput
                classNames={{ input: "focus:border-primary" }}
                label="Topic"
                size="xs"
                value={editCourse ? editCourse.topic : ""}
                withAsterisk
                onChange={(e) => {
                  const updatedCourseTopic = e.target.value;
                  setEditCourse((editCourse: any) => ({
                    ...editCourse,
                    topic: updatedCourseTopic,
                  }));
                }}
              />
            )}
            <TextInput
              classNames={{ input: "focus:border-primary" }}
              label="Section"
              size="xs"
              value={editCourse ? getSection(editCourse.sectionNo) : ""}
              withAsterisk
              maxLength={3}
              onChange={(e) => {
                const updatedSectionNo = e.target.value;
                setEditCourse((editCourse: any) => ({
                  ...editCourse,
                  sectionNo: updatedSectionNo,
                }));
              }}
            />
            {/* Open in */}
            <div
              className="flex justify-between items-center rounded-lg p-3  gap-1 bg-white"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              <span className="text-[#3E3E3E] font-semibold">
                Open in Semester 3/66
              </span>
              <Switch
                color="#5C55E5"
                size="lg"
                onLabel="ON"
                offLabel="OFF"
                checked={editCourse.isActive}
                onChange={() => {
                  setEditCourse(!editCourse.isActive);
                }}
              />
            </div>

            {/* Open Semester */}
            <div
              className="flex justify-between items-center rounded-lg p-3  gap-1 bg-white"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              <span className="text-[#3E3E3E] font-semibold">
                Open Semester
              </span>
              <Checkbox.Group
                classNames={{ error: "mt-2" }}
                // {...form.getInputProps(`sections.${index}.semester`)}
              >
                <Group className="flex flex-row gap-1 justify-end ">
                  {SEMESTER.map((item) => (
                    <Checkbox
                      key={item}
                      classNames={{
                        input:
                          "bg-black bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                        body: "mr-3",
                        label: "text-[14px] cursor-pointer",
                      }}
                      color="#5768D5"
                      size="xs"
                      label={item}
                      value={item.toString()}
                    />
                  ))}
                </Group>
              </Checkbox.Group>
            </div>
          </div>
        </Modal>
      )}

      <div className="bg-[#ffffff] flex flex-col h-full w-full p-6 py-3 gap-3 overflow-hidden">
        <div className="flex flex-col  py-1 gap-1 items-start ">
          <p className="text-secondary text-[16px] font-semibold">Dashboard</p>
          <p className="text-tertiary text-[12px] font-medium">XX Courses</p>
        </div>
        {/* Course Detail */}
        <InfiniteScroll
          dataLength={courseManagement.length}
          next={onShowMore}
          height={"100%"}
          loader={<></>}
          hasMore={payload?.hasMore}
          className="overflow-y-auto w-full h-fit max-h-full flex flex-col gap-4 p-1"
          style={{ height: "fit-content", maxHeight: "100%" }}
        >
          {courseManagement.map((course, index) => (
            <div
              key={index}
              className="bg-[#F4F5FE] flex flex-col rounded-lg py-5 px-8 gap-4"
            >
              {/* Course Topic */}
              <div className="gap-3 flex items-center w-full justify-between">
                <div className="flex flex-col w-[25%]">
                  <p className="font-semibold text-[14px] text-secondary">
                    {course.courseNo}
                  </p>
                  <p className="text-[12px] font-normal text-[#4E5150] flex-wrap ">
                    {course.courseName}
                  </p>
                </div>

                <div className="rounded-full hover:bg-gray-300 p-1 cursor-pointer">
                  <IconDots />
                </div>
              </div>
              {/* Section */}
              {course.sections.map((sec: any) => (
                <div className="flex flex-col gap-4">
                  <div
                    className="bg-white py-3 px-5 rounded-lg"
                    style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.20)" }}
                  >
                    <div className="gap-3 flex items-center justify-between ">
                      <div className="flex flex-row items-center w-fit gap-6">
                        <div className="flex flex-col w-56">
                          <p className="font-semibold text-[14px] text-tertiary">
                            Section {getSection(sec.sectionNo)}
                          </p>
                          {course.type === COURSE_TYPE.SEL_TOPIC && (
                            <p className="text-[12px] font-normal text-[#4E5150] flex-wrap ">
                              {sec.topic}
                            </p>
                          )}
                        </div>

                        <div
                          className={`px-3 py-1  rounded-[20px]  text-[12px] font-medium ${
                            sec.isActive
                              ? "bg-[#10e5908e] text-[#267156]"
                              : "bg-[#919191] text-white"
                          } `}
                        >
                          <p className=" font-semibold ">
                            {sec.isActive ? "Active" : "Inactive"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-row w-[60%] items-center justify-between text-[#4E5150] text-[12px] font-normal ">
                        {/* Main Instructor */}
                        <p className="text-wrap w-[20%]">Thanaporn P.</p>
                        {/* Open Symester */}
                        <div className="flex flex-row gap-1 w-[30%]">
                          <p className="text-wrap ">Open Semester</p>
                          <div className="flex flex-row gap-1">
                            {sec.semester.map((term: any, index: number) => (
                              <span key={index} className="text-wrap ">
                                {index === 0
                                  ? term
                                  : index === sec.semester.length - 1
                                  ? ` and ${term}`
                                  : `, ${term}`}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Button */}
                        <div className="flex flex-row gap-4 items-center">
                          <div className="flex flex-row justify-center items-center  bg-transparent  border-[1px] border-secondary text-secondary size-8 bg-none rounded-full  cursor-pointer hover:bg-secondary/10">
                            <Icon IconComponent={ManageAdminIcon} />
                          </div>
                          <div
                            onClick={() => {
                              const temp = {
                                ...sec,
                                ...course,
                              };
                              setEditCourse(temp);
                              openModalEditSection();
                            }}
                            className="flex flex-row justify-center items-center bg-transparent  border-[1px] border-[#F39D4E] text-[#F39D4E] size-8 bg-none rounded-full  cursor-pointer hover:bg-[#F39D4E]/10"
                          >
                            <IconEdit className="size-4" stroke={1.5} />
                          </div>
                          <div className="flex flex-row justify-center items-center bg-transparent  border-[1px] border-[#FF4747] text-[#FF4747] size-8 bg-none rounded-full  cursor-pointer hover:bg-[#FF4747]/10">
                            <IconTrash className="size-4" stroke={1.5} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </>
  );
}
