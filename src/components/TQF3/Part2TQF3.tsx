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
import { IconEdit, IconGripVertical, IconTrash } from "@tabler/icons-react";
import {
  IconExclamationCircle,
  IconInfoCircle,
  IconPlus,
} from "@tabler/icons-react";
import { useEffect } from "react";

type Props = {};
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
  const [state, handlers] = useListState(dataTest);

  useEffect(() => {
    if (dataTest) {
      handlers.setState(dataTest);
    }
  }, [dataTest]);
  return (
    <div className="flex w-full max-h-full">
      <div className="flex flex-col border-b-[1px] w-full border-[#e6e6e6]  gap-5">
        <div className="flex text-secondary items-center w-full justify-between">
          <p className="font-medium">วัตถุประสงค์ของกระบวนวิชา (CLO)</p>
          <Button
            className="rounded-[8px] text-[12px] w-fit font-medium h-8 px-4"
            // onClick={() => setOpenAddModal(true)}
          >
            <IconPlus className="h-5 w-5 mr-1" stroke={1.5} color="#ffffff" />
            Add CLO
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
            <p>
              Making changes to CLOs?{" "}
              <span>
                Double-checking in TQF 3 (Parts 4 & 5 & 6) and TQF 5 (Parts 2 &
                3)
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
            className="overflow-y-auto overflow-x-auto w-full h-fit max-h-full border flex flex-col rounded-lg border-secondary"
            style={{ height: "fit-content" }}
          >
            <Table stickyHeader striped className="w-full">
              <Table.Thead>
                <Table.Tr className="bg-[#F4F5FE]">
                  <Table.Th className="w-[10%]">CLO No.</Table.Th>
                  <Table.Th className="w-[40%]">CLO Description</Table.Th>
                  <Table.Th className="w-[20%]">Learning Method</Table.Th>
                  <Table.Th className="w-[20%]">Action</Table.Th>
                  <Table.Th className="w-[10%]"></Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Droppable droppableId="dnd-list" direction="vertical">
                {(provided) => (
                  <Table.Tbody
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="text-default text-b3 w-full"
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
                            <Table.Td className="w-[10%]">{item.no}</Table.Td>
                            <Table.Td className="w-[40%]">
                              {item.cloTH}
                            </Table.Td>
                            <Table.Td className="w-[20%]">{item.Lab}</Table.Td>
                            <Table.Td className="w-[20%]">
                              <div className="flex justify-start gap-4 items-center">
                                <div className="flex justify-center items-center bg-transparent border-[1px] border-[#F39D4E] text-[#F39D4E] size-8 bg-none rounded-full cursor-pointer hover:bg-[#F39D4E]/10">
                                  <IconEdit className="size-4" stroke={1.5} />
                                </div>
                                <div className="flex justify-center items-center bg-transparent border-[1px] size-8 bg-none rounded-full cursor-pointer border-[#FF4747] text-[#FF4747] hover:bg-[#FF4747]/10">
                                  <IconTrash className="size-4" stroke={1.5} />
                                </div>
                              </div>
                            </Table.Td>
                            <Table.Td
                              className={`${
                                snapshot.isDragging ? "w-[200px]" : ""
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
            </Table>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
