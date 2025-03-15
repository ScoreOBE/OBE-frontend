import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button, Alert, Checkbox, Radio } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Table } from "@mantine/core";
import Icon from "../Icon";
import IconAdd from "@/assets/icons/plus.svg?react";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconTrash from "@/assets/icons/trash.svg?react";
import IconEdit from "@/assets/icons/edit.svg?react";
import IconGripVertical from "@/assets/icons/verticalGrip.svg?react";
import { useEffect, useState } from "react";
import ModalManageCLO, { LearningMethod } from "../Modal/TQF3/ModalManageCLO";
import ModalManageCourseContent from "../Modal/TQF3/ModalManageCourseContent";
import unplug from "@/assets/image/unplug.png";
import { IModelCLO, IModelSchedule, IModelTQF3Part2 } from "@/models/ModelTQF3";
import { cloneDeep, isEqual } from "lodash";
import { EVALUATE_TYPE, TEACHING_METHOD } from "@/helpers/constants/enum";
import MainPopup from "../Popup/MainPopup";
import { useAppDispatch, useAppSelector } from "@/store";
import { updatePartTQF3 } from "@/store/tqf3";
import { useSearchParams } from "react-router-dom";
import { PartTopicTQF3 } from "@/helpers/constants/TQF3.enum";

type Props = {
  setForm?: React.Dispatch<React.SetStateAction<any>>;
};

