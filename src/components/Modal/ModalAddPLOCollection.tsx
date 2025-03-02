import { useEffect, useState } from "react";
import {
  Button,
  Group,
  Modal,
  Stepper,
  Textarea,
  TextInput,
  Tooltip,
  Kbd,
} from "@mantine/core";
import Icon from "../Icon";
import IconCircleFilled from "@/assets/icons/circleFilled.svg?react";
import IconGripVertical from "@/assets/icons/verticalGrip.svg?react";
import IconArrowRight from "@/assets/icons/arrowRight.svg?react";
import IconTrash from "@/assets/icons/trash.svg?react";
import IconSO from "@/assets/icons/SO.svg?react";
import { IModelPLO, IModelPLONo } from "@/models/ModelPLO";
import { useAppDispatch, useAppSelector } from "@/store";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { useListState } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { isEmpty } from "lodash";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { validateTextInput } from "@/helpers/functions/validation";
import { checkCanCreatePLO, createPLO } from "@/services/plo/plo.service";
import { setLoadingOverlay } from "@/store/loading";
import { useHotkeys } from "react-hotkeys-hook";

type Props = {
  opened: boolean;
  onClose: () => void;
  collection: Partial<IModelPLO>;
  fetchPLO: () => void;
};

export default function ModalAddPLOCollection({
  opened,
  onClose,
  collection,
  fetchPLO,
}: Props) {
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [active, setActive] = useState(0);
  const [state, handlers] = useListState<Partial<IModelPLONo>>([]);
  const [reorder, setReorder] = useState(false);
  const [firstInput, setFirstInput] = useState(false);
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      curriculum: [],
      data: [] as Partial<IModelPLONo[]>,
    } as Partial<IModelPLO>,
    validate: {
      name: (value) =>
        validateTextInput(value, "PLO Collection Name", 70, false),
      criteriaTH: (value) =>
        validateTextInput(value, "Criteria Thai language", 105, false),
      criteriaEN: (value) =>
        validateTextInput(value, "Criteria English language", 70, false),
      curriculum: (value) => !value?.length && "Select curriculum at least one",
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
        isValid = form.getValues().data?.length! > 0;
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
        form.validateField("curriculum");
        isValid = form.getValues().curriculum?.length! > 0;
    }
    if (isValid) {
      setActive((cur) => (cur < 3 ? cur + 1 : cur));
      setFirstInput(true);
      if (active == 3) {
        onClose();
      }
    }
    dispatch(setLoadingOverlay(false));
  };
  const prevStep = () => setActive((cur) => (cur > 0 ? cur - 1 : cur));
  const closeModal = () => {
    setActive(0);
    handlers.setState([]);
    form.reset();
    formOnePLONo.reset();
    onClose();
  };

  useEffect(() => {
    if (opened && !form.getValues().name?.length) {
      if (!isEmpty(collection)) {
        formOnePLONo.setFieldValue("no", collection.data?.length! + 1);
        form.setValues(collection);
        form.setFieldValue("name", "");
        handlers.setState(collection.data!);
      } else {
        formOnePLONo.reset();
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
      const ploNo = form.getValues().data?.length! + 1;
      formOnePLONo.setFieldValue("no", ploNo);
      handlers.setState(form.getValues().data!);
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "PLO added successfully",
        `PLO-${ploNo} is added`
      );
    }
  };

  useHotkeys(
    "ctrl+enter, meta+enter",
    () => {
      onClickAddAnother();
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
    }
  );

  const addPLOCollection = async () => {
    const payload = {
      ...form.getValues(),
      facultyCode: user.facultyCode,
      data: form.getValues().data,
    };
    const res = await createPLO(payload);
    if (res) {
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "PLO Collection added successfully",
        `${payload.name} is added`
      );
      closeModal();
      fetchPLO();
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={closeModal}
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
                  placeholder="PLO 1/67"
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
                placeholder="เกณฑ์ของ ABET"
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
                placeholder="ABET Criteria"
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
                  placeholder="ความสามารถในการแก้ปัญหาทางวิศวกรรม"
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
                  placeholder="An ability to solve complex engineering problems."
                  {...formOnePLONo.getInputProps("descEN")}
                />
              </div>
              {form.getValues().data?.length! > 0 && (
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
            label="Review"
            description="STEP 3"
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
                  </div>

                  <div className="text-b4 flex gap-1">
                    <p className="text-nowrap">Criteria TH:</p>
                    <p className="text-[#444444] font-medium break-all">
                      {form.getValues().criteriaTH}
                    </p>
                  </div>
                  <div className="text-b4 flex gap-1">
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
                        key={index}
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
                <Tooltip
                  arrowOffset={20}
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
                      <Kbd className=" text-secondary">
                        {isMac ? "⌘" : "Ctrl"}
                      </Kbd>{" "}
                      + <Kbd className=" text-secondary">Enter</Kbd>
                    </div>
                  }
                  color="#FCFCFC"
                  className="w-fit border  rounded-md "
                  position="top"
                >
                  <Button variant="subtle" onClick={onClickAddAnother}>
                    Add more PLO
                  </Button>
                </Tooltip>
              )}

              <Button
                loading={loading}
                onClick={active == 2 ? addPLOCollection : nextStep}
                rightSection={
                  active != 2 && (
                    <Icon
                      IconComponent={IconArrowRight}
                      className=" stroke-[2px] size-5"
                    />
                  )
                }
              >
                {active == 2 ? "Done" : "Next step"}
              </Button>
            </div>
          </Group>
        )}
      </Modal>
    </>
  );
}
