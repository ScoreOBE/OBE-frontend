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
import { isMobile } from "@/helpers/functions/function";

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
              className="border border-red-100 rounded-xl bg-red-50"
              classNames={{
                title: "acerSwift:max-macair133:!text-b3",
                icon: "size-6",
                body: " flex justify-center",
                root: "p-4",
                wrapper: "items-start",
              }}
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
                      root: "border border-green-200 rounded-xl ",
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
          <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mt-6">
            {/* Header */}
            <div className="bg-[#1f69f3] text-white px-8 py-6 iphone:max-sm:px-4 iphone:max-sm:py-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#4c8af5] rounded-full opacity-20 -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#0d4ebc] rounded-full opacity-20 translate-y-1/2 -translate-x-1/2"></div>
              <h2 className="text-xl iphone:max-sm:text-lg font-bold relative z-10">
                {PartTopicTQF3.part3}
              </h2>
            </div>

            {/* Content */}
            <div className="divide-y divide-gray-100">
              {/* Grading Policy */}
              <div className="flex flex-col sm:flex-row p-6 iphone:max-sm:p-4 hover:bg-blue-50/30 transition-all duration-300">
                <div className="w-full sm:w-2/5 mb-3 sm:mb-0">
                  <h3 className="font-semibold text-gray-800 flex items-center iphone:max-sm:text-[14px]">
                    <span className="inline-block w-1.5 h-5 iphone:max-sm:h-4 bg-[#1f69f3] rounded-sm mr-2"></span>
                    การกำหนดเกรด
                  </h3>
                  <p className="text-sm iphone:max-sm:text-[12px] text-gray-500 ml-3.5">
                    Grading
                  </p>
                </div>
                <div className="w-full sm:w-3/5 font-medium iphone:max-sm:text-[14px]">
                  <div className="py-3 px-4 bg-[#1f69f3]/5 rounded-lg border-l-2 border-[#1f69f3]">
                    <p className="text-gray-800">{tqf3.part3?.gradingPolicy}</p>
                  </div>
                </div>
              </div>

              {/* Evaluation Items */}
              <div className="p-6 iphone:max-sm:p-4">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 flex items-center iphone:max-sm:text-[14px]">
                    <span className="inline-block w-1.5 h-5 iphone:max-sm:h-4 bg-[#1f69f3] rounded-sm mr-2"></span>
                    Evaluation Items
                  </h3>
                </div>

                {!isMobile ? (
                  <div className="overflow-hidden border border-[#1f69f3]/20 rounded-xl shadow-sm mt-4">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#1f69f3]/10">
                          <th className="py-3 px-4 text-left text-[#1f69f3] font-semibold w-[5%] border-b border-[#1f69f3]/10">
                            No.
                          </th>
                          <th className="py-3 px-4 text-left text-[#1f69f3] font-semibold w-[15%] border-b border-[#1f69f3]/10">
                            Method
                          </th>
                          <th className="py-3 px-4 text-left text-[#1f69f3] font-semibold w-[65%] border-b border-[#1f69f3]/10">
                            Description
                          </th>
                          <th className="py-3 px-4 text-right text-[#1f69f3] font-semibold w-[15%] border-b border-[#1f69f3]/10">
                            Evaluate
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tqf3.part3?.eval?.map((item, index) => (
                          <tr
                            key={item.no.toString()}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-blue-50/30"
                            }
                          >
                            <td className="py-3 px-4">{item.no}</td>
                            <td className="py-3 px-4">
                              <p className="font-medium text-gray-800">
                                {item.topicTH}
                              </p>
                              <p className="text-sm text-gray-600">
                                {item.topicEN}
                              </p>
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              {item.desc.length ? item.desc : "-"}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className="inline-flex items-center justify-center px-3 py-1 bg-[#1f69f3] text-white font-medium rounded-full">
                                {item.percent}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-[#1f69f3]/20 font-semibold text-[#1f69f3]">
                          <td className="py-3 px-4" colSpan={3}>
                            Total
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-flex items-center justify-center px-3 py-1 bg-[#1f69f3] text-white font-bold rounded-full">
                              100%
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <div className="space-y-3 mt-2">
                    {tqf3.part3?.eval?.map((item) => (
                      <div
                        key={item.no.toString()}
                        className="bg-white rounded-lg shadow-sm border border-[#1f69f3]/10 overflow-hidden hover:border-[#1f69f3]/30 transition-all"
                      >
                        <div className="flex items-center justify-between bg-[#1f69f3]/5 px-4 py-2 border-b border-[#1f69f3]/10">
                          <div className="flex items-center gap-2">
                            <span className="bg-[#1f69f3]/20 text-[#1f69f3] font-semibold px-2 py-0.5 rounded-full text-[12px]">
                              #{item.no}
                            </span>
                            <h3 className="font-medium text-gray-800 iphone:max-sm:text-[14px]">
                              {item.topicTH}
                            </h3>
                          </div>
                          <span className="bg-[#1f69f3] text-white font-semibold px-2.5 py-0.5 rounded-full text-[12px]">
                            {item.percent}%
                          </span>
                        </div>

                        <div className="p-4">
                          <p className="text-gray-600 italic text-sm iphone:max-sm:text-[12px] mb-3">
                            {item.topicEN}
                          </p>

                          <div className="mt-2">
                            <h4 className="text-[12px] font-medium text-[#1f69f3] mb-1">
                              Description:
                            </h4>
                            <p className="text-gray-700 iphone:max-sm:text-[12px]">
                              {item.desc.length
                                ? item.desc
                                : "No description provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Total percentage for mobile */}
                    <div className="bg-[#1f69f3]/10 rounded-lg p-4 mt-4 flex items-center justify-between">
                      <span className="font-semibold text-gray-800 iphone:max-sm:text-[14px]">
                        Total Evaluation
                      </span>
                      <span className="bg-[#1f69f3] text-white font-bold px-3 py-1 rounded-full iphone:max-sm:text-[14px]">
                        100%
                      </span>
                    </div>
                  </div>
                )}
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
