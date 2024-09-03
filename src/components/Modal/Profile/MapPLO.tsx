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
  Menu,
} from "@mantine/core";
import Icon from "@/components/Icon";
import {
  IconEdit,
  IconPlus,
  IconInfoCircle,
  IconTrash,
  IconCheck,
  IconExclamationCircle,
  IconDots,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import CheckIcon from "@/assets/icons/Check.svg?react";
import { IModelCourseManagement } from "@/models/ModelCourseManagement";
import { getCourseManagement } from "@/services/courseManagement/courseManagement.service";
import { useAppSelector } from "@/store";
import { CourseManagementRequestDTO } from "@/services/courseManagement/dto/courseManagement.dto";
import Loading from "@/components/Loading";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  createPLONo,
  deletePLONo,
  getOnePLO,
  getPLOs,
  updatePLO,
} from "@/services/plo/plo.service";
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
import { SearchInput } from "@/components/SearchInput";

type Props = {
  ploName: string;
};

export default function MapPLO({ ploName = "" }: Props) {
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState<any>({});
  const [ploList, setPloList] = useState<Partial<IModelPLO>>({});
  const [reorder, setReorder] = useState(false);
  const [state, handlers] = useListState(ploList.data || []);
  const [couresNo, setCouresNo] = useState("");
  const [isMapPLO, setIsMapPLO] = useState(false);
  const [totalCourse, setTotalCourse] = useState<number>(0);
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
      fetchOnePLO();
      setOpenModalEditPLONo(false);
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Edit success",
        `PLO-${formPLO.getValues().no} is edited`
      );
    }
  };

  useEffect(() => {
    if (ploName.length) {
      setCourseManagement([]);
      fetchOnePLO();
    }
  }, [ploName]);

  useEffect(() => {
    if (ploList.departmentCode && !courseManagement.length) {
      const payloadCourse = {
        ...new CourseManagementRequestDTO(),
        limit: 20,
        departmentCode: ploList.departmentCode,
      };
      setPayload(payloadCourse);
      fetchCourse(payloadCourse);
    }
  }, [ploList]);

  useEffect(() => {
    if (openModalAddCourse) {
      form.reset();
    } else if (openModalAddPLONo) {
      formPLO.reset();
    }
  }, [openModalAddCourse, openModalAddPLONo]);

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

  const fetchOnePLO = async () => {
    const res = await getOnePLO(ploName);
    if (res) {
      setPloList(res);
    }
  };

  const fetchCourse = async (payloadCourse: any) => {
    setLoading(true);
    const res = await getCourseManagement(payloadCourse);
    if (res) {
      setPayload({
        ...payloadCourse,
        hasMore: res.courses.length >= payloadCourse.limit,
      });
      setTotalCourse(res.totalCount);
      setCourseManagement(res.courses);
    }
    setLoading(false);
  };

  const onClickAddPLONo = async () => {
    const isValid = !formPLO.validate().hasErrors;
    if (isValid) {
      const no = ploList.data?.length! + 1;
      const res = await createPLONo(ploList.id!, {
        ...formPLO.getValues(),
        no,
      });
      if (res) {
        showNotifications(
          NOTI_TYPE.SUCCESS,
          `Add PLO-${no} Success`,
          `PLO-${no} is added`
        );
        setPloList(res);
        setOpenModalAddPLONo(false);
        formPLO.reset();
      }
    }
  };

  const onClickDeletePLO = async () => {
    const res = await deletePLONo(ploList.id!, { id: formPLO.getValues().id });
    if (res) {
      showNotifications(
        NOTI_TYPE.SUCCESS,
        `Delete PLO-${formPLO.getValues().no} Success`,
        `PLO-${formPLO.getValues().no} is deleted`
      );
      setPloList(res);
      setOpenMainPopupDelPLO(false);
      formPLO.reset();
    }
  };

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

  const searchCourse = async (searchValue: string, reset?: boolean) => {
    setCourseManagement([]);
    let payloadCourse: any = {
      ...new CourseManagementRequestDTO(),
      limit: 20,
      departmentCode: ploList.departmentCode,
    };
    if (reset) payloadCourse.search = "";
    else payloadCourse.search = searchValue;
    fetchCourse(payloadCourse);
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
            {...formPLO.getInputProps("descTH")}
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
            {...formPLO.getInputProps("descEN")}
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
              onClick={onClickAddPLONo}
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
        action={onClickDeletePLO}
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
              classNames={{ title: "-mt-[2px]", icon: 'size-6' }}
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
      {!ploList.name ? (
        <Loading />
      ) : (
        <div className=" flex flex-col h-full w-full px-6 pb-2 pt-2 gap-3 overflow-hidden ">
          <div className="flex flex-row pt-4 pb-5 items-center justify-between">
            <div className="flex flex-col items-start">
              <div className="flex gap-1 items-center">
                <p className="text-secondary text-[16px] font-bold">
                  {ploList.name}
                </p>
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
                    <div className="text-default text-[13px] p-2 flex flex-col gap-2">
                      <div className="flex gap-2">
                        <p className="text-secondary font-semibold">
                          Active in:
                        </p>
                        <p className=" font-medium">
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
                  <IconInfoCircle size={16} className="-ml-0 text-secondary" />
                </Tooltip>
              </div>

              <p className="text-tertiary text-[14px] font-medium">
                {ploList.criteriaTH} / {ploList.criteriaEN}
              </p>
            </div>
          </div>
          <Tabs
            classNames={{
              root: "overflow-hidden flex flex-col h-full",
              tab: "px-0 pt-0 !bg-transparent hover:!text-tertiary",
              tabLabel: "!font-semibold",
            }}
            defaultValue="plodescription"
          >
            <Tabs.List className="!gap-6 !bg-transparent">
              <Tabs.Tab value="plodescription">PLO Description</Tabs.Tab>
              <Tabs.Tab className="overflow-hidden" value="plomapping">
                PLO Mapping
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel
              value="plodescription"
              className="overflow-hidden flex h-full mt-3"
            >
              <div className=" overflow-hidden  bg-[#ffffff] flex flex-col h-full w-full  ">
                <div className="flex items-center  justify-between  pt-2 pb-5">
                  <div className="flex flex-col items-start ">
                    <div className="flex items-center text-primary gap-1">
                      <p className="text-secondary text-[16px] font-bold">
                        PLO Description
                      </p>
                    </div>
                    <div className="text-[12px] font-medium">
                      {ploList.data?.length} PLOs
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
<div className=" overflow-y-auto max-h-full">
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
                    {(provided, snapshot) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {state.map((item, index) => (
                          <Draggable
                            key={item.no}
                            index={index}
                            draggableId={item.no.toString()}
                          >
                            {(provided, snapshot) => (
                              <div
                                className={`flex p-4 w-full justify-between first:-mt-2 border-b last:border-none ${
                                  snapshot.isDragging
                                    ? "bg-hover rounded-md"
                                    : ""
                                }`}
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
                                  {isFirstSemester && (
                                    <>
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
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext></div>
              </div>
            </Tabs.Panel>

            <Tabs.Panel className="overflow-hidden mt-1" value="plomapping">
              <div className=" overflow-hidden  bg-[#ffffff] flex flex-col h-full w-full p">
                <div className="flex items-center  justify-between pt-4 pb-5">
                  <div className="flex flex-col items-start ">
                    <p className="text-secondary text-[16px] font-bold">
                      PLO Mapping
                    </p>
                    <div className="text-[12px] font-medium">
                      {totalCourse} Courses
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {!isMapPLO ? (
                      <div className="flex gap-5">
                        <SearchInput onSearch={searchCourse} />

                        <div className="rounded-full hover:bg-gray-300 p-1 cursor-pointer">
                          <Menu
                            trigger="click"
                            position="bottom-end"
                            offset={6}
                          >
                            <Menu.Target>
                              <IconDots />
                            </Menu.Target>
                            <Menu.Dropdown
                              className="rounded-md translate-y-1 backdrop-blur-xl bg-white "
                              style={{
                                boxShadow:
                                  "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                              }}
                            >
                              <>
                                <Menu.Item
                                  className="text-[#3e3e3e] font-semibold text-[12px] h-7 w-[180px]"
                                  onClick={() => setOpenModalAddCourse(true)}
                                >
                                  <div className="flex items-center gap-2">
                                    <IconPlus
                                      className="h-5 w-5 -mr-1"
                                      stroke={1.5}
                                    />
                                    <span>Add Course</span>
                                  </div>
                                </Menu.Item>
                                <Menu.Item
                                  className="text-[#3e3e3e] font-semibold text-[12px] h-7 w-[180px]"
                                  onClick={() => {
                                    setIsMapPLO(true);
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    <IconEdit className="size-4" stroke={1.5} />
                                    <span>Mapping</span>
                                  </div>
                                </Menu.Item>
                              </>
                            </Menu.Dropdown>
                          </Menu>
                        </div>
                      </div>
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
                  className="overflow-y-auto overflow-x-auto w-full h-fit max-h-full border flex flex-col rounded-lg border-secondary"
                  style={{ height: "fit-content" }}
                  loader={<Loading />}
                >
                  <Table stickyHeader striped>
                    <Table.Thead>
                      <Table.Tr className="bg-[#e5e7f6]">
                        <Table.Th>Course No.</Table.Th>
                        {ploList.data?.map((plo, index) => (
                          <Table.Th key={index}>PLO-{plo.no}</Table.Th>
                        ))}
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {/* {!loading && !courseManagement.length ? (
                        <div className="flex flex-col w-full items-center justify-center">
                          No Course Found
                        </div>
                      ) : ( */}
                      {courseManagement.map((course, index) => (
                        <Table.Tr key={index}>
                          <Table.Td className="py-4 text-b3 font-semibold pl-5">
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
                      {/* )} */}
                    </Table.Tbody>
                  </Table>
                </InfiniteScroll>
              </div>
            </Tabs.Panel>
          </Tabs>
        </div>
      )}
    </>
  );
}
