import {
  Button,
  Select,
  Table,
  Tabs,
  Drawer,
  ScrollArea,
  Tooltip,
  Modal,
  TextInput,
  Textarea,
  Checkbox,
} from "@mantine/core";
import {
  IconEdit,
  IconPlus,
  IconInfoCircle,
  IconTrash,
  IconCheck,
} from "@tabler/icons-react";
import Icon from "@/components/Icon";
import { useEffect, useState } from "react";
import CheckIcon from "@/assets/icons/Check.svg?react";
import { IModelCourseManagement } from "@/models/ModelCourseManagement";
import { getCourseManagement } from "@/services/courseManagement/courseManagement.service";
import CourseManagement from "./CourseManagement";
import { useAppSelector } from "@/store";
import { CourseManagementRequestDTO } from "@/services/courseManagement/dto/courseManagement.dto";
import Loading from "@/components/Loading";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDisclosure } from "@mantine/hooks";
import DrawerPLOdes from "@/components/DrawerPLO";
import { getPLOs } from "@/services/plo/plo.service";
import { IModelPLO, IModelPLONo } from "@/models/ModelPLO";
import { useParams, useSearchParams } from "react-router-dom";

import { rem, Text } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { IconGripVertical } from "@tabler/icons-react";
import { COURSE_TYPE, POPUP_TYPE } from "@/helpers/constants/enum";
import MainPopup from "@/components/Popup/MainPopup";
import { validateCourseNo } from "@/helpers/functions/validation";
import { useForm } from "@mantine/form";

