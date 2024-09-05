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
  Tabs,
  Select,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import AddIcon from "@/assets/icons/plus.svg?react";
import { Table, rem } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { IconEdit, IconGripVertical, IconTrash } from "@tabler/icons-react";
import DrawerPLOdes from "../DrawerPLO";
import {
  IconExclamationCircle,
  IconInfoCircle,
  IconPlus,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Icon from "../Icon";

type Props = {};
export default function Part4TQF3() {
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
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  useEffect(() => {
    if (dataTest) {
      handlers.setState(dataTest);
    }
  }, [dataTest]);
  return (
    <div className="flex w-full max-h-full overflow-hidden">
      <div className="flex flex-col w-full">
        <Tabs
          classNames={{
            root: "overflow-hidden flex flex-col pt-4 px-3 pb-1",
            tab: "px-0 pt-0 !bg-transparent hover:!text-tertiary",
            tabLabel: "!font-semibold",
          }}
        >
          <Tabs.List className="!gap-7 !bg-transparent">
            <Tabs.Tab value="TH">
              <div className="flex flex-row items-center gap-2 ">CLO 1</div>
            </Tabs.Tab>
            <Tabs.Tab value="EN">
              <div className="flex flex-row items-center gap-2 ">CLO 2</div>
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
        {/* CLO Map Assessmen Tool */}
        <div className="flex text-secondary  max-h-full overflow-y-auto gap-4 items-start w-full pb-6 px-3 pt-3  pr-3 flex-col">
          <div className="flex flex-col gap-[2px] text-[15px]">
            <p className="font-bold">
              CLO 1 -{" "}
              <span className="font-semibold">
                อธิบายหลักการทำงานของระบบปฏิบัติการคอมพิวเตอร์
              </span>
            </p>
            <p className="font-bold">
              Explain the working principle of computer operating systems.
              <span className=" text-red-500">*</span>
            </p>
          </div>
          <div className="w-full">
            <Alert
              radius="md"
              icon={<IconInfoCircle />}
              variant="light"
              color="blue"
              classNames={{
                icon: "size-6",
                body: " flex justify-center",
              }}
              className="w-full"
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
          </div>

          <div
            className="overflow-x-auto w-full flex flex-col rounded-md border border-secondary  "
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <Table stickyHeader striped className="w-full">
              <Table.Thead className="z-[2]">
                <Table.Tr className="bg-[#e5e7f6] ">
                  <Table.Th className="w-[1%] !rounded-tl-md"></Table.Th>
                  <Table.Th className="w-[13%]">Topic</Table.Th>
                  <Table.Th className="w-[45%]">Description</Table.Th>
                  <Table.Th className="w-[20%]">Evaluation week</Table.Th>
                  <Table.Th className=" w-[16%] pr-6 text-end">
                    <div className="flex flex-row items-center gap-2">
                      Evaluate CLO
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
                            "Fill the number of topic used to linked for CLO 1
                            and The total doesn't need added up to 100%.
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
                  <Table.Th className=" w-[5%] !rounded-tr-md">Action</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody className="text-[13px] font-normal text-[#333333] ">
                {state.map((item, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>
                      <Checkbox
                        aria-label="Select row"
                        value={item.no}
                        checked={selectedRows.includes(item.no)}
                        onChange={(event) => {
                          if (
                            event.target.checked &&
                            !selectedRows.includes(item.no)
                          ) {
                            setSelectedRows((prev) => [...prev, item.no]);
                          } else if (
                            !event.target.checked &&
                            selectedRows.includes(item.no)
                          ) {
                            setSelectedRows(
                              selectedRows.filter((row) => row != item.no)
                            );
                          }
                        }}
                      />
                    </Table.Td>
                    <Table.Td>
                      <p className="w-fit">{item.topicTH}</p>
                      <p className="w-fit">{item.topicEN}</p>
                    </Table.Td>
                    <Table.Td>{item.des}</Table.Td>
                    <Table.Td>
                      <Select />
                    </Table.Td>
                    <Table.Td className="pr-6 text-end text-b1 ">
                      <div className="flex font-semibold flex-row items-center gap-2">
                        <TextInput
                          classNames={{ input: "!rounded-[4px]" }}
                        ></TextInput>
                        %
                      </div>
                    </Table.Td>
                    <Table.Td className="  pr-[30px]">
                      <div className="flex justify-start gap-4 items-center">
                        <div className="flex justify-center items-center bg-transparent border-[1px] border-[#F39D4E] text-[#F39D4E] size-8 bg-none rounded-full cursor-pointer hover:bg-[#F39D4E]/10">
                          <IconEdit className="size-4" stroke={1.5} />
                        </div>
                        <div className="flex justify-center items-center bg-transparent border-[1px] size-8 bg-none rounded-full cursor-pointer border-[#FF4747] text-[#FF4747] hover:bg-[#FF4747]/10">
                          <IconTrash className="size-4" stroke={1.5} />
                        </div>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>

              <Table.Tfoot className="text-secondary   font-semibold  ">
                <Table.Tr className="bg-[#e5e7f6] border-none">
                  <Table.Th className="text-[14px] !rounded-bl-md" colSpan={4}>
                    Total
                  </Table.Th>
                  <Table.Th className="text-[16px] text-end pr-6">60%</Table.Th>
                  <Table.Th className="!rounded-br-md"></Table.Th>
                </Table.Tr>
              </Table.Tfoot>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
