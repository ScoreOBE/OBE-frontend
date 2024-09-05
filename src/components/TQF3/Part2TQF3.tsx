import { COURSE_TYPE, TEACHING_METHOD } from "@/helpers/constants/enum";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Radio,
  Checkbox,
  TextInput,
  Textarea,
  Button,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Table, rem } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import AddIcon from "@/assets/icons/plus.svg?react";
import Icon from "../Icon";
import ModalManageCLO from "../Modal/TQF3/ModalManageCLO";
import {
  IconEdit,
  IconGripVertical,
  IconTrash,
  IconInfoCircle,
  IconPlus,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function Part2TQF3() {
  const dataTest = [
    {
      no: 1,
      cloTH: "อธิบายหลักการทำงานของระบบปฏิบัติการคอมพิวเตอร์.",
      cloEN: "Explain the working principle of computer operating systems.",
      Lec: "Lecture (if any)",
      Lab: "Laboratory (if any)",
    },
    {
      no: 2,
      cloTH: "อธิบายหลักการทำงานของระบบปฏิบัติการคอมพิวเตอร์.",
      cloEN: "Explain the working principle of computer operating systems.",
      Lec: "Lecture (if any)",
      Lab: "Laboratory (if any)",
    },
    {
      no: 3,
      cloTH: "อธิบายหลักการทำงานของระบบปฏิบัติการคอมพิวเตอร์.",
      cloEN: "Explain the working principle of computer operating systems.",
      Lec: "Lecture (if any)",
      Lab: "Laboratory (if any)",
    },
    {
      no: 4,
      cloTH: "อธิบายหลักการทำงานของระบบปฏิบัติการคอมพิวเตอร์.",
      cloEN: "Explain the working principle of computer operating systems.",
      Lec: "Lecture (if any)",
      Lab: "Laboratory (if any)",
    },
  ];
  const dataPlan = [
    {
      no: 1,
      Topic: "Course introduction",
      lecHr: 1.5,
      LabHr: 0.0,
    },
    {
      no: 2,
      Topic: "Operating-System Structures",
      lecHr: 1.5,
      LabHr: 0.0,
    },
    {
      no: 3,
      Topic: "Processes",
      lecHr: 1.5,
      LabHr: 0.0,
    },
    {
      no: 4,
      Topic: "Threads",
      lecHr: 1.5,
      LabHr: 0.0,
    },
    {
      no: 5,
      Topic: "Process Synchronization",
      lecHr: 1.5,
      LabHr: 0.0,
    },
  ];
  const [state, handlers] = useListState(dataTest);
  const [statePlan, handlersPlan] = useListState(dataPlan);
  const [openModalAddCLO, setOpenModalAddCLO] = useState(false);
  const [openModalEditCLO, setOpenModalEditCLO] = useState(false);

  return (
    <>
      <ModalManageCLO
        opened={openModalAddCLO}
        onClose={() => setOpenModalAddCLO(false)}
        type="add"
      />
      <ModalManageCLO
        opened={openModalEditCLO}
        onClose={() => setOpenModalEditCLO(false)}
        type="edit"
      />
      <div className="flex flex-col w-full max-h-full gap-4">
        {/* Description */}
        <div className="flex flex-col border-b-[1px] w-full border-[#e6e6e6]  gap-4 pb-8">
          <div className="flex text-secondary items-center w-full justify-between">
            <p className="font-semibold text-[15px]">
              วัตถุประสงค์ของกระบวนวิชา <span className="font-bold">(CLO)</span>{" "}
              <span className=" text-red-500">*</span>
            </p>
            <Button
              className="text-center rounded-[8px] text-[12px] w-fit font-semibold h-8 px-4"
              onClick={() => setOpenModalAddCLO(true)}
            >
              <div className="flex gap-2">
                <Icon IconComponent={AddIcon} />
                Add CLO
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
                Making changes to CLOs?{" "}
                <span className="font-extrabold">
                  Double-checking in TQF 3 (Parts 4 & 5 & 6) and TQF 5 (Parts 2
                  & 3)
                </span>{" "}
                ensures all information in your 261405 course materials aligns
                seamlessly
              </p>
            }
          ></Alert>
          {/* Table */}
          <DragDropContext
            onDragEnd={({ destination, source }) => {
              if (!destination) return;
              handlers.reorder({
                from: source.index,
                to: destination.index,
              });
            }}
          >
            <div
              className="overflow-x-auto w-full h-fit max-h-full border flex flex-col rounded-md border-secondary"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                height: "fit-content",
              }}
            >
              <Table stickyHeader striped className="w-full">
                <Table.Thead>
                  <Table.Tr className="bg-[#e5e7f6]">
                    <Table.Th className="w-[10%]">CLO No.</Table.Th>
                    <Table.Th className="w-[50%]">CLO Description</Table.Th>
                    <Table.Th className="w-[20%]">Learning Method</Table.Th>
                    <Table.Th className="w-[15%]">Action</Table.Th>
                    <Table.Th className="w-[5%]"></Table.Th>
                  </Table.Tr>
                </Table.Thead>

                <Droppable droppableId="dnd-list" direction="vertical">
                  {(provided) => (
                    <Table.Tbody
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="text-default text-[13px] font-normal w-full"
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
                            >
                              <Table.Td className="w-[10%]">{item.no}</Table.Td>
                              <Table.Td className="w-[50%]">
                                <div className="flex flex-col gap-0.5">
                                  <p>{item.cloTH}</p>
                                  <p>{item.cloEN}</p>
                                </div>
                              </Table.Td>
                              <Table.Td className="w-[20%]">
                                <div className="flex flex-col gap-0.5">
                                  <p>{item.Lec}</p>
                                  <p>{item.Lab}</p>
                                </div>
                              </Table.Td>
                              <Table.Td className="w-[15%]">
                                <div className="flex justify-start gap-4 items-center">
                                  <div className="flex justify-center items-center bg-transparent border-[1px] border-[#F39D4E] text-[#F39D4E] size-8 bg-none rounded-full cursor-pointer hover:bg-[#F39D4E]/10">
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
                                  snapshot.isDragging ? "w-[5%]" : ""
                                }`}
                              >
                                <div
                                  className="cursor-pointer hover:bg-hover text-tertiary size-8 rounded-full flex items-center justify-center"
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
              </Table>
            </div>
          </DragDropContext>
        </div>

        {/* Planning */}
        <div className="flex flex-col  w-full gap-4 pb-8">
          <div className="flex text-secondary items-center w-full justify-between">
            <p className="font-semibold text-[15px]">
              เนื้อหาวิชาและแผนการสอน
              <span className="font-bold">
                {" "}
                (Course content and Schedule){" "}
                <span className=" text-red-500">*</span>
              </span>
            </p>

            <Button className="text-center rounded-[8px] text-[12px] w-fit font-semibold h-8 px-4">
              <div className="flex gap-2">
                <Icon IconComponent={AddIcon} />
                Add Topic
              </div>
            </Button>
          </div>
          {/* Table */}
          <DragDropContext
            onDragEnd={({ destination, source }) => {
              if (!destination) return;
              handlers.reorder({
                from: source.index,
                to: destination.index,
              });
            }}
          >
            <div
              className="overflow-y-auto overflow-x-auto w-full h-fit max-h-full border flex flex-col rounded-md border-secondary"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                height: "fit-content",
              }}
            >
              <Table stickyHeader striped className="w-full">
                <Table.Thead>
                  <Table.Tr className="bg-[#e5e7f6]">
                    <Table.Th className="w-[10%] ">Week No.</Table.Th>
                    <Table.Th className="w-[30%]">Topic</Table.Th>
                    <Table.Th className="w-[20%] text-end">
                      Lecture Hour
                    </Table.Th>
                    <Table.Th className="w-[20%] text-end !pr-24">
                      Lab Hour
                    </Table.Th>
                    <Table.Th className="w-[15%]">Action</Table.Th>
                    <Table.Th className="w-[5%]"></Table.Th>
                  </Table.Tr>
                </Table.Thead>

                <Droppable droppableId="dnd-list" direction="vertical">
                  {(provided) => (
                    <Table.Tbody
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="text-default text-[13px] font-normal w-full"
                    >
                      {statePlan.map((item, index) => (
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
                              <Table.Td className="w-[10%]">{item.no}</Table.Td>
                              <Table.Td className="w-[30%]">
                                <p>{item.Topic}</p>
                              </Table.Td>
                              <Table.Td className="w-[20%] text-end">
                                <p>{item.lecHr}</p>
                              </Table.Td>
                              <Table.Td className="w-[20%] text-end !pr-24">
                                <p>{item.LabHr}</p>
                              </Table.Td>
                              <Table.Td className="w-[15%]">
                                <div className="flex justify-start gap-4 items-center">
                                  <div className="flex justify-center items-center bg-transparent border-[1px] border-[#F39D4E] text-[#F39D4E] size-8 bg-none rounded-full cursor-pointer hover:bg-[#F39D4E]/10">
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
                                  snapshot.isDragging ? "w-[5%]" : ""
                                }`}
                              >
                                <div
                                  className="cursor-pointer hover:bg-hover text-tertiary size-8 rounded-full flex items-center justify-center"
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

                <Table.Tfoot className="text-secondary font-semibold !h-[10px] ">
                  <Table.Tr className="bg-[#e5e7f6] border-none">
                    <Table.Th className="!rounded-bl-md" colSpan={2}>
                      Total
                    </Table.Th>
                    <Table.Th className="text-end">7.5</Table.Th>
                    <Table.Th className="text-end !pr-24">0.0</Table.Th>
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
