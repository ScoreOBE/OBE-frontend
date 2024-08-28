import {
  Button,
  Table,
  Tabs,
  Tooltip,
  Modal,
  TextInput,
  Textarea,
  Checkbox,
  Alert,
} from "@mantine/core";
import {
  IconEdit,
  IconPlus,
  IconInfoCircle,
  IconTrash,
  IconCheck,
  IconExclamationCircle,
} from "@tabler/icons-react";
import Icon from "@/components/Icon";
import { useEffect, useState } from "react";
import CheckIcon from "@/assets/icons/Check.svg?react";
import { IModelCourseManagement } from "@/models/ModelCourseManagement";
import { getCourseManagement } from "@/services/courseManagement/courseManagement.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { CourseManagementRequestDTO } from "@/services/courseManagement/dto/courseManagement.dto";
import Loading from "@/components/Loading";
import InfiniteScroll from "react-infinite-scroll-component";
import { getPLOs, updatePLO } from "@/services/plo/plo.service";
import { IModelPLO, IModelPLONo } from "@/models/ModelPLO";
import { rem } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { IconGripVertical } from "@tabler/icons-react";
import { NOTI_TYPE, POPUP_TYPE } from "@/helpers/constants/enum";
import MainPopup from "@/components/Popup/MainPopup";
import { validateCourseNo } from "@/helpers/functions/validation";
import { useForm } from "@mantine/form";
import { showNotifications } from "@/helpers/functions/function";
import { setLoading } from "@/store/loading";
import { useParams } from "react-router-dom";
import { setShowSidebar } from "@/store/showSidebar";

