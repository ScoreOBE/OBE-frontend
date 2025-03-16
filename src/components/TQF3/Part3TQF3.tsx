import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Radio, Button, Alert, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import Icon from "../Icon";
import IconAdd from "@/assets/icons/plus.svg?react";
import IconTrash from "@/assets/icons/trash.svg?react";
import IconEdit from "@/assets/icons/edit.svg?react";
import IconVerticalGrip from "@/assets/icons/verticalGrip.svg?react";
import IconCheckbox from "@/assets/icons/checkbox.svg?react";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import { Table } from "@mantine/core";
import { useEffect, useState } from "react";
import ModalManageEvalTopic from "../Modal/TQF3/ModalManageEvalTopic";
import { IModelEval, IModelTQF3Part3 } from "@/models/ModelTQF3";
import { cloneDeep, isEqual } from "lodash";
import MainPopup from "../Popup/MainPopup";
import unplug from "@/assets/image/unplug.png";
import { useAppDispatch, useAppSelector } from "@/store";
import { updatePartTQF3 } from "@/store/tqf3";
import { useSearchParams } from "react-router-dom";
import { PartTopicTQF3 } from "@/helpers/constants/TQF3.enum";

type Props = {
  setForm?: React.Dispatch<React.SetStateAction<any>>;
};

