import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Group,
  Modal,
  Radio,
  RadioCard,
  Stepper,
  Textarea,
  TextInput,
} from "@mantine/core";
import Icon from "../Icon";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import IconCircleFilled from "@/assets/icons/circleFilled.svg?react";
import IconHome from "@/assets/icons/home.svg?react";
import IconGripVertical from "@/assets/icons/verticalGrip.svg?react";
import IconArrowRight from "@/assets/icons/arrowRight.svg?react";
import IconTrash from "@/assets/icons/trash.svg?react";
import IconSO from "@/assets/icons/SO.svg?react";
import { IModelPLO, IModelPLONo } from "@/models/ModelPLO";
import { getDepartment } from "@/services/faculty/faculty.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { sortData } from "@/helpers/functions/function";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { useListState } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { isEmpty, isEqual } from "lodash";
import { NOTI_TYPE, ROLE } from "@/helpers/constants/enum";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { validateTextInput } from "@/helpers/functions/validation";
import { checkCanCreatePLO, createPLO } from "@/services/plo/plo.service";
import { IModelDepartment } from "@/models/ModelFaculty";
import { setLoadingOverlay } from "@/store/loading";

type Props = {
  opened: boolean;
  onOpen: () => void;
  onClose: () => void;
  collection: Partial<IModelPLO>;
  fetchPLO: () => void;
};

