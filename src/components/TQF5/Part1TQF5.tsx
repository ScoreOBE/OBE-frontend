import { Button, Table, TextInput } from "@mantine/core";
import Icon from "../Icon";
import IconUpload from "@/assets/icons/upload.svg?react";
import IconEdit from "@/assets/icons/edit.svg?react";
import IconCheck2 from "@/assets/icons/Check2.svg?react";
import maintenace from "@/assets/image/maintenance.png";
import { useAppSelector } from "@/store";
import { TypeMethodTQF5 } from "@/pages/TQF/TQF5";
import { useForm } from "@mantine/form";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { IModelTQF5Part1 } from "@/models/ModelTQF5";
import ModalUploadGrade from "../Modal/Score/ModalUploadGrade";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
  method: TypeMethodTQF5;
};

export default function Part1TQF5({ setForm, method }: Props) {
  const { courseNo } = useParams();
  const course = useAppSelector((state) =>
    state.course.courses.find((c) => c.courseNo == courseNo)
  );
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
        A: "80.00 to 100.00",
        Bplus: "75.00 to 79.99",
        B: "70.00 to 75.99",
        Cplus: "65.00 to 69.99",
        C: "60.00 to 64.99",
        Dplus: "55.00 to 59.99",
        D: "50.00 to 54.99",
        F: "0.00 to 49.99",
        W: "-",
        S: "-",
        U: "-",
      },
    } as IModelTQF5Part1,
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
    };
    courseEval?.forEach((item) => {
      Object.keys(totals).forEach((key) => {
        (totals as any)[key] += item[key] || 0;
      });
    });
    totals.total = Object.values(totals).reduce((a, b) => a + (b as number), 0);
    return totals;
  };

  return (
    <>
      <ModalUploadGrade
        opened={openModalUploadGrade}
        onClose={() => setOpenModalUploadGrade(false)}
        data={course!}
      />

      <div className="flex w-full flex-col text-[15px] max-h-full gap-2 text-default ">
        <div className="flex text-secondary gap-4  w-full border-b-[1px] border-[#e6e6e6] pb-6 flex-col">
          <div className="flex text-secondary items-center justify-between flex-row gap-1 text-[15px]">
            <p className="font-bold">
              Student grading<span className="ml-1 text-red-500">*</span>
            </p>
            {method == "scoreOBE" ? (
              <Button
                leftSection={
                  <Icon IconComponent={IconUpload} className="size-4" />
                }
                className="font-bold"
                onClick={() => setOpenModalUploadGrade(true)}
              >
                Upload Grade Sheet
              </Button>
            ) : (
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
            )}
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
                  const total = Object.values(item)
                    .slice(1)
                    .reduce((a, b) => a + (b ?? 0), 0);
                  return (
                    <Table.Tr
                      className="font-medium text-default text-[13px]"
                      key={item.sectionNo}
                    >
                      <Table.Td>{item.sectionNo}</Table.Td>
                      <Table.Td>
                        {isEditCourseEval ? (
                          <TextInput
                            size="xs"
                            {...form.getInputProps(`courseEval.${index}.A`)}
                          />
                        ) : (
                          item.A ?? "-"
                        )}
                      </Table.Td>
                      <Table.Td>
                        {isEditCourseEval ? (
                          <TextInput
                            size="xs"
                            {...form.getInputProps(`courseEval.${index}.Bplus`)}
                          />
                        ) : (
                          item.Bplus ?? "-"
                        )}
                      </Table.Td>
                      <Table.Td>
                        {isEditCourseEval ? (
                          <TextInput
                            size="xs"
                            {...form.getInputProps(`courseEval.${index}.B`)}
                          />
                        ) : (
                          item.B ?? "-"
                        )}
                      </Table.Td>
                      <Table.Td>
                        {isEditCourseEval ? (
                          <TextInput
                            size="xs"
                            {...form.getInputProps(`courseEval.${index}.Cplus`)}
                          />
                        ) : (
                          item.Cplus ?? "-"
                        )}
                      </Table.Td>
                      <Table.Td>
                        {isEditCourseEval ? (
                          <TextInput
                            size="xs"
                            {...form.getInputProps(`courseEval.${index}.C`)}
                          />
                        ) : (
                          item.C ?? "-"
                        )}
                      </Table.Td>
                      <Table.Td>
                        {isEditCourseEval ? (
                          <TextInput
                            size="xs"
                            {...form.getInputProps(`courseEval.${index}.Dplus`)}
                          />
                        ) : (
                          item.Dplus ?? "-"
                        )}
                      </Table.Td>
                      <Table.Td>
                        {isEditCourseEval ? (
                          <TextInput
                            size="xs"
                            {...form.getInputProps(`courseEval.${index}.D`)}
                          />
                        ) : (
                          item.D ?? "-"
                        )}
                      </Table.Td>
                      <Table.Td>
                        {isEditCourseEval ? (
                          <TextInput
                            size="xs"
                            {...form.getInputProps(`courseEval.${index}.F`)}
                          />
                        ) : (
                          item.F ?? "-"
                        )}
                      </Table.Td>
                      <Table.Td>
                        {isEditCourseEval ? (
                          <TextInput
                            size="xs"
                            {...form.getInputProps(`courseEval.${index}.W`)}
                          />
                        ) : (
                          item.W ?? "-"
                        )}
                      </Table.Td>
                      <Table.Td>
                        {isEditCourseEval ? (
                          <TextInput
                            size="xs"
                            {...form.getInputProps(`courseEval.${index}.S`)}
                          />
                        ) : (
                          item.S ?? "-"
                        )}
                      </Table.Td>
                      <Table.Td>
                        {isEditCourseEval ? (
                          <TextInput
                            size="xs"
                            {...form.getInputProps(`courseEval.${index}.U`)}
                          />
                        ) : (
                          item.U ?? "-"
                        )}
                      </Table.Td>
                      <Table.Td>
                        {isEditCourseEval ? (
                          <TextInput
                            size="xs"
                            {...form.getInputProps(`courseEval.${index}.P`)}
                          />
                        ) : (
                          item.P ?? "-"
                        )}
                      </Table.Td>
                      <Table.Td>{total}</Table.Td>
                      <Table.Td>{(0 / (total || 1)).toFixed(2)}</Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
              <Table.Tfoot className="!bg-bgTableHeader  !border-t-[1px] border-secondary sticky bottom-0">
                {(() => {
                  const totals = calculateTotals(form.getValues().courseEval);
                  return (
                    <Table.Tr className="border-none text-secondary font-semibold">
                      <Table.Th className="rounded-bl-[8px] w-[10%]">
                        Total
                      </Table.Th>
                      <Table.Th className="w-[6%]">{totals.A}</Table.Th>
                      <Table.Th className="w-[6%]">{totals.Bplus}</Table.Th>
                      <Table.Th className="w-[6%]">{totals.B}</Table.Th>
                      <Table.Th className="w-[6%]">{totals.Cplus}</Table.Th>
                      <Table.Th className="w-[6%]">{totals.C}</Table.Th>
                      <Table.Th className="w-[6%]">{totals.Dplus}</Table.Th>
                      <Table.Th className="w-[6%]">{totals.D}</Table.Th>
                      <Table.Th className="w-[6%]">{totals.F}</Table.Th>
                      <Table.Th className="w-[6%]">{totals.W}</Table.Th>
                      <Table.Th className="w-[6%]">{totals.S}</Table.Th>
                      <Table.Th className="w-[6%]">{totals.U}</Table.Th>
                      <Table.Th className="w-[6%]">{totals.P}</Table.Th>
                      <Table.Th className="w-[9%]">{totals.total}</Table.Th>
                      <Table.Th className="!rounded-br-[8px] w-[9%]">
                        0
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
                {/* First row of headers */}
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

      {/* <div className="flex px-16 sm:max-ipad11:px-8  flex-row items-center justify-between h-full">
        <div className="h-full  justify-center flex flex-col">
          <p className="text-secondary text-[21px] font-semibold">
            TQF 5 is coming soon to
            <span className="font-[600] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
              ScoreOBE +
            </span>{" "}
          </p>
          <br />
          <p className=" -mt-3 mb-6 text-b2 break-words font-medium leading-relaxed">
            Instructors, get ready to experience a new and improved way to //
            complete TQF 5 <br /> starting February 2025.
          </p>
        </div>

        <img className=" z-50  w-[25vw]  " src={maintenace} alt="loginImage" />
      </div> */}
    </>
  );
}