export default function MapPLO() {
  const { name } = useParams();
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const loading = useAppSelector((state) => state.loading);
  const dispatch = useAppDispatch();
  const [payload, setPayload] = useState<any>();
  const [ploList, setPloList] = useState<Partial<IModelPLO>>({});
  const [reorder, setReorder] = useState(false);
  const [state, handlers] = useListState(ploList.data || []);
  const [getPLONo, setGetPLONo] = useState<number>(0);
  const [isMapPLO, setIsMapPLO] = useState(false);
  const courseManagementTotal = useAppSelector(
    (state) => state.courseManagement
  );
  const isFirstSemester =
    ploList.semester === academicYear?.semester &&
    ploList.year === academicYear?.year;
  const [courseManagement, setCourseManagement] = useState<
    IModelCourseManagement[]
  >([]);
  const [openMainPopupDelPLO, setOpenMainPopupDelPLO] = useState(false);
  const [openModalAddPLONo, setOpenModalAddPLONo] = useState(false);
  const [openModalEditPLONo, setOpenModalEditPLONo] = useState(false);
  const [openModalAddCourse, setOpenModalAddCourse] = useState(false);

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

  const formPLO = useForm({
    mode: "controlled",
    initialValues: { id: "", no: 0, descTH: "", descEN: "" } as IModelPLONo,
    validate: {
      descTH: (value) => {
        if (!value) return `PLO Thai language is required`;
      },
      descEN: (value) => {
        if (!value) return `PLO English language is required`;
      },
    },
    validateInputOnBlur: true,
  });

  const editPLO = async () => {
    const payload = ploList.data?.map((plo) => {
      if (plo.id === formPLO.getValues().id) {
        plo = formPLO.getValues();
      }
      return plo;
    });

    const res = await updatePLO(ploList.id!, {
      data: payload,
    });
    if (res) {
      fetchPLO();
      setOpenModalEditPLONo(false);
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Edit success",
        `PLO-${formPLO.getValues().no} is edited`
      );
    }
  };

  useEffect(() => {
    dispatch(setShowSidebar(true));
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

  useEffect(() => {
    if (academicYear) {
      fetchPLO();
    }
  }, [academicYear]);

  useEffect(() => {
    if (!openModalAddCourse) {
      form.reset();
    }
  }, [openModalAddCourse]);

  useEffect(() => {
    if (ploList.data) {
      handlers.setState(ploList.data);
    }
  }, [ploList.data]);

  useEffect(() => {
    const reorderPLO = async (data: IModelPLONo[]) => {
      const res = await updatePLO(ploList.id!, { data });
      if (res) {
        showNotifications(
          NOTI_TYPE.SUCCESS,
          "Update PLO",
          "Reorder PLO success"
        );
      }
    };
    if (reorder && state) {
      const plo = state;
      plo.forEach((e, index) => {
        e.no = index + 1;
      });
      setPloList({ ...ploList, data: plo });
      reorderPLO(plo);
      setReorder(false);
    }
  }, [reorder]);

  const fetchPLO = async () => {
    let res = await getPLOs({
      manage: true,
      role: user.role,
      departmentCode: user.departmentCode,
    });
    if (res) {
      setPloList(
        res.find(
          (plo: any) =>
            plo.name.replace(/[-\/ ]/g, "") == name?.replace(/[-\/ ]/g, "")
        )
      );
    }
  };

  const fetchCourse = async (payloadCourse: any) => {
    dispatch(setLoading(true));
    const res = await getCourseManagement(payloadCourse);
    if (res) {
      setCourseManagement(res.courses);
    }
    dispatch(setLoading(false));
  };

  const onClickDeletePLO = async (no: any) => {};

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
        opened={openModalAddPLONo}
        closeOnClickOutside={false}
        withCloseButton={false}
        onClose={() => setOpenModalAddPLONo(false)}
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
              onClick={() => setOpenModalAddPLONo(false)}
              variant="subtle"
              color="#575757"
              className="rounded-[8px] text-[12px] h-[32px] w-fit "
            >
              Cancel
            </Button>
            <Button
              // onClick={submit}
              className="rounded-[8px] text-[12px] h-[32px] w-fit "
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
      {/* Edit PLO */}
      <Modal
        title={`Edit PLO-${formPLO.getValues().no}`}
        opened={openModalEditPLONo}
        withCloseButton={false}
        closeOnClickOutside={false}
        onClose={() => setOpenModalEditPLONo(false)}
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
            {...formPLO.getInputProps("descTH")}
            value={formPLO.getValues().descTH}
            onChange={(event) => {
              formPLO.setFieldValue("descTH", event.target.value);
            }}
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
            {...formPLO.getInputProps("descEN")}
            value={formPLO.getValues().descEN}
            onChange={(event) => {
              formPLO.setFieldValue("descEN", event.target.value);
            }}
          />

          <div className="flex gap-2 mt-3 justify-end">
            <Button
              onClick={() => setOpenModalEditPLONo(false)}
              variant="subtle"
              color="#575757"
              className="rounded-[8px] text-[12px] h-[32px] w-fit "
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                editPLO();
              }}
              className="rounded-[8px] text-[12px] h-[32px] w-fit "
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
      {/* Add Course */}
      <Modal
        title={`Add Course`}
        opened={openModalAddCourse}
        withCloseButton={false}
        onClose={() => setOpenModalAddCourse(false)}
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
              onClick={() => setOpenModalAddCourse(false)}
              variant="subtle"
              color="#575757"
              className="rounded-[8px] text-[12px] h-[32px] w-fit "
            >
              Cancel
            </Button>
            <Button
              // onClick={submit}
              className="rounded-[8px] text-[12px] h-[32px] w-fit "
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
      <MainPopup
        opened={openMainPopupDelPLO}
        onClose={() => setOpenMainPopupDelPLO(false)}
        action={() => onClickDeletePLO(getPLONo)}
        type={POPUP_TYPE.DELETE}
        labelButtonRight="Delete PLO"
        title={`Delete PLO ${formPLO.getValues().no}`}
        message={
          <>
            <Alert
              variant="light"
              color="red"
              title="After you delete this PLO, it will affect all courses that use this PLO collection."
              icon={<IconExclamationCircle />}
              classNames={{ title: "-mt-[2px]" }}
            ></Alert>
            <div className="flex flex-col mt-3 gap-2">
              <p>
                xxxxxxxxxxxxxxx
                <br /> <span>Are you sure you want to deleted this PLO? </span>
              </p>
            </div>
          </>
        }
      />
      <div className=" flex flex-col h-full w-full px-6 pb-2 pt-2 gap-4 overflow-hidden ">
        <Tabs
          classNames={{ root: "overflow-hidden flex flex-col h-full" }}
          defaultValue="plodescription"
        >
          <Tabs.List>
            <Tabs.Tab value="plodescription">PLO Description</Tabs.Tab>
            <Tabs.Tab className="overflow-hidden" value="plomapping">
              Map PLO
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel
            value="plodescription"
            className="overflow-hidden flex h-full mt-1"
          >
            {loading ? (
              <Loading />
            ) : (
              <div className=" overflow-hidden  bg-[#ffffff] flex flex-col h-full w-full  py-3 gap-[12px] ">
                <div className="flex items-center  justify-between  ">
                  <div className="flex flex-col items-start ">
                    <div className="flex items-center text-primary gap-1"></div>
                    <div className="text-[#909090] text-[12px] font-medium"></div>
                    <div className="flex flex-col  items-start ">
                      <div className="flex items-center gap-1 text-secondary text-[16px] font-bold">
                        {ploList.name}
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
                            <div className="text-[#333333] text-[13px] p-2 flex flex-col gap-2">
                              <div className="flex gap-2">
                                <p className="text-secondary font-semibold">
                                  Active in:
                                </p>
                                <p className=" font-medium ">
                                  {ploList.semester}/{ploList.year} -{" "}
                                  {ploList.isActive ? "Currently" : ""}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <p className="text-secondary font-semibold">
                                  Department:
                                </p>

                                <p className="font-medium flex flex-col gap-1 ">
                                  {ploList.departmentCode?.join(", ")}
                                </p>
                              </div>
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

                      <p className="text-tertiary text-[14px] font-medium">
                        {ploList.criteriaTH} {ploList.criteriaEN}
                      </p>
                    </div>
                  </div>
                  {isFirstSemester && (
                    <Button
                      leftSection={
                        <IconPlus className="h-5 w-5 -mr-1" stroke={1.5} />
                      }
                      className="rounded-[8px] text-[12px] h-[32px] w-fit "
                      onClick={() => setOpenModalAddPLONo(true)}
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
                    setReorder(true);
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
                                className="flex p-4 w-full justify-between first:-mt-2 border-b last:border-none"
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
                                      formPLO.setValues(item);
                                      setOpenModalEditPLONo(true);
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
                                        formPLO.setValues(item);
                                        setOpenMainPopupDelPLO(true);
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
            )}
          </Tabs.Panel>

          <Tabs.Panel className=" overflow-hidden mt-1" value="plomapping">
            <div className=" overflow-hidden  bg-[#ffffff] flex flex-col h-full w-full  py-3 gap-[12px] ">
              <div className="flex items-center  justify-between  ">
                <div className="flex flex-col  items-start ">
                  <p className="text-secondary text-[16px] font-bold">
                    Map PLO
                  </p>
                  <p className="text-tertiary text-[14px] font-medium">
                    {courseManagementTotal.total} Course
                    {courseManagementTotal.total > 1 ? "s " : " "}
                  </p>
                </div>

                <div className="flex gap-3">
                  {!isMapPLO && (
                    <Button
                      leftSection={
                        <IconPlus className="h-5 w-5 -mr-1" stroke={1.5} />
                      }
                      className="rounded-[8px] text-[12px] h-[32px] w-fit "
                      onClick={() => setOpenModalAddCourse(true)}
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
                className="overflow-y-auto overflow-x-auto w-full h-fit max-h-full border flex flex-col  rounded-lg border-secondary"
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
                                  __size="xs"
                                  classNames={{
                                    input:
                                      "bg-[black] bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                                    body: "mr-3 px-0",
                                    label:
                                      "text-[14px] text-[#615F5F] cursor-pointer",
                                  }}
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
