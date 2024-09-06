import { COURSE_TYPE, TEACHING_METHOD } from "@/helpers/constants/enum";
import {
  Radio,
  Checkbox,
  TextInput,
  Textarea,
  Button,
  Alert,
  Table,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconInfoCircle } from "@tabler/icons-react";
import AddIcon from "@/assets/icons/plus.svg?react";
import Icon from "../Icon";
import IconPLO from "@/assets/icons/PLOdescription.svg?react";
import DrawerPLOdes from "@/components/DrawerPLO";
import { useState } from "react";

type Props = {};
export default function Part5TQF3() {
  const [openDrawerPLOdes, setOpenDrawerPLOdes] = useState(false);
  const plo = 12;
  const clo = 12;
  return (
    <>
      <DrawerPLOdes
        opened={openDrawerPLOdes}
        onClose={() => setOpenDrawerPLOdes(false)}
      />

      <div className="flex flex-col w-full max-h-full gap-4 pb-6">
        {/* Topic */}
        <div className="flex text-secondary items-center w-full justify-between">
          <span className="text-[15px] font-bold">
            {"CLO Mapping "}
            <span className=" text-red-500">*</span>
          </span>
          <Button
            className="text-center rounded-[8px] text-[12px] w-fit font-semibold h-8 px-4"
            onClick={() => setOpenDrawerPLOdes(true)}
            color="#5768d5"
          >
            <div className="flex gap-2">
              <Icon IconComponent={IconPLO} />
              PLO Description
            </div>
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-y-auto overflow-x-auto w-full h-full max-h-full border flex flex-col rounded-lg border-secondary relative">
          <Table stickyHeader striped>
            <Table.Thead className="z-[2]">
              <Table.Tr>
                <Table.Th className="min-w-[480px] sticky left-0 !p-0">
                  <div className="w-full flex items-center px-[25px] h-[58px] border-r-[1px] border-[#DEE2E6]">
                    CLO Description
                  </div>
                </Table.Th>
                {Array.from({ length: plo }).map((_, index) => (
                  <Table.Th key={index} className="min-w-[95px] w-fit">
                    PLO-{index + 1}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {Array.from({ length: clo }).map((_, rowIndex) => (
                <Table.Tr
                  key={rowIndex}
                  className="text-[13px] text-default"
                  // data-striped={rowIndex % 2 ? "odd" : "even"}
                >
                  <Table.Td className="!p-0 sticky left-0 z-[1]">
                    <div className="flex flex-col gap-0.5 px-[25px] py-4 border-r-[1px] border-[#DEE2E6]">
                      <p>อธิบายหลักการทำงานของระบบปฏิบัติการคอมพิวเตอร์.</p>
                      <p>
                        Explain the working principle of computer operating
                        systems the working principle of computer operating
                        systems the working principle of computer operating
                        systems the working principle of computer operating
                        systems. systems.
                      </p>
                    </div>
                  </Table.Td>
                  {Array.from({ length: plo }).map((_, index) => (
                    <Table.Td key={index}>
                      <div className="flex items-start">
                        <Checkbox
                          size="xs"
                          classNames={{
                            input:
                              "bg-[black] bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                            body: "mr-3 px-0",
                            label: "text-[14px] text-[#615F5F] cursor-pointer",
                          }}
                        />
                      </div>
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </div>
    </>
  );
}
