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
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconList, IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import { upperFirst } from "lodash";
import { useEffect, useRef, useState } from "react";

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
  const [topicLength, setTopicLenght] = useState(0);

  const form = useForm({
    mode: "controlled",
    initialValues: { schedule: [] } as Partial<IModelTQF3Part2>,
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
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    if (data) {
      if (type == "add") {
        const length = (data as IModelSchedule[]).length || 0;
        form.setFieldValue("schedule", data as IModelSchedule[]);
        formOneWeek.setValues({
          weekNo: length + 1,
          topic: "",
          lecHour: teachingMethod.includes(TEACHING_METHOD.LEC.en) ? 3 : 0,
          labHour: teachingMethod.includes(TEACHING_METHOD.LAB.en) ? 3 : 0,
        });
        setTopicLenght(length);
      } else {
        formOneWeek.setValues(data as IModelSchedule);
      }
    }
  }, [data]);

  const closeModal = () => {
    onClose();
    setTopicLenght(0);
    form.reset();
    formOneWeek.reset();
  };

  const addMore = () => {
    if (!formOneWeek.validate().hasErrors) {
      form.insertListItem("schedule", formOneWeek.getValues());
      setTopicLenght(topicLength + 1);
      formOneWeek.setValues({
        weekNo: formOneWeek.getValues().weekNo! + 1,
        topic: "",
        lecHour: teachingMethod.includes(TEACHING_METHOD.LEC.en) ? 3 : 0,
        labHour: teachingMethod.includes(TEACHING_METHOD.LAB.en) ? 3 : 0,
      });
    }
  };

  const removeTopic = (index: number) => {
    setTopicLenght(topicLength - 1);
    form.removeListItem("schedule", index);
    const newTopicList = form.getValues().schedule;
    newTopicList?.forEach((week, i) => {
      week.weekNo = i + 1;
    });
    formOneWeek.setFieldValue("weekNo", newTopicList?.length! + 1);
  };

  return (
    <Modal
      opened={opened}
      onClose={closeModal}
      closeOnClickOutside={false}
      title={`${upperFirst(type)} Course Content`}
      size={type === "add" && topicLength > 0 ? "70vw" : "35vw"}
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: `flex flex-col bg-[#F6F7FA] overflow-hidden `,
        body: `overflow-hidden ${height}`,
        header: `mb-1`,
      }}
    >
      <FocusTrapInitialFocus />
      <div
        className={`flex flex-col  !gap-5 ${
          type === "add" ? "h-full" : "h-fit  "
        } `}
      >
        <div
          className={`flex gap-5 py-1 ${
            type === "add" ? " h-[500px]" : "h-fit"
          }`}
        >
          {/* Input Field */}
          <div
            className={`flex flex-col ${
              type === "add" && "p-5"
            } gap-1 rounded-md overflow-hidden ${
              topicLength > 0 && type === "add" ? "w-[45%]" : "w-full"
            } h-full relative`}
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
                  input: "flex h-[200px] p-3 text-[13px]",
                  label: "flex pb-1",
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
                  input: "flex px-3 py-5 text-[13px]",
                  label: "flex pb-1",
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
                      className="p-1 rounded-md hover:bg-bgTableHeader"
                      onClick={() => handlersLecRef.current?.decrement()}
                      style={{ cursor: "pointer" }}
                    >
                      <IconMinus size={18} color="#5768d5" />
                    </div>
                    <div className="h-8 border"></div>
                    <div
                      className=" p-1 rounded-md hover:bg-bgTableHeader"
                      onClick={() => handlersLecRef.current?.increment()}
                      style={{ cursor: "pointer" }}
                    >
                      <IconPlus size={18} color="#5768d5" />
                    </div>
                  </div>
                }
                {...formOneWeek.getInputProps("lecHour")}
              />

              <NumberInput
                label={
                  <p className="font-semibold flex gap-1 h-full">
                    Lab hour (hr) <span className=" text-error">*</span>
                  </p>
                }
                classNames={{
                  input: "flex px-3 py-5 text-[13px]",
                  label: "flex pb-1",
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
                      className="p-1 rounded-md hover:bg-bgTableHeader"
                      onClick={() => handlersLabRef.current?.decrement()}
                      style={{ cursor: "pointer" }}
                    >
                      <IconMinus size={18} color="#5768d5" />
                    </div>
                    <div className="h-8 border"></div>
                    <div
                      className=" p-1 rounded-md hover:bg-bgTableHeader"
                      onClick={() => handlersLabRef.current?.increment()}
                      style={{ cursor: "pointer" }}
                    >
                      <IconPlus size={18} color="#5768d5" />
                    </div>
                  </div>
                }
                {...formOneWeek.getInputProps("labHour")}
              />
            </div>

            {/* Add More Button */}
            {type === "add" && (
              <div className="absolute right-5 bottom-5">
                <Button variant="outline" onClick={addMore}>
                  Add more
                </Button>
              </div>
            )}
          </div>
          {/* List Course Content */}
          {!!form.getValues().schedule?.length && type === "add" && (
            <div
              className="flex flex-col bg-white border-secondary border-[1px] rounded-md w-[55%] h-full"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                overflowY: "auto",
              }}
            >
              <div className="sticky top-0 z-10 bg-[#e6e9ff] text-[14px] flex items-center justify-between border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold ">
                <div className="flex items-center gap-2">
                  <IconList style={{ width: rem(20), height: rem(20) }} />{" "}
                  <span className="flex flex-row items-center gap-2">
                    List Course Content Added
                  </span>
                </div>
                <p>
                  {topicLength} Course Content{topicLength > 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex flex-col w-full h-fit px-4">
                {form.getValues().schedule?.map((item, index) => (
                  <div
                    key={index}
                    className={`py-3 w-full border-b-[1px] pl-3 ${
                      topicLength > 1 ? "last:border-none last:pb-5" : ""
                    } `}
                  >
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between">
                        <p className="text-secondary mb-2 font-semibold text-[14px]">
                          {/* Course Content {item.weekNo} */}
                          Week {item.weekNo}
                        </p>

                        <div
                          className="flex items-center justify-center border-[#FF4747] size-8 rounded-full hover:bg-[#FF4747]/10 cursor-pointer"
                          onClick={() => removeTopic(index)}
                        >
                          <IconTrash
                            stroke={1.5}
                            color="#FF4747"
                            className="size-4 flex items-center"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-tertiary text-[13px] font-medium flex flex-col gap-1">
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
        <div className="flex gap-2  items-end  justify-end h-fit">
          <Button variant="subtle" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setScheduleList(
                type == "add"
                  ? form.getValues().schedule
                  : formOneWeek.getValues()
              );
              closeModal();
            }}
            disabled={
              type == "add" ? form.getValues().schedule?.length == 0 : false
            }
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
