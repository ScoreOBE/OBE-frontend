import {
  Checkbox,
  TextInput,
  Alert,
  Tabs,
  Select,
  Tooltip,
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import CheckIcon from "@/assets/icons/Check.svg?react";
import { Table, rem } from "@mantine/core";
import { IconCheckbox } from "@tabler/icons-react";
import { IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Icon from "../Icon";
import { IModelCourse } from "@/models/ModelCourse";
import { IModelEval, IModelTQF3Part4 } from "@/models/ModelTQF3";
import { cloneDeep, isEqual } from "lodash";

type Props = {
  data: IModelCourse;
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function Part4TQF3({ data, setForm }: Props) {
  const form = useForm({
    mode: "controlled",
    initialValues: {
      data: [] as IModelTQF3Part4[],
    },
    validate: {
      // data: (value) => {
      //   for (const item of value) {
      //     item.evals.reduce;
      //   }
      // },
    },
    onValuesChange(values, previous) {
      values.data.forEach((item) => {
        item.evals.forEach((e) => {
          e.percent = !e.percent.toString().length
            ? 0
            : parseInt(e.percent as any);
        });
        item.percent = item.evals.reduce((acc, cur) => acc + cur.percent, 0);
      });
      if (!isEqual(values, previous)) {
        setForm(form);
      }
    },
  });

  useEffect(() => {
    if (data.TQF3?.part4) {
      form.setValues(cloneDeep(data.TQF3.part4));
    } else if (data.TQF3?.part2) {
      const evalList =
        data.TQF3.part3?.eval.map((e) => ({
          eval: e.id,
          evalWeek: [],
          percent: 0,
        })) ?? [];
      form.setFieldValue(
        "data",
        cloneDeep(
          data.TQF3?.part2?.clo?.map((clo) => ({
            clo,
            percent: 0,
            evals: evalList,
          }))
        ) ?? []
      );
    }
  }, [data]);

  useEffect(() => {
    if (form.getValues()) {
      console.log(form.getValues());
    }
  }, [form]);

  return (
    <div className="flex w-full h-full pt-3 pb-3">
      <Tabs
        defaultValue="percent"
        classNames={{
          root: "flex flex-col w-full h-full",
          tab: "px-0 pt-0 !bg-transparent hover:!text-tertiary",
          tabLabel: "!font-semibold",
          panel: "w-full h-fit max-h-full flex flex-col gap-2 rounded-lg",
        }}
      >
        <Tabs.List className="!bg-transparent items-center flex w-full gap-5">
          <Tabs.Tab value="percent">Evaluate</Tabs.Tab>
          <Tabs.Tab value="week">Evaluation Week</Tabs.Tab>
        </Tabs.List>
        <div className="overflow-auto flex w-full max-h-full mt-3">
          <Tabs.Panel value="percent">
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
                    Each CLO must be linked to at least one evaluation topic.
                  </p>
                }
              />
            </div>
            <div
              className="overflow-auto border border-secondary rounded-lg relative"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              <Table stickyHeader striped>
                <Table.Thead className="z-[2]">
                  <Table.Tr>
                    <Table.Th
                      className="min-w-[400px] z-[3] sticky left-0 !p-0"
                      style={{
                        boxShadow: "0px 0px 10px -5px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      <div className="w-full flex items-center px-[25px] h-[58px] border-r-[1px] border-bgTableHeader">
                        CLO Description
                      </div>
                    </Table.Th>
                    {data.TQF3?.part3?.eval.map((item) => (
                      <Table.Th
                        key={item.no}
                        className="min-w-[120px] max-w-[160px] !py-3.5 !px-2.5 z-0"
                      >
                        <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                          {item.topicTH}
                        </p>
                        <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                          {item.topicEN}
                        </p>
                      </Table.Th>
                    ))}
                    <Table.Th className="w-[25x] sticky right-0 !p-0">
                      <div className="w-full flex items-center px-[25px] h-[58px] border-l-[1px] border-bgTableHeader">
                        Evaluate CLO
                      </div>
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {form
                    .getValues()
                    .data.map(({ clo, percent, evals }, cloIndex) => (
                      <Table.Tr key={cloIndex} className="text-b3 text-default">
                        <Table.Td className="!p-0 sticky left-0 z-[1]">
                          <div className="flex flex-col gap-0.5 px-[25px] py-3 border-r-[1px] border-[#DEE2E6]">
                            <p className="text-secondary font-semibold">
                              CLO-{clo.no}
                            </p>
                            <p>{clo.descTH}</p>
                            <p>{clo.descEN}</p>
                          </div>
                        </Table.Td>
                        {evals.map((item, evalIndex: number) => (
                          <Table.Td
                            key={evalIndex}
                            className="!px-2.5 max-w-[200px]"
                          >
                            <div className="flex flex-col gap-2 max-w-full">
                              <NumberInput
                                className="w-[80px]"
                                hideControls
                                suffix="%"
                                allowNegative={false}
                                min={0}
                                max={
                                  data.TQF3?.part3?.eval.find(
                                    (e) => e.id == item.eval
                                  )?.percent
                                }
                                {...form.getInputProps(
                                  `data.${cloIndex}.evals.${evalIndex}.percent`
                                )}
                              />
                            </div>
                          </Table.Td>
                        ))}
                        <td className="!p-0 sticky right-0 z-[1] !bg-bgTableHeader">
                          {/* <Table.Td className="!p-0 sticky right-0 z-[1] !bg-bgTableHeader"> */}
                          <div className="flex h-full px-[25px] font-semibold text-b2 border-l-[1px] border-[#DEE2E6]">
                            {percent}%
                          </div>
                          {/* </Table.Td> */}
                        </td>
                      </Table.Tr>
                    ))}
                </Table.Tbody>
                <Table.Tfoot className="z-[2] sticky bottom-0">
                  <Table.Tr className="border-none text-secondary font-semibold">
                    <Table.Th className="!bg-bgTableHeader sticky left-0 text-b2 !rounded-bl-md border-r-[1px] border-[#DEE2E6]">
                      Total (Percentage)
                    </Table.Th>
                    {data.TQF3?.part3?.eval.map((item, evalIndex) => {
                      const totalPercent = form
                        .getValues()
                        .data.reduce(
                          (acc, cur) =>
                            acc + (cur.evals[evalIndex]?.percent || 0),
                          0
                        );

                      return (
                        <Table.Th
                          key={evalIndex}
                          className="!bg-bgTableHeader text-b2"
                        >
                          {totalPercent} / {item.percent}%
                        </Table.Th>
                      );
                    })}
                    <Table.Th className="!bg-[#34d9c3] text-default sticky right-0 text-b2 !rounded-br-md">
                      {form
                        .getValues()
                        .data.reduce((acc, cur) => acc + cur.percent, 0)}
                      %
                    </Table.Th>
                  </Table.Tr>
                </Table.Tfoot>
              </Table>
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="week">
            <div></div>
          </Tabs.Panel>
        </div>
      </Tabs>
      {/* <Tabs
        defaultValue="All"
        classNames={{
          root: "overflow-hidden flex flex-col pt-4 w-full h-full",
          tab: "px-0 pt-0 !bg-transparent hover:!text-tertiary",
          tabLabel: "!font-semibold",
        }}
      >
        <Tabs.List className="!bg-transparent items-center flex w-full gap-5">
          <Tabs.Tab value="All">All CLOs</Tabs.Tab>
          {form.getValues().data.map((item) => (
            <Tabs.Tab key={item.clo.id} value={item.clo.id}>
              <div className="flex flex-row items-center gap-2">
                <Icon IconComponent={CheckIcon} className="text-[#24b9a5]" />
                <p>CLO {item.clo.no}</p>
              </div>
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <div className="overflow-y-auto w-full max-h-full">
          <Tabs.Panel value="All">
            <div className="flex flex-col text-secondary gap-4 items-start w-full px-3 py-5">
              <div
                className="overflow-auto w-full flex flex-col rounded-md border border-secondary"
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
              >
                <Table stickyHeader striped className="w-full">
                  <Table.Thead className="z-[2]">
                    <Table.Tr className="bg-[#e5e7f6] ">
                      <Table.Th className="w-[15%]">CLO No.</Table.Th>
                      <Table.Th className="w-[55%]">CLO Description</Table.Th>
                      <Table.Th className=" w-[15%] pr-6 text-end">
                        <div className="flex flex-row items-center gap-2">
                          Evaluate CLO
                        </div>
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody className="text-[13px] font-semibold">
                    {data.TQF3?.part2?.clo.map((clo) => (
                      <Table.Tr key={clo.no}>
                        <Table.Td>{clo.no}</Table.Td>
                        <Table.Td>
                          <p className="w-fit">{clo.descTH}</p>
                          <p className="w-fit">{clo.descEN}</p>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>

                  <Table.Tfoot className="text-secondary font-semibold  ">
                    <Table.Tr className="bg-[#e5e7f6] border-none">
                      <Table.Th
                        className="text-[14px] !rounded-bl-md"
                        colSpan={3}
                      >
                        Total
                      </Table.Th>
                      <Table.Th className="text-[16px] text-end pr-6">
                        0 %
                      </Table.Th>
                    </Table.Tr>
                  </Table.Tfoot>
                </Table>
              </div>
            </div>
          </Tabs.Panel>
          {form.getValues().data.map((item, index) => (
            <Tabs.Panel key={item.clo.id} value={item.clo.id}>
              <div className="flex flex-col text-secondary gap-4 items-start w-full px-3 py-5">
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
                  className="overflow-auto w-full flex flex-col rounded-md border border-secondary"
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
                    <Table.Tbody className="text-[13px] font-semibold">
                      {data.TQF3?.part3?.eval.map((evalItem) => {
                        const evalIndex =
                          item.evals.map((e, i) => {
                            if (e.eval === evalItem.id) return i;
                          })[0] || 0;

                        return (
                          <Table.Tr
                            key={evalItem.no}
                            className={`${
                              item.evals.find((e) => e.eval == evalItem.id)
                                ? "text-default"
                                : "text-noData"
                            }`}
                          >
                            <Table.Td>
                              <Checkbox
                                classNames={{ input: "border-default" }}
                                value={evalItem.id}
                                checked={item.evals
                                  .map((e) => e.eval)
                                  .includes(evalItem.id)}
                                onChange={(event) => {
                                  if (
                                    event.target.checked &&
                                    !item.evals.find(
                                      (e) => e.eval == evalItem.id
                                    )
                                  ) {
                                    form.insertListItem(`data.${index}.evals`, {
                                      eval: evalItem.id,
                                      evalWeek: [],
                                      percent: 0,
                                    });
                                  } else if (
                                    !event.target.checked &&
                                    item.evals.find(
                                      (e) => e.eval == evalItem.id
                                    )
                                  ) {
                                    form.removeListItem(
                                      `data.${index}.evals`,
                                      evalIndex
                                    );
                                  }
                                }}
                              />
                            </Table.Td>
                            <Table.Td>
                              <p className="w-fit">{evalItem.topicTH}</p>
                              <p className="w-fit">{evalItem.topicEN}</p>
                            </Table.Td>
                            <Table.Td>
                              {evalItem.desc.length ? evalItem.desc : "-"}
                            </Table.Td>
                            <Table.Td>
                              <Select
                                // data={data.TQF3?.part2?.schedule.map(
                                //   (week) => ({
                                //     value: week.id,
                                //     label: week.weekNo.toString(),
                                //   })
                                // )}
                                data={[{ value: "1", label: "1" }]}
                                classNames={{
                                  option: "text-[13px] py-2 px-3",
                                  options:
                                    "whitespace-pre-wrap leading-5 overflow-y-auto",
                                  input: `whitespace-break-spaces flex flex-col flex-wrap`,
                                }}
                                disabled={
                                  !item.evals.find((e) => e.eval == evalItem.id)
                                }
                              />
                            </Table.Td>
                            <Table.Td className="pr-6 text-end text-b1 ">
                              <div className="flex font-semibold flex-row items-center gap-2">
                                <TextInput
                                  disabled={
                                    !item.evals.find(
                                      (e) => e.eval == evalItem.id
                                    )
                                  }
                                  {...form.getInputProps(
                                    `data.${index}.evals.${evalIndex}.percent`
                                  )}
                                ></TextInput>
                                % / {evalItem.percent}
                              </div>
                            </Table.Td>
                          </Table.Tr>
                        );
                      })}
                    </Table.Tbody>

                    <Table.Tfoot className="text-secondary font-semibold  ">
                      <Table.Tr className="bg-[#e5e7f6] border-none">
                        <Table.Th
                          className="text-[14px] !rounded-bl-md"
                          colSpan={4}
                        >
                          Total
                        </Table.Th>
                        <Table.Th className="text-[16px] text-end pr-6">
                          {item.evals.reduce(
                            (acc, cur) => acc + cur.percent,
                            0
                          )}
                          %
                        </Table.Th>
                      </Table.Tr>
                    </Table.Tfoot>
                  </Table>
                </div>
              </div>
            </Tabs.Panel>
          ))}
        </div>
      </Tabs> */}
    </div>
  );
}