export default function Part2TQF3({ setForm = () => {} }: Props) {
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [params, setParams] = useSearchParams({});
  const tqf3 = useAppSelector((state) => state.tqf3);
  const disabled =
    tqf3.courseSyllabus ||
    (parseInt(params.get("year") || "") !== academicYear.year &&
      parseInt(params.get("semester") || "") !== academicYear.semester);
  const dispatch = useAppDispatch();
  const [editData, setEditData] = useState<any>();
  const [openModalAddCLO, setOpenModalAddCLO] = useState(false);
  const [openModalEditCLO, setOpenModalEditCLO] = useState(false);
  const [openPopupDelCLO, setOpenPopupDelCLO] = useState(false);
  const [openModalAddTopic, setOpenModalAddTopic] = useState(false);
  const [openModalEditTopic, setOpenModalEditTopic] = useState(false);
  const [openPopupDelTopic, setOpenPopupDelTopic] = useState(false);

  const form = useForm({
    mode: "controlled",
    initialValues: {
      teachingMethod: [],
      evaluate: undefined,
      clo: [],
      schedule: [],
    } as Partial<IModelTQF3Part2>,
    validate: {
      teachingMethod: (value) =>
        !value?.length && "Select Teaching Method at least one",
      evaluate: (value) => !value?.length && "Evaluation is required",
      clo: (value) => !value?.length && "Add CLO at least one",
      schedule: (value) => !value?.length && "Schedule is required",
    },
    validateInputOnBlur: true,
    onValuesChange: (values, previous) => {
      if (!isEqual(values.clo, previous.clo)) {
        values.clo?.forEach((clo, index) => {
          clo.no = index + 1;
        });
      } else if (!isEqual(values.schedule, previous.schedule)) {
        values.schedule?.forEach((week, index) => {
          week.weekNo = index + 1;
        });
      }
      if (!isEqual(values, previous)) {
        dispatch(
          updatePartTQF3({ part: "part2", data: cloneDeep(form.getValues()) })
        );
        setForm(form);
      }
    },
  });

  useEffect(() => {
    if (tqf3.courseSyllabus) return;
    if (tqf3.part2) {
      form.setValues(cloneDeep(tqf3.part2));
    }
  }, []);

  const onClickDeleteCLO = () => {
    form.removeListItem("clo", editData.no - 1);
    setOpenPopupDelCLO(false);
    setEditData(undefined);
  };

  const onClickDeleteTopic = () => {
    form.removeListItem("schedule", editData.weekNo - 1);
    setOpenPopupDelTopic(false);
    setEditData(undefined);
  };

  return (
    <>
      <ModalManageCLO
        opened={openModalAddCLO}
        onClose={() => setOpenModalAddCLO(false)}
        type="add"
        data={form.getValues().clo!}
        setCloList={(value: IModelCLO[]) =>
          form.setFieldValue("clo", [...form.getValues().clo!, ...value])
        }
      />
      <ModalManageCLO
        opened={openModalEditCLO}
        onClose={() => setOpenModalEditCLO(false)}
        type="edit"
        data={editData}
        setCloList={(value: IModelCLO) =>
          form.setFieldValue(`clo.${editData.no - 1}`, value)
        }
      />
      <ModalManageCourseContent
        opened={openModalAddTopic}
        onClose={() => setOpenModalAddTopic(false)}
        type="add"
        teachingMethod={form.getValues().teachingMethod ?? []}
        data={form.getValues().schedule!}
        setScheduleList={(value: IModelSchedule[]) =>
          form.setFieldValue("schedule", [
            ...form.getValues().schedule!,
            ...value,
          ])
        }
      />
      <ModalManageCourseContent
        opened={openModalEditTopic}
        onClose={() => setOpenModalEditTopic(false)}
        type="edit"
        teachingMethod={form.getValues().teachingMethod ?? []}
        data={editData}
        setScheduleList={(value: IModelSchedule) =>
          form.setFieldValue(`schedule.${editData.weekNo - 1}`, value)
        }
      />
      <MainPopup
        opened={openPopupDelCLO}
        onClose={() => setOpenPopupDelCLO(false)}
        type="delete"
        title={`Delete CLO ${editData?.no}`}
        message={
          <>
            <Alert
              variant="light"
              color="red"
              title={
                <p className="acerSwift:max-macair133:!text-b3">
                  This action cannot be undone. After you delete this CLO,{" "}
                  <br /> it will be permanently deleted from this course.
                </p>
              }
              icon={
                <Icon
                  IconComponent={IconExclamationCircle}
                  className="size-6 acerSwift:max-macair133:size-5"
                />
              }
            ></Alert>
            <div className="flex flex-col mt-3 ">
              <p className="text-b4 acerSwift:max-macair133:!text-b5 text-[#808080]">
                CLO Description
              </p>
              <p className=" -translate-y-[2px] text-b1 acerSwift:max-macair133:!text-b2">
                {editData?.descTH}
              </p>
              <p className=" -translate-y-[2px] text-b1 acerSwift:max-macair133:!text-b2">
                {editData?.descEN}
              </p>
            </div>
          </>
        }
        labelButtonRight="Delete CLO"
        action={onClickDeleteCLO}
      />
      <MainPopup
        opened={openPopupDelTopic}
        onClose={() => setOpenPopupDelTopic(false)}
        type="delete"
        title={`Delete Course Content Week ${editData?.weekNo}`}
        message={
          <>
            <Alert
              variant="light"
              color="red"
              title={
                <p>
                  This action cannot be undone. After you delete this Course
                  Content, <br /> it will be permanently deleted from this
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
              <p className="text-b4  text-[#808080]">Course Content Topic</p>
              <p className="-translate-y-[2px] text-b1">{editData?.topic}</p>
            </div>
          </>
        }
        labelButtonRight="Delete Course Content"
        action={onClickDeleteTopic}
      />
      {tqf3.part1?.updatedAt ? (
        !tqf3.courseSyllabus ? (
          <div className="flex flex-col w-full max-h-full gap-5 ">
            <div className=" border-b-[1px] border-[#e6e6e6] justify-between h-fit w-full  items-top  grid grid-cols-3 pb-5   ">
              <div className="flex text-secondary flex-col  text-[15px] acerSwift:max-macair133:!text-b3">
                <p className="font-semibold">
                  ลักษณะของกระบวนวิชา <span className=" text-red-500">*</span>
                </p>
                <p className="font-semibold">Teaching Method</p>
                <p className="error-text mt-1">
                  {form.getInputProps("teachingMethod").error}
                </p>
              </div>
              <Checkbox.Group
                key={form.key("teachingMethod")}
                {...form.getInputProps("teachingMethod")}
                error={<></>}
              >
                <div className="flex flex-col text-default gap-4">
                  {Object.values(TEACHING_METHOD).map((key) => (
                    <Checkbox
                      key={key.en}
                      classNames={{
                        label:
                          "font-medium text-b3 acerSwift:max-macair133:!text-b4",
                      }}
                      label={`${key.th} (${key.en})`}
                      value={key.en}
                      disabled={disabled}
                    />
                  ))}
                </div>
              </Checkbox.Group>
            </div>
            <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-center  grid grid-cols-3 pb-5  ">
              <div className="flex text-secondary flex-col text-[15px] acerSwift:max-macair133:!text-b3">
                <p className="font-semibold">
                  การวัดและประเมินผล <span className=" text-red-500">*</span>
                </p>
                <p className="font-semibold">Evaluation</p>
                <p className="error-text mt-1">
                  {form.getInputProps("evaluate").error}
                </p>
              </div>
              <Radio.Group
                key={form.key("evaluate")}
                {...form.getInputProps("evaluate")}
                error={<></>}
              >
                <div className="flex gap-8 text-default">
                  {Object.values(EVALUATE_TYPE).map((item) => (
                    <Radio
                      key={item}
                      classNames={{
                        radio: `${disabled && "!cursor-default"}`,
                        label: `${
                          disabled && "!cursor-default"
                        } font-medium text-b3 acerSwift:max-macair133:!text-b4`,
                      }}
                      label={item}
                      value={item}
                      disabled={disabled}
                    />
                  ))}
                </div>
              </Radio.Group>
            </div>
            {/* CLO */}
            <div
              key={form.key("clo")}
              {...form.getInputProps("clo")}
              className="flex flex-col border-b-[1px] w-full border-[#e6e6e6] gap-4 pb-2"
            >
              <div className="flex text-secondary items-center w-full justify-between">
                <p className="font-semibold text-[15px] acerSwift:max-macair133:!text-b2">
                  ผลลัพธ์การเรียนรู้ของกระบวนวิชา{" "}
                  <span className="font-bold">
                    (Course Learning Objective: CLO)
                  </span>
                  <span className=" text-red-500">*</span>
                </p>
                {!disabled && (
                  <Button
                    className="text-center px-4"
                    onClick={() => setOpenModalAddCLO(true)}
                  >
                    <div className="flex gap-2 acerSwift:max-macair133:!text-b5">
                      <Icon IconComponent={IconAdd} />
                      Add CLO
                    </div>
                  </Button>
                )}
              </div>
              <DragDropContext
                onDragEnd={({ destination, source }) => {
                  if (!destination) return;
                  form.reorderListItem("clo", {
                    from: source.index,
                    to: destination.index,
                  });
                }}
              >
                <div
                  className="overflow-x-auto mt-1 w-full h-fit max-h-full border flex flex-col rounded-md border-secondary"
                  style={{
                    boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                    height: "fit-content",
                  }}
                >
                  <Table stickyHeader striped className="w-full">
                    <Table.Thead className="acerSwift:max-macair133:!text-b3">
                      <Table.Tr className="bg-[#e5e7f6]">
                        <Table.Th className="w-[10%]">CLO No.</Table.Th>
                        <Table.Th className="w-[50%]">CLO Description</Table.Th>
                        <Table.Th className="w-[20%]">Learning Method</Table.Th>
                        {!disabled && (
                          <>
                            <Table.Th className="w-[15%]">Action</Table.Th>
                            <Table.Th className="w-[5%]"></Table.Th>
                          </>
                        )}
                      </Table.Tr>
                    </Table.Thead>

                    {!form.getValues().clo?.length ? (
                      <Table.Tbody>
                        <Table.Tr>
                          <Table.Td colSpan={5} className="text-center">
                            No CLO
                          </Table.Td>
                        </Table.Tr>
                      </Table.Tbody>
                    ) : (
                      <Droppable droppableId="dnd-list" direction="vertical">
                        {(provided) => (
                          <Table.Tbody
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="text-default text-b3 acerSwift:max-macair133:!text-b4 font-normal w-full"
                          >
                            {form.getValues().clo?.map((item, index) => (
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
                                    <Table.Td className="w-[10%]">
                                      {item.no}
                                    </Table.Td>
                                    <Table.Td className="w-[50%]">
                                      <div className="flex flex-col gap-0.5">
                                        <p>{item.descTH}</p>
                                        <p>{item.descEN}</p>
                                      </div>
                                    </Table.Td>
                                    <Table.Td className="w-[20%]">
                                      <div className="flex flex-col gap-0.5">
                                        {item.learningMethod.map((method) => (
                                          <p key={method}>
                                            {method == LearningMethod.Other
                                              ? item.other
                                              : method}
                                          </p>
                                        ))}
                                      </div>
                                    </Table.Td>
                                    {!disabled && (
                                      <>
                                        <Table.Td className="w-[15%]">
                                          <div className="flex justify-start gap-4 items-center">
                                            <div
                                              className="flex justify-center items-center bg-transparent border-[1px] border-[#F39D4E] text-[#F39D4E] size-8 bg-none rounded-full cursor-pointer hover:bg-[#F39D4E]/10"
                                              onClick={() => {
                                                setEditData(item);
                                                setOpenModalEditCLO(true);
                                              }}
                                            >
                                              <Icon
                                                IconComponent={IconEdit}
                                                className="size-4 stroke-[2px]"
                                              />
                                            </div>
                                            <div
                                              className="flex justify-center items-center bg-transparent border-[1px] size-8 bg-none rounded-full cursor-pointer border-[#FF4747] text-[#FF4747] hover:bg-[#FF4747]/10"
                                              onClick={() => {
                                                setEditData(item);
                                                setOpenPopupDelCLO(true);
                                              }}
                                            >
                                              <Icon
                                                IconComponent={IconTrash}
                                                className="size-4 stroke-[2px] acerSwift:max-macair133:!size-4"
                                              />
                                            </div>
                                          </div>
                                        </Table.Td>
                                        <Table.Td
                                          className={`${
                                            snapshot.isDragging ? "w-[5%]" : ""
                                          }`}
                                        >
                                          <div
                                            className="cursor-pointer hover:bg-hover text-tertiary size-8 rounded-full flex items-center justify-center"
                                            {...provided.dragHandleProps}
                                          >
                                            <Icon
                                              IconComponent={IconGripVertical}
                                              className="size-5 stroke-[2px]"
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
                  </Table>
                </div>
              </DragDropContext>
              <p className="error-text -mt-1">
                {form.getInputProps("clo").error}
              </p>
            </div>
            {/* Planning */}
            <div
              key={form.key("schedule")}
              {...form.getInputProps("schedule")}
              className="flex flex-col  w-full gap-4 pb-2"
            >
              <div className="flex text-secondary items-center w-full justify-between">
                <p className="font-semibold text-[15px] acerSwift:max-macair133:!text-b2">
                  เนื้อหาวิชาและแผนการสอน{" "}
                  <span className="font-bold">
                    (Course content and Schedule){" "}
                    <span className=" text-red-500">*</span>
                  </span>
                </p>
                {!disabled && (
                  <Button
                    className="text-center px-4"
                    onClick={() => setOpenModalAddTopic(true)}
                  >
                    <div className="flex gap-2 acerSwift:max-macair133:!text-b5">
                      <Icon IconComponent={IconAdd} />
                      Add Course Content
                    </div>
                  </Button>
                )}
              </div>
              <DragDropContext
                onDragEnd={({ destination, source }) => {
                  if (!destination) return;
                  form.reorderListItem("schedule", {
                    from: source.index,
                    to: destination.index,
                  });
                }}
              >
                <div
                  className="overflow-y-auto mt-1 overflow-x-auto w-full  h-fit max-h-full border flex flex-col rounded-md border-secondary"
                  style={{
                    boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                    height: "fit-content",
                  }}
                >
                  <Table stickyHeader striped className="w-full">
                    <Table.Thead className="acerSwift:max-macair133:!text-b3">
                      <Table.Tr className=" bg-bgTableHeader">
                        <Table.Th className="w-[10%] ">Week No.</Table.Th>
                        <Table.Th className="w-[30%]">Topic</Table.Th>
                        <Table.Th className="w-[20%] text-end">
                          Lecture Hour
                        </Table.Th>
                        <Table.Th className="w-[20%] text-end !pr-24">
                          Lab Hour
                        </Table.Th>
                        {!disabled && (
                          <>
                            <Table.Th className="w-[15%]">Action</Table.Th>
                            <Table.Th className="w-[5%]"></Table.Th>
                          </>
                        )}
                      </Table.Tr>
                    </Table.Thead>

                    {!form.getValues().schedule?.length ? (
                      <Table.Tbody>
                        <Table.Tr>
                          <Table.Td colSpan={6} className="text-center">
                            No Course content and Schedule
                          </Table.Td>
                        </Table.Tr>
                      </Table.Tbody>
                    ) : (
                      <Droppable droppableId="dnd-list" direction="vertical">
                        {(provided) => (
                          <Table.Tbody
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="text-default text-b3 acerSwift:max-macair133:!text-b4 font-normal w-full"
                          >
                            {form.getValues().schedule?.map((item, index) => (
                              <Draggable
                                key={item.weekNo.toString()}
                                index={index}
                                draggableId={item.weekNo.toString()}
                              >
                                {(provided, snapshot) => (
                                  <Table.Tr
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`table-row ${
                                      snapshot.isDragging ? "bg-hover" : ""
                                    }`}
                                  >
                                    <Table.Td className="w-[10%]">
                                      {item.weekNo}
                                    </Table.Td>
                                    <Table.Td className="w-[30%]">
                                      <p>{item.topic}</p>
                                    </Table.Td>
                                    <Table.Td className="w-[20%] text-end">
                                      <p>{item.lecHour}</p>
                                    </Table.Td>
                                    <Table.Td className="w-[20%] text-end !pr-24">
                                      <p>{item.labHour}</p>
                                    </Table.Td>
                                    {!disabled && (
                                      <>
                                        <Table.Td className="w-[15%]">
                                          <div className="flex justify-start gap-4 items-center">
                                            <div
                                              className="flex justify-center items-center bg-transparent border-[1px] border-[#F39D4E] text-[#F39D4E] size-8 bg-none rounded-full cursor-pointer hover:bg-[#F39D4E]/10"
                                              onClick={() => {
                                                setEditData(item);
                                                setOpenModalEditTopic(true);
                                              }}
                                            >
                                              <Icon
                                                IconComponent={IconEdit}
                                                className="size-4 stroke-[2px]"
                                              />
                                            </div>
                                            <div
                                              className="flex justify-center items-center bg-transparent border-[1px] size-8 bg-none rounded-full cursor-pointer border-[#FF4747] text-[#FF4747] hover:bg-[#FF4747]/10"
                                              onClick={() => {
                                                setEditData(item);
                                                setOpenPopupDelTopic(true);
                                              }}
                                            >
                                              <Icon
                                                IconComponent={IconTrash}
                                                className="size-4 stroke-[2px]"
                                              />
                                            </div>
                                          </div>
                                        </Table.Td>
                                        <Table.Td
                                          className={`${
                                            snapshot.isDragging ? "w-[5%]" : ""
                                          }`}
                                        >
                                          <div
                                            className="cursor-pointer hover:bg-hover text-tertiary size-8 rounded-full flex items-center justify-center"
                                            {...provided.dragHandleProps}
                                          >
                                            <Icon
                                              IconComponent={IconGripVertical}
                                              className="size-5 stroke-[2px]"
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

                    <Table.Tfoot className="text-secondary font-semibold !h-[10px] acerSwift:max-macair133:!text-b3">
                      <Table.Tr className=" bg-bgTableHeader border-none">
                        <Table.Th className="!rounded-bl-md" colSpan={2}>
                          Total
                        </Table.Th>
                        <Table.Th className="text-end">
                          {form
                            .getValues()
                            .schedule?.reduce(
                              (acc, { lecHour }) => acc + lecHour,
                              0.0
                            )
                            .toFixed(1)}
                        </Table.Th>
                        <Table.Th className="text-end !pr-24">
                          {form
                            .getValues()
                            .schedule?.reduce(
                              (acc, { labHour }) => acc + labHour,
                              0.0
                            )
                            .toFixed(1)}
                        </Table.Th>
                        {!disabled && (
                          <Table.Th
                            className="!rounded-br-md"
                            colSpan={2}
                          ></Table.Th>
                        )}
                      </Table.Tr>
                    </Table.Tfoot>
                  </Table>
                </div>
              </DragDropContext>
              <p className="error-text -mt-1">
                {form.getInputProps("schedule").error}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full text-[15px] acerSwift:max-macair133:text-b3 text-default border-b-2">
            <div className=" text-secondary acerSwift:max-macair133:!text-b2 font-semibold whitespace-break-spaces border-b pb-4">
              {PartTopicTQF3.part2}
            </div>
            <div className=" border-b-[1px] border-[#e6e6e6] justify-between h-fit w-full grid grid-cols-2 py-5">
              <div className="flex text-secondary flex-col  text-[15px] acerSwift:max-macair133:!text-b3">
                <p className="font-semibold">ลักษณะของกระบวนวิชา</p>
                <p className="font-semibold">Teaching Method</p>
              </div>
              <div className="flex flex-col text-default gap-2 font-medium text-b3 acerSwift:max-macair133:text-b4">
                {Object.values(TEACHING_METHOD)
                  .filter((key) => tqf3.part2?.teachingMethod?.includes(key.en))
                  .map((key) => (
                    <p key={key.en}>
                      {key.th} ({key.en})
                    </p>
                  ))}
              </div>
            </div>
            <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit items-center grid grid-cols-2 py-5">
              <div className="flex text-secondary flex-col text-[15px] acerSwift:max-macair133:!text-b3">
                <p className="font-semibold">การวัดและประเมินผล</p>
                <p className="font-semibold">Evaluation</p>
              </div>
              <div className="flex flex-col text-default font-medium text-b3 acerSwift:max-macair133:!text-b4">
                <p>{tqf3.part2?.evaluate}</p>
              </div>
            </div>
            <div className="flex flex-col border-b-[1px] w-full border-[#e6e6e6] gap-4 py-4">
              <div className="flex text-secondary items-center w-full justify-between">
                <p className="font-semibold text-[15px] acerSwift:max-macair133:!text-b2">
                  ผลลัพธ์การเรียนรู้ของกระบวนวิชา{" "}
                  <span className="font-bold">
                    (Course Learning Objective: CLO)
                  </span>
                </p>
              </div>
              <div
                className="overflow-x-auto mt-1 w-full h-fit max-h-full border flex flex-col rounded-md border-secondary"
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                  height: "fit-content",
                }}
              >
                <Table stickyHeader striped className="w-full">
                  <Table.Thead className="acerSwift:max-macair133:!text-b3">
                    <Table.Tr className="bg-[#e5e7f6]">
                      <Table.Th className="w-[10%]">CLO No.</Table.Th>
                      <Table.Th className="w-[50%]">CLO Description</Table.Th>
                      <Table.Th className="w-[20%]">Learning Method</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody className="text-default text-b3 acerSwift:max-macair133:!text-b4 font-normal w-full">
                    {tqf3.part2?.clo?.map((item) => (
                      <Table.Tr key={item.no.toString()}>
                        <Table.Td className="w-[10%]">{item.no}</Table.Td>
                        <Table.Td className="w-[50%]">
                          <div className="flex flex-col gap-0.5">
                            <p>{item.descTH}</p>
                            <p>{item.descEN}</p>
                          </div>
                        </Table.Td>
                        <Table.Td className="w-[20%]">
                          <div className="flex flex-col gap-0.5">
                            {item.learningMethod.map((method) => (
                              <p key={method}>
                                {method == LearningMethod.Other
                                  ? item.other
                                  : method}
                              </p>
                            ))}
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            </div>
            <div className="flex flex-col w-full gap-4 py-4">
              <div className="flex text-secondary items-center w-full justify-between">
                <p className="font-semibold text-[15px] acerSwift:max-macair133:!text-b2">
                  เนื้อหาวิชาและแผนการสอน{" "}
                  <span className="font-bold">
                    (Course content and Schedule)
                  </span>
                </p>
              </div>
              <div
                className="overflow-y-auto mt-1 overflow-x-auto w-full  h-fit max-h-full border flex flex-col rounded-md border-secondary"
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                  height: "fit-content",
                }}
              >
                <Table stickyHeader striped className="w-full">
                  <Table.Thead className="acerSwift:max-macair133:!text-b3">
                    <Table.Tr className=" bg-bgTableHeader">
                      <Table.Th className="w-[10%] ">Week No.</Table.Th>
                      <Table.Th className="w-[30%]">Topic</Table.Th>
                      <Table.Th className="w-[20%] text-end">
                        Lecture Hour
                      </Table.Th>
                      <Table.Th className="w-[20%] text-end !pr-24">
                        Lab Hour
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody className="text-default text-b3 acerSwift:max-macair133:!text-b4 font-normal w-full">
                    {tqf3.part2?.schedule?.map((item) => (
                      <Table.Tr key={item.weekNo.toString()}>
                        <Table.Td className="w-[10%]">{item.weekNo}</Table.Td>
                        <Table.Td className="w-[30%]">
                          <p>{item.topic}</p>
                        </Table.Td>
                        <Table.Td className="w-[20%] text-end">
                          <p>{item.lecHour}</p>
                        </Table.Td>
                        <Table.Td className="w-[20%] text-end !pr-24">
                          <p>{item.labHour}</p>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                  <Table.Tfoot className="text-secondary font-semibold !h-[10px] acerSwift:max-macair133:!text-b3">
                    <Table.Tr className=" bg-bgTableHeader border-none">
                      <Table.Th className="!rounded-bl-md" colSpan={2}>
                        Total
                      </Table.Th>
                      <Table.Th className="text-end">
                        {form
                          .getValues()
                          .schedule?.reduce(
                            (acc, { lecHour }) => acc + lecHour,
                            0.0
                          )
                          .toFixed(1)}
                      </Table.Th>
                      <Table.Th className="text-end !pr-24">
                        {form
                          .getValues()
                          .schedule?.reduce(
                            (acc, { labHour }) => acc + labHour,
                            0.0
                          )
                          .toFixed(1)}
                      </Table.Th>
                      {!disabled && (
                        <Table.Th
                          className="!rounded-br-md"
                          colSpan={2}
                        ></Table.Th>
                      )}
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
            <p className="   text-secondary font-semibold text-[22px] sm:max-ipad11:text-h1">
              Complete TQF3 Part 1 First
            </p>
            <p className=" text-[#333333] leading-6 font-medium text-b2 sm:max-ipad11:text-b3">
              To start TQF3 Part 2, please complete and save TQF3 Part 1. <br />{" "}
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