export default function MapPLO() {
  const { name } = useParams();
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState<any>();
  const [ploList, setPloList] = useState<Partial<IModelPLO>>({});
  const [ploListTest, setPloListTest] = useState<Partial<IModelPLO>>({});
  const [state, handlers] = useListState(ploList.data || []);
  const [getPLONo, setGetPLONo] = useState<number>();
  const [couresNo, setCouresNo] = useState("");
  const [isMapPLO, setIsMapPLO] = useState(false);
  const isFirstSemester =
    ploList.semester === academicYear?.semester &&
    ploList.year === academicYear?.year;
  const [
    mainPopupDelPLO,
    { open: openMainPopupDelPLO, close: closeMainPopupDelPLO },
  ] = useDisclosure(false);
  const [
    modalAddPLONo,
    { open: openModalAddPLONo, close: closeModalAddPLONo },
  ] = useDisclosure(false);
  const [
    modalEditPLONo,
    { open: openModalEditPLONo, close: closeModalEditPLONo },
  ] = useDisclosure(false);
  const fetchPLO = async () => {
    let res = await getPLOs({
      role: user.role,
      departmentCode: user.departmentCode,
    });
    if (res) {
      setPloList(res.plos[0].collections[0]);
      setPloListTest(res);
      console.log(res);
    }
  };
  const [
    modalAddCourse,
    { open: openModalAddCourse, close: closeModalAddCourse },
  ] = useDisclosure(false);

  const [courseManagement, setCourseManagement] = useState<
    IModelCourseManagement[]
  >([]);

  useEffect(() => {
    if (user.departmentCode) {
      const payloadCourse = {
        ...new CourseManagementRequestDTO(),
        limit: 20,
        departmentCode: user.departmentCode,
        hasMore: true,
      };
      setPayload(payloadCourse);
      fetchCourse(payloadCourse);
    }
  }, [user]);

  // useEffect(() => {
  //   console.log(ploListTest);
  // }, [ploListTest]);

  const fetchCourse = async (payloadCourse: any) => {
    setLoading(true);
    const res = await getCourseManagement(payloadCourse);
    if (res) {
      setCourseManagement(res.courses);
    }
    setLoading(false);
  };

  const onClickDeletePLO = async (no: any) => {
    // const res = await deleteSectionManagement(coures.id, coures.secId, coures);
    // if (res) {
    //   closeMainPopupDelPLO();
    //   showNotifications(
    //     NOTI_TYPE.SUCCESS,
    //     "Delete Section Success",
    //     `${editSec?.sectionNo} is deleted`
    //   );
    // }
  };

  const form = useForm({
    mode: "controlled",
    initialValues: { courseNo: "" },
    validate: {
      courseNo: (value) => {
        return validateCourseNo(value);
      },
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    if (academicYear) {
      fetchPLO();
    }
  }, [academicYear]);

  useEffect(() => {
    if (ploList.data) {
      handlers.setState(ploList.data);
    }
  }, [ploList.data]);

  useEffect(() => {
    if (state) {
      const plo = state;
      plo.forEach((e, index) => {
        e.no = index + 1;
      });
      setPloList({ ...ploList, data: plo });
    }
  }, [state]);

  useEffect(() => {
    if (!modalAddCourse) {
      form.reset();
    }
  }, [modalAddCourse]);

  const onShowMore = async () => {
    const res = await getCourseManagement({
      ...payload,
      page: payload.page + 1,
    });
    if (res.length) {
      setCourseManagement([...courseManagement, ...res]);
      setPayload({
        ...payload,
        page: payload.page + 1,
        hasMore: res.length >= payload.limit,
      });
    } else {
      setPayload({ ...payload, hasMore: false });
    }
  };

  return (
    <>
      {/* Add PLO */}
      <Modal
        title="Add PLO"
        opened={modalAddPLONo}
        closeOnClickOutside={false}
        withCloseButton={false}
        onClose={closeModalAddPLONo}
        transitionProps={{ transition: "pop" }}
        size="35vw"
        centered
        classNames={{
          content: "flex flex-col overflow-hidden pb-2  max-h-full h-fit",
          body: "flex flex-col overflow-hidden max-h-full h-fit",
        }}
      >
        <div className="flex flex-col mt-2 gap-3">
          <Textarea
            withAsterisk={true}
            label={
              <p className="text-b2 font-semibold flex gap-1">
                PLO <span className="text-secondary">Thai language</span>
              </p>
            }
            className="w-full border-none   rounded-r-none "
            classNames={{
              input: "flex  h-[150px] p-3 ",
              label: "flex pb-1",
            }}
            placeholder="Ex. ความสามารถในการแก้ปัญหาทางวิศวกรรม"
          />
          <Textarea
            withAsterisk={true}
            label={
              <p className="text-b2 font-semibold flex gap-1 ">
                PLO <span className="text-secondary">English language</span>
              </p>
            }
            className="w-full border-none rounded-r-none"
            classNames={{
              input: "flex  h-[150px] p-3",
              label: "flex pb-1",
            }}
            placeholder="Ex. An ability to solve complex engineering problems."
          />

          <div className="flex gap-2 mt-3 justify-end">
            <Button
              onClick={closeModalAddPLONo}
              variant="subtle"
              color="#575757"
              className="rounded-[8px] text-[12px] h-[32px] w-fit "
            >
              Cancel
            </Button>
            <Button
              // onClick={submit}
              className="rounded-[8px] text-[12px] h-[32px] w-fit "
              color="#5768d5"
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
      {/* Edit PLO */}
      <Modal
        title={`Edit PLO-${getPLONo}`}
        opened={modalEditPLONo}
        withCloseButton={false}
        closeOnClickOutside={false}
        onClose={closeModalEditPLONo}
        transitionProps={{ transition: "pop" }}
        size="35vw"
        centered
        classNames={{
          content: "flex flex-col overflow-hidden pb-2  max-h-full h-fit",
          body: "flex flex-col overflow-hidden max-h-full h-fit",
        }}
      >
        <div className="flex flex-col gap-3">
          <Textarea
            withAsterisk={true}
            label={
              <p className="text-b2 flex gap-1">
                PLO <span className="text-secondary">Thai language</span>
              </p>
            }
            className="w-full border-none rounded-r-none "
            style={{ boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)" }}
            classNames={{
              input: "flex !rounded-r-none h-[150px] p-3",
              label: "flex pb-1",
            }}
            placeholder="Ex. ความสามารถในการแก้ปัญหาทางวิศวกรรม"
          />
          <Textarea
            withAsterisk={true}
            label={
              <p className="text-b2 flex gap-1 ">
                PLO <span className="text-secondary">English language</span>
              </p>
            }
            className="w-full border-none rounded-r-none "
            style={{ boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)" }}
            classNames={{
              input: "flex !rounded-r-none h-[150px] p-3",
              label: "flex pb-1",
            }}
            placeholder="Ex. An ability to solve complex engineering problems."
          />

          <div className="flex gap-2 mt-3 justify-end">
            <Button
              onClick={closeModalEditPLONo}
              variant="subtle"
              color="#575757"
              className="rounded-[8px] text-[12px] h-[32px] w-fit "
            >
              Cancel
            </Button>
            <Button
              // onClick={submit}
              className="rounded-[8px] text-[12px] h-[32px] w-fit "
              color="#5768d5"
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
      {/* Add Course */}
      <Modal
        title={`Add Course`}
        opened={modalAddCourse}
        withCloseButton={false}
        onClose={closeModalAddCourse}
        transitionProps={{ transition: "pop" }}
        size="35vw"
        centered
        classNames={{
          content: "flex flex-col overflow-hidden pb-2  max-h-full h-fit",
          body: "flex flex-col overflow-hidden max-h-full h-fit",
        }}
      >
        <div className="flex flex-col gap-3">
          <TextInput
            classNames={{ input: "focus:border-primary" }}
            label="Course No."
            size="xs"
            withAsterisk
            placeholder="Ex. 26X4XX"
            maxLength={6}
            {...form.getInputProps("courseNo")}
          />

          <div className="flex gap-2 mt-3 justify-end">
            <Button
              onClick={closeModalAddCourse}
              variant="subtle"
              color="#575757"
              className="rounded-[8px] text-[12px] h-[32px] w-fit "
            >
              Cancel
            </Button>
            <Button
              // onClick={submit}
              className="rounded-[8px] text-[12px] h-[32px] w-fit "
              color="#5768d5"
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
      <MainPopup
        opened={mainPopupDelPLO}
        onClose={closeMainPopupDelPLO}
        action={() => onClickDeletePLO(getPLONo)}
        type={POPUP_TYPE.DELETE}
        labelButtonRight="Delete PLO"
        title={`Delete PLO ${getPLONo}`}
        message={
          <p>
            xxxxxxxxxxxxxxx
            <br /> <span>Are you sure you want to deleted this PLO? </span>
          </p>
        }
      />
      <div className=" flex flex-col h-full w-full px-6 pb-2 pt-2 gap-4 overflow-hidden ">
        <Tabs
          color="#5768d5"
          classNames={{ root: "overflow-hidden flex flex-col max-h-full " }}
          defaultValue="plodescription"
        >
          <Tabs.List>
            <Tabs.Tab value="plodescription">PLO Description</Tabs.Tab>
            <Tabs.Tab className="overflow-hidden" value="plomapping">
              Map PLO
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="plodescription" className="overflow-hidden mt-1">
            <div className=" overflow-hidden  bg-[#ffffff] flex flex-col h-full w-full  py-3 gap-[12px] ">
              <div className="flex items-center  justify-between  ">
                <div className="flex flex-col items-start ">
                  <div className="flex items-center text-primary gap-1">
                    <p className="text-secondary text-[16px] font-bold">
                      {ploList.name}
                    </p>
                    {/* Tooltip */}

                    <Tooltip
                      multiline
                      label={
                        <div className="text-[#333333] text-[13px] p-2 flex flex-col gap-2">
                          <div className="text-secondary font-bold text-[14px]">
                            {ploList.name}
                          </div>
                          <div>
                            <p className="font-semibold">Active in:</p>
                            <p className="text-tertiary  pl-3">
                              {ploList.semester}/{ploList.year} -{" "}
                              {ploList.isActive ? "Currently" : ""}
                            </p>
                          </div>
                          <div>
                            <p className="font-semibold">Department:</p>

                            <p className="text-tertiary pl-3 flex flex-col gap-1">
                              {ploList.departmentCode?.join(", ")}
                            </p>
                          </div>
                        </div>
                      }
                      color="#FCFCFC"
                      className="w-fit  border rounded-md"
                      classNames={{
                        arrow: "border ",
                      }}
                      style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px" }}
                      position="bottom-start"
                    >
                      <IconInfoCircle
                        size={16}
                        className="-ml-0 text-secondary"
                      />
                    </Tooltip>
                  </div>
                  <div className="text-[#909090] text-[12px] font-medium">
                    <p>
                      {ploList.criteriaTH} {ploList.criteriaEN}
                    </p>
                  </div>
                </div>
                {isFirstSemester && (
                  <Button
                    color="#5768D5"
                    leftSection={
                      <IconPlus className="h-5 w-5 -mr-1" stroke={1.5} />
                    }
                    className="rounded-[8px] text-[12px] h-[32px] w-fit "
                    onClick={openModalAddPLONo}
                  >
                    Add PLO
                  </Button>
                )}
              </div>

              <DragDropContext
                onDragEnd={({ destination, source }) => {
                  handlers.reorder({
                    from: source.index,
                    to: destination?.index || 0,
                  });
                }}
              >
                <Droppable droppableId="dnd-list" direction="vertical">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className=" overflow-y-auto"
                    >
                      {state.map((item, index) => (
                        <Draggable
                          key={item.no}
                          index={index}
                          draggableId={item.no.toString()}
                        >
                          {(provided, snapshot) => (
                            <div
                              className="flex p-4 w-full justify-between border-b last:border-none"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <div className="flex flex-col gap-2 w-[85%] ">
                                <p className="text-secondary font-semibold text-[14px]">
                                  PLO-{item.no}
                                </p>
                                <div className="text-tertiary text-[13px] font-medium flex flex-col gap-1">
                                  <div className="flex  text-pretty ">
                                    <li></li> {item.descTH}
                                  </div>
                                  <div className="flex  text-pretty ">
                                    <li></li> {item.descEN}
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-1 items-center">
                                <div
                                  className="flex items-center justify-center border-[#F39D4E] size-8 rounded-full  hover:bg-[#F39D4E]/10  cursor-pointer"
                                  onClick={() => {
                                    setGetPLONo(item.no);
                                    openModalEditPLONo();
                                  }}
                                >
                                  <IconEdit
                                    stroke={1.5}
                                    color="#F39D4E"
                                    className="flex items-center size-4"
                                  />
                                </div>
                                {isFirstSemester && (
                                  <div
                                    className="flex items-center justify-center border-[#FF4747] size-8 rounded-full  hover:bg-[#FF4747]/10  cursor-pointer"
                                    onClick={() => {
                                      setGetPLONo(item.no);
                                      openMainPopupDelPLO();
                                    }}
                                  >
                                    <IconTrash
                                      stroke={1.5}
                                      color="#FF4747"
                                      className=" size-4 flex items-center"
                                    />
                                  </div>
                                )}
                                <div
                                  className="cursor-pointer hover:bg-hover  text-tertiary size-8 rounded-full flex items-center justify-center"
                                  {...provided.dragHandleProps}
                                >
                                  <IconGripVertical
                                    style={{
                                      width: rem(20),
                                      height: rem(20),
                                    }}
                                    stroke={1.5}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </Tabs.Panel>

          <Tabs.Panel className=" overflow-hidden mt-1" value="plomapping">
            <div className=" overflow-hidden  bg-[#ffffff] flex flex-col h-full w-full  py-3 gap-[12px] ">
              <div className="flex items-center  justify-between  ">
                <div className="flex flex-col items-start ">
                  <p className="text-secondary text-[16px] font-bold">
                    Map PLO
                  </p>
                  <div className="text-[#909090] text-[12px] font-medium">
                    <p>xxxxxxxxxxxxxxx</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {!isMapPLO && (
                    <Button
                      color="#5768D5"
                      leftSection={
                        <IconPlus className="h-5 w-5 -mr-1" stroke={1.5} />
                      }
                      className="rounded-[8px] text-[12px] h-[32px] w-fit "
                      onClick={openModalAddCourse}
                    >
                      Add Course
                    </Button>
                  )}
                  {!isMapPLO ? (
                    <Button
                      color="#F39D4E"
                      leftSection={<IconEdit className="size-4" stroke={1.5} />}
                      className="rounded-[8px] text-[12px] h-[32px] w-fit "
                      onClick={() => {
                        setIsMapPLO(true);
                      }}
                    >
                      Map PLO
                    </Button>
                  ) : (
                    <div className="flex gap-3">
                      <Button
                        variant="subtle"
                        color="#575757"
                        className="rounded-[8px] text-[12px] h-[32px] w-fit bg-[#e5e7eb] hover-[#e5e7eb]/10"
                        onClick={() => {
                          setIsMapPLO(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        color="#0eb092"
                        leftSection={
                          <IconCheck className="size-4" stroke={2} />
                        }
                        className="rounded-[8px] text-[12px] h-[32px] w-fit "
                        onClick={() => {
                          setIsMapPLO(false);
                        }}
                      >
                        Done
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {/* Table */}

              <InfiniteScroll
                dataLength={courseManagement.length}
                next={onShowMore}
                height={"100%"}
                hasMore={payload?.hasMore}
                className="overflow-y-auto w-full h-fit max-h-full border flex flex-col  rounded-lg border-secondary"
                style={{ height: "fit-content" }}
                loader={<Loading />}
              >
                <Table stickyHeader striped>
                  <Table.Thead>
                    <Table.Tr className="bg-[#F4F5FE]">
                      <Table.Th>Course No.</Table.Th>
                      {ploList.data?.map((plo, index) => (
                        <Table.Th key={index}>PLO-{plo.no}</Table.Th>
                      ))}
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody>
                    {courseManagement.map((course, index) => (
                      <Table.Tr key={index}>
                        <Table.Td className="py-4 text-[#333333] text-b3 font-semibold pl-5">
                          {course.courseNo}
                        </Table.Td>

                        {ploList.data?.map((plo, index) => (
                          <Table.Td key={index}>
                            <div className="flex items-start">
                              {!isMapPLO ? (
                                <Icon IconComponent={CheckIcon} />
                              ) : (
                                <Checkbox
                                  classNames={{
                                    input:
                                      "bg-[black] bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                                    body: "mr-3 px-0",
                                    label:
                                      "text-[14px] text-[#615F5F] cursor-pointer",
                                  }}
                                  color="#5768D5"
                                  size="xs"
                                />
                              )}
                            </div>
                          </Table.Td>
                        ))}
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </InfiniteScroll>
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  );
}
