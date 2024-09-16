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
import CheckIcon from "@/assets/icons/Check.svg?react";
import { Table, rem } from "@mantine/core";
import { IconCheckbox } from "@tabler/icons-react";
import { IconInfoCircle, IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Icon from "../Icon";
import { IModelCourse } from "@/models/ModelCourse";
import { IModelCLO, IModelTQF3Part4 } from "@/models/ModelTQF3";
import { values } from "lodash";

type Props = {
  data: IModelCourse;
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function Part4TQF3({ data, setForm }: Props) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const form = useForm({
    mode: "controlled",
    initialValues: {
      data: data.TQF3?.part2?.clo.map((clo) => ({
        clo: clo,
        evals: [],
      })) as IModelTQF3Part4[],
    },
    validate: {},
  });

  useEffect(() => {
    if (form.getValues()) {
      console.log(form.getValues());
    }
  }, [form]);

  return (
    <div className="flex w-full max-h-full overflow-hidden">
      <div className="flex flex-col w-full">
        <Tabs
          defaultValue={form.getValues().data[0].clo?.id}
          classNames={{
            root: "overflow-hidden flex flex-col pt-4 w-full",
            tab: "px-0 pt-0 !bg-transparent hover:!text-tertiary",
            tabLabel: "!font-semibold",
          }}
        >
          <Tabs.List className="!bg-transparent items-center flex w-full gap-5">
            {form.getValues().data.map((item) => (
              <Tabs.Tab key={item.clo.id} value={item.clo.id}>
                <div className="flex flex-row items-center gap-2">
                  <Icon IconComponent={CheckIcon} className="text-[#24b9a5]" />
                  <p>CLO {item.clo.no}</p>
                </div>
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {form.getValues().data.map((item, index) => (
            <Tabs.Panel
              key={item.clo.id}
              value={item.clo.id}
              className="overflow-hidden flex h-full"
            >
              <div className="flex text-secondary overflow-y-auto  max-h-full gap-4 items-start w-full px-3 pb-7 py-5 pr-3 flex-col">
                <div className="flex flex-col gap-[2px] text-[15px]">
                  <p className="font-bold">
                    CLO {item.clo.no} -{" "}
                    <span className="font-semibold">{item.clo.descTH}</span>
                  </p>
                  <p className="font-bold">{item.clo.descEN}</p>
                </div>
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
                        Each CLO must be linked to at least one evaluation
                        topic.
                      </p>
                    }
                  ></Alert>
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
                    className="w-full -mt-2"
                    title={
                      <p className="font-semibold">
                        Select the evaluation topics you'd like to link with
                        your CLOs by checking the box in front of each topic in
                        the table below.
                      </p>
                    }
                  ></Alert>
                </div>

                <div
                  className=" w-full flex flex-col rounded-md border border-secondary  overflow-clip"
                  style={{
                    boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <Table stickyHeader striped className="w-full">
                    <Table.Thead className="z-[2]">
                      <Table.Tr className="bg-[#e5e7f6] ">
                        <Table.Th className="w-[1%] !rounded-tl-md"></Table.Th>
                        <Table.Th className="w-[14%]">Topic</Table.Th>
                        <Table.Th className="w-[55%]">Description</Table.Th>
                        <Table.Th className="w-[15%]">Evaluation week</Table.Th>
                        <Table.Th className=" w-[15%] pr-6 text-end">
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
                                  Fill the number of topic used to linked for
                                  CLO 1 and The total doesn't need added up to
                                  100%.
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
                      </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody className="text-[13px] font-normal text-[#333333] ">
                      {data.TQF3?.part3?.eval.map((evalItem) => {
                        const evalIndex = form
                          .getValues()
                          .data[index].evals.map((e, i) => {
                            if (e.eval.no === evalItem.no) return i;
                          })[0]!;

                        return (
                          <Table.Tr key={evalItem.no}>
                            <Table.Td>
                              <Checkbox
                                aria-label="Select row"
                                value={evalItem.no}
                                onChange={(event) => {
                                  if (
                                    event.target.checked &&
                                    !selectedRows.includes(evalItem.no)
                                  ) {
                                    setSelectedRows((prev) => [
                                      ...prev,
                                      evalItem.no,
                                    ]);
                                    form.insertListItem(`data.${index}.evals`, {
                                      eval: evalItem,
                                      evalWeek: [],
                                      percent: 0,
                                    });
                                  } else if (
                                    !event.target.checked &&
                                    selectedRows.includes(evalItem.no)
                                  ) {
                                    setSelectedRows(
                                      selectedRows.filter(
                                        (row) => row != evalItem.no
                                      )
                                    );
                                    {
                                      form.removeListItem(
                                        `data.${index}.evals`,
                                        evalIndex
                                      );
                                    }
                                  }
                                }}
                              />
                            </Table.Td>
                            <Table.Td>
                              <p className="w-fit">{evalItem.topicTH}</p>
                              <p className="w-fit">{evalItem.topicEN}</p>
                            </Table.Td>
                            <Table.Td>{evalItem.desc}</Table.Td>
                            <Table.Td>
                              <Select
                                data={[{ value: "test", label: "Test" }]}
                                classNames={{
                                  option: "text-[13px] py-2 px-3",
                                  options:
                                    "whitespace-pre-wrap leading-5 overflow-y-auto",
                                  input: `whitespace-break-spaces flex flex-col flex-wrap ${
                                    !selectedRows.includes(evalItem.no) &&
                                    "!bg-hover"
                                  }`,
                                }}
                              />
                            </Table.Td>
                            <Table.Td className="pr-6 text-end text-b1 ">
                              <div className="flex font-semibold flex-row items-center gap-2">
                                <TextInput
                                  // disabled={
                                  //   !form
                                  //     .getValues()
                                  //     .data[index].evals.find((e) => {
                                  //       e.eval.no === evalItem.no;
                                  //     })
                                  // }
                                  classNames={{
                                    input: `!rounded-[4px] ${
                                      !form
                                        .getValues()
                                        .data[index].evals.find((e) => {
                                          e.eval.no === evalItem.no;
                                        }) && "!bg-hover"
                                    }`,
                                  }}
                                  {...form.getInputProps(
                                    `data.${index}.evals.${evalIndex}.percent`
                                  )}
                                ></TextInput>
                                %
                              </div>
                            </Table.Td>
                          </Table.Tr>
                        );
                      })}
                    </Table.Tbody>

                    <Table.Tfoot className="text-secondary   font-semibold  ">
                      <Table.Tr className="bg-[#e5e7f6] border-none">
                        <Table.Th
                          className="text-[14px] !rounded-bl-md"
                          colSpan={4}
                        >
                          Total
                        </Table.Th>
                        <Table.Th className="text-[16px] text-end pr-6">
                          60 %
                        </Table.Th>
                      </Table.Tr>
                    </Table.Tfoot>
                  </Table>
                </div>
              </div>
            </Tabs.Panel>
          ))}
        </Tabs>

        {/* CLO Map Assessmen Tool */}
      </div>
    </div>
  );
}
