import { Alert, Tabs, NumberInput, Group, Chip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Table } from "@mantine/core";
import { IconCheckbox } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { IModelEval, IModelTQF3Part4 } from "@/models/ModelTQF3";
import { cloneDeep, isEqual } from "lodash";
import unplug from "@/assets/image/unplug.png";
import { useAppDispatch, useAppSelector } from "@/store";
import { updatePartTQF3 } from "@/store/tqf3";
import React from "react";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function Part4TQF3({ setForm }: Props) {
  const tqf3 = useAppSelector((state) => state.tqf3);
  const dispatch = useAppDispatch();
  const form = useForm({
    mode: "controlled",
    initialValues: { data: [] as IModelTQF3Part4[] },
    validate: {
      data: {
        percent: (value) => {
          const evalFormError = evalForm.validate();
          return value == 0
            ? "CLO must be linked to at least one evaluation topic"
            : evalFormError.hasErrors
            ? ""
            : null;
        },
      },
    },
    onValuesChange(values, previous) {
      values.data.forEach((item) => {
        item.percent =
          item.evals.reduce((acc, cur) => acc + cur.percent, 0) || 0;
      });
      if (!isEqual(values, previous)) {
        dispatch(
          updatePartTQF3({ part: "part4", data: cloneDeep(form.getValues()) })
        );
        setForm(form);
      }
    },
  });

  const evalForm = useForm({
    mode: "controlled",
    initialValues: { data: [] as (IModelEval & { curPercent: number })[] },
    validate: {
      data: {
        curPercent: (value, values, path) => {
          const percent = values.data[parseInt(path.split(".")[1])].percent;
          return value !== percent && `Total percent must equal ${percent}%`;
        },
      },
    },
  });

  useEffect(() => {
    if (tqf3.part4) {
      form.setValues(cloneDeep(tqf3.part4));
      setEvalForm();
      tqf3.part4.data.forEach((item, cloIndex) => {
        item.evals.forEach((e, evalIndex) => {
          setPercentEval(cloIndex, evalIndex, e.eval as string, e, e.percent);
        });
      });
    } else {
      if (tqf3.part2) {
        form.setFieldValue(
          "data",
          cloneDeep(
            tqf3?.part2?.clo?.map((clo) => ({
              clo: clo.id,
              percent: 0,
              evals: [],
            }))
          ) ?? []
        );
      }
      if (tqf3.part3) setEvalForm();
    }
  }, []);

  const setEvalForm = () => {
    const evalData = cloneDeep(tqf3.part3?.eval || []).map((item) => ({
      ...item,
      curPercent: 0,
    }));
    evalForm.setFieldValue("data", evalData);
  };

  const setPercentEval = (
    cloIndex: number,
    evalIndex: number,
    evalId: string,
    evalItem: any,
    value: string | number
  ) => {
    const percent = typeof value == "number" ? value : parseInt(value);
    const index = evalForm.getValues().data.findIndex((e) => e.id == evalId);
    if (percent > 0) {
      if (evalItem) {
        form.setFieldValue(
          `data.${cloIndex}.evals.${evalIndex}.percent`,
          percent
        );
      } else {
        form.insertListItem(`data.${cloIndex}.evals`, {
          eval: evalId,
          evalWeek: [],
          percent: percent,
        });
      }
      evalForm.setFieldValue(
        `data.${index}.curPercent`,
        evalForm.getValues().data[index].curPercent + percent
      );
    } else {
      const percentDel =
        form.getValues().data[cloIndex].evals[evalIndex]?.percent || 0;
      form.removeListItem(`data.${cloIndex}.evals`, evalIndex);
      evalForm.setFieldValue(
        `data.${index}.curPercent`,
        evalForm.getValues().data[index].curPercent - percentDel
      );
    }
  };

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
          <Tabs.Tab value="percent">
            Evaluate <span className="text-red-500">*</span>
          </Tabs.Tab>
          <Tabs.Tab value="week">Evaluation Week</Tabs.Tab>
        </Tabs.List>
        <div className="overflow-auto flex w-full max-h-full px-3 mt-3">
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
                className="w-full mb-1"
                title={
                  <p className="font-semibold">
                    Each CLO must be linked to at least one evaluation topic,
                    and{" "}
                    <span className="font-extrabold">
                      {" "}
                      the total CLO percentage (shown at the bottom-right corner
                      of the table) must add up to 100%.
                    </span>
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
                      className="min-w-[400px] sticky left-0 !p-0"
                      style={{
                        filter: "drop-shadow(2px 0px 2px rgba(0, 0, 0, 0.3))",
                      }}
                    >
                      <div className="w-full flex items-center px-[25px] h-[58px]">
                        CLO Description / Evaluation Topic
                      </div>
                    </Table.Th>
                    {evalForm.getValues().data.map((item, evalIndex) => (
                      <Table.Th
                        key={evalForm.key(`data.${evalIndex}.curPercent`)}
                        className="min-w-[120px] max-w-[160px] !py-3.5 !px-4.5 z-0"
                        {...evalForm.getInputProps(
                          `data.${evalIndex}.curPercent`
                        )}
                      >
                        <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                          {item.topicTH}
                        </p>
                        <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                          {item.topicEN}
                        </p>
                        <p className="error-text">
                          {
                            evalForm.getInputProps(
                              `data.${evalIndex}.curPercent`
                            ).error
                          }
                        </p>
                      </Table.Th>
                    ))}
                    <Table.Th
                      style={{
                        filter: "drop-shadow(-2px 0px 2px  rgba(0, 0, 0, 0.3))",
                      }}
                      className="w-[55px] !bg-[#e4f5ff] sticky right-0 !p-0"
                    >
                      <div className="w-[90px] text-nowrap flex items-center justify-center h-[58px]">
                        Total <br /> CLO (%)
                      </div>
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {form
                    .getValues()
                    .data.map(({ clo, percent, evals }, cloIndex) => {
                      const cloItem = tqf3?.part2?.clo.find((e) => e.id == clo);
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
                            <div className="flex gap-5 justify-start  items-center  px-[20px] py-2">
                              <div className="text-secondary min-w-fit font-bold">
                                CLO-{cloItem?.no}
                              </div>
                              <p className="flex w-fit   font-medium justify-between flex-col ">
                                <span>{cloItem?.descTH}</span>
                                <span>{cloItem?.descEN}</span>
                                <span className="error-text">
                                  {
                                    form.getInputProps(
                                      `data.${cloIndex}.percent`
                                    ).error
                                  }
                                </span>
                              </p>
                            </div>
                          </Table.Td>
                          {evalForm.getValues().data.map((item, index) => {
                            const evalItem = evals.find(
                              (e) => e.eval === item.id
                            );
                            const i = evals.findIndex(
                              (e) => e.eval === item.id
                            );
                            return (
                              <Table.Td
                                key={index}
                                className="!px-4.5 max-w-[200px]"
                              >
                                <div className="flex flex-col gap-2 max-w-full">
                                  <NumberInput
                                    className="w-[80px]"
                                    hideControls
                                    suffix="%"
                                    allowNegative={false}
                                    min={0}
                                    max={item.percent}
                                    classNames={{
                                      input: `${
                                        evalItem &&
                                        "!border-secondary border-[2px]"
                                      }`,
                                    }}
                                    value={
                                      typeof evalItem?.percent == "number"
                                        ? evalItem.percent
                                        : 0
                                    }
                                    onChange={(value) =>
                                      setPercentEval(
                                        cloIndex,
                                        i,
                                        item.id,
                                        evalItem,
                                        value
                                      )
                                    }
                                  />
                                </div>
                              </Table.Td>
                            );
                          })}
                          <td
                            style={{
                              filter:
                                "drop-shadow(-2px 0px 2px rgba(0, 0, 0, 0.3))",
                            }}
                            className="!bg-[#e4f5ff] !p-0 !h-full sticky z-[1] right-0 "
                          >
                            <div className="  max-h-full items-center justify-center px-[25px]  font-semibold text-b2">
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
                      className="!bg-bgTableHeader sticky left-0 text-b2 !rounded-bl-md"
                    >
                      Total Assessment (%)
                    </Table.Th>
                    {evalForm.getValues().data.map((item, evalIndex) => {
                      return (
                        <Table.Th
                          key={evalIndex}
                          className="!bg-bgTableHeader text-b2"
                        >
                          {item.curPercent} / {item.percent}%
                        </Table.Th>
                      );
                    })}
                    <Table.Th
                      style={{
                        filter: "drop-shadow(-2px 0px 2px  rgba(0, 0, 0, 0.3))",
                      }}
                      className="!bg-[#bae0f7] text-default sticky right-0 text-b1 font-extrabold !rounded-br-md"
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
            {/* <div
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
              className=" rounded-md border-[1px] overflow-y-auto  border-secondary"
            >
              {form.getValues().data.map(({ clo, evals }, cloIndex) => {
                const cloItem = tqf3?.part2?.clo.find((e) => e.id == clo);
                return (
                  <div
                    key={cloIndex}
                    className="w-full h-full max-h-full flex flex-col"
                  >
                    <div className="w-full sticky top-0 z-10 text-secondary flex flex-row gap-6 items-center pl-6 py-4 bg-bgTableHeader">
                      <div className="text-secondary min-w-fit font-bold">
                        CLO-{cloItem?.no}
                      </div>
                      <p className="flex w-fit gap-1   font-medium justify-between flex-col ">
                        <span>{cloItem?.descTH}</span>
                        <span>{cloItem?.descEN}</span>
                      </p>
                    </div>
                    {evals.length > 0 ? (
                      evals.map((item, evalIndex) => {
                        const evalTopic = evalForm
                          .getValues()
                          .data.find(({ id }) => id == item.eval);
                        return (
                          <div
                            key={item.eval as string}
                            className="border-b-[1px] justify-start items-center flex last:border-none py-4 px-6 w-full"
                          >
                            <div className="flex font-medium  translate-x-16 mr-24 gap-1 flex-col">
                              <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                                {evalTopic?.topicTH}
                              </p>
                              <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                                {evalTopic?.topicEN}
                              </p>
                            </div>
                            <Chip.Group
                              multiple
                              {...form.getInputProps(
                                `data.${cloIndex}.evals.${evalIndex}.evalWeek`
                              )}
                              onChange={(event) =>
                                form.setFieldValue(
                                  `data.${cloIndex}.evals.${evalIndex}.evalWeek`,
                                  event.sort()
                                )
                              }
                            >
                              <Group justify="start">
                                {tqf3.part2?.schedule.map(({ weekNo }) => (
                                  <Chip
                                    key={weekNo}
                                    color="#5768d5"
                                    classNames={{ label: "py-4 text-[13px]" }}
                                    value={weekNo}
                                    checked={item.evalWeek.includes(
                                      weekNo.toString()
                                    )}
                                  >
                                    Week {weekNo}
                                  </Chip>
                                ))}
                              </Group>
                            </Chip.Group>
                          </div>
                        );
                      })
                    ) : (
                      <div className="justify-center items-center flex py-4 px-6 w-full">
                        No Topics
                      </div>
                    )}
                  </div>
                );
              })}
            </div> */}
            <div className="overflow-auto border border-secondary rounded-lg relative">
              <Table stickyHeader className="!w-full">
                <Table.Thead className=" z-[2]">
                  <Table.Tr>
                    <Table.Th className="w-[25%] sticky left-0 !p-0">
                      <div className="w-full flex items-center px-[25px] h-[24px]">
                        CLO Description
                      </div>
                    </Table.Th>
                    <Table.Th className="!w-[12%]  !max-w-[12%] px-2 !py-3.5  z-0">
                      <div className=" flex items-center  h-[24px]">
                        Evaluation Topic
                      </div>
                    </Table.Th>
                    <Table.Th className="w-[40%]  !py-3.5 z-0">
                      <div className=" flex items-center  translate-x-3  h-[24px]">Evaluation Week</div>
                    </Table.Th>
                    {/* {evalForm.getValues().data.map((item, evalIndex) => (
                      <Table.Th
                        key={evalForm.key(`data.${evalIndex}.curPercent`)}
                        className="min-w-[120px] max-w-[160px] !py-3.5 !px-4.5 z-0"
                        {...evalForm.getInputProps(
                          `data.${evalIndex}.curPercent`
                        )}
                      >
                        <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                          {item.topicTH}
                        </p>
                        <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                          {item.topicEN}
                        </p>
                        <p className="error-text">
                          {
                            evalForm.getInputProps(
                              `data.${evalIndex}.curPercent`
                            ).error
                          }
                        </p>
                      </Table.Th>
                    ))} */}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {form.getValues().data.map(({ clo, evals }, cloIndex) => {
                    const cloItem = tqf3?.part2?.clo.find((e) => e.id == clo);
                    return (
                      <React.Fragment key={cloIndex}>
                        {/* Main Row */}
                        <Table.Tr className="text-b3 table-row h-full text-default">
                          {/* CLO Description Column */}
                          <Table.Td
                            key={form.key(`data.${cloIndex}.percent`)}
                            className="!p-0 sticky left-0 border-r-[1px] z-[1]"
                            {...form.getInputProps(`data.${cloIndex}.percent`)}
                          >
                            <div className="flex gap-5 justify-start items-center px-[20px] py-2">
                              <div className="text-secondary min-w-fit font-bold">
                                CLO-{cloItem?.no}
                              </div>
                              <p className="flex w-fit font-medium justify-between flex-col">
                                <span>{cloItem?.descTH}</span>
                                <span>{cloItem?.descEN}</span>
                                <span className="error-text">
                                  {
                                    form.getInputProps(
                                      `data.${cloIndex}.percent`
                                    ).error
                                  }
                                </span>
                              </p>
                            </div>
                          </Table.Td>
                          {/* Evaluations Column */}
                          <Table.Td
                            className="!p-0  !w-full !h-full "
                            colSpan={2}
                          >
                            {/* Nested Row for Evaluations */}
                            <Table.Tbody className="flex flex-col py !w-full ">
                              {evals.length > 0 ? (
                                evals.map((item, evalIndex) => {
                                  const evalTopic = evalForm
                                    .getValues()
                                    .data.find(({ id }) => id == item.eval);
                                  return (
                                    <Table.Tr
                                      key={evalIndex}
                                      className="!p-0 flex !h-full !w-full"
                                    >
                                      {/* Evaluation Topic Column */}
                                      <Table.Td className="!w-[24%]  !h-ful text-default font-medium  flex flex-col justify-center  !min-w-[24%] ">
                                        <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                                          {evalTopic?.topicTH}
                                        </p>
                                        <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                                          {evalTopic?.topicEN}
                                        </p>
                                      </Table.Td>
                                      {/* Evaluation Weeks Column */}
                                      <Table.Td className="  !w-[100%]">
                                        <Chip.Group
                                          multiple
                                          {...form.getInputProps(
                                            `data.${cloIndex}.evals.${evalIndex}.evalWeek`
                                          )}
                                          onChange={(event) =>
                                            form.setFieldValue(
                                              `data.${cloIndex}.evals.${evalIndex}.evalWeek`,
                                              event.sort()
                                            )
                                          }
                                        >
                                          <Group
                                            className="w-full"
                                            justify="start"
                                          >
                                            {tqf3.part2?.schedule.map(
                                              ({ weekNo }) => (
                                                <Chip
                                                  key={weekNo}
                                                  color="#5768d5"
                                                  classNames={{
                                                    label: "py-4 font-medium text-[13px]",
                                                  }}
                                                  value={weekNo}
                                                  checked={item.evalWeek.includes(
                                                    weekNo.toString()
                                                  )}
                                                >
                                                   Week {weekNo}
                                                </Chip>
                                              )
                                            )}
                                          </Group>
                                        </Chip.Group>
                                      </Table.Td>
                                    </Table.Tr>
                                  );
                                })
                              ) : (
                                <Table.Tr>
                                  <Table.Td
                                    colSpan={2}
                                    className="justify-center items-center flex py-4 px-6 w-full"
                                  >
                                    No Topics
                                  </Table.Td>
                                </Table.Tr>
                              )}
                            </Table.Tbody>
                          </Table.Td>
                        </Table.Tr>
                      </React.Fragment>
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
