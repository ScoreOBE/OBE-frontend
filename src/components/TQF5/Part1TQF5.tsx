import { Button, Table, TextInput } from "@mantine/core";
import Icon from "../Icon";
import IconUpload from "@/assets/icons/upload.svg?react";
import IconEdit from "@/assets/icons/edit.svg?react";
import IconCheck2 from "@/assets/icons/Check2.svg?react";
import { useAppDispatch, useAppSelector } from "@/store";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IModelTQF5Part1 } from "@/models/ModelTQF5";
import ModalUploadGrade from "../Modal/Score/ModalUploadGrade";
import { cloneDeep, isEqual } from "lodash";
import { updatePartTQF5 } from "@/store/tqf5";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function Part1TQF5({ setForm }: Props) {
  const { courseNo } = useParams();
  const course = useAppSelector((state) =>
    state.course.courses.find((c) => c.courseNo == courseNo)
  );
  const tqf5 = useAppSelector((state) => state.tqf5);
  const dispatch = useAppDispatch();
  const [openModalUploadGrade, setOpenModalUploadGrade] = useState(false);
  const [isEditCourseEval, setIsEditCourseEval] = useState(false);
  const [isEditCriteria, setIsEditCriteria] = useState(false);
  const form = useForm({
    mode: "controlled",
    initialValues: {
      courseEval: course?.sections.map((sec) => ({
        sectionNo: sec.sectionNo,
        A: 0,
        Bplus: 0,
        B: 0,
        Cplus: 0,
        C: 0,
        Dplus: 0,
        D: 0,
        F: 0,
        W: 0,
        S: 0,
        U: 0,
        P: 0,
      })),
      gradingCriteria: {
        A: ">= 80.00",
        Bplus: "75.00 - 79.99",
        B: "70.00 - 74.99",
        Cplus: "65.00 - 69.99",
        C: "60.00 - 64.99",
        Dplus: "55.00 - 59.99",
        D: "50.00 - 54.99",
        F: "0.00 - 49.99",
        W: "-",
        S: "-",
        U: "-",
      },
    } as IModelTQF5Part1,
    validateInputOnBlur: true,
    onValuesChange(values, previous) {
      if (!isEqual(values, previous)) {
        dispatch(
          updatePartTQF5({ part: "part1", data: cloneDeep(form.getValues()) })
        );
        setForm(form);
      }
    },
  });

  const calculateTotals = (courseEval: any[]) => {
    const totals = {
      A: 0,
      Bplus: 0,
      B: 0,
      Cplus: 0,
      C: 0,
      Dplus: 0,
      D: 0,
      F: 0,
      W: 0,
      S: 0,
      U: 0,
      P: 0,
      total: 0,
      avg: 0,
    };
    courseEval?.forEach((item) => {
      Object.keys(totals).forEach((key) => {
        (totals as any)[key] += parseInt(item[key]) || 0;
      });
    });
    totals.total = Object.values(totals).reduce((a, b) => a + (b as number), 0);
    return totals;
  };

  useEffect(() => {
    if (tqf5.part1) {
      form.setValues(cloneDeep(tqf5.part1));
    }
  }, []);

  return (
    <>
      <ModalUploadGrade
        opened={openModalUploadGrade}
        onClose={() => setOpenModalUploadGrade(false)}
        data={course!}
      />

      <div className="flex w-full flex-col text-[15px] max-h-full gap-3 text-default px-3">
        <div className="flex text-secondary gap-4 w-full border-b-[1px] border-[#e6e6e6] pb-6 flex-col">
          <div className="flex text-secondary items-center justify-between flex-row gap-1 text-[15px]">
            <p className="font-bold">
              Student grading<span className="ml-1 text-red-500">*</span>
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                leftSection={
                  <Icon IconComponent={IconUpload} className="size-4" />
                }
                className="font-bold"
                onClick={() => setOpenModalUploadGrade(true)}
              >
                Upload Grade Sheet
              </Button>
              <Button
                leftSection={
                  <Icon
                    IconComponent={isEditCourseEval ? IconCheck2 : IconEdit}
                    className="size-4"
                  />
                }
                className="font-bold"
                color={isEditCourseEval ? "#0eb092" : "#ee933e"}
                onClick={() => setIsEditCourseEval(!isEditCourseEval)}
              >
                {isEditCourseEval ? "Done" : "Edit Course Eval"}
              </Button>
            </div>
          </div>
          <div
            className="overflow-x-auto w-full h-fit bg max-h-full border flex flex-col rounded-lg border-secondary"
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
            }}
          >
            <Table stickyHeader striped>
              <Table.Thead>
                <Table.Tr className="bg-[#e5e7f6] border-b-[1px] border-secondary">
                  <Table.Th
                    className="!rounded-tl-[8px] items-center justify-center  text-center !rounded-tr-[8px] w-full"
                    colSpan={15}
                  >
                    จำนวนนักศึกษา (Number of Students)
                  </Table.Th>
                </Table.Tr>
                <Table.Tr className="bg-[#e5e7f6]">
                  <Table.Th className=" w-[10%]">Section</Table.Th>
                  <Table.Th className=" w-[6%]">A</Table.Th>
                  <Table.Th className=" w-[6%]">B+</Table.Th>
                  <Table.Th className=" w-[6%]">B</Table.Th>
                  <Table.Th className=" w-[6%]">C+</Table.Th>
                  <Table.Th className=" w-[6%]">C</Table.Th>
                  <Table.Th className=" w-[6%]">D+</Table.Th>
                  <Table.Th className=" w-[6%]">D</Table.Th>
                  <Table.Th className=" w-[6%]">F</Table.Th>
                  <Table.Th className=" w-[6%]">W</Table.Th>
                  <Table.Th className=" w-[6%]">S</Table.Th>
                  <Table.Th className=" w-[6%]">U</Table.Th>
                  <Table.Th className=" w-[6%]">P</Table.Th>
                  <Table.Th className=" w-[9%]">Total</Table.Th>
                  <Table.Th className=" w-[9%]">Avg</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {form.getValues().courseEval?.map((item, index) => {
                  const data = Object.values(item)
                    .slice(1)
                    .map((e: any) => parseInt(e));
                  const total = data.reduce((a, b: any) => a + b, 0);
                  const avg =
                    total > 0
                      ? (4 * data[0] +
                          3.5 * data[1] +
                          3 * data[2] +
                          2.5 * data[3] +
                          2 * data[4] +
                          1.5 * data[5] +
                          1 * data[6] +
                          0 * data[7]) /
                        total
                      : 0;
                  return (
                    <Table.Tr
                      className="font-medium text-default text-[13px]"
                      key={item.sectionNo}
                    >
                      <Table.Td>{item.sectionNo}</Table.Td>
                      {Object.keys(item)
                        .slice(1)
                        .map((key) => (
                          <Table.Td key={key}>
                            {isEditCourseEval ? (
                              <TextInput
                                size="xs"
                                {...form.getInputProps(
                                  `courseEval.${index}.${key}`
                                )}
                              />
                            ) : (
                              (item as any)[key] ?? "-"
                            )}
                          </Table.Td>
                        ))}
                      <Table.Td>{total}</Table.Td>
                      <Table.Td>{avg.toFixed(2)}</Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
              <Table.Tfoot className="!bg-bgTableHeader  !border-t-[1px] border-secondary sticky bottom-0">
                {(() => {
                  const totals = calculateTotals(form.getValues().courseEval);
                  const avg =
                    totals.total > 0
                      ? (4 * totals.A +
                          3.5 * totals.Bplus +
                          3 * totals.B +
                          2.5 * totals.Cplus +
                          2 * totals.C +
                          1.5 * totals.Dplus +
                          1 * totals.D +
                          0 * totals.F) /
                        totals.total
                      : 0;
                  return (
                    <Table.Tr className="border-none text-secondary font-semibold">
                      <Table.Th className="rounded-bl-[8px] w-[10%]">
                        Total
                      </Table.Th>
                      {Object.keys(totals)
                        .slice(0, -1)
                        .map((key) => (
                          <Table.Th key={key}>{(totals as any)[key]}</Table.Th>
                        ))}
                      <Table.Th className="!rounded-br-[8px]">
                        {avg.toFixed(2)}
                      </Table.Th>
                    </Table.Tr>
                  );
                })()}
              </Table.Tfoot>
            </Table>
          </div>
        </div>
        <div className="flex text-secondary gap-4 items-center justify-center w-full border-b-[1px] border-[#e6e6e6] pb-6 flex-col">
          <div className="flex text-secondary items-center w-full justify-between flex-row gap-1 mt-2 text-[15px]">
            <p className="font-bold">
              Grading criteria<span className="ml-1 text-red-500">*</span>
            </p>
            <Button
              leftSection={
                <Icon
                  IconComponent={isEditCriteria ? IconCheck2 : IconEdit}
                  className="size-4"
                />
              }
              className="font-bold"
              color={isEditCriteria ? "#0eb092" : "#ee933e"}
              onClick={() => setIsEditCriteria(!isEditCriteria)}
            >
              {isEditCriteria ? "Done" : "Edit Grade criteria"}
            </Button>
          </div>
          <div
            className="h-fit bg max-h-full border items-center justify-center flex flex-col rounded-lg border-secondary overflow-clip"
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
            }}
          >
            <Table striped>
              <Table.Thead>
                <Table.Tr className="bg-[#e5e7f6] border-b-[1px] border-secondary">
                  <Table.Th className=" items-center justify-center text-center min-w-[100px]">
                    Grade
                  </Table.Th>
                  <Table.Th className="items-center justify-center  text-center min-w-[200px]">
                    Score range
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody className="justify-center items-center text-center ">
                {Object.keys(form.getValues().gradingCriteria).map((key) => (
                  <Table.Tr
                    className="font-medium text-default text-[13px]"
                    key={key}
                  >
                    <Table.Td>{key.replace("plus", "+")}</Table.Td>
                    <Table.Td>
                      {!isEditCriteria ? (
                        (form.getValues().gradingCriteria as any)[key]
                      ) : (
                        <TextInput
                          size="xs"
                          {...form.getInputProps(`gradingCriteria.${key}`)}
                        />
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
