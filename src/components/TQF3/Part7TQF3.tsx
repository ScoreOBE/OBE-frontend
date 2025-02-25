import { Checkbox, Button, Alert, Table, Tabs } from "@mantine/core";
import { useForm } from "@mantine/form";
import Icon from "../Icon";
import IconCheck from "@/assets/icons/Check.svg?react";
import IconCheckbox from "@/assets/icons/checkbox.svg?react";
import IconPLO from "@/assets/icons/PLOdescription.svg?react";
import DrawerPLOdes from "@/components/DrawerPLO";
import { useEffect, useState } from "react";
import { IModelTQF3, IModelTQF3Part7 } from "@/models/ModelTQF3";
import { useAppDispatch, useAppSelector } from "@/store";
import unplug from "@/assets/image/unplug.png";
import notLinkPLO from "@/assets/image/notLinkPLO.jpeg";
import { cloneDeep, isEqual } from "lodash";
import { updatePartTQF3 } from "@/store/tqf3";
import { useSearchParams } from "react-router-dom";
import { initialTqf3Part7 } from "@/helpers/functions/tqf3";
import { IModelPLO } from "@/models/ModelPLO";
import { IModelPLORequire } from "@/models/ModelCourseManagement";
import { getSectionNo } from "@/helpers/functions/function";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
  tqf3Original: Partial<IModelTQF3> & {
    topic?: string;
    ploRequired?: IModelPLORequire[];
  };
};

