import { Alert, Tabs, NumberInput, MultiSelect } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Table } from "@mantine/core";
import { IconCheckbox } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { IModelTQF3Part4 } from "@/models/ModelTQF3";
import { cloneDeep, isEqual } from "lodash";
import unplug from "@/assets/image/unplug.png";
import { useAppSelector } from "@/store";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function Part4TQF3({ setForm }: Props) {
  const tqf3 = useAppSelector((state) => state.tqf3);
  const form = useForm({
    mode: "controlled",
    initialValues: {
      data: [] as IModelTQF3Part4[],
    },
    validate: {
      // data: (value) => {
      //   return value.reduce((acc, cur) => acc + cur.percent, 0) != 100 && "";
      // },
      data: {
        percent: (value) =>
          value == 0 && "CLO must be linked to at least one evaluation topic",
      },
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
        // setForm(form);
      }
    },
  });

  useEffect(() => {
    if (tqf3.part4) {
      form.setValues(cloneDeep(tqf3.part4));
    } else if (tqf3.part2) {
      const evalList =
        tqf3.part3?.eval.map((e) => ({
          eval: e.id,
          evalWeek: [],
          percent: 0,
        })) ?? [];
      form.setFieldValue(
        "data",
        cloneDeep(
          tqf3?.part2?.clo?.map((clo) => ({
            clo: clo.id,
            percent: 0,
            evals: evalList,
          }))
        ) ?? []
      );
    }
  }, []);

  return tqf3?.part3?.updatedAt ? (
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
                        filter: "drop-shadow(2px 0px 2px rgba(0, 0, 0, 0.3))",
                      }}
                    >
                      <div className="w-full flex items-center px-[25px] h-[58px] border-r-[1px] border-bgTableHeader">
                        CLO Description
                      </div>
                    </Table.Th>
                    {tqf3?.part3?.eval.map((item) => (
                      <Table.Th
                        key={item.no}
                        className="min-w-[120px] max-w-[160px] !py-3.5 !px-4.5 z-0"
                      >
                        <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                          {item.topicTH}
                        </p>
                        <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                          {item.topicEN}
                        </p>
                      </Table.Th>
                    ))}
                    <Table.Th
                      style={{
                        filter: "drop-shadow(-2px 0px 2px  rgba(0, 0, 0, 0.3))",
                      }}
                      className="w-[55px] sticky right-0 !p-0"
                    >
                      <div className="w-[90px] text-nowrap flex items-center justify-center h-[58px] border-l-[1px]  border-bgTableHeader">
                        Total <br /> CLO (%)
                      </div>
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {form
                    .getValues()
                    .data.map(({ clo, percent, evals }, cloIndex) => {
                      const cloItem = tqf3?.part2?.clo.find(
                        (e) => e.id == clo
                      )!;
                      return (
                        <Table.Tr
                          key={cloIndex}
                          className="text-b3 table-row h-full text-default"
                        >
                          <Table.Td
                            key={form.key(`data.${cloIndex}.percent`)}
                            style={{
                              filter:
                                "drop-shadow(2px 0px 2px rgba(0, 0, 0, 0.3))",
                            }}
                            className="!p-0 sticky left-0 z-[1]"
                            {...form.getInputProps(`data.${cloIndex}.percent`)}
                          >
                            <div className="flex flex-col gap-0.5 px-[25px] py-3 border-r-[1px] border-[#DEE2E6]">
                              <p className="text-secondary font-semibold">
                                CLO-{cloItem.no}
                              </p>
                              <p>{cloItem.descTH}</p>
                              <p>{cloItem.descEN}</p>
                              <p className="text-error text-b3 -mt-1">
                                {
                                  form.getInputProps(`data.${cloIndex}.percent`)
                                    .error
                                }
                              </p>
                            </div>
                          </Table.Td>
                          {evals.map((item, evalIndex) => (
                            <Table.Td
                              key={evalIndex}
                              className="!px-4.5 max-w-[200px]"
                            >
                              <div className="flex flex-col gap-2 max-w-full">
                                <NumberInput
                                  className="w-[80px]"
                                  hideControls
                                  suffix="%"
                                  allowNegative={false}
                                  min={0}
                                  max={
                                    tqf3?.part3?.eval.find(
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

                          <td
                            style={{
                              filter:
                                "drop-shadow(-2px 0px 2px rgba(0, 0, 0, 0.3))",
                            }}
                            className="!bg-bgTableHeader !p-0 !h-full sticky z-[1] right-0 "
                          >
                            <div className="  max-h-full items-center justify-center px-[25px]  font-semibold text-b2 border-l-[1px] border-[#DEE2E6]">
                              {percent}%
                            </div>
                          </td>
                        </Table.Tr>
                      );
                    })}
                </Table.Tbody>
                <Table.Tfoot className="z-[2] sticky bottom-0">
                  <Table.Tr className="border-none text-secondary font-semibold">
                    <Table.Th
                      style={{
                        filter: "drop-shadow(2px 0px 2px rgba(0, 0, 0, 0.3))",
                      }}
                      className="!bg-bgTableHeader sticky left-0 text-b2 !rounded-bl-md border-r-[1px] border-[#DEE2E6]"
                    >
                      Total Assessment (%)
                    </Table.Th>
                    {tqf3?.part3?.eval.map((item, evalIndex) => {
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
                    <Table.Th
                      style={{
                        filter: "drop-shadow(-2px 0px 2px  rgba(0, 0, 0, 0.3))",
                      }}
                      className="!bg-[#ccd1fb] text-default sticky right-0 text-b1 font-extrabold !rounded-br-md"
                    >
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
                        filter: "drop-shadow(2px 0px 2px rgba(0, 0, 0, 0.3))",
                      }}
                    >
                      <div className="w-full flex items-center px-[25px] h-[58px] border-r-[1px] border-bgTableHeader">
                        CLO Description
                      </div>
                    </Table.Th>
                    {tqf3?.part3?.eval.map((item) => (
                      <Table.Th
                        key={item.no}
                        className="min-w-[120px] max-w-[160px] !py-3.5 !px-4.5 z-0"
                      >
                        <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                          {item.topicTH}
                        </p>
                        <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                          {item.topicEN}
                        </p>
                      </Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {form.getValues().data.map(({ clo, evals }, cloIndex) => {
                    const cloItem = tqf3?.part2?.clo.find((e) => e.id == clo)!;
                    return (
                      <Table.Tr
                        key={cloIndex}
                        className="text-b3 table-row h-full text-default"
                      >
                        <Table.Td
                          style={{
                            filter:
                              "drop-shadow(2px 0px 2px rgba(0, 0, 0, 0.3))",
                          }}
                          className="!p-0 sticky left-0 z-[1]"
                        >
                          <div className="flex flex-col gap-0.5 px-[25px] py-3 border-r-[1px] border-[#DEE2E6]">
                            <p className="text-secondary font-semibold">
                              CLO-{cloItem.no}
                            </p>
                            <p>{cloItem.descTH}</p>
                            <p>{cloItem.descEN}</p>
                          </div>
                        </Table.Td>
                        {evals.map((item, evalIndex: number) => (
                          <Table.Td
                            key={evalIndex}
                            className="!px-4.5 max-w-[200px]"
                          >
                            <div className="flex flex-col gap-2 max-w-full">
                              <MultiSelect
                                className="z-0"
                                classNames={{
                                  input: "overflow-hidden",
                                  pillsList: "overflow-auto",
                                }}
                                data={tqf3?.part2?.schedule.map(({ weekNo }) =>
                                  weekNo.toString()
                                )}
                                disabled={
                                  evals.find((e) => e.eval == item.eval)
                                    ?.percent == 0
                                }
                                {...form.getInputProps(
                                  `data.${cloIndex}.evals.${evalIndex}.evalWeek`
                                )}
                              />
                            </div>
                          </Table.Td>
                        ))}
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </div>
          </Tabs.Panel>
        </div>
      </Tabs>
    </div>
  ) : (
    <div className="flex px-16  flex-row items-center justify-between h-full">
      <div className="flex justify-center  h-full items-start gap-2 flex-col">
        <p className="   text-secondary font-semibold text-[18px]">
          Complete TQF3 Part 3 First
        </p>
        <p className=" text-[#333333] leading-6 font-medium text-[14px]">
          To start TQF3 Part 4, please complete and save TQF3 Part 3. <br />{" "}
          Once done, you can continue to do it.
        </p>
      </div>
      <img
        className=" z-50  w-[580px] h-[300px] "
        src={unplug}
        alt="loginImage"
      />
    </div>
  );
}
