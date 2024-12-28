import { TEACHING_METHOD } from "@/helpers/constants/enum";
import { validateTextInput } from "@/helpers/functions/validation";
import { IModelSchedule, IModelTQF3Part2 } from "@/models/ModelTQF3";
import {
  Button,
  Modal,
  Textarea,
  NumberInput,
  NumberInputHandlers,
  FocusTrapInitialFocus,
  Kbd,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Icon from "@/components/Icon";
import IconTrash from "@/assets/icons/trash.svg?react";
import IconList2 from "@/assets/icons/list2.svg?react";
import IconMinus from "@/assets/icons/minus.svg?react";
import IconPlus2 from "@/assets/icons/plus2.svg?react";
import { upperFirst } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

type actionType = "add" | "edit";

type Props = {
  opened: boolean;
  onClose: () => void;
  type: actionType;
  teachingMethod: string[];
  data: IModelSchedule[] | IModelSchedule;
  setScheduleList: (value: any) => void;
};
export default function ModalManageTopic({
  opened,
  onClose,
  type,
  teachingMethod,
  data,
  setScheduleList,
}: Props) {
  const height = type === "add" ? "h-full" : "h-fit";
  const handlersLecRef = useRef<NumberInputHandlers>(null);
  const handlersLabRef = useRef<NumberInputHandlers>(null);
  const topicRef = useRef<HTMLDivElement>(null);
  const [isAdded, setIsAdded] = useState(false);
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  const form = useForm({
    mode: "controlled",
    initialValues: { schedule: [] } as Partial<IModelTQF3Part2>,
    onValuesChange: (values) => {
      localStorage.setItem("dataAddCourseContent", JSON.stringify(values));
    },
  });

  const formOneWeek = useForm({
    mode: "controlled",
    initialValues: {
      weekNo: 1,
      topic: "",
      lecHour: 0,
      labHour: 0,
    } as Partial<IModelSchedule>,
    validate: {
      topic: (value) => validateTextInput(value, "Course Content", 0, false),
      lecHour: (value, values) =>
        !value && !values.labHour && "Lecture hour or Lab hour is required",
      labHour: (value, values) =>
        !value && !values.lecHour && "Lecture hour or Lab hour is required",
    },
    validateInputOnBlur: true,
    onValuesChange(values, previous) {
      if (values.lecHour != previous.lecHour) {
        formOneWeek.validateField("labHour");
      } else if (values.labHour != previous.labHour) {
        formOneWeek.validateField("lecHour");
      }
      localStorage.setItem("dataAddWeekCourseContent", JSON.stringify(values));
    },
  });

  useEffect(() => {
    if (opened && data) {
      if (!localStorage.getItem("dataAddCourseContent")) {
        form.reset();
      }
      if (!localStorage.getItem("dataAddWeekCourseContent")) {
        formOneWeek.reset();
      }
      if (type == "add") {
        const dataListStorage = JSON.parse(
          localStorage.getItem("dataAddCourseContent")!
        );
        const dataOneStorage = JSON.parse(
          localStorage.getItem("dataAddWeekCourseContent")!
        );
        const length =
          dataListStorage?.length ?? ((data as IModelSchedule[]).length || 0);
        if (dataListStorage) {
          form.setValues(dataListStorage);
        }
        if (dataOneStorage) {
          formOneWeek.setValues(dataOneStorage);
        } else {
          formOneWeek.setValues({
            weekNo: length + 1,
            topic: "",
            lecHour: teachingMethod.includes(TEACHING_METHOD.LEC.en) ? 3 : 0,
            labHour: teachingMethod.includes(TEACHING_METHOD.LAB.en) ? 3 : 0,
          });
        }
      } else {
        formOneWeek.setValues(data as IModelSchedule);
      }
    }
  }, [data, opened]);

  useEffect(() => {
    if (topicRef.current && isAdded) {
      topicRef.current.scrollIntoView({ behavior: "smooth" });
      setIsAdded(false);
    }
  }, [isAdded]);

  const closeModal = () => {
    onClose();
    localStorage.removeItem("dataAddCourseContent");
    localStorage.removeItem("dataAddWeekCourseContent");
  };

  const onClickDone = () => {
    if (type == "add") {
      if (formOneWeek.getValues().topic?.length) {
        addMore();
      }
      if (form.getValues().schedule?.length! > 0) {
        setScheduleList(form.getValues().schedule);
      } else {
        formOneWeek.validate();
        return;
      }
    } else if (!formOneWeek.validate().hasErrors) {
      setScheduleList(formOneWeek.getValues());
    } else {
      return;
    }
    closeModal();
  };

  const addMore = () => {
    if (!formOneWeek.validate().hasErrors) {
      form.insertListItem("schedule", formOneWeek.getValues());
      setIsAdded(true);
      formOneWeek.setValues({
        weekNo: formOneWeek.getValues().weekNo! + 1,
        topic: "",
        lecHour: teachingMethod.includes(TEACHING_METHOD.LEC.en) ? 3 : 0,
        labHour: teachingMethod.includes(TEACHING_METHOD.LAB.en) ? 3 : 0,
      });
    }
  };

  const removeTopic = (index: number) => {
    const length = (data as IModelSchedule[]).length;
    form.removeListItem("schedule", index);
    const newTopicList = form.getValues().schedule;
    newTopicList?.forEach((week, i) => {
      week.weekNo = length + i + 1;
    });
    formOneWeek.setFieldValue("weekNo", length + newTopicList?.length! + 1);
  };

  useHotkeys(
    "ctrl+enter, meta+enter",
    () => {
      addMore();
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
    }
  );

  return (
    <Modal
      opened={opened}
      onClose={closeModal}
      closeOnEscape={false}
      closeOnClickOutside={false}
      title={`${upperFirst(type)} Course Content`}
      size={
        type === "add" && form.getValues().schedule?.length! > 0
          ? "80vw"
          : "50vw"
      }
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: `flex flex-col bg-[#F6F7FA] overflow-hidden `,
        body: `overflow-hidden ${height}`,
        header: `mb-1`,
        title: "acerSwift:max-macair133:!text-b1",
      }}
    >
      <FocusTrapInitialFocus />
      <div
        className={`flex flex-col  !gap-5 ${
          type === "add"
            ? "h-full sm:max-macair133:h-fit sm:max-macair133:mb-14 sm:max-macair133:overflow-y-auto sm:max-macair133:px-[2px]"
            : "h-fit  "
        } `}
      >
        <div
          className={`flex gap-5 py-1 ${type === "add" ? " h-fit " : "h-fit"}`}
        >
          {/* Input Field */}
          <div
            className={`flex flex-col ${
              type === "add" && "p-5"
            } gap-1 rounded-md overflow-hidden ${
              form.getValues().schedule?.length! > 0 && type === "add"
                ? "w-[45%]"
                : "w-full"
            } h-fit sm:max-macair133:h-fit relative`}
            style={{
              boxShadow:
                type === "add" ? "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" : "none",
            }}
          >
            <div className="flex flex-col gap-4  h-[80%]">
              <Textarea
                autoFocus={false}
                label={
                  <p className="font-semibold flex gap-1">
                    Course Content <span className=" text-error">*</span>
                  </p>
                }
                className="w-full border-none rounded-r-none"
                classNames={{
                  input:
                    "flex h-[100px] acerSwift:max-macair133:!h-[108px] p-3 text-b3 acerSwift:max-macair133:!text-b4",
                  label: "flex pb-1 acerSwift:max-macair133:!text-b4",
                }}
                placeholder="Ex. การอินทิเกรต (Integration)"
                {...formOneWeek.getInputProps("topic")}
              />

              <NumberInput
                label={
                  <p className="font-semibold flex gap-1 h-full">
                    Lecture hour (hr)
                    <span className=" text-error">*</span>
                  </p>
                }
                classNames={{
                  input:
                    "flex px-3 py-5 text-b3 acerSwift:max-macair133:!text-b4",
                  label: "flex pb-1 acerSwift:max-macair133:!text-b4",
                }}
                size="xs"
                allowNegative={false}
                handlersRef={handlersLecRef}
                decimalScale={2}
                step={1}
                min={0}
                max={100}
                rightSection={
                  <div className="flex gap-2 items-center mr-16">
                    <div
                      className="p-1 rounded-md hover:bg-bgTableHeader cursor-pointer"
                      onClick={() => handlersLecRef.current?.decrement()}
                    >
                      <Icon
                        IconComponent={IconMinus}
                        className="size-4 stroke-[#1f69f3]"
                      />
                    </div>
                    <div className="h-8 border"></div>
                    <div
                      className=" p-1 rounded-md hover:bg-bgTableHeader cursor-pointer"
                      onClick={() => handlersLecRef.current?.increment()}
                    >
                      <Icon
                        IconComponent={IconPlus2}
                        className="size-4 stroke-[#1f69f3]"
                      />
                    </div>
                  </div>
                }
                {...formOneWeek.getInputProps("lecHour")}
                error=""
              />

              <NumberInput
                label={
                  <p className="font-semibold flex gap-1 h-full">
                    Lab hour (hr) <span className=" text-error">*</span>
                  </p>
                }
                classNames={{
                  input:
                    "flex px-3 py-5 text-b3 acerSwift:max-macair133:!text-b4",
                  label: "flex pb-1 acerSwift:max-macair133:!text-b4",
                }}
                size="xs"
                allowNegative={false}
                handlersRef={handlersLabRef}
                decimalScale={2}
                step={1}
                min={0}
                max={100}
                rightSection={
                  <div className="flex gap-2 items-center mr-16">
                    <div
                      className="p-1 rounded-md hover:bg-bgTableHeader cursor-pointer"
                      onClick={() => handlersLabRef.current?.decrement()}
                    >
                      <Icon
                        IconComponent={IconMinus}
                        className="size-4 stroke-[#1f69f3]"
                      />
                    </div>
                    <div className="h-8 border"></div>
                    <div
                      className=" p-1 rounded-md hover:bg-bgTableHeader cursor-pointer"
                      onClick={() => handlersLabRef.current?.increment()}
                    >
                      <Icon
                        IconComponent={IconPlus2}
                        className="size-4 stroke-[#1f69f3]"
                      />
                    </div>
                  </div>
                }
                {...formOneWeek.getInputProps("labHour")}
                error=""
              />
              <p className="text-error text-b4 -mt-1">
                {formOneWeek.getInputProps("lecHour").error ||
                  formOneWeek.getInputProps("labHour").error}
              </p>
            </div>
          </div>
          {/* List Course Content */}
          {!!form.getValues().schedule?.length && type === "add" && (
            <div
              className="flex flex-col flex-1 bg-white border-secondary border-[1px] rounded-md w-[55%] h-[342px]"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                overflowY: "auto",
              }}
            >
              <div className="sticky top-0 z-10 bg-bgTableHeader text-b2 acerSwift:max-macair133:!text-b3 flex items-center justify-between border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold ">
                <div className="flex items-center gap-2">
                  <Icon IconComponent={IconList2} className="size-5" />
                  <span className="flex flex-row items-center gap-2">
                    List Course Content Added
                  </span>
                </div>
                <p>
                  {form.getValues().schedule?.length!} Course Content
                  {form.getValues().schedule?.length! > 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex flex-col w-full h-fit px-4">
                {form.getValues().schedule?.map((item, index) => (
                  <div
                    ref={
                      index === form.getValues().schedule?.length! - 1
                        ? topicRef
                        : undefined
                    }
                    className={`py-3 w-full border-b-[1px] pl-3 ${
                      form.getValues().schedule?.length! > 1
                        ? "last:border-none last:pb-5"
                        : ""
                    } `}
                  >
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between">
                        <p className="text-secondary mb-2 font-semibold text-b2 acerSwift:max-macair133:!text-b3">
                          {/* Course Content {item.weekNo} */}
                          Week {item.weekNo}
                        </p>

                        <div
                          className="flex items-center justify-center border-[#FF4747] size-8 rounded-full hover:bg-[#FF4747]/10 cursor-pointer"
                          onClick={() => removeTopic(index)}
                        >
                          <Icon
                            IconComponent={IconTrash}
                            className="size-4 stroke-[#ff4747] stroke-[2px] flex items-center"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-tertiary text-b3 acerSwift:max-macair133:!text-b4 font-medium flex flex-col gap-1">
                      <div className="flex text-pretty font-semibold">
                        {/* <li></li> Week {item.weekNo}: {item.topic} */}
                        <li></li> Topic: {item.topic}
                      </div>
                      <div className="flex text-pretty">
                        <li></li> Lecture hour: {item.lecHour} hr
                        {!!item.lecHour && "s"}
                      </div>
                      <div className="flex text-pretty">
                        <li></li> Lab hour: {item.labHour} hr
                        {!!item.labHour && "s"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Button */}
        <div className="flex gap-2 sm:max-macair133:fixed sm:max-macair133:bottom-6 sm:max-macair133:right-8  items-end  justify-end h-fit">
          <Button
            variant="subtle"
            onClick={closeModal}
            className="acerSwift:max-macair133:!text-b5"
          >
            Cancel
          </Button>

          {type === "add" && (
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
                  <Kbd className=" text-secondary">{isMac ? "⌘" : "Ctrl"}</Kbd>{" "}
                  + <Kbd className=" text-secondary">Enter</Kbd>
                </div>
              }
              color="#FCFCFC"
              className="w-fit border  rounded-md "
              position="top"
            >
              <Button
                variant="subtle"
                onClick={addMore}
                className="acerSwift:max-macair133:!text-b5"
              >
                Add more Content
              </Button>
            </Tooltip>
          )}
          <Button
            onClick={onClickDone}
            className="acerSwift:max-macair133:!text-b5"
            disabled={
              form.getValues().schedule?.length == 0 && !formOneWeek.errors
            }
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
