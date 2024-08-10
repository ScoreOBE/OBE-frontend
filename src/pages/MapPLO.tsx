import { Button, Select, Table, Checkbox } from "@mantine/core";
import { IconChevronDown, IconEdit, IconPlus } from "@tabler/icons-react";
import PLOdescIcon from "@/assets/icons/PLOdescription.svg?react";
import Icon from "@/components/Icon";
import { useState } from "react";
import CheckIcon from "@/assets/icons/Check.svg?react";

export default function MapPLO() {
  const [openedDropdown, setOpenedDropdown] = useState(false);

  return (
    <div className="bg-[#ffffff] flex flex-col h-full w-full px-6 py-5 gap-3 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1 items-start ">
          <p className="text-secondary text-[16px] font-bold">
            Map PLO required
          </p>
          <div className="text-[#909090] text-[12px] font-medium">
            <p>PLO Collection 1</p>
            <p>Affected to: Semester 1/67</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            color="#F39D4E"
            leftSection={<IconEdit className="size-4" stroke={1.5} />}
            className=" rounded-[8px]  text-[13px] font-semibold h-9 px-3"
          >
            Map PLO
          </Button>
          <Button
            color="#5768D5"
            leftSection={<IconPlus className="h-5 w-5 -mr-1" stroke={1.5} />}
            className=" rounded-[8px]  text-[13px] font-semibold h-9 px-3"
          >
            Add Course
          </Button>
          <Button
            color="#efefef"
            leftSection={
              <Icon IconComponent={PLOdescIcon} className="h-5 w-5 -mr-1" />
            }
            className=" rounded-[8px]  text-[13px] font-semibold h-9 px-3 text-tertiary border-[#DCDCDC]  hover:text-tertiary"
          >
            PLO
          </Button>
          <Select
            rightSectionPointerEvents="all"
            // data={instructorOption}
            allowDeselect
            placeholder="Collection 1"
            className="w-36 border-none"
            classNames={{
              input: "rounded-md  border-secondary",
            }}
            rightSection={
              <template className="flex items-center gap-2 absolute right-2">
                {/* {editUser && (
                  <IconX
                    size={"1.25rem"}
                    stroke={2}
                    className={`cursor-pointer`}
                    onClick={() => setEditUser(null)}
                  />
                )} */}
                <IconChevronDown
                  stroke={2}
                  className={`${
                    openedDropdown ? "rotate-180" : ""
                  } stroke-primary cursor-pointer`}
                  onClick={() => setOpenedDropdown(!openedDropdown)}
                />
              </template>
            }
            // dropdownOpened={openedDropdown}
            // onDropdownClose={() => setOpenedDropdown(false)}
          />
        </div>
      </div>
      <Table stickyHeader stickyHeaderOffset={60} withTableBorder>
        <Table.Thead>
          <Table.Tr className="bg-[#F4F5FE]">
            <Table.Th>Course</Table.Th>
            <Table.Th>PLO 1</Table.Th>
            <Table.Th>PLO 2</Table.Th>
            <Table.Th>PLO 3</Table.Th>
            <Table.Th>PLO 4</Table.Th>
            <Table.Th>PLO 5</Table.Th>
            <Table.Th>PLO 6</Table.Th>
            <Table.Th>PLO 7</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          <Table.Tr>
            <Table.Td className="py-4 pl-5">266514</Table.Td>
            <Table.Td className="py-4 pl-5 flex items-start ">
              <Icon IconComponent={CheckIcon} />
            </Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td className="py-4 pl-5">266324</Table.Td>
            <Table.Td className="py-4 pl-5 flex items-start">
              <Icon IconComponent={CheckIcon} />
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
  );
}
