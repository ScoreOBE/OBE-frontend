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
import { IconCheckbox, IconExclamationCircle } from "@tabler/icons-react";
import { useEffect } from "react";
import { IModelEval, IModelTQF3Part4 } from "@/models/ModelTQF3";
import { cloneDeep, isEqual } from "lodash";
import unplug from "@/assets/image/unplug.png";
import { useAppDispatch, useAppSelector } from "@/store";
import { updatePartTQF3 } from "@/store/tqf3";
import React from "react";
import { useSearchParams } from "react-router-dom";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
  openedAlert: boolean;
  onCloseAlert: () => void;
};

export default function Part4TQF3({
  setForm,
  openedAlert,
  onCloseAlert,
}: Props) {
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [params, setParams] = useSearchParams({});
  const disabled =
    parseInt(params.get("year") || "") !== academicYear.year &&
    parseInt(params.get("semester") || "") !== academicYear.semester;
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
      setEvalForm();
      form.getValues().data.forEach((item, cloIndex) => {
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
    } else {
      form.removeListItem(`data.${cloIndex}.evals`, evalIndex);
    }
    evalForm.setFieldValue(
      `data.${index}.curPercent`,
      form
        .getValues()
        .data.map(({ evals }) =>
          evals.find((e) => e.eval == evalForm.getValues().data[index].id)
        )
        .reduce((acc, cur) => acc + (cur?.percent || 0), 0)
    );
  };

  return tqf3?.part3?.updatedAt ? (
    <>
      {/* Modal Alert Data TQF3 Part4 */}
      <Modal
        opened={openedAlert}
        onClose={onCloseAlert}
        closeOnClickOutside={false}
        title="Cannot Save"
        size="35vw"
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
            color="red"
            classNames={{
              body: " flex justify-center",
            }}
            title={
              <div className="flex items-center  gap-2">
                <IconExclamationCircle />
                <p>text</p>
                ''
              </div>
            }
            className="mb-4"
          >
            <p className="pl-8 text-default -mt-1 leading-6 font-medium ">
              {Object.keys(form.errors)
                .filter((key) => form.errors[key]?.toString().length! > 0)
                .map((_, index) => `CLO ${index + 1}`)
                .join(", ")}
            </p>

            <p className="pl-8 text-default -mt-1 leading-6 font-medium ">
              {Object.keys(evalForm.errors)
                .filter((key) => evalForm.errors[key]?.toString().length! > 0)
                .map((_, index) => evalForm.getValues().data[index].topicTH)
                .join(", ")}
            </p>
          </Alert>
        </div>

        <Button className="!w-full " onClick={onCloseAlert}>
          I Understood
        </Button>
      </Modal>

      <div className="flex w-full h-full pt-3 pb-3">
        <Tabs
          defaultValue="percent"
          classNames={{
            root: "flex flex-col w-full h-full",
            tab: "px-0 pt-0 !bg-transparent hover:!text-tertiary",
            tabLabel: "!font-semibold text-[13px]",
            panel: "w-full h-fit max-h-full flex flex-col gap-2 rounded-lg",
          }}
        >
          <Tabs.List className="!bg-transparent items-center flex w-full gap-5">
            <Tabs.Tab value="percent">
              Evaluate <span className="text-red-500">*</span>
            </Tabs.Tab>
            <Tabs.Tab value="week">Evaluation Week</Tabs.Tab>
          </Tabs.List>
          <div className="overflow-auto flex w-full max-h-full  mt-3">
            <Tabs.Panel value="percent">
              {!disabled && (
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
                  <Table.Thead className="z-[2]">
                    <Table.Tr>
                      <Table.Th
                        className="min-w-[400px] sticky left-0 !p-0"
                        style={{
                          filter: "drop-shadow(2px 0px 2px rgba(0, 0, 0, 0.1))",
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
                                <div className="text-secondary min-w-fit font-bold">
                                  CLO-{cloItem?.no}
                                </div>
                                <p className="flex w-fit   font-medium justify-between flex-col ">
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
                                        } ${disabled && "!cursor-default"}`,
                                      }}
                                      disabled={disabled}
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
                                  "drop-shadow(-2px 0px 2px rgba(0, 0, 0, 0.1))",
                              }}
                              className="!bg-[#e4f5ff] !p-0 !h-full sticky z-[1] right-0 "
                            >
                              <div className="  max-h-full items-center justify-center px-[25px]  font-semibold text-b2">
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
                          filter: "drop-shadow(2px 0px 2px rgba(0, 0, 0, 0.1))",
                        }}
                        className="!bg-bgTableHeader sticky left-0 text-b2 !rounded-bl-md"
                      >
                        Total Assessment (%)
                      </Table.Th>
                      {evalForm.getValues().data.map((item, evalIndex) => {
                        return (
                          <Table.Th
                            key={evalIndex}
                            className={`!bg-bgTableHeader text-b2 ${
                              item.curPercent > item.percent && "text-delete"
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
                        className={`!bg-[#bae0f7] sticky right-0 text-b1 font-extrabold !rounded-br-md ${
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
                              .data.reduce((acc, cur) => acc + cur.percent, 0) %
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
                  <Table.Thead className=" z-[2]">
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
                      const cloItem = tqf3?.part2?.clo.find((e) => e.id == clo);
                      return (
                        <React.Fragment key={cloIndex}>
                          {/* Main Row */}
                          <Table.Tr className="text-b3 border-[#d9d9d9] border-b-[1px] table-row h-full text-default">
                            {/* CLO Description Column */}
                            <Table.Td
                              key={form.key(`data.${cloIndex}.percent`)}
                              className="!p-0 border-r-[1px] border-[#d9d9d9] z-[1]"
                              {...form.getInputProps(
                                `data.${cloIndex}.percent`
                              )}
                            >
                              <div className="flex gap-5 justify-start  items-center px-[20px] py-2">
                                <div className="text-secondary min-w-fit font-bold">
                                  CLO-{cloItem?.no}
                                </div>
                                <p className="flex w-fit font-medium  justify-between flex-col">
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
                                        <Table.Td className="!w-[24%] !h-ful text-default font-medium flex flex-col justify-center !min-w-[24%] ">
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
                                                    color="#5768d5"
                                                    classNames={{
                                                      label: `${
                                                        disabled &&
                                                        `!cursor-default`
                                                      } py-4 font-medium text-[13px]`,
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
    </>
  ) : (
    <div className="flex px-16  flex-row items-center justify-between h-full">
      <div className="flex justify-center  h-full items-start gap-2 flex-col">
        <p className="   text-secondary font-semibold text-[22px]">
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
