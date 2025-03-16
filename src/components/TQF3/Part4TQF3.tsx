import {
  Alert,
  Tabs,
  NumberInput,
  Group,
  Chip,
  Modal,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Table } from "@mantine/core";
import Icon from "../Icon";
import IconCheckbox from "@/assets/icons/checkbox.svg?react";
import { useEffect, useRef } from "react";
import { IModelEval, IModelTQF3Part4 } from "@/models/ModelTQF3";
import { cloneDeep, isEqual } from "lodash";
import unplug from "@/assets/image/unplug.png";
import { useAppDispatch, useAppSelector } from "@/store";
import { updatePartTQF3 } from "@/store/tqf3";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { initialTqf3Part4 } from "@/helpers/functions/tqf3";
import { PartTopicTQF3 } from "@/helpers/constants/TQF3.enum";
import { isMobile } from "@/helpers/functions/function";

type Props = {
  setForm?: React.Dispatch<React.SetStateAction<any>>;
  openedAlert?: boolean;
  onCloseAlert?: () => void;
};

export default function Part4TQF3({
  setForm = () => {},
  openedAlert = false,
  onCloseAlert = () => {},
}: Props) {
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [params, setParams] = useSearchParams({});
  const tqf3 = useAppSelector((state) => state.tqf3);
  const disabled =
    tqf3.courseSyllabus ||
    (parseInt(params.get("year") || "") !== academicYear.year &&
      parseInt(params.get("semester") || "") !== academicYear.semester);
  const dispatch = useAppDispatch();
  const tableRefs = useRef<(HTMLInputElement | null)[][]>([]);
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
    if (tqf3.courseSyllabus) {
      setAllEval();
      return;
    }
    if (tqf3.part4) {
      form.setFieldValue("updatedAt", tqf3.part4.updatedAt);
      form.setFieldValue(
        "data",
        cloneDeep(
          tqf3?.part2?.clo?.map((cloItem) => {
            const item = tqf3.part4?.data.find(({ clo }) => clo == cloItem.id);
            return {
              clo: cloItem.id,
              percent: item?.percent || 0,
              evals:
                cloneDeep(
                  item?.evals.filter((item) =>
                    tqf3.part3?.eval
                      .map(({ id }) => id)
                      .includes(item.eval as string)
                  )
                ) || [],
            };
          })
        ) ?? []
      );
      setAllEval();
    } else {
      if (tqf3.part2) {
        form.setValues(initialTqf3Part4(tqf3.part2));
      }
      if (tqf3.part3) setEvalForm();
    }
  }, []);

  const setAllEval = () => {
    setEvalForm();
    (tqf3.courseSyllabus ? tqf3.part4 : form.getValues())?.data.forEach(
      (item, cloIndex) => {
        item.evals.forEach((e, evalIndex) => {
          setPercentEval(cloIndex, evalIndex, e.eval as string, e, e.percent);
        });
      }
    );
  };

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
    if (!tqf3.courseSyllabus) {
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
      } else {
        form.removeListItem(`data.${cloIndex}.evals`, evalIndex);
      }
    }
    evalForm.setFieldValue(
      `data.${index}.curPercent`,
      (tqf3.courseSyllabus ? tqf3.part4 : form.getValues())?.data
        .map(({ evals }) =>
          evals.find((e) => e.eval == evalForm.getValues().data[index].id)
        )
        .reduce((acc, cur) => acc + (cur?.percent || 0), 0)
    );
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    cloIndex: number,
    colIndex: number
  ) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const isShiftPressed = e.shiftKey;
      let nextRowIndex = cloIndex + (isShiftPressed ? -1 : 1);
      let nextColIndex = colIndex;
      if (nextRowIndex < 0) {
        nextRowIndex = tableRefs.current[nextColIndex - 1]?.length - 1 || 0;
        nextColIndex -= 1;
      } else if (nextRowIndex >= tableRefs.current[nextColIndex]?.length) {
        nextRowIndex = 0;
        nextColIndex += 1;
      }
      if (nextColIndex >= 0 && nextColIndex < tableRefs.current.length) {
        const targetInput = tableRefs.current[nextColIndex][nextRowIndex];
        if (targetInput) {
          targetInput.focus();
        }
      }
    }
  };

  return tqf3?.part3?.updatedAt ? (
    <>
      {/* Modal Alert Data TQF3 Part4 */}
      <Modal
        opened={openedAlert}
        onClose={onCloseAlert}
        closeOnClickOutside={false}
        title="Unable to save"
        size="30vw"
        centered
        transitionProps={{ transition: "pop" }}
        classNames={{
          content:
            "flex flex-col justify-start bg-[#F6F7FA] text-[14px] item-center w-full overflow-hidden ",
        }}
      >
        <div className={`w-full  bg-white  rounded-md gap-2 flex flex-col`}>
          <Alert
            radius="md"
            variant="light"
            color="blue"
            classNames={{
              body: " flex justify-center",
            }}
            title={
              <div className="flex items-center  gap-2">
                <Icon IconComponent={IconInfo2} />
                <p>You need to complete TQF 3 Part 4 first</p>
              </div>
            }
            className="mb-4"
          >
            <p className="pl-8 text-default -mt-1 leading-6 font-medium ">
              {Object.keys(form.errors)
                .filter((key) => form.errors[key]?.toString().length! > 0)
                .map((key) => `CLO ${parseInt(key.split(".")[1]) + 1}`)
                .join(", ")}
            </p>
            <p className="pl-8 text-default -mt-1 leading-6 font-medium ">
              {Object.keys(evalForm.errors)
                .filter((key) => evalForm.errors[key]?.toString().length! > 0)
                .map(
                  (key) =>
                    evalForm.getValues().data[parseInt(key.split(".")[1])]
                      .topicEN
                )
                .join(", ")}
            </p>
          </Alert>
        </div>

        <Button className="!w-full" onClick={onCloseAlert}>
          OK
        </Button>
      </Modal>

      {!tqf3.courseSyllabus ? (
        <div className="flex w-full h-full pt-3 pb-3">
          <Tabs
            defaultValue="percent"
            classNames={{
              root: "flex flex-col w-full h-full",
              tab: "px-0 pt-0 !bg-transparent hover:!text-tertiary",
              tabLabel: "!font-semibold text-b3",
              panel: "w-full h-fit max-h-full flex flex-col gap-2 rounded-lg",
            }}
          >
            <Tabs.List className="!bg-transparent items-center flex w-full gap-5">
              <Tabs.Tab value="percent">
                Evaluate <span className="text-red-500">*</span>
              </Tabs.Tab>
              <Tabs.Tab value="week">Evaluation Week</Tabs.Tab>
            </Tabs.List>
            <div className="overflow-auto flex px-3 w-full max-h-full  mt-3">
              <Tabs.Panel value="percent">
                {!disabled && (
                  <div className="w-full">
                    <Alert
                      radius="md"
                      icon={
                        <Icon
                          IconComponent={IconCheckbox}
                          className="acerSwift:max-macair133:size-5"
                        />
                      }
                      variant="light"
                      color="rgba(6, 158, 110, 1)"
                      classNames={{
                        icon: "size-6",
                        body: " flex justify-center",
                      }}
                      className="w-full mb-1"
                      title={
                        <p className="font-semibold acerSwift:max-macair133:!text-b4">
                          Each CLO must be linked to at least one evaluation
                          topic, and{" "}
                          <span className="font-extrabold">
                            {" "}
                            the total CLO percentage (shown at the bottom-right
                            corner of the table) must add up to 100%.
                          </span>
                        </p>
                      }
                    />
                  </div>
                )}
                <div
                  className="overflow-auto border border-secondary rounded-lg relative"
                  style={{
                    boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <Table stickyHeader striped>
                    <Table.Thead className="z-[2] acerSwift:max-macair133:!text-b3">
                      <Table.Tr>
                        <Table.Th
                          className="min-w-[400px] sticky left-0 !p-0"
                          style={{
                            filter:
                              "drop-shadow(2px 0px 2px rgba(0, 0, 0, 0.1))",
                          }}
                        >
                          <div className="w-full flex items-center px-[25px] h-[58px]">
                            CLO Description / Evaluation Topic
                          </div>
                        </Table.Th>
                        {evalForm.getValues().data.map((item, evalIndex) => (
                          <Table.Th
                            key={evalForm.key(`data.${evalIndex}.curPercent`)}
                            className={`min-w-[120px] max-w-[160px] !py-3.5 !px-4.5 z-0 ${
                              evalForm.getInputProps(
                                `data.${evalIndex}.curPercent`
                              ).error && "text-delete"
                            }`}
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
                          </Table.Th>
                        ))}
                        <Table.Th
                          style={{
                            filter:
                              "drop-shadow(-2px 0px 2px  rgba(0, 0, 0, 0.1))",
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
                          const cloItem = tqf3?.part2?.clo.find(
                            (e) => e.id == clo
                          );
                          return (
                            <Table.Tr
                              key={cloIndex}
                              className="text-[13px] table-row h-full text-default"
                            >
                              <Table.Td
                                key={form.key(`data.${cloIndex}.percent`)}
                                style={{
                                  filter:
                                    "drop-shadow(2px 0px 2px rgba(0, 0, 0, 0.1))",
                                }}
                                className="!p-0 sticky left-0 z-[1]"
                                {...form.getInputProps(
                                  `data.${cloIndex}.percent`
                                )}
                              >
                                <div className="flex gap-5 justify-start  items-center  px-[20px] py-2">
                                  <div className="text-secondary min-w-fit font-bold acerSwift:max-macair133:!text-b3">
                                    CLO-{cloItem?.no}
                                  </div>
                                  <p className="flex w-fit   font-medium justify-between flex-col acerSwift:max-macair133:!text-b4">
                                    <span className="mb-1">
                                      {cloItem?.descTH}
                                    </span>
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
                              {evalForm
                                .getValues()
                                .data.map((item, colIndex) => {
                                  const evalItem = evals.find(
                                    (e) => e.eval === item.id
                                  );
                                  const i = evals.findIndex(
                                    (e) => e.eval === item.id
                                  );
                                  if (!tableRefs.current[colIndex]) {
                                    tableRefs.current[colIndex] = [];
                                  }

                                  return (
                                    <Table.Td
                                      key={colIndex}
                                      className="!px-4.5 max-w-[200px]"
                                    >
                                      <div className="flex flex-col gap-2 max-w-full">
                                        <NumberInput
                                          ref={(el) =>
                                            (tableRefs.current[colIndex][
                                              cloIndex
                                            ] = el)
                                          }
                                          className="w-[80px]"
                                          hideControls
                                          suffix="%"
                                          allowNegative={false}
                                          min={0}
                                          max={item.percent}
                                          classNames={{
                                            input: `${
                                              evalItem &&
                                              "!border-secondary border-[2px] acerSwift:max-macair133:!text-b3"
                                            } ${disabled && "!cursor-default"}`,
                                          }}
                                          disabled={disabled}
                                          value={
                                            typeof evalItem?.percent == "number"
                                              ? evalItem.percent
                                              : 0
                                          }
                                          onKeyDown={(e) =>
                                            handleKeyDown(e, cloIndex, colIndex)
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
                                    "drop-shadow(-2px 0px 2px rgba(0, 0, 0, 0.1))",
                                }}
                                className="!bg-[#e4f5ff] !p-0 !h-full sticky z-[1] right-0 "
                              >
                                <div className="  max-h-full items-center justify-center px-[25px] font-semibold text-b2 acerSwift:max-macair133:!text-b3">
                                  {percent % 1 === 0
                                    ? percent
                                    : percent.toFixed(2)}
                                  %
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
                            filter:
                              "drop-shadow(2px 0px 2px rgba(0, 0, 0, 0.1))",
                          }}
                          className="!bg-bgTableHeader sticky left-0 text-b2 acerSwift:max-macair133:!text-b3 !rounded-bl-md"
                        >
                          Total Assessment (%)
                        </Table.Th>
                        {evalForm.getValues().data.map((item, evalIndex) => {
                          return (
                            <Table.Th
                              key={evalIndex}
                              className={`!bg-bgTableHeader text-b2 acerSwift:max-macair133:!text-b3 ${
                                item.curPercent > item.percent && "text-delete"
                              } ${
                                item.curPercent == item.percent &&
                                "text-[#042B74]"
                              }`}
                            >
                              {item.curPercent.toFixed(
                                item.curPercent % 1 === 0 ? 0 : 2
                              )}{" "}
                              /{" "}
                              {item.percent.toFixed(
                                item.percent % 1 === 0 ? 0 : 2
                              )}
                              %
                            </Table.Th>
                          );
                        })}
                        <Table.Th
                          style={{
                            filter:
                              "drop-shadow(-2px 0px 2px  rgba(0, 0, 0, 0.1))",
                          }}
                          className={`!bg-[#bae0f7] acerSwift:max-macair133:!text-b2 sticky right-0 text-b1 font-extrabold !rounded-br-md ${
                            form
                              .getValues()
                              .data.reduce((acc, cur) => acc + cur.percent, 0) >
                            100
                              ? "text-delete"
                              : "text-[#0a162b]"
                          }`}
                        >
                          {form
                            .getValues()
                            .data.reduce((acc, cur) => acc + cur.percent, 0)
                            .toFixed(
                              form
                                .getValues()
                                .data.reduce(
                                  (acc, cur) => acc + cur.percent,
                                  0
                                ) %
                                1 ===
                                0
                                ? 0
                                : 2
                            )}
                          %
                        </Table.Th>
                      </Table.Tr>
                    </Table.Tfoot>
                  </Table>
                </div>
              </Tabs.Panel>
              <Tabs.Panel value="week">
                <div className="overflow-auto border border-secondary rounded-lg relative">
                  <Table stickyHeader className="!w-full">
                    <Table.Thead className=" z-[2] acerSwift:max-macair133:!text-b3">
                      <Table.Tr>
                        <Table.Th className="w-[25%] !p-0">
                          <div className="w-full flex items-center px-[25px] h-[24px]">
                            CLO Description
                          </div>
                        </Table.Th>
                        <Table.Th className="!w-[12%] !max-w-[12%] px-2 !py-3.5  z-0">
                          <div className=" flex items-center  h-[24px]">
                            Evaluation Topic
                          </div>
                        </Table.Th>
                        <Table.Th className="w-[40%] !py-3.5 z-0">
                          <div className=" flex items-center  translate-x-3  h-[24px]">
                            Evaluation Week
                          </div>
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {form.getValues().data.map(({ clo, evals }, cloIndex) => {
                        const cloItem = tqf3?.part2?.clo.find(
                          (e) => e.id == clo
                        );
                        return (
                          <React.Fragment key={cloIndex}>
                            {/* Main Row */}
                            <Table.Tr className="text-b4 border-[#d9d9d9] border-b-[1px] table-row h-full text-default">
                              {/* CLO Description Column */}
                              <Table.Td
                                key={form.key(`data.${cloIndex}.percent`)}
                                className="!p-0 border-r-[1px] border-[#d9d9d9] z-[1]"
                                {...form.getInputProps(
                                  `data.${cloIndex}.percent`
                                )}
                              >
                                <div className="flex gap-5 text-b3 !justify-start !items-start !text-start  !h-full !flex-1 !self-start !snap-start  px-[20px] ">
                                  <div className="text-secondary min-w-fit font-bold">
                                    CLO-{cloItem?.no}
                                  </div>
                                  <p className="flex w-fit font-medium  justify-between flex-col acerSwift:max-macair133:!text-b4">
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
                                <Table.Tbody className="flex flex-col py !w-full">
                                  {evals.length > 0 ? (
                                    evals.map((item, evalIndex) => {
                                      const evalTopic = evalForm
                                        .getValues()
                                        .data.find(({ id }) => id == item.eval);
                                      return (
                                        <Table.Tr
                                          key={evalIndex}
                                          className="!p-0 border-[#d9d9d9] border-b-[1px] flex !h-full !w-full"
                                        >
                                          {/* Evaluation Topic Column */}
                                          <Table.Td className="!w-[24%] text-b3 acerSwift:max-macair133:!text-b3 !h-ful text-default font-medium flex flex-col justify-center !min-w-[24%] ">
                                            <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                                              {evalTopic?.topicTH}
                                            </p>
                                            <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                                              {evalTopic?.topicEN}
                                            </p>
                                          </Table.Td>
                                          {/* Evaluation Weeks Column */}
                                          <Table.Td className="!w-[100%]">
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
                                                      color="#1f69f3"
                                                      classNames={{
                                                        label: `${
                                                          disabled &&
                                                          `!cursor-default`
                                                        } py-4 font-medium text-b3 acerSwift:max-macair133:!text-b5`,
                                                      }}
                                                      disabled={disabled}
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
        <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mt-6">
          {/* Header */}
          <div className="bg-[#1f69f3] text-white px-8 py-6 iphone:max-sm:px-4 iphone:max-sm:py-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4c8af5] rounded-full opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#0d4ebc] rounded-full opacity-20 translate-y-1/2 -translate-x-1/2"></div>
            <h2 className="text-xl iphone:max-sm:text-lg font-bold relative z-10">
              {PartTopicTQF3.part4}
            </h2>
          </div>

          {/* Content */}
          <div className="divide-y divide-gray-100">
            {/* CLO Evaluation Title */}
            <div className="flex flex-col sm:flex-row p-6 iphone:max-sm:p-4 hover:bg-blue-50/30 transition-all duration-300">
              <div className="w-full sm:w-2/5 mb-3 sm:mb-0">
                <h3 className="font-semibold text-gray-800 flex items-center iphone:max-sm:text-[14px]">
                  <span className="inline-block w-1.5 h-5 iphone:max-sm:h-4 bg-[#1f69f3] rounded-sm mr-2"></span>
                  CLO Evaluation Matrix
                </h3>
                <p className="text-sm iphone:max-sm:text-[12px] text-gray-500 ml-3.5">
                  Course Learning Outcomes Assessment
                </p>
              </div>
              <div className="w-full sm:w-3/5 font-medium iphone:max-sm:text-[14px]">
                <div className="py-3 px-4 bg-[#1f69f3]/5 rounded-lg border-l-2 border-[#1f69f3]">
                  <p className="text-gray-800">
                    This matrix shows how each CLO is evaluated through
                    different assessment methods.
                  </p>
                </div>
              </div>
            </div>

            {/* CLO Evaluation Table/Cards */}
            <div className="p-6 iphone:max-sm:p-4">
              {!isMobile ? (
                // Desktop Table View
                <div className="overflow-auto border border-[#1f69f3]/20 rounded-xl shadow-sm mt-2">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="bg-[#1f69f3]/10">
                        <th className="py-3 px-4 text-left text-[#1f69f3] font-semibold border-b border-[#1f69f3]/10 min-w-[300px] sticky left-0 bg-[#1f69f3]/10">
                          CLO Description
                        </th>
                        {evalForm.getValues().data.map((item, evalIndex) => (
                          <th
                            key={evalIndex}
                            className="py-3 px-4 text-left text-[#1f69f3] font-semibold border-b border-[#1f69f3]/10 min-w-[120px]"
                          >
                            <p>{item.topicTH}</p>
                            <p className="text-sm text-gray-600">
                              {item.topicEN}
                            </p>
                          </th>
                        ))}
                        <th className="py-3 px-4 text-center text-[#1f69f3] font-semibold border-b border-[#1f69f3]/10 w-[100px] bg-[#e4f5ff]">
                          Total
                          <br />
                          CLO (%)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tqf3.part4?.data.map(
                        ({ clo, percent, evals }, cloIndex) => {
                          const cloItem = tqf3?.part2?.clo.find(
                            (e) => e.id == clo
                          );
                          return (
                            <tr
                              key={cloIndex}
                              className={`hover:bg-blue-50/30 transition-all duration-300 ${
                                cloIndex % 2 === 0
                                  ? "bg-white"
                                  : "bg-blue-50/30"
                              }`}
                            >
                              <td className="py-3 px-4 sticky left-0 bg-inherit border-b border-[#1f69f3]/10">
                                <div className="flex gap-3">
                                  <div className="text-[#1f69f3] font-bold whitespace-nowrap">
                                    CLO-{cloItem?.no}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      {cloItem?.descTH}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {cloItem?.descEN}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              {evalForm
                                .getValues()
                                .data.map((item, colIndex) => {
                                  const evalItem = evals.find(
                                    (e) => e.eval === item.id
                                  );
                                  return (
                                    <td
                                      key={colIndex}
                                      className="py-3 px-4 text-center border-b border-[#1f69f3]/10"
                                    >
                                      {evalItem ? (
                                        <span className="inline-flex items-center justify-center px-3 py-1 bg-[#1f69f3] text-white font-medium rounded-full">
                                          {evalItem.percent}%
                                        </span>
                                      ) : (
                                        <span className="text-gray-400">
                                          0%
                                        </span>
                                      )}
                                    </td>
                                  );
                                })}
                              <td className="py-3 px-4 text-center font-bold bg-[#e4f5ff] border-b border-[#1f69f3]/10">
                                <span className="inline-flex items-center justify-center px-3 py-1 bg-[#1f69f3] text-white font-medium rounded-full">
                                  {percent % 1 === 0
                                    ? percent
                                    : percent.toFixed(2)}
                                  %
                                </span>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="bg-[#1f69f3]/20 font-semibold text-[#1f69f3]">
                        <td className="py-3 px-4 sticky left-0 bg-[#1f69f3]/20">
                          Total Assessment (%)
                        </td>
                        {evalForm.getValues().data.map((item, evalIndex) => (
                          <td key={evalIndex} className="py-3 px-4 text-center">
                            {item.curPercent.toFixed(
                              item.curPercent % 1 === 0 ? 0 : 2
                            )}{" "}
                            /{" "}
                            {item.percent.toFixed(
                              item.percent % 1 === 0 ? 0 : 2
                            )}
                            %
                          </td>
                        ))}
                        <td className="py-3 px-4 text-center bg-[#bae0f7]">
                          <span className="inline-flex items-center justify-center px-3 py-1 bg-[#1f69f3] text-white font-bold rounded-full">
                            {tqf3.part4?.data
                              .reduce((acc, cur) => acc + cur.percent, 0)
                              .toFixed(
                                tqf3.part4.data.reduce(
                                  (acc, cur) => acc + cur.percent,
                                  0
                                ) %
                                  1 ===
                                  0
                                  ? 0
                                  : 2
                              )}
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                // Mobile Card View
                <div className="space-y-3 mt-2">
                  {tqf3.part4?.data.map(({ clo, percent, evals }, cloIndex) => {
                    const cloItem = tqf3?.part2?.clo.find((e) => e.id == clo);

                    return (
                      <div
                        key={cloIndex}
                        className="bg-white rounded-lg shadow-sm border border-[#1f69f3]/10 overflow-hidden hover:border-[#1f69f3]/30 transition-all"
                      >
                        <div className="flex items-center justify-between bg-[#1f69f3]/5 px-4 py-2 border-b border-[#1f69f3]/10">
                          <div className="flex items-center gap-2">
                            <span className="bg-[#1f69f3]/20 text-[#1f69f3] font-semibold px-2 py-0.5 rounded-full text-[12px]">
                              CLO-{cloItem?.no}
                            </span>
                          </div>
                          <span className="bg-[#1f69f3] text-white font-semibold px-2.5 py-0.5 rounded-full text-[12px]">
                            {percent}%
                          </span>
                        </div>

                        <div className="p-4">
                          <div className="mb-3">
                            <h4 className="font-medium text-gray-800 iphone:max-sm:text-[14px]">
                              {cloItem?.descTH}
                            </h4>
                            <p className="text-gray-600 italic text-sm iphone:max-sm:text-[12px]">
                              {cloItem?.descEN}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-4">
                            {evalForm.getValues().data.map((item, colIndex) => {
                              const evalItem = evals.find(
                                (e) => e.eval === item.id
                              );
                              return (
                                <div
                                  key={colIndex}
                                  className={`p-3 rounded-lg border ${
                                    evalItem
                                      ? "border-[#1f69f3]/30 bg-[#1f69f3]/5"
                                      : "border-gray-200 bg-gray-50"
                                  }`}
                                >
                                  <p className="text-[12px] text-gray-500">
                                    {item.topicEN}
                                  </p>
                                  <p className="text-[14px] font-medium text-gray-800 truncate">
                                    {item.topicTH}
                                  </p>
                                  <p
                                    className={`text-lg font-bold mt-1 ${
                                      evalItem
                                        ? "text-[#1f69f3]"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {evalItem?.percent ?? 0}%
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        {/* Total percentage for mobile */}
                        <div className="bg-[#1f69f3]/10 rounded-lg p-4 mt-4 flex items-center justify-between">
                          <span className="font-semibold text-gray-800 iphone:max-sm:text-[14px]">
                            Total Evaluation
                          </span>
                          <span className="bg-[#1f69f3] text-white font-bold px-3 py-1 rounded-full iphone:max-sm:text-[14px]">
                            {percent % 1 === 0 ? percent : percent.toFixed(2)} %
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    <div className="flex px-16  w-full ipad11:px-8 sm:px-2  gap-5  items-center justify-between h-full">
      <div className="flex justify-center  h-full items-start gap-2 flex-col">
        <p className="   text-secondary font-semibold text-[22px] sm:max-ipad11:text-[20px]">
          Complete TQF3 Part 3 First
        </p>
        <p className=" text-[#333333] leading-6 font-medium text-[14px] sm:max-ipad11:text-[13px]">
          To start TQF3 Part 4, please complete and save TQF3 Part 3. <br />{" "}
          Once done, you can continue to do it.
        </p>
      </div>
      <img
        className=" z-50 ipad11:w-[380px] sm:w-[340px] w-[340px]  macair133:w-[580px] macair133:h-[300px] "
        src={unplug}
        alt="loginImage"
      />
    </div>
  );
}
