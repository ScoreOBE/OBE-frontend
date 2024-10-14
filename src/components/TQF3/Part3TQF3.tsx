import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Radio, Button, Alert, Group, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import AddIcon from "@/assets/icons/plus.svg?react";
import { Table, rem } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import {
  IconCheckbox,
  IconEdit,
  IconExclamationCircle,
  IconGripVertical,
  IconTrash,
} from "@tabler/icons-react";
import { IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Icon from "../Icon";
import ModalManageEvalTopic from "../Modal/TQF3/ModalManageEvalTopic";
import { IModelEval, IModelTQF3Part3 } from "@/models/ModelTQF3";
import { cloneDeep, isEqual } from "lodash";
import MainPopup from "../Popup/MainPopup";
import unplug from "@/assets/image/unplug.png";
import { useAppDispatch, useAppSelector } from "@/store";
import { updatePartTQF3 } from "@/store/tqf3";
import { useSearchParams } from "react-router-dom";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function Part3TQF3({ setForm }: Props) {
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [params, setParams] = useSearchParams({});
  const disabled =
    parseInt(params.get("year") || "") !== academicYear.year &&
    parseInt(params.get("semester") || "") !== academicYear.semester;
  const tqf3 = useAppSelector((state) => state.tqf3);
  const dispatch = useAppDispatch();
  const optionGrading = [
    "แบบอิงกลุ่ม (Norm-Referenced Grading)",
    "แบบอิงเกณฑ์ (Criterion-Referenced Grading)",
    "แบบอิงเกณฑ์และอิงกลุ่ม (Criterion and Norm-Referenced Grading)",
  ];
  const [percentTotal, setPercentTotal] = useState(0);
  const [editData, setEditData] = useState<any>();
  const [openModalAddEvalTopic, setOpenModalAddEvalTopic] = useState(false);
  const [openModalEditEvalTopic, setOpenModalEditEvalTopic] = useState(false);
  const [openPopupDelEvalTopic, setOpenPopupDelEvalTopic] = useState(false);
  const [openedTooltip, setOpenedTooltip] = useState(false);

  const form = useForm({
    mode: "controlled",
    initialValues: {
      gradingPolicy: "",
      eval: [],
    } as Partial<IModelTQF3Part3>,
    validate: {
      gradingPolicy: (value) => !value?.length && "Grading Policy is required",
      eval: (value) =>
        !value?.length
          ? "Add Evaluation at least one"
          : value.reduce((acc, cur) => acc + cur.percent, 0) !== 100
          ? "Percentage must equal 100%"
          : null,
    },
    validateInputOnBlur: true,
    onValuesChange: (values, previous) => {
      if (!isEqual(values.eval, previous.eval)) {
        values.eval?.forEach((item, index) => {
          item.no = index + 1;
        });
      }
      if (!isEqual(values, previous)) {
        dispatch(
          updatePartTQF3({ part: "part3", data: cloneDeep(form.getValues()) })
        );
        setForm(form);
        setPercentTotal(
          values.eval?.reduce((acc, { percent }) => acc + percent, 0) || 0
        );
      }
    },
  });

  useEffect(() => {
    if (tqf3.part3) {
      form.setValues(cloneDeep(tqf3.part3));
    }
  }, []);

  const onClickDeleteTopic = () => {
    form.removeListItem("eval", editData.no - 1);
    setOpenPopupDelEvalTopic(false);
    setEditData(undefined);
  };

  return (
    <>
      <ModalManageEvalTopic
        opened={openModalAddEvalTopic}
        onClose={() => setOpenModalAddEvalTopic(false)}
        type="add"
        data={form.getValues().eval!}
        total={percentTotal}
        setEvalList={(value: IModelEval[]) =>
          form.setFieldValue("eval", [...form.getValues().eval!, ...value])
        }
      />
      <ModalManageEvalTopic
        opened={openModalEditEvalTopic}
        onClose={() => setOpenModalEditEvalTopic(false)}
        type="edit"
        data={editData}
        total={percentTotal - editData?.percent}
        setEvalList={(value: IModelEval) =>
          form.setFieldValue(`eval.${editData.no - 1}`, value)
        }
      />
      <MainPopup
        opened={openPopupDelEvalTopic}
        onClose={() => setOpenPopupDelEvalTopic(false)}
        type="delete"
        title={`Delete Topic ${editData?.no}`}
        message={
          <>
            <Alert
              variant="light"
              color="red"
              title={
                <p>
                  This action cannot be undone. After you delete this Evaluation
                  Topic, <br /> it will be permanently deleted from this course.
                </p>
              }
              icon={<IconExclamationCircle />}
              classNames={{ icon: "size-6" }}
            ></Alert>
            <div className="flex flex-col mt-3 ">
              <p className="text-b3  text-[#808080]">Evaluation Topic</p>
              <p className="-translate-y-[2px] text-b1">{editData?.topicTH}</p>
              <p className="-translate-y-[2px] text-b1">{editData?.topicEN}</p>
            </div>
          </>
        }
        labelButtonRight="Delete Topic"
        action={onClickDeleteTopic}
      />
      {tqf3.part2?.updatedAt ? (
        <div className="flex flex-col w-full">
          <div className="flex flex-col w-full h-full pb-2 gap-4">
            <div className="flex text-secondary gap-4 items-start w-full border-b-[1px] border-[#e6e6e6] pb-6 flex-col">
              <div className="flex flex-row gap-1 text-[15px]">
                <p className="font-semibold">การกำหนดเกรด</p>
                <p className="font-bold">
                  (Grading) <span className=" text-red-500">*</span>
                </p>
              </div>
              <div className="flex flex-col font-medium text-default">
                <Radio.Group
                  key={form.key("gradingPolicy")}
                  classNames={{ error: "mt-2" }}
                  {...form.getInputProps("gradingPolicy")}
                >
                  <Group className="flex flex-col items-start">
                    {optionGrading.map((item, index) => (
                      <Radio
                        key={index}
                        classNames={{
                          radio: `${disabled && "!cursor-default"}`,
                          label: `${disabled && "!cursor-default"}`,
                        }}
                        label={item}
                        value={item}
                        disabled={disabled}
                      />
                    ))}
                  </Group>
                </Radio.Group>
              </div>
            </div>
            <div className="flex text-secondary items-center w-full justify-between">
              <div className="flex flex-row gap-1 text-[15px]">
                <p className="font-bold">
                  Course Syllabus<span className="ml-1 text-red-500">*</span>
                </p>
              </div>
              {!disabled && (
                <Button
                  className="text-center px-4"
                  onClick={() => setOpenModalAddEvalTopic(true)}
                  onMouseOver={() => setOpenedTooltip(true)}
                  onMouseLeave={() => setOpenedTooltip(false)}
                >
                  <div className="flex gap-2">
                    <Icon IconComponent={AddIcon} />
                    Add Evaluation Topic
                  </div>
                </Button>
              )}
              {/* </Tooltip> */}
            </div>
            {!disabled && (
              <div className="w-full">
                <Alert
                  radius="md"
                  icon={<IconCheckbox />}
                  variant="light"
                  color="rgba(6, 158, 110, 1)"
                  classNames={{
                    icon: "size-6",
                    body: " flex justify-center",
                  }}
                  className="w-full"
                  title={
                    <p className="font-semibold">
                      The total of all topics in the course syllabus{" "}
                      <span className=" font-extrabold">
                        must add up to 100%
                      </span>{" "}
                      .
                    </p>
                  }
                ></Alert>
              </div>
            )}
            {/* Table */}
            <DragDropContext
              key={form.key("eval")}
              {...form.getInputProps("eval")}
              onDragEnd={({ destination, source }) => {
                if (!destination) return; // Check if destination exists
                form.reorderListItem("eval", {
                  from: source.index,
                  to: destination.index,
                });
              }}
            >
              <div
                className="overflow-auto w-full flex flex-col rounded-md border border-secondary"
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
              >
                <Table stickyHeader striped className="w-full">
                  <Table.Thead>
                    <Table.Tr className="bg-[#e5e7f6] ">
                      <Table.Th className="w-[5%] !rounded-tl-md">No.</Table.Th>
                      <Table.Th className=" w-[15%]">Topic</Table.Th>
                      <Table.Th className="w-[65%]">Description</Table.Th>
                      <Table.Th className="w-[5%] text-end">
                        <div className="flex flex-row !justify-end items-center gap-2">
                          Evaluate
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
                                Percentage of scores for each topic in the
                                course syllabus.
                              </div>
                            }
                            color="#FCFCFC"
                            className="w-fit border  rounded-md "
                            position="bottom-end"
                          >
                            <IconInfoCircle
                              size={16}
                              className="-ml-0 text-secondary"
                            />
                          </Tooltip>
                        </div>
                      </Table.Th>
                      {disabled ? (
                        <Table.Th className="w-[5%] !rounded-tr-md"></Table.Th>
                      ) : (
                        <>
                          <Table.Th className="w-[20%]">Action</Table.Th>
                          <Table.Th className="w-[5%] !rounded-tr-md"></Table.Th>
                        </>
                      )}
                    </Table.Tr>
                  </Table.Thead>
                  {!form.getValues().eval?.length ? (
                    <Table.Tbody>
                      <Table.Tr>
                        <Table.Td colSpan={6} className="text-center">
                          No Course Syllabus
                        </Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  ) : (
                    <Droppable droppableId="dnd-list" direction="vertical">
                      {(provided) => (
                        <Table.Tbody
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="text-[13px] font-normal text-[#333333] w-full"
                        >
                          {form.getValues().eval?.map((item, index) => (
                            <Draggable
                              key={item.no.toString()}
                              index={index}
                              draggableId={item.no.toString()}
                            >
                              {(provided, snapshot) => (
                                <Table.Tr
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`table-row ${
                                    snapshot.isDragging ? "bg-hover " : ""
                                  }`}
                                >
                                  <Table.Td className="w-[5%] ">
                                    {item.no}
                                  </Table.Td>
                                  <Table.Td className="w-[15%] ">
                                    <p>{item.topicTH}</p>
                                    <p>{item.topicEN}</p>
                                  </Table.Td>
                                  <Table.Td className="w-[65%] max-w-[65%] flex-wrap">
                                    {item.desc.length ? item.desc : "-"}
                                  </Table.Td>
                                  <Table.Td className="w-[5%] text-end text-b1">
                                    <p>{item.percent}%</p>
                                  </Table.Td>
                                  {disabled ? (
                                    <Table.Td></Table.Td>
                                  ) : (
                                    <>
                                      <Table.Td className="w-[20%]">
                                        <div className="flex justify-start gap-4 items-center">
                                          <div
                                            className="flex justify-center items-center bg-transparent border-[1px] border-[#F39D4E] text-[#F39D4E] size-8 bg-none rounded-full cursor-pointer hover:bg-[#F39D4E]/10"
                                            onClick={() => {
                                              setEditData(item);
                                              setOpenModalEditEvalTopic(true);
                                            }}
                                          >
                                            <IconEdit
                                              className="size-4"
                                              stroke={1.5}
                                            />
                                          </div>
                                          <div
                                            className="flex justify-center items-center bg-transparent border-[1px] size-8 bg-none rounded-full cursor-pointer border-[#FF4747] text-[#FF4747] hover:bg-[#FF4747]/10"
                                            onClick={() => {
                                              setEditData(item);
                                              setOpenPopupDelEvalTopic(true);
                                            }}
                                          >
                                            <IconTrash
                                              className="size-4"
                                              stroke={1.5}
                                            />
                                          </div>
                                        </div>
                                      </Table.Td>
                                      <Table.Td
                                        className={`${
                                          snapshot.isDragging ? "w-[10%]" : ""
                                        }`}
                                      >
                                        <div
                                          className="cursor-pointer hover:bg-hover text-tertiary size-8 rounded-full flex items-center justify-center "
                                          {...provided.dragHandleProps}
                                        >
                                          <IconGripVertical
                                            style={{
                                              width: "20px",
                                              height: "20px",
                                            }}
                                            stroke={1.5}
                                          />
                                        </div>
                                      </Table.Td>
                                    </>
                                  )}
                                </Table.Tr>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </Table.Tbody>
                      )}
                    </Droppable>
                  )}

                  <Table.Tfoot className="text-secondary font-semibold">
                    <Table.Tr className="bg-[#e5e7f6] border-none">
                      <Table.Th
                        className="text-[14px] !rounded-bl-md"
                        colSpan={3}
                      >
                        Total
                      </Table.Th>
                      <Table.Th className="text-[16px] text-end">
                        {percentTotal}%
                      </Table.Th>
                      <Table.Th
                        className="!rounded-br-md"
                        colSpan={2}
                      ></Table.Th>
                    </Table.Tr>
                  </Table.Tfoot>
                </Table>
              </div>
              <p className="error-text -mt-1">
                {form.getInputProps("eval").error}
              </p>
            </DragDropContext>
          </div>
        </div>
      ) : (
        <div className="flex px-16  flex-row items-center justify-between h-full">
          <div className="flex justify-center  h-full items-start gap-2 flex-col">
            <p className="   text-secondary font-semibold text-[22px]">
              Complete TQF3 Part 2 First
            </p>
            <p className=" text-[#333333] leading-6 font-medium text-[14px]">
              To start TQF3 Part 3, please complete and save TQF3 Part 2. <br />{" "}
              Once done, you can continue to do it.
            </p>
          </div>
          <img
            className=" z-50  w-[580px] h-[300px] "
            src={unplug}
            alt="loginImage"
          />
        </div>
      )}
    </>
  );
}
