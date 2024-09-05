import { COURSE_TYPE, TEACHING_METHOD } from "@/helpers/constants/enum";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Radio,
  Checkbox,
  TextInput,
  Textarea,
  Button,
  Alert,
  Group,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import AddIcon from "@/assets/icons/plus.svg?react";
import { Table, rem } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { IconEdit, IconGripVertical, IconTrash } from "@tabler/icons-react";
import {
  IconExclamationCircle,
  IconInfoCircle,
  IconPlus,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Icon from "../Icon";
import ModalManageEvalTopic from "../Modal/TQF3/ModalManageEvalTopic";

type Props = {};
export default function Part3TQF3() {
  const dataTest = [
    {
      no: 1,
      topicTH: "สอบกลางภาค",
      topicEN: "Midterm Exam",
      des: "วัดผลความรู้ความเข้าใจเกี่ยวกับโครงสร้างและการทำงานของระบบปฏิบัติการขั้นสูงครอบคลุมทั้งภาคทฤษฎีและปฏิบัติ",
      evaPercent: "10%",
    },
    {
      no: 2,
      topicTH: "สอบกลางภาค",
      topicEN: "Midterm Exam",
      des: "วัดผลความรู้ความเข้าใจเกี่ยวกับโครงสร้างและการทำงานของระบบปฏิบัติการขั้นสูงครอบคลุมทั้งภาคทฤษฎีและปฏิบัติ",
      evaPercent: "10%",
    },
    {
      no: 3,
      topicTH: "สอบกลางภาค",
      topicEN: "Midterm Exam",
      des: "วัดผลความรู้ความเข้าใจเกี่ยวกับโครงสร้างและการทำงานของระบบปฏิบัติการขั้นสูงครอบคลุมทั้งภาคทฤษฎีและปฏิบัติ",
      evaPercent: "10%",
    },
    {
      no: 4,
      topicTH: "สอบกลางภาค",
      topicEN: "Midterm Exam",
      des: "วัดผลความรู้ความเข้าใจเกี่ยวกับโครงสร้างและการทำงานของระบบปฏิบัติการขั้นสูงครอบคลุมทั้งภาคทฤษฎีและปฏิบัติ",
      evaPercent: "10%",
    },
    {
      no: 5,
      topicTH: "สอบกลางภาค",
      topicEN: "Midterm Exam",
      des: "วัดผลความรู้ความเข้าใจเกี่ยวกับโครงสร้างและการทำงานของระบบปฏิบัติการขั้นสูงครอบคลุมทั้งภาคทฤษฎีและปฏิบัติ",
      evaPercent: "10%",
    },
    {
      no: 6,
      topicTH: "สอบกลางภาค",
      topicEN: "Midterm Exam",
      des: "วัดผลความรู้ความเข้าใจเกี่ยวกับโครงสร้างและการทำงานของระบบปฏิบัติการขั้นสูงครอบคลุมทั้งภาคทฤษฎีและปฏิบัติ",
      evaPercent: "10%",
    },
  ];
  const [state, handlers] = useListState(dataTest);
  const [openModalAddEvalTopic, setOpenModalAddEvalTopic] = useState(false);
  const [openModalEditEvalTopic, setOpenModalEditEvalTopic] = useState(false);

  return (
    <>
      <ModalManageEvalTopic
        opened={openModalAddEvalTopic}
        onClose={() => setOpenModalAddEvalTopic(false)}
        type="add"
      />
      <ModalManageEvalTopic
        opened={openModalEditEvalTopic}
        onClose={() => setOpenModalEditEvalTopic(false)}
        type="edit"
      />
      <div className="flex w-full">
        <div className="flex flex-col  w-full pb-8 gap-4">
          <div className="flex text-secondary gap-4 items-start w-full border-b-[1px] border-[#e6e6e6] mt-1 pb-6 flex-col">
            <div className="flex flex-row gap-1 text-[15px]">
              <p className="font-semibold">การกำหนดเกรด</p>
              <p className="font-bold">
                (Grading) <span className=" text-red-500">*</span>
              </p>
            </div>
            <div className="flex flex-col font-medium  text-[#333333]">
              <Radio.Group>
                <Group className="flex flex-col items-start">
                  <Radio
                    size="sm"
                    label="แบบอิงกลุ่ม (Norm-Referenced Grading)"
                  />
                  <Radio label="แบบอิงเกณฑ์ (Criterion-Referenced Grading)" />
                  <Radio label="แบบอิงเกณฑ์และอิงกลุ่ม (Criterion and Norm-Referenced Grading)" />
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

            <Button
              className="text-center rounded-[8px] text-[12px] w-fit font-semibold h-8 px-4"
              onClick={() => setOpenModalAddEvalTopic(true)}
            >
              <div className="flex gap-2">
                <Icon IconComponent={AddIcon} />
                Add Evaluation Topic
              </div>
            </Button>
          </div>
          <Alert
            radius="md"
            icon={<IconInfoCircle />}
            variant="light"
            color="blue"
            classNames={{
              icon: "size-6",
              body: " flex justify-center",
            }}
            title={
              <p className="font-semibold">
                Making changes to Evaluation Topic?{" "}
                <span className=" font-extrabold">
                  {" "}
                  Double-checking in TQF 5 (Parts 2)
                </span>{" "}
                ensures all information in your 261405 course materials aligns
                seamlessly
              </p>
            }
          ></Alert>

          {/* Table */}
          <DragDropContext
            onDragEnd={({ destination, source }) => {
              if (!destination) return; // Check if destination exists
              handlers.reorder({
                from: source.index,
                to: destination.index,
              });
            }}
          >
            <div
              className="overflow-x-auto w-full flex flex-col rounded-md border border-secondary"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              <Table stickyHeader striped className="w-full">
                <Table.Thead className="">
                  <Table.Tr className="bg-[#e5e7f6] ">
                    <Table.Th className="w-[5%] !rounded-tl-md">No.</Table.Th>
                    <Table.Th className=" w-[15%]">Topic</Table.Th>
                    <Table.Th className="w-[65%]">Description</Table.Th>
                    <Table.Th className="w-[5%] text-end">
                      <div className="flex flex-row items-center gap-2">
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
                              The total of all topic evaluations must added up
                              to{" "}
                              <span className=" font-bold text-secondary">
                                100%
                              </span>
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
                    <Table.Th className="w-[20%]">Action</Table.Th>
                    <Table.Th className="w-[5%] !rounded-tr-md"></Table.Th>
                  </Table.Tr>
                </Table.Thead>

                <Droppable droppableId="dnd-list" direction="vertical">
                  {(provided) => (
                    <Table.Tbody
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="text-[13px] font-normal text-[#333333] w-full"
                    >
                      {state.map((item, index) => (
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
                              // style={{
                              //   ...provided.draggableProps.style,
                              //   display: "table-row",
                              // }}
                            >
                              <Table.Td className="w-[5%] ">{item.no}</Table.Td>
                              <Table.Td className="w-[15%] ">
                                <p>{item.topicTH}</p>
                                <p>{item.topicEN}</p>
                              </Table.Td>
                              <Table.Td className="w-[65%]">
                                {item.des}
                              </Table.Td>
                              <Table.Td className="w-[5%] text-end text-b1 ">
                                <p>{item.evaPercent}</p>
                              </Table.Td>
                              <Table.Td className="w-[20%]">
                                <div className="flex justify-start gap-4 items-center">
                                  <div
                                    className="flex justify-center items-center bg-transparent border-[1px] border-[#F39D4E] text-[#F39D4E] size-8 bg-none rounded-full cursor-pointer hover:bg-[#F39D4E]/10"
                                    onClick={() =>
                                      setOpenModalEditEvalTopic(true)
                                    }
                                  >
                                    <IconEdit className="size-4" stroke={1.5} />
                                  </div>
                                  <div className="flex justify-center items-center bg-transparent border-[1px] size-8 bg-none rounded-full cursor-pointer border-[#FF4747] text-[#FF4747] hover:bg-[#FF4747]/10">
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
                            </Table.Tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Table.Tbody>
                  )}
                </Droppable>
                <Table.Tfoot className="text-secondary font-semibold">
                  <Table.Tr className="bg-[#e5e7f6] border-none">
                    <Table.Th
                      className="text-[14px] !rounded-bl-md"
                      colSpan={3}
                    >
                      Total
                    </Table.Th>
                    <Table.Th className="text-[16px] text-end">60%</Table.Th>
                    <Table.Th className="!rounded-br-md" colSpan={2}></Table.Th>
                  </Table.Tr>
                </Table.Tfoot>
              </Table>
            </div>
          </DragDropContext>
        </div>
      </div>
    </>
  );
}