export default function Part7TQF3({ setForm, tqf3Original }: Props) {
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [params, setParams] = useSearchParams({});
  const disabled =
    parseInt(params.get("year") || "") !== academicYear.year &&
    parseInt(params.get("semester") || "") !== academicYear.semester;
  const tqf3 = useAppSelector((state) => state.tqf3);
  const dispatch = useAppDispatch();
  const [sectionList, setSectionList] = useState<string[]>([]);
  const [ploRequire, setPloRequire] = useState<string[]>([]);
  const [coursePLO, setCoursePLO] = useState<Partial<IModelPLO>>({});
  const [openDrawerPLOdes, setOpenDrawerPLOdes] = useState(false);
  const [selectCurriculum, setSelectCurriculum] = useState<string | null>();

  const form = useForm({
    mode: "controlled",
    initialValues: {
      list: [] as { curriculum: string; data: IModelTQF3Part7[] }[],
    },
    validate: {
      list: {
        data: {
          plos: (value, values, path) => {
            if (
              values.list[parseInt(path.split(".")[1])]?.curriculum !=
              selectCurriculum
            )
              return null;
            const ploFormError = ploForm.validate();
            return !value.length
              ? "CLO must be linked to at least one PLO"
              : ploFormError.hasErrors
              ? ""
              : null;
          },
        },
      },
    },
    onValuesChange(values, previous) {
      if (!isEqual(values, previous)) {
        dispatch(
          updatePartTQF3({
            part: "part7",
            data: cloneDeep(form.getValues()),
          })
        );
        setForm(form);
      }
    },
  });

  const ploForm = useForm({
    mode: "controlled",
    initialValues: {
      list: [] as {
        curriculum: string;
        data: { id: string; clos: string[] }[];
      }[],
    },
    validate: {
      list: {
        data: {
          clos: (value, values, path) =>
            values.list[parseInt(path.split(".")[1])]?.curriculum ==
              selectCurriculum &&
            !value.length &&
            `Select CLO at least one`,
        },
      },
    },
  });

  useEffect(() => {
    if (tqf3.curriculum?.length) {
      setSelectCurriculum(tqf3.curriculum[0]);
    } else {
      setSelectCurriculum(null);
    }
  }, [tqf3.curriculum]);

  useEffect(() => {
    if (tqf3.coursePLO?.length && selectCurriculum) {
      const plo = tqf3.coursePLO.find(({ curriculum }) =>
        curriculum?.includes(selectCurriculum)
      )!;
      setCoursePLO(plo);
      const ploR =
        tqf3.ploRequired?.find(
          ({ curriculum }) => curriculum == selectCurriculum
        )?.list || [];
      setPloRequire(ploR);
      setSectionList(
        tqf3.sections
          .filter(({ curriculum }) => curriculum == selectCurriculum)
          .map(({ sectionNo }) => getSectionNo(sectionNo))
      );
    } else {
      setCoursePLO({});
      setPloRequire([]);
    }
  }, [tqf3.ploRequired, tqf3.coursePLO, selectCurriculum]);

  useEffect(() => {
    if (tqf3.coursePLO?.length && tqf3.curriculum?.length) {
      ploForm.setFieldValue(
        "list",
        tqf3.ploRequired?.map((item) => ({
          curriculum: item.curriculum,
          data: item.list.map((plo) => ({
            id: plo,
            clos: [],
          })),
        })) || []
      );
      if (tqf3.part7) {
        form.setFieldValue("updatedAt", tqf3.part7.updatedAt);
        form.setFieldValue(
          "list",
          cloneDeep(
            tqf3.curriculum?.map((cur, index) => {
              const dataItem = tqf3.part7?.list.find(
                ({ curriculum }) => curriculum == cur
              );
              return {
                curriculum: cur,
                data:
                  tqf3?.part2?.clo?.map((cloItem) => {
                    const item = dataItem?.data.find(
                      ({ clo }) => clo == cloItem.id
                    );
                    ploForm
                      .getValues()
                      .list[index]?.data.forEach(({ id }, ploIndex) => {
                        if ((item?.plos as string[])?.includes(id)) {
                          ploForm.insertListItem(
                            `list.${index}.data.${ploIndex}.clos`,
                            cloItem.id
                          );
                        }
                      });
                    return {
                      clo: cloItem.id,
                      plos: cloneDeep(item?.plos) || [],
                    };
                  }) || [],
              };
            })
          ) ?? []
        );
      } else if (tqf3.part2) {
        form.setValues(initialTqf3Part7(tqf3.part2, tqf3.curriculum!));
      }
    } else {
      form.reset();
      ploForm.reset();
    }
  }, [tqf3.ploRequired, tqf3.coursePLO]);

  const checkPart7Status = (
    item: {
      curriculum: string;
      data: IModelTQF3Part7[];
    },
    index: number
  ) => {
    return isEqual(
      item,
      initialTqf3Part7(tqf3.part2, tqf3.curriculum!).list[index]
    )
      ? "text-[#DEE2E6]"
      : !isEqual(tqf3Original?.part7?.list[index], item) ||
        item.data?.some(({ plos }) => plos.length == 0) ||
        !tqf3.ploRequired
          ?.find((e) => e.curriculum == item.curriculum)
          ?.list.every((plo) =>
            item.data?.some(({ plos }) => (plos as string[]).includes(plo))
          )
      ? "text-edit"
      : "text-[#24b9a5]";
  };

  return tqf3?.part6?.updatedAt ? (
    coursePLO?.data?.length ? (
      <>
        {coursePLO && (
          <DrawerPLOdes
            opened={openDrawerPLOdes}
            onClose={() => setOpenDrawerPLOdes(false)}
            data={coursePLO}
          />
        )}
        <div className="flex w-full h-full pt-3 pb-3">
          <Tabs
            value={selectCurriculum}
            onChange={(event) => setSelectCurriculum(event)}
            classNames={{
              root: "flex flex-col w-full h-full",
              tab: "px-0 pt-0 !bg-transparent hover:!text-tertiary",
              tabLabel: "!font-semibold text-b3",
              panel: "w-full h-fit max-h-full flex flex-col gap-2 rounded-lg",
            }}
          >
            <Tabs.List className="!bg-transparent items-center flex w-full gap-5">
              {form.getValues().list.map((cur, index) => (
                <Tabs.Tab key={cur.curriculum} value={cur.curriculum}>
                  <div className="flex items-center gap-2">
                    <Icon
                      IconComponent={IconCheck}
                      className={checkPart7Status(cur, index)}
                    />
                    {cur.curriculum}
                  </div>
                </Tabs.Tab>
              ))}
            </Tabs.List>
            <div className="overflow-auto flex px-3 w-full max-h-full mt-3">
              {form.getValues().list?.map((cur, index) => (
                <Tabs.Panel
                  key={`${cur.curriculum}-${index}`}
                  value={cur.curriculum}
                >
                  <div className="flex flex-col w-full max-h-full gap-4 pb-4">
                    {/* Topic */}
                    <div className="flex text-secondary items-center w-full justify-between">
                      <span className="text-[15px] acerSwift:max-macair133:!text-b3 font-semibold">
                        CLO Mapping <span className=" text-red-500">*</span>{" "}
                        <br />
                        <span className="text-b3 text-default">
                          (section {sectionList.join(", ")})
                        </span>
                      </span>
                      <Button
                        color="#e9e9e9"
                        className="text-center px-4"
                        onClick={() => setOpenDrawerPLOdes(true)}
                      >
                        <div className="flex gap-2 acerSwift:max-macair133:!text-b5 !text-default">
                          <Icon
                            IconComponent={IconPLO}
                            className="acerSwift:max-macair133:!size-3"
                          />
                          PLO Description
                        </div>
                      </Button>
                    </div>
                    <div className="w-full">
                      <Alert
                        radius="md"
                        icon={<Icon IconComponent={IconCheckbox} />}
                        variant="light"
                        color="rgba(6, 158, 110, 1)"
                        classNames={{
                          icon: "size-6",
                          body: "flex justify-center",
                        }}
                        className="w-full"
                        title={
                          <p className="font-semibold acerSwift:max-macair133:!text-b3">
                            Each CLO must be linked to at least one PLO.
                            {!!tqf3.ploRequired?.length && (
                              <>
                                And if you see
                                <span className="text-red-500 font-bold">
                                  '*'
                                </span>
                                in a PLO column, at least one of your CLOs must
                                be linked to that{" "}
                                <span className="text-red-500 font-bold">
                                  required PLO
                                </span>
                              </>
                            )}
                          </p>
                        }
                      ></Alert>
                    </div>

                    {/* Table */}
                    <div
                      key={form.key(`list.${index}.data`)}
                      className="overflow-auto border border-secondary rounded-lg relative"
                      style={{
                        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                      }}
                    >
                      <Table stickyHeader striped>
                        <Table.Thead className="z-[2] acerSwift:max-macair133:!text-b3 overflow-auto">
                          <Table.Tr>
                            <Table.Th
                              style={{
                                filter:
                                  "drop-shadow(2px 0px 2px rgba(0, 0, 0, 0.1))",
                              }}
                              className="min-w-[500px] sticky left-0 !p-0"
                            >
                              <div className="w-full flex items-center px-[25px] h-[58px] border-r-[1px] border-[#DEE2E6]">
                                CLO Description ( {tqf3.part2?.clo.length} CLO
                                {tqf3.part2?.clo.length! > 1 ? "s" : ""} )
                              </div>
                            </Table.Th>
                            {coursePLO?.data?.map(({ no, id }) => {
                              const ploIndex = ploForm
                                .getValues()
                                .list[index]?.data.findIndex(
                                  (plo) => plo.id == id
                                );
                              return (
                                <Table.Th
                                  key={id}
                                  className="min-w-[100px] !pt-3 !pb-2 w-fit"
                                >
                                  <p className="acerSwift:max-macair133:!text-b3">
                                    PLO-{no}{" "}
                                    <span className="text-red-500">
                                      {ploRequire.includes(id) && "*"}
                                    </span>
                                  </p>
                                  <p className="error-text mt-1">
                                    {
                                      ploForm.getInputProps(
                                        `list.${index}.data.${ploIndex}.clos`
                                      ).error
                                    }
                                  </p>
                                </Table.Th>
                              );
                            })}
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {cur.data.map(({ clo }, cloIndex) => {
                            const cloItem = tqf3?.part2?.clo.find(
                              (e) => e.id == clo
                            );
                            return (
                              <Table.Tr
                                key={cloIndex}
                                className="text-[13px] text-default"
                              >
                                <Table.Td
                                  key={form.key(
                                    `list.${index}.data.${cloIndex}.plos`
                                  )}
                                  style={{
                                    filter:
                                      "drop-shadow(2px 0px 2px rgba(0, 0, 0, 0.1))",
                                  }}
                                  className="!p-0 !py-1 sticky left-0 z-[1]"
                                  {...form.getInputProps(
                                    `list.${index}.data.${cloIndex}.plos`
                                  )}
                                >
                                  <div className="flex gap-5 justify-start  items-center  px-[20px] py-2">
                                    <div className="text-secondary min-w-fit font-bold acerSwift:max-macair133:!text-b3">
                                      CLO-{cloItem?.no}
                                    </div>
                                    <p className="flex w-fit font-medium justify-between flex-col acerSwift:max-macair133:!text-b4">
                                      <span className="mb-2">
                                        {cloItem?.descTH}
                                      </span>
                                      <span>{cloItem?.descEN}</span>
                                      <span className="error-text mt-1">
                                        {
                                          form.getInputProps(
                                            `list.${index}.data.${cloIndex}.plos`
                                          ).error
                                        }
                                      </span>
                                    </p>
                                  </div>
                                </Table.Td>
                                {coursePLO?.data?.map(({ id }, ploIndex) => {
                                  return (
                                    <Table.Td key={ploIndex}>
                                      <div className="flex items-start">
                                        <Checkbox
                                          size="sm"
                                          classNames={{
                                            body: "mr-3 px-0",
                                            label:
                                              "text-b4 text-[#615F5F] cursor-pointer",
                                          }}
                                          disabled={disabled}
                                          checked={(
                                            cur.data[cloIndex].plos as string[]
                                          )?.includes(id)}
                                          onChange={(event) => {
                                            const ploIndex = ploForm
                                              .getValues()
                                              .list[index]?.data.findIndex(
                                                (plo) => plo.id == id
                                              );
                                            form.setFieldValue(
                                              `list.${index}.data.${cloIndex}.plos`,
                                              (prev: string[] = []) => {
                                                return event.target.checked
                                                  ? [...prev, id].sort()
                                                  : prev.filter(
                                                      (plo) => plo !== id
                                                    );
                                              }
                                            );
                                            if (ploIndex >= 0) {
                                              ploForm.setFieldValue(
                                                `list.${index}.data.${ploIndex}.clos`,
                                                (prev: string[] = []) => {
                                                  return event.target.checked
                                                    ? [...prev, clo].sort()
                                                    : prev.filter(
                                                        (item) => item !== clo
                                                      );
                                                }
                                              );
                                            }
                                          }}
                                        />
                                      </div>
                                    </Table.Td>
                                  );
                                })}
                              </Table.Tr>
                            );
                          })}
                        </Table.Tbody>
                      </Table>
                    </div>
                  </div>
                </Tabs.Panel>
              ))}
            </div>
          </Tabs>
        </div>
      </>
    ) : (
      <div className="flex flex-col w-full h-full justify-center items-center">
        <div className="flex px-16  w-full ipad11:px-8 sm:px-2  gap-5  items-center justify-between h-full">
          <div className="flex justify-center  h-full items-start gap-2 flex-col">
            <p className="text-secondary font-semibold text-[22px] sm:max-ipad11:text-[20px]">
              This Course not linked to PLO
            </p>
            <p className=" text-[#333333] leading-6 font-medium text-[14px] sm:max-ipad11:text-[13px]">
              If you need to do this part, please contact your department
              administrator. <br /> You can still proceed with completing TQF 5
            </p>
          </div>
          <img
            className=" z-50 ipad11:w-[300px] sm:w-[240px] w-[240px]  macair133:w-[350px] macair133:h-[350px] "
            src={notLinkPLO}
            alt="loginImage"
          />
        </div>
      </div>
    )
  ) : (
    <div className="flex px-16  w-full ipad11:px-8 sm:px-2  gap-5  items-center justify-between h-full">
      <div className="flex justify-center  h-full items-start gap-2 flex-col">
        <p className="   text-secondary font-semibold text-[22px] sm:max-ipad11:text-[20px]">
          Complete TQF3 Part 6 First
        </p>
        <p className=" text-[#333333] leading-6 font-medium text-[14px] sm:max-ipad11:text-[13px]">
          To start TQF3 Part 7, please complete and save TQF3 Part 6. <br />{" "}
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