export default function Part3TQF3({ setForm = () => {} }: Props) {
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [params, setParams] = useSearchParams({});
  const tqf3 = useAppSelector((state) => state.tqf3);
  const disabled =
    tqf3.courseSyllabus ||
    (parseInt(params.get("year") || "") !== academicYear.year &&
      parseInt(params.get("semester") || "") !== academicYear.semester);
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
    if (tqf3.courseSyllabus) return;
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
        title={`Delete Method ${editData?.no}`}
        message={
          <>
            <Alert
              variant="light"
              color="red"
              title={
                <p>
                  This action cannot be undone. After you delete this Evaluation
                  Method, <br /> it will be permanently deleted from this
                  course.
                </p>
              }
              icon={
                <Icon
                  IconComponent={IconExclamationCircle}
                  className="size-6"
                />
              }
            ></Alert>
            <div className="flex flex-col mt-3 ">
              <p className="text-b4  text-[#808080]">Evaluation Method</p>
              <p className="-translate-y-[2px] text-b1">{editData?.topicTH}</p>
              <p className="-translate-y-[2px] text-b1">{editData?.topicEN}</p>
            </div>
          </>
        }
        labelButtonRight="Delete Topic"
        action={onClickDeleteTopic}
      />
      {tqf3.part2?.updatedAt ? (
        !tqf3.courseSyllabus ? (
          <div className="flex flex-col w-full">
            <div className="flex flex-col w-full h-full pb-2 gap-4">
              <div className="flex text-secondary gap-4 items-start w-full border-b-[1px] border-[#e6e6e6] pb-6 flex-col">
                <div className="flex flex-row gap-1 text-[15px]  acerSwift:max-macair133:!text-b3">
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
                            label: `${
                              disabled && "!cursor-default"
                            } acerSwift:max-macair133:!text-b4`,
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
                <div className="flex flex-row gap-1 text-[15px] acerSwift:max-macair133:!text-b3">
                  <p className="font-bold">
                    Evaluation Items<span className="ml-1 text-red-500">*</span>
                  </p>
                </div>
                {!disabled && (
                  <Button
                    className="text-center px-4"
                    onClick={() => setOpenModalAddEvalTopic(true)}
                  >
                    <div className="flex gap-2 acerSwift:max-macair133:!text-b5">
                      <Icon IconComponent={IconAdd} />
                      Add Evaluation Method
                    </div>
                  </Button>
                )}
              </div>
              {!disabled && (
                <div className="w-full">
                  <Alert
                    radius="md"
                    icon={<Icon IconComponent={IconCheckbox} />}
                    variant="light"
                    color="rgba(6, 158, 110, 1)"
                    classNames={{
                      icon: "size-6",
                      body: " flex justify-center",
                    }}
                    className="w-full"
                    title={
                      <p className="font-semibold acerSwift:max-macair133:!text-b3">
                        The total of all methods in the course syllabus{" "}
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
                    <Table.Thead className="acerSwift:max-macair133:!text-b3">
                      <Table.Tr className="bg-[#e5e7f6] ">
                        <Table.Th className="w-[5%] !rounded-tl-md">
                          No.
                        </Table.Th>
                        <Table.Th className=" w-[15%]">Method</Table.Th>
                        <Table.Th className="w-[65%]">Description</Table.Th>
                        <Table.Th className="w-[5%] text-end">
                          <div className="flex flex-row !justify-end items-center gap-2">
                            Evaluate
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
                            className="text-b3 acerSwift:max-macair133:!text-b4 font-normal text-[#333333] w-full"
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
                                    <Table.Td className="w-[5%] acerSwift:max-macair133:!text-b2 text-end text-b1">
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
                                              <Icon
                                                IconComponent={IconEdit}
                                                className="size-4 stroke-2"
                                              />
                                            </div>
                                            <div
                                              className="flex justify-center items-center bg-transparent border-[1px] size-8 bg-none rounded-full cursor-pointer border-[#FF4747] text-[#FF4747] hover:bg-[#FF4747]/10"
                                              onClick={() => {
                                                setEditData(item);
                                                setOpenPopupDelEvalTopic(true);
                                              }}
                                            >
                                              <Icon
                                                IconComponent={IconTrash}
                                                className="size-4 stroke-2"
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
                                            <Icon
                                              IconComponent={IconVerticalGrip}
                                              className="stroke-[2px]"
                                              style={{
                                                width: "20px",
                                                height: "20px",
                                              }}
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
                      <Table.Tr className=" bg-bgTableHeader border-none">
                        <Table.Th
                          className="text-b2 acerSwift:max-macair133:!text-b3 !rounded-bl-md"
                          colSpan={3}
                        >
                          Total
                        </Table.Th>
                        <Table.Th className="text-b1 acerSwift:max-macair133:!text-b2 text-end">
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
          <div className="flex flex-col w-full text-[15px] bg-[#dfebff]/40 p-5 acerSwift:max-macair133:text-b3 mt-2 text-default rounded-xl">
            <div className=" text-secondary text-b1 font-semibold whitespace-break-spaces border-b-[1px] border-noData pb-4">
              {PartTopicTQF3.part3}
            </div>
            <div className=" border-b-[1px] border-[#e6e6e6] px-6 justify-between h-fit w-full grid grid-cols-2 py-5">
            <div className="flex text-gray-800 flex-col  text-[15px] acerSwift:max-macair133:!text-b3">
                <p className="font-medium">การกำหนดเกรด</p>
                <p className="font-semibold">Grading</p>
              </div>
              <div className="flex flex-col text-default gap-2 font-medium text-b2 acerSwift:max-macair133:text-b4">
                <p>{tqf3.part3?.gradingPolicy}</p>
              </div>
            </div>
            <div className="flex flex-col w-full px-6 gap-4 pt-5 pb-2">
              <div className="flex text-gray-800 items-center w-full justify-between">
                <p className="font-semibold">Evaluation Items</p>
              </div>
              <div
                className="overflow-auto w-full flex flex-col rounded-md border border-secondary"
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
              >
                <Table stickyHeader striped className="w-full">
                  <Table.Thead className="acerSwift:max-macair133:!text-b3">
                    <Table.Tr className="bg-[#e5e7f6] ">
                      <Table.Th className="w-[5%] !rounded-tl-md">No.</Table.Th>
                      <Table.Th className=" w-[15%]">Method</Table.Th>
                      <Table.Th className="w-[65%]">Description</Table.Th>
                      <Table.Th className="w-[5%] text-end">
                        <div className="flex flex-row !justify-end items-center gap-2">
                          Evaluate
                        </div>
                      </Table.Th>
                      <Table.Th className="w-[5%] !rounded-tr-md"></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody className="text-b3 acerSwift:max-macair133:!text-b4 font-normal text-[#333333] w-full">
                    {tqf3.part3?.eval?.map((item) => (
                      <Table.Tr key={item.no.toString()}>
                        <Table.Td className="w-[5%] ">{item.no}</Table.Td>
                        <Table.Td className="w-[15%] ">
                          <p>{item.topicTH}</p>
                          <p>{item.topicEN}</p>
                        </Table.Td>
                        <Table.Td className="w-[65%] max-w-[65%] flex-wrap">
                          {item.desc.length ? item.desc : "-"}
                        </Table.Td>
                        <Table.Td className="w-[5%] acerSwift:max-macair133:!text-b2 text-end text-b1">
                          <p>{item.percent}%</p>
                        </Table.Td>
                        <Table.Td></Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                  <Table.Tfoot className="text-secondary font-semibold">
                    <Table.Tr className=" bg-bgTableHeader border-none">
                      <Table.Th
                        className="text-b2 acerSwift:max-macair133:!text-b3 !rounded-bl-md"
                        colSpan={3}
                      >
                        Total
                      </Table.Th>
                      <Table.Th className="text-b1 acerSwift:max-macair133:!text-b2 text-end">
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
            </div>
          </div>
        )
      ) : (
        <div className="flex px-16  w-full ipad11:px-8 sm:px-2  gap-5  items-center justify-between h-full">
          <div className="flex justify-center  h-full items-start gap-2 flex-col">
            <p className="   text-secondary font-semibold text-[22px] sm:max-ipad11:text-[20px]">
              Complete TQF3 Part 2 First
            </p>
            <p className=" text-[#333333] leading-6 font-medium text-[14px] sm:max-ipad11:text-[13px]">
              To start TQF3 Part 3, please complete and save TQF3 Part 2. <br />{" "}
              Once done, you can continue to do it.
            </p>
          </div>
          <img
            className=" z-50 ipad11:w-[380px] sm:w-[340px] w-[340px]  macair133:w-[580px] macair133:h-[300px] "
            src={unplug}
            alt="loginImage"
          />
        </div>
      )}
    </>
  );
}
