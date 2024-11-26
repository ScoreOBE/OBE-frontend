import { Button, Table, TextInput } from "@mantine/core";
import Icon from "../Icon";
import IconUpload from "@/assets/icons/upload.svg?react";
import IconEdit from "@/assets/icons/edit.svg?react";
import IconCheck2 from "@/assets/icons/Check2.svg?react";
import maintenace from "@/assets/image/maintenance.png";
import { useAppSelector } from "@/store";
import { TypeMethodTQF5 } from "@/pages/TQF/TQF5";
import { useForm } from "@mantine/form";
import { useState } from "react";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
  method: TypeMethodTQF5;
};

export default function Part1TQF5({ setForm, method }: Props) {
  const [isEditCriteria, setIsEditCriteria] = useState(false);
  const studentData = [
    {
      section: "001",
      a: "3",
      bplus: "3",
      b: "2",
      cplus: "2",
      c: "2",
      dplus: "2",
      d: "2",
      f: "1",
      w: "0",
      s: "0",
      u: "0",
      p: "0",
      total: "17",
      avg: "3.14",
    },
    {
      section: "002",
      a: "5",
      bplus: "2",
      b: "1",
      cplus: "8",
      c: "2",
      dplus: "0",
      d: "1",
      f: "3",
      w: "0",
      s: "0",
      u: "0",
      p: "0",
      total: "22",
      avg: "2.99",
    },
    {
      section: "701",
      a: "0",
      bplus: "2",
      b: "8",
      cplus: "6",
      c: "1",
      dplus: "5",
      d: "6",
      f: "2",
      w: "0",
      s: "0",
      u: "0",
      p: "0",
      total: "30",
      avg: "2.74",
    },
    {
      section: "801",
      a: "4",
      bplus: "8",
      b: "4",
      cplus: "2",
      c: "9",
      dplus: "6",
      d: "3",
      f: "1",
      w: "0",
      s: "0",
      u: "0",
      p: "0",
      total: "37",
      avg: "2.88",
    },
  ];
  const rows = studentData.map((element) => (
    <Table.Tr
      className="font-medium text-default text-[13px]"
      key={element.section}
    >
      <Table.Td>{element.section}</Table.Td>
      <Table.Td>{element.a}</Table.Td>
      <Table.Td>{element.bplus}</Table.Td>
      <Table.Td>{element.b}</Table.Td>
      <Table.Td>{element.cplus}</Table.Td>
      <Table.Td>{element.c}</Table.Td>
      <Table.Td>{element.dplus}</Table.Td>
      <Table.Td>{element.d}</Table.Td>
      <Table.Td>{element.f}</Table.Td>
      <Table.Td>{element.w}</Table.Td>
      <Table.Td>{element.s}</Table.Td>
      <Table.Td>{element.u}</Table.Td>
      <Table.Td>{element.p}</Table.Td>
      <Table.Td>{element.total}</Table.Td>
      <Table.Td>{element.avg}</Table.Td>
    </Table.Tr>
  ));
  const gradingCriteriaForm = useForm({
    mode: "controlled",
    initialValues: {
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
  });

  return (
    // <div className="flex w-full flex-col text-[15px] max-h-full gap-2 text-default ">
    //   <div className="flex text-secondary gap-4  w-full border-b-[1px] border-[#e6e6e6] pb-6 flex-col">
    //     <div className="flex text-secondary items-center justify-between flex-row gap-1 text-[15px]">
    //       <p className="font-bold">
    //         Student grading<span className="ml-1 text-red-500">*</span>
    //       </p>
    //       {method == "scoreOBE" ? (
    //         <Button
    //           leftSection={
    //             <Icon IconComponent={IconUpload} className="size-4" />
    //           }
    //           className="font-bold"
    //         >
    //           Upload Grade Sheet
    //         </Button>
    //       ) : (
    //         <Button
    //           leftSection={<Icon IconComponent={IconEdit} className="size-4" />}
    //           className="font-bold"
    //           color="#ee933e"
    //         >
    //           Edit Course Eval
    //         </Button>
    //       )}
    //     </div>
    //     <div
    //       className="overflow-x-auto w-full h-fit bg max-h-full border flex flex-col rounded-lg border-secondary"
    //       style={{
    //         boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
    //       }}
    //     >
    //       <Table stickyHeader striped>
    //         <Table.Thead>
    //           <Table.Tr className="bg-[#e5e7f6] border-b-[1px] border-secondary">
    //             <Table.Th
    //               className="!rounded-tl-[8px] items-center justify-center  text-center !rounded-tr-[8px] w-full"
    //               colSpan={15}
    //             >
    //               จำนวนนักศึกษา (Number of Students)
    //             </Table.Th>
    //           </Table.Tr>

    //           {/* Second row of headers */}
    //           <Table.Tr className="bg-[#e5e7f6]">
    //             <Table.Th className=" w-[10%]">Section</Table.Th>
    //             <Table.Th className=" w-[6%]">A</Table.Th>
    //             <Table.Th className=" w-[6%]">B+</Table.Th>
    //             <Table.Th className=" w-[6%]">B</Table.Th>
    //             <Table.Th className=" w-[6%]">C+</Table.Th>
    //             <Table.Th className=" w-[6%]">C</Table.Th>
    //             <Table.Th className=" w-[6%]">D+</Table.Th>
    //             <Table.Th className=" w-[6%]">D</Table.Th>
    //             <Table.Th className=" w-[6%]">F</Table.Th>
    //             <Table.Th className=" w-[6%]">W</Table.Th>
    //             <Table.Th className=" w-[6%]">S</Table.Th>
    //             <Table.Th className=" w-[6%]">U</Table.Th>
    //             <Table.Th className=" w-[6%]">P</Table.Th>
    //             <Table.Th className=" w-[9%]">Total</Table.Th>
    //             <Table.Th className=" w-[9%]">Avg</Table.Th>
    //           </Table.Tr>
    //         </Table.Thead>

    //         <Table.Tbody>{rows}</Table.Tbody>
    //         <Table.Tfoot className=" !bg-bgTableHeader  !border-t-[1px] border-secondary sticky bottom-0">
    //           <Table.Tr className="border-none text-secondary font-semibold">
    //             <Table.Th className="rounded-bl-[8px] w-[10%]">Total</Table.Th>
    //             <Table.Th className=" w-[6%]">12</Table.Th>
    //             <Table.Th className=" w-[6%]">15</Table.Th>
    //             <Table.Th className=" w-[6%]">15</Table.Th>
    //             <Table.Th className=" w-[6%]">18</Table.Th>
    //             <Table.Th className=" w-[6%]">14</Table.Th>
    //             <Table.Th className=" w-[6%]">13</Table.Th>
    //             <Table.Th className=" w-[6%]">12</Table.Th>
    //             <Table.Th className=" w-[6%]">7</Table.Th>
    //             <Table.Th className=" w-[6%]">0</Table.Th>
    //             <Table.Th className=" w-[6%]">0</Table.Th>
    //             <Table.Th className=" w-[6%]">0</Table.Th>
    //             <Table.Th className=" w-[6%]">0</Table.Th>
    //             <Table.Th className=" w-[9%]">106</Table.Th>
    //             <Table.Th className="!rounded-br-[8px] w-[9%]">2.94</Table.Th>
    //           </Table.Tr>
    //         </Table.Tfoot>
    //       </Table>
    //     </div>
    //   </div>
    //   <div className="flex text-secondary gap-4 items-center justify-center w-full border-b-[1px] border-[#e6e6e6] pb-6 flex-col">
    //     <div className="flex text-secondary items-center w-full justify-between flex-row gap-1 mt-2 text-[15px]">
    //       <p className="font-bold">
    //         Grading criteria<span className="ml-1 text-red-500">*</span>
    //       </p>
    //       <Button
    //         leftSection={
    //           <Icon
    //             IconComponent={isEditCriteria ? IconCheck2 : IconEdit}
    //             className="size-4"
    //           />
    //         }
    //         className="font-bold"
    //         color={isEditCriteria ? "#0eb092" : "#ee933e"}
    //         onClick={() => setIsEditCriteria(!isEditCriteria)}
    //       >
    //         {isEditCriteria ? "Done" : "Edit Grade criteria"}
    //       </Button>
    //     </div>
    //     <div
    //       className="h-fit bg max-h-full border items-center justify-center flex flex-col rounded-lg border-secondary overflow-clip"
    //       style={{
    //         boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
    //       }}
    //     >
    //       <Table striped>
    //         <Table.Thead>
    //           {/* First row of headers */}
    //           <Table.Tr className="bg-[#e5e7f6] border-b-[1px] border-secondary">
    //             <Table.Th className=" items-center justify-center text-center min-w-[100px]">
    //               Grade
    //             </Table.Th>
    //             <Table.Th className="items-center justify-center  text-center min-w-[200px]">
    //               Score range
    //             </Table.Th>
    //           </Table.Tr>
    //         </Table.Thead>

    //         <Table.Tbody className="  justify-center items-center text-center ">
    //           {Object.keys(gradingCriteriaForm.getValues()).map((key) => (
    //             <Table.Tr
    //               className="font-medium text-default text-[13px]"
    //               key={key}
    //             >
    //               <Table.Td>{key.replace("plus", "+")}</Table.Td>
    //               <Table.Td>
    //                 {!isEditCriteria ? (
    //                   (gradingCriteriaForm.getValues() as any)[key]
    //                 ) : (
    //                   <TextInput
    //                     size="xs"
    //                     {...gradingCriteriaForm.getInputProps(key)}
    //                   />
    //                 )}
    //               </Table.Td>
    //             </Table.Tr>
    //           ))}
    //         </Table.Tbody>
    //       </Table>
    //     </div>
    //   </div>
    // </div>
    <div className="flex px-16 sm:max-ipad11:px-8  flex-row items-center justify-between h-full">
      <div className="h-full  justify-center flex flex-col">
        <p className="text-secondary text-[21px] font-semibold">
          TQF 5 is coming soon to{" "}
          <span className="font-[600] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
            ScoreOBE +{" "}
          </span>{" "}
        </p>
        <br />
        <p className=" -mt-3 mb-6 text-b2 break-words font-medium leading-relaxed">
          Instructors, get ready to experience a new and improved way to
          complete TQF 5 <br /> starting February 2025.
        </p>
      </div>
      <img className=" z-50  w-[25vw]  " src={maintenace} alt="loginImage" />
    </div>
  );
}
