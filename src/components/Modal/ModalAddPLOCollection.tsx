import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Group,
  Modal,
  Radio,
  RadioCard,
  rem,
  Stepper,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  IconArrowRight,
  IconCircleFilled,
  IconHome2,
  IconInfoCircle,
  IconTrash,
  IconGripVertical,
} from "@tabler/icons-react";
import { IModelPLO, IModelPLONo } from "@/models/ModelPLO";
import { getDepartment } from "@/services/faculty/faculty.service";
import { useAppSelector } from "@/store";
import { showNotifications, sortData } from "@/helpers/functions/function";
import Icon from "../Icon";
import IconSO from "@/assets/icons/SO.svg?react";
import { useListState } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { isEmpty, isEqual } from "lodash";
import { NOTI_TYPE, ROLE } from "@/helpers/constants/enum";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { validateCourseNameorTopic } from "@/helpers/functions/validation";
import { checkCanCreatePLO, createPLO } from "@/services/plo/plo.service";

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
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [department, setDepartment] = useState<any>([]);
  const [ploNo, setPloNo] = useState(0);
  const [state, handlers] = useListState<Partial<IModelPLONo>>([]);
  const [reorder, setReorder] = useState(false);
  const [firstInput, setFirstInput] = useState(false);
  const [isAddAnother, setIsAddAnother] = useState(false);
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
      name: (value) => {
        if (!value) return `PLO Collection Name is required`;
        if (!value.trim().length) return "Cannot have only spaces";
        const maxLength = 70;
        if (value.length > maxLength)
          return `You have ${value.length - maxLength} characters too many`;
      },
      criteriaTH: (value) => {
        if (!value) return `Criteria Thai language is required`;
        if (!value.trim().length) return "Cannot have only spaces";
        const maxLength = 105;
        if (value.length > maxLength)
          return `You have ${value.length - maxLength} characters too many`;
      },
      criteriaEN: (value) => {
        return validateCourseNameorTopic(value, "Criteria English language");
      },

      departmentCode: (value) => {
        return !value?.length && "Select department at least one";
      },
      data: {
        descTH: (value) => {
          if (form.getValues().data?.length! > 1 && firstInput && !isAddAnother)
            return false;
          if (!value && (isAddAnother || firstInput))
            return `PLO Thai language is required`;
        },
        descEN: (value) => {
          if (form.getValues().data?.length! > 1 && firstInput && !isAddAnother)
            return false;
          if (!value && (isAddAnother || firstInput))
            return `PLO English language is required`;
        },
      },
    },
    validateInputOnBlur: true,
  });

  const nextStep = async () => {
    setLoading(true);
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
        form.clearFieldError(`data.${ploNo}.descTH`);
        form.clearFieldError(`data.${ploNo}.descEN`);
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
          form.validateField(`data.${ploNo}.descTH`);
          form.validateField(`data.${ploNo}.descEN`);
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
    setLoading(false);
  };
  const prevStep = () => setActive((cur) => (cur > 0 ? cur - 1 : cur));
  const closeModal = () => {
    setOpenModalSelectSemester(false);
    setSelectSemester("");
    setActive(0);
    setPloNo(0);
    handlers.setState([]);
    form.reset();
    onClose();
  };

  const fetchDep = async () => {
    const res = await getDepartment(user.facultyCode);
    if (res) {
      sortData(res.department, "departmentCode", "string");
      if (user.role === ROLE.SUPREME_ADMIN) {
        setDepartment(res.department);
      } else {
        const dep = res.department.filter((e: any) =>
          user.departmentCode.includes(e.departmentCode)
        );
        setDepartment(dep);
      }
    }
  };

  useEffect(() => {
    if (opened) {
      fetchDep();
      if (!isEmpty(collection)) {
        setPloNo(collection.data?.length!);
        form.setValues(collection);
        form.setFieldValue("name", "");
        form.insertListItem("data", {
          descTH: "",
          descEN: "",
        });
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
  }, [opened, academicYear]);

  useEffect(() => {
    if (state) {
      const plo: any[] = state;
      plo?.forEach((e, index) => {
        e.no = index + 1;
      });
      handlers.setState(plo!);
      form.setFieldValue("data", [...plo, { descTH: "", descEN: "" }]);
      setReorder(false);
    }
  }, [reorder]);

  useEffect(() => {
    if (isAddAnother) {
      form.validateField(`data.${ploNo}.descTH`);
      form.validateField(`data.${ploNo}.descEN`);
      if (
        !form.validateField(`data.${ploNo}.descTH`).hasError &&
        !form.validateField(`data.${ploNo}.descEN`).hasError
      ) {
        form.setFieldValue(`data.${ploNo}.no`, ploNo + 1);
        form.insertListItem("data", {
          descTH: "",
          descEN: "",
        });
        setPloNo(ploNo + 1);
        handlers.setState(form.getValues().data?.filter((e) => e.no)!);
        showNotifications(
          NOTI_TYPE.SUCCESS,
          "Add success",
          `PLO-${ploNo + 1} is added`
        );
      }
      setIsAddAnother(false);
    }
  }, [isAddAnother]);

  const setDepartmentCode = (checked: boolean, value?: string[]) => {
    let departmentCode = form.getValues().departmentCode;
    if (value) {
      departmentCode = value.sort();
    } else if (checked) {
      departmentCode = department.map((dep: any) => dep.departmentCode);
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
      data: form.getValues().data?.filter((plo) => plo.no),
    };
    const res = await createPLO(payload);
    if (res) {
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Add success",
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
        withCloseButton={false}
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
                <IconInfoCircle />
                <p>
                  Select semester you would like to begin using the PLO Collection.
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
                  color="#575757"
                  variant="subtle"
                  className="rounded-[8px] text-[12px] h-[32px] w-fit "
                  justify="start"
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
                className="rounded-[8px] border-none text-[12px] h-[32px] w-fit"
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
            ? "65vw"
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
          icon={<IconCircleFilled />}
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
                    Criteria{" "}
                    <span className="text-secondary">Thai language</span>
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
                  <p className=" flex gap-1">
                    Criteria{" "}
                    <span className="text-secondary">English language</span>
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
            <div className="flex gap-3 h-[440px] mt-3 ">
              <div
                className={`flex flex-col  gap-3 p-5 rounded-lg h-full ${
                  state.length ? "w-[40%]" : "w-full"
                } overflow-hidden relative`}
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
              >
                <Textarea
                  withAsterisk={true}
                  autoFocus={false}
                  label={
                    <p className="font-semibold flex gap-1 h-full ">
                      PLO <span className="text-secondary">Thai language</span>
                    </p>
                  }
                  className="w-full border-none   rounded-r-none "
                  classNames={{
                    input: "flex  h-[125px] p-3 ",
                    label: "flex pb-1",
                  }}
                  placeholder="Ex. ความสามารถในการแก้ปัญหาทางวิศวกรรม"
                  {...form.getInputProps(`data.${ploNo}.descTH`)}
                  value={form.getValues().data?.at(ploNo)?.descTH ?? undefined}
                  onChange={(event) => {
                    form.setFieldValue(
                      `data.${ploNo}.descTH`,
                      event.target.value
                    );
                  }}
                />
                <Textarea
                  autoFocus={false}
                  withAsterisk={true}
                  label={
                    <p className="font-semibold flex gap-1">
                      PLO{" "}
                      <span className="text-secondary">English language</span>
                    </p>
                  }
                  className="w-full border-none rounded-r-none"
                  classNames={{
                    input: "flex h-[125px] p-3",
                    label: "flex pb-1",
                  }}
                  placeholder="Ex. An ability to solve complex engineering problems."
                  {...form.getInputProps(`data.${ploNo}.descEN`)}
                  value={form.getValues().data?.at(ploNo)?.descEN ?? undefined}
                  onChange={(event) => {
                    form.setFieldValue(
                      `data.${ploNo}.descEN`,
                      event.target.value
                    );
                  }}
                />

                <div className="flex gap-2 mt-3 w-full justify-end absolute right-5 bottom-5 ">
                  <Button
                    onClick={() => setIsAddAnother(true)}
                    variant="outline"
                    className="rounded-[8px] text-[12px] h-[32px] w-fit "
                  >
                    Add more
                  </Button>
                </div>
              </div>
              {form.getValues().data?.length! > 1 && (
                <div
                  className="flex flex-col bg-white border-secondary border-[1px] rounded-md w-[60%] h-full overflow-y-hidden"
                  style={{
                    boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <div className="bg-[#e6e9ff] flex items-center justify-between border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold ">
                    <div className="flex items-center gap-2">
                      <Icon IconComponent={IconSO} />

                      <span>List PLO Added</span>
                    </div>
                    <p>{state.length} PLOs</p>
                  </div>
                  <div className="flex flex-col w-full overflow-y-auto overflow-x-hidden px-5 pl-7">
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
                            className="w-full"
                          >
                            {state.map((item, index) => (
                              <Draggable
                                key={index}
                                index={index}
                                draggableId={index.toString()}
                              >
                                {(provided) => (
                                  <div
                                    className={`py-3 w-full ${
                                      state?.length! > 1
                                        ? "last:border-none last:pb-5"
                                        : ""
                                    } border-b-[1px]`}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                  >
                                    <div className="flex flex-col gap-2 w-full ">
                                      <div className="flex items-center justify-between">
                                        <p className="text-secondary font-semibold text-[14px]">
                                          PLO-{item.no}
                                        </p>
                                        <div className="flex gap-1 items-center">
                                          <div
                                            className="flex items-center justify-center border-[#FF4747] size-8 rounded-full  hover:bg-[#FF4747]/10  cursor-pointer"
                                            onClick={() => {
                                              handlers.remove(index);
                                              setPloNo(ploNo - 1);
                                              form.removeListItem(
                                                "data",
                                                index
                                              );
                                              setReorder(true);
                                            }}
                                          >
                                            <IconTrash
                                              stroke={1.5}
                                              color="#FF4747"
                                              className=" size-4 flex items-center"
                                            />
                                          </div>

                                          <div
                                            className="cursor-pointer hover:bg-hover  text-tertiary size-8 rounded-full flex items-center justify-center "
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

                                      <div className="text-tertiary text-[13px] font-medium flex flex-col gap-1">
                                        <div className="flex  text-pretty ">
                                          <li></li> {item.descTH}
                                        </div>
                                        <div className="flex  text-pretty ">
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
                icon={<IconInfoCircle />}
                variant="light"
                color="blue"
                className="mb-5"
                classNames={{
                  icon: "size-6",
                  body: " flex justify-center",
                }}
                title={<p>Select the department you would like to use for the PLO collection.</p>}
              ></Alert>
              <div
                className="w-full  flex flex-col bg-white border-secondary border-[1px] rounded-md overflow-clip"
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="bg-[#e6e9ff] flex items-center justify-between rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold">
                  <div className="flex items-center gap-2">
                    <IconHome2 className="text-secondary" size={19} />

                    <span>List of Departments</span>
                  </div>
                  <p>{department.length} departments</p>
                </div>
                <div className="flex flex-col w-full h-[290px] px-3 overflow-y-auto">
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
                      department.map((dep: any) => dep.departmentCode)
                    )}
                    onChange={(event) => {
                      setDepartmentCode(event.target.checked);
                    }}
                  />
                  <Checkbox.Group
                    // {...form.getInputProps("departmentCode")}
                    value={form.getValues().departmentCode}
                    onChange={(event) => {
                      setDepartmentCode(false, event);
                      // form.setFieldValue("departmentCode", event);
                    }}
                  >
                    <Group className="gap-0">
                      {department.map((dep: any, index: any) => (
                        <Checkbox
                          size="xs"
                          key={index}
                          value={dep.departmentCode}
                          className="p-3 py-4  w-full last:border-none border-b-[1px] "
                          classNames={{
                            label: "ml-2 text-[13px] font-medium",
                            input: "cursor-pointer",
                          }}
                          label={`${dep.departmentEN} (${dep.departmentCode})`}
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
            <div className="flex gap-5 mt-3   max-h-[440px]">
              <div
                className="w-full  flex flex-col bg-white border-secondary border-[1px] rounded-md overflow-hidden"
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="bg-[#e6e9ff] flex flex-col items-start justify-start rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold">
                  <div className="flex justify-between w-full">
                    <p>PLO Collection Name - {form.getValues().name}</p>
                    <p>{form.getValues().departmentCode?.length} Departments</p>
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
                        className={`flex  py-4 w-full justify-between  border-b bg-red ${
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
                <Button
                  color="#575757"
                  variant="subtle"
                  className="rounded-[8px] text-[12px] h-[32px] w-fit "
                  justify="start"
                  onClick={prevStep}
                >
                  Back
                </Button>
              )}
            </div>
            <Button
              className="rounded-[8px] text-[12px] h-[32px] w-fit "
              loading={loading}
              onClick={() => {
                nextStep();
              }}
              rightSection={
                active != 4 && <IconArrowRight stroke={2} size={20} />
              }
            >
              {active == 3 ? "Select semester" : "Next step"}
            </Button>
          </Group>
        )}
      </Modal>
    </>
  );
}