export default function ModalAddPLOCollection({
  opened,
  onOpen,
  onClose,
  collection,
  fetchPLO,
}: Props) {
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const dispatch = useAppDispatch();
  const [active, setActive] = useState(0);
  const [department, setDepartment] = useState<Partial<IModelDepartment>[]>([]);
  const [state, handlers] = useListState<Partial<IModelPLONo>>([]);
  const [reorder, setReorder] = useState(false);
  const [firstInput, setFirstInput] = useState(false);
  const [openModalSelectSemester, setOpenModalSelectSemester] = useState(false);
  const [semesterOption, setSemesterOption] = useState<any[]>([]);
  const [selectSemester, setSelectSemester] = useState("");

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      departmentCode: [],
      data: [{ descTH: "", descEN: "" }] as Partial<IModelPLONo[]>,
    } as Partial<IModelPLO>,
    validate: {
      name: (value) =>
        validateTextInput(value, "PLO Collection Name", 70, false),
      criteriaTH: (value) =>
        validateTextInput(value, "Criteria Thai language", 105, false),
      criteriaEN: (value) =>
        validateTextInput(value, "Criteria English language", 70, false),
      departmentCode: (value) =>
        !value?.length && "Select department at least one",
    },
    validateInputOnBlur: true,
  });

  const formOnePLONo = useForm({
    mode: "controlled",
    initialValues: { no: 1, descTH: "", descEN: "" },
    validate: {
      descTH: (value) => {
        if (!value) return `PLO Thai language is required`;
        else if (!value.trim().length) return "Cannot have only spaces";
      },
      descEN: (value) => {
        if (!value) return `PLO English language is required`;
        else if (!value.trim().length) return "Cannot have only spaces";
      },
    },
    validateInputOnBlur: true,
  });

  const nextStep = async () => {
    dispatch(setLoadingOverlay(true));
    setFirstInput(false);
    let isValid = true;
    switch (active) {
      case 0:
        form.validateField("criteriaTH");
        form.validateField("criteriaEN");
        isValid =
          isValid &&
          !form.validateField("name").hasError &&
          !form.validateField("criteriaTH").hasError &&
          !form.validateField("criteriaEN").hasError;
        if (isValid) {
          const res = await checkCanCreatePLO(form.getValues().name!);
          if (!res) isValid = false;
        }
        formOnePLONo.clearErrors();
        break;
      case 1:
        isValid = form.getValues().data?.length! > 1;
        if (!isValid) {
          setFirstInput(true);
          showNotifications(
            NOTI_TYPE.ERROR,
            "Invalid PLO No.",
            "Please add PLO No. at least one"
          );
          formOnePLONo.validate();
        }
        if (
          formOnePLONo.getValues().descTH.length ||
          formOnePLONo.getValues().descEN.length
        ) {
          if (formOnePLONo.validate().hasErrors) {
            isValid = false;
          }
          onClickAddAnother();
        }
        break;
      case 2:
        form.validateField("departmentCode");
        isValid = form.getValues().departmentCode?.length! > 0;
    }
    if (isValid) {
      setActive((cur) => (cur < 3 ? cur + 1 : cur));
      setFirstInput(true);
      if (active == 3) {
        setOpenModalSelectSemester(true);
        onClose();
      }
    }
    dispatch(setLoadingOverlay(false));
  };
  const prevStep = () => setActive((cur) => (cur > 0 ? cur - 1 : cur));
  const closeModal = () => {
    setOpenModalSelectSemester(false);
    setSelectSemester("");
    setActive(0);
    handlers.setState([]);
    form.reset();
    formOnePLONo.reset();
    onClose();
  };

  const fetchDep = async () => {
    const res = await getDepartment(user.facultyCode);
    if (res) {
      sortData(res.department, "codeEN", "string");
      if (user.role === ROLE.SUPREME_ADMIN) {
        setDepartment([
          {
            departmentEN: res.facultyEN,
            codeEN: res.codeEN,
            courseCode: res.courseCode,
          },
          ...res.department,
        ]);
      } else {
        const dep = res.department.filter((e) =>
          user.departmentCode.includes(e.codeEN)
        );
        setDepartment([
          {
            departmentEN: res.facultyEN,
            codeEN: res.codeEN,
            courseCode: res.courseCode,
          },
          ...dep,
        ]);
      }
    }
  };

  useEffect(() => {
    if (opened && !form.getValues().name?.length) {
      fetchDep();
      if (!isEmpty(collection)) {
        formOnePLONo.setFieldValue("no", collection.data?.length! + 1);
        form.setValues(collection);
        form.setFieldValue("name", "");
        handlers.setState(collection.data!);
      }
      if (academicYear) {
        const option: any[] = [];
        for (let i = 0; i < 3; i++) {
          let semester =
            (i > 0 ? option[i - 1].semester : academicYear.semester) + 1;
          let year = i > 0 ? option[i - 1].year : academicYear.year;
          if (semester > 3) {
            year += Math.floor((semester - 1) / 3);
            semester = semester % 3 || 3;
          }
          option.push({
            label: `${semester}/${year}`,
            semester,
            year,
          });
          setSemesterOption(option);
        }
      }
    }
  }, [opened]);

  useEffect(() => {
    if (state) {
      const plo: any[] = state;
      plo?.forEach((e, index) => {
        e.no = index + 1;
      });
      handlers.setState(plo!);
      form.setFieldValue("data", [...plo]);
      setReorder(false);
    }
  }, [reorder]);

  const onClickAddAnother = () => {
    if (!formOnePLONo.validate().hasErrors) {
      form.insertListItem("data", formOnePLONo.getValues());
      formOnePLONo.reset();
      const ploNo = form.getValues().data?.length!;
      formOnePLONo.setFieldValue("no", ploNo);
      handlers.setState(form.getValues().data!);
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Add successfully",
        `PLO-${ploNo} is added`
      );
    }
  };

  const setDepartmentCode = (checked: boolean, value?: string[]) => {
    let departmentCode = form.getValues().departmentCode;
    if (value) {
      departmentCode = value.sort();
    } else if (checked) {
      departmentCode = department.map((dep) => dep.codeEN!);
    } else {
      departmentCode = [];
    }
    form.setFieldValue("departmentCode", departmentCode);
  };

  const addPLOCollection = async () => {
    const term = semesterOption.find(
      (option) => option.label == selectSemester
    );
    const payload = {
      ...form.getValues(),
      facultyCode: user.facultyCode,
      semester: term.semester,
      year: term.year,
      data: form.getValues().data,
    };
    const res = await createPLO(payload);
    if (res) {
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Add successfully",
        `${payload.name} is added`
      );
      closeModal();
      fetchPLO();
    }
  };

  return (
    <>
      <Modal
        title={
          <div className="flex flex-col gap-1">
            <p>Select semester</p>
          </div>
        }
        closeOnClickOutside={false}
        opened={openModalSelectSemester}
        onClose={closeModal}
        transitionProps={{ transition: "pop" }}
        size="39vw"
        centered
        classNames={{
          content: "flex flex-col overflow-hidden pb-2  max-h-full h-fit",
          body: "flex flex-col overflow-hidden max-h-full h-fit",
        }}
      >
        <div className="flex flex-col gap-5 pt-1 w-full">
          <Alert
            radius="md"
            variant="light"
            color="blue"
            classNames={{
              body: " flex justify-center",
            }}
            title={
              <div className="flex items-center  gap-2">
                <Icon IconComponent={IconInfo2} />
                <p>
                  Select semester you would like to begin using the PLO
                  Collection.
                </p>
              </div>
            }
          ></Alert>
          <Radio.Group
            value={selectSemester}
            onChange={(event) => setSelectSemester(event)}
          >
            <Group className="overflow-y-hidden max-h-[200px]">
              <div className="flex p-1 w-full h-full flex-col overflow-y-auto gap-3">
                {semesterOption.map((e, index) => (
                  <RadioCard
                    key={index}
                    value={e.label}
                    style={{
                      boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                    }}
                    className="p-3 flex border-none h-full rounded-md w-full"
                  >
                    <Group>
                      <Radio.Indicator />
                      <div className="text-b2 font-medium ">{e.label}</div>
                    </Group>
                  </RadioCard>
                ))}
              </div>
            </Group>
          </Radio.Group>

          <div className="flex  justify-end w-full">
            <Group className="flex w-full h-fit items-end justify-between">
              <div>
                <Button
                  variant="subtle"
                  onClick={() => {
                    onOpen();
                    setOpenModalSelectSemester(false);
                  }}
                >
                  Back
                </Button>
              </div>
              <Button
                disabled={isEmpty(selectSemester)}
                onClick={addPLOCollection}
              >
                Done
              </Button>
            </Group>
          </div>
        </div>
      </Modal>
      <Modal
        opened={opened}
        onClose={openModalSelectSemester ? onClose : closeModal}
        closeOnClickOutside={false}
        title="Add PLO Collection"
        size={
          active === 1 && form.getValues().data?.length! > 1
            ? "100vw"
            : active === 3
            ? "55vw"
            : "45vw"
        }
        centered
        transitionProps={{ transition: "pop" }}
        classNames={{
          content:
            "flex flex-col justify-center bg-[#F6F7FA] item-center overflow-hidden max-w-[70vw] ",
        }}
      >
        <Stepper
          active={active}
          color="#6869AD"
          onStepClick={setActive}
          allowNextStepsSelect={false}
          icon={<Icon IconComponent={IconCircleFilled} />}
          classNames={{
            separator: `text-primary mb-12 h-[3px] `,
            step: "flex flex-col  items-start  w-[42px] ",
            stepIcon: "mb-2 text-[#E6E6FF] bg-[#E6E6FF] border-[#E6E6FF]",
            stepBody: "flex-col-reverse m-0 text-nowrap",
            stepLabel: "text-[13px] font-semibold",
            stepDescription: "text-[13px] font-semibold ",
          }}
          className=" justify-center items-center mt-1  text-[14px] max-h-full"
        >
          <Stepper.Step
            allowStepSelect={false}
            label="PLO Info"
            description="STEP 1"
          >
            <div className="flex flex-col gap-3 mt-3">
              <div className=" border-b border-gray">
                <TextInput
                  size="xs"
                  withAsterisk={true}
                  label="PLO Collection Name"
                  className="w-full border-none pb-5"
                  classNames={{
                    input: "flex p-3",
                    label: "flex pb-1 gap-1",
                  }}
                  placeholder="Ex. PLO 1/67"
                  {...form.getInputProps("name")}
                />
              </div>
              <TextInput
                size="xs"
                withAsterisk={true}
                label={
                  <p className="font-semibold flex gap-1">
                    Criteria <span className="text-secondary">Thai</span>
                  </p>
                }
                className="w-full border-none "
                classNames={{
                  input: "flex p-3",
                  label: "flex pb-1 gap-1",
                }}
                placeholder="Ex. เกณฑ์ของ ABET"
                {...form.getInputProps("criteriaTH")}
              />
              <TextInput
                size="xs"
                withAsterisk={true}
                label={
                  <p className="flex gap-1">
                    Criteria <span className="text-secondary">English</span>
                  </p>
                }
                className="w-full border-none "
                classNames={{
                  input: "flex p-3",
                  label: "flex pb-1 gap-1",
                }}
                placeholder="Ex. ABET Criteria"
                {...form.getInputProps("criteriaEN")}
              />
            </div>
          </Stepper.Step>
          <Stepper.Step
            allowStepSelect={false}
            label="Add PLO"
            description="STEP 2"
          >
            <div className="flex gap-3 overflow-hidden sm:max-macair133:h-full p-[2px] macair133:h-[440px] mt-3 ">
              <div
                className={`flex flex-col overflow-y-auto macair133:h-full  sm:h-[320px] ipad11:h-[360px]  gap-3 p-5 rounded-lg h-full ${
                  state.length ? "w-[50%]" : "w-full"
                } overflow-hidden relative`}
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
              >
                <Textarea
                  withAsterisk={true}
                  autoFocus={false}
                  label={
                    <p className="font-semibold flex gap-1 h-full">
                      PLO <span className="text-secondary">Thai</span>
                    </p>
                  }
                  className="w-full border-none   rounded-r-none "
                  classNames={{
                    input:
                      "flex macair133:h-[120px] sm:h-[75px] ipad11:h-[95px] p-3 ",
                    label: "flex pb-1 gap-1",
                  }}
                  placeholder="Ex. ความสามารถในการแก้ปัญหาทางวิศวกรรม"
                  {...formOnePLONo.getInputProps("descTH")}
                />
                <Textarea
                  autoFocus={false}
                  withAsterisk={true}
                  label={
                    <p className="font-semibold flex gap-1">
                      PLO <span className="text-secondary">English</span>
                    </p>
                  }
                  className="w-full border-none rounded-r-none"
                  classNames={{
                    input:
                      "flex macair133:h-[120px] sm:h-[75px] ipad11:h-[95px] p-3",
                    label: "flex pb-1 gap-1",
                  }}
                  placeholder="Ex. An ability to solve complex engineering problems."
                  {...formOnePLONo.getInputProps("descEN")}
                />
              </div>
              {form.getValues().data?.length! > 1 && (
                <div
                  className="flex flex-col bg-white border-secondary border-[1px] macair133:h-full sm:h-[320px] ipad11:h-[360px] rounded-md w-[50%] h-full"
                  style={{
                    boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                    overflowY: "auto",
                  }}
                >
                  <div className="sticky top-0 z-10 bg-bgTableHeader flex items-center justify-between border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold ">
                    <div className="flex items-center gap-2">
                      <Icon IconComponent={IconSO} />
                      <span>List PLO Added</span>
                    </div>
                    <p>
                      {state.length} PLO{state.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex flex-col w-full h-fit pl-2">
                    <DragDropContext
                      onDragEnd={({ destination, source }) => {
                        if (destination) {
                          handlers.reorder({
                            from: source.index,
                            to: destination.index,
                          });
                          setReorder(true);
                        }
                      }}
                    >
                      <Droppable droppableId="dnd-list" direction="vertical">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {state.map((item, index) => (
                              <Draggable
                                key={index}
                                index={index}
                                draggableId={index.toString()}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    className={`py-3 w-full border-b-[1px] px-3 ${
                                      state.length > 1
                                        ? "last:border-none last:pb-5"
                                        : ""
                                    } ${
                                      snapshot.isDragging
                                        ? "bg-hover rounded-md"
                                        : ""
                                    }`}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                  >
                                    <div className="flex flex-col gap-1 w-full">
                                      <div className="flex items-center justify-between">
                                        <p className="text-secondary font-semibold text-[14px]">
                                          PLO-{item.no}
                                        </p>
                                        <div className="flex gap-1 ">
                                          <div
                                            className="flex items-center justify-center border-[#FF4747] size-8 rounded-full hover:bg-[#FF4747]/10 cursor-pointer"
                                            onClick={() => {
                                              handlers.remove(index);
                                              form.removeListItem(
                                                "data",
                                                index
                                              );
                                              setReorder(true);
                                            }}
                                          >
                                            <Icon
                                              IconComponent={IconTrash}
                                              className="size-4 stroke-[2px] stroke-[#ff4747] flex items-center"
                                            />
                                          </div>

                                          <div
                                            className="cursor-pointer hover:bg-hover  text-tertiary size-8 rounded-full flex items-center justify-center"
                                            {...provided.dragHandleProps}
                                          >
                                            <Icon
                                              IconComponent={IconGripVertical}
                                              className="stroke-[2px] size-5"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="text-tertiary text-[13px] font-medium flex flex-col gap-3">
                                        <div className="flex text-pretty">
                                          <li></li> {item.descTH}
                                        </div>
                                        <div className="flex text-pretty">
                                          <li></li> {item.descEN}
                                        </div>
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
                </div>
              )}
            </div>
          </Stepper.Step>
          <Stepper.Step
            allowStepSelect={false}
            label="Map Department"
            description="STEP 3"
          >
            <div className="mt-3 flex flex-col">
              <Alert
                radius="md"
                icon={<Icon IconComponent={IconInfo2} />}
                variant="light"
                color="blue"
                className="mb-5"
                classNames={{
                  icon: "size-6",
                  body: " flex justify-center",
                }}
                title={
                  <p>
                    Select the department you would like to use for the PLO
                    collection.
                  </p>
                }
              ></Alert>
              <div
                className="w-full  flex flex-col bg-white border-secondary border-[1px] rounded-md overflow-clip"
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="bg-bgTableHeader flex items-center justify-between rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold">
                  <div className="flex items-center gap-2">
                    <Icon
                      IconComponent={IconHome}
                      className="text-secondary size-5"
                    />

                    <span>List of Departments</span>
                  </div>
                  <p>
                    {department.length} Department
                    {department.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex flex-col w-full macair133:h-[290px] h-[200px] ipad11:h-[220px] sm:h-[170px] px-3 overflow-y-auto">
                  <Checkbox
                    size="xs"
                    className="p-3 py-5  w-full last:border-none border-b-[1px]"
                    classNames={{
                      label: "ml-2 font-medium  text-[13px]",
                      input: "cursor-pointer",
                    }}
                    label="All"
                    checked={isEqual(
                      form.getValues().departmentCode,
                      department.map((dep) => dep.codeEN)
                    )}
                    onChange={(event) => {
                      setDepartmentCode(event.target.checked);
                    }}
                  />
                  <Checkbox.Group
                    value={form.getValues().departmentCode}
                    onChange={(event) => {
                      setDepartmentCode(false, event);
                    }}
                  >
                    <Group className="gap-0">
                      {department.map((dep, index: number) => (
                        <Checkbox
                          size="xs"
                          key={index}
                          value={dep.codeEN}
                          className="p-3 py-4  w-full last:border-none border-b-[1px] "
                          classNames={{
                            label: "ml-2 text-[13px] font-medium",
                            input: "cursor-pointer",
                          }}
                          label={`${dep.departmentEN} (${dep.codeEN} - ${dep.courseCode})`}
                        />
                      ))}
                    </Group>
                  </Checkbox.Group>
                </div>
              </div>
              {!firstInput && (
                <div className="text-[#FA5252] text-[12px] mt-2">
                  {form.validateField("departmentCode").error}
                </div>
              )}
            </div>
          </Stepper.Step>
          <Stepper.Step
            allowStepSelect={false}
            label="Review"
            description="STEP 4"
          >
            <div className="flex gap-5 mt-3 sm:max-h-[280px] ipad11:max-h-[340px] macair133:max-h-[440px]">
              <div
                className="w-full  flex flex-col bg-white border-secondary border-[1px] rounded-md overflow-hidden"
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="bg-bgTableHeader flex flex-col items-start justify-start rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold">
                  <div className="flex justify-between w-full">
                    <p>PLO Collection Name - {form.getValues().name}</p>
                    <p>
                      {form.getValues().departmentCode?.length} Department
                      {form.getValues().departmentCode?.length! > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="text-b3 flex gap-1">
                    <p className="text-nowrap">Criteria TH:</p>
                    <p className="text-[#444444] font-medium break-all">
                      {form.getValues().criteriaTH}
                    </p>
                  </div>
                  <div className="text-b3 flex gap-1">
                    <p className="text-nowrap">Criteria EN:</p>
                    <p className="text-[#444444] font-medium break-all">
                      {form.getValues().criteriaEN}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 px-5 h-full overflow-y-auto ">
                  <div className="flex flex-col w-full ">
                    {state.map((item, index) => (
                      <div
                        className={`flex  py-4 w-full justify-between  border-b  ${
                          state?.length! > 1 ? "last:border-none" : ""
                        }`}
                      >
                        <div className="flex flex-col gap-2 w-full ">
                          <div className="flex items-center justify-between">
                            <p className="text-secondary font-semibold text-[14px]">
                              PLO-{item.no}
                            </p>
                          </div>

                          <div className="text-tertiary text-[13px] font-medium flex flex-col gap-1">
                            <div className="flex  text-pretty ">
                              <li></li> {item.descTH}
                            </div>
                            <div className="flex  text-pretty">
                              <li></li> {item.descEN}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Stepper.Step>
        </Stepper>
        {active >= 0 && (
          <Group className="flex w-full h-fit items-end justify-between mt-7">
            <div>
              {active > 0 && (
                <Button variant="subtle" onClick={prevStep}>
                  Back
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              {active === 1 && (
                <Button
                  variant="subtle"
                  disabled={form.getValues().data?.length === 0}
                  onClick={onClickAddAnother}
                >
                  Add more PLO
                </Button>
              )}

              <Button
                loading={loading}
                onClick={() => {
                  nextStep();
                }}
                rightSection={
                  active != 4 && (
                    <Icon
                      IconComponent={IconArrowRight}
                      className=" stroke-[2px] size-5"
                    />
                  )
                }
              >
                {active == 3 ? "Select semester" : "Next step"}
              </Button>
            </div>
          </Group>
        )}
      </Modal>
    </>
  );
}
