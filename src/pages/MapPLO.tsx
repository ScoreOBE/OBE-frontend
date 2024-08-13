import { Button, Select, Table, Checkbox } from "@mantine/core";
import { IconChevronDown, IconEdit, IconPlus } from "@tabler/icons-react";
import PLOdescIcon from "@/assets/icons/PLOdescription.svg?react";
import Icon from "@/components/Icon";
import { useEffect, useState } from "react";
import CheckIcon from "@/assets/icons/Check.svg?react";
import { IModelCourseManagement } from "@/models/ModelCourseManagement";
import { getCourseManagement } from "@/services/courseManagement/courseManagement.service";
import CourseManagement from "./CourseManagement";
import { useAppSelector } from "@/store";
import { CourseManagementRequestDTO } from "@/services/courseManagement/dto/courseManagement.dto";
import Loading from "@/components/Loading";
import InfiniteScroll from "react-infinite-scroll-component";

export default function MapPLO() {
  const user = useAppSelector((state) => state.user);
  const [openedDropdown, setOpenedDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState<any>();
  const [courseManagement, setCourseManagement] = useState<
    IModelCourseManagement[]
  >([]);

  useEffect(() => {
    if (user.departmentCode) {
      const payloadCourse = {
        ...new CourseManagementRequestDTO(),
        departmentCode: user.departmentCode,
        hasMore: true,
      };
      setPayload(payloadCourse);
      fetchCourse(payloadCourse);
    }
  }, [user]);

  const fetchCourse = async (payloadCourse: any) => {
    setLoading(true);
    const res = await getCourseManagement(payloadCourse);
    if (res) {
      setCourseManagement(res.courses);
    }
    setLoading(false);
  };

  const onShowMore = async () => {
    const res = await getCourseManagement({
      ...payload,
      page: payload.page + 1,
    });
    if (res) {
      setCourseManagement([...courseManagement, ...res]);
      setPayload({
        ...payload,
        page: payload.page + 1,
        hasMore: res.length >= payload.limit,
      });
    } else {
      setPayload({ ...payload, hasMore: false });
    }
  };

  useEffect(() => {
    console.log(CourseManagement);
  });

  return (
    <div className="bg-[#ffffff] flex flex-col h-full w-full px-6 py-3 gap-[12px] overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex flex-col  items-start ">
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
            className="rounded-[8px] text-[12px] h-[32px] w-fit "
          >
            Map PLO
          </Button>
          <Button
            color="#5768D5"
            leftSection={<IconPlus className="h-5 w-5 -mr-1" stroke={1.5} />}
            className="rounded-[8px] text-[12px] h-[32px] w-fit "
          >
            Add Course
          </Button>
          <Button
            color="#efefef"
            leftSection={
              <Icon IconComponent={PLOdescIcon} className="h-5 w-5 -mr-1" />
            }
            className="rounded-[8px] text-[12px] h-[32px] w-fit "
          >
            PLO
          </Button>
          <Select
            rightSectionPointerEvents="all"
            // data={instructorOption}
            allowDeselect
            placeholder="Collection 1"
            className="w-36  border-none"
            classNames={{
              input: "rounded-md h-[32px]  border-secondary",
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

      <div className="rounded-lg overflow-clip border border-secondary">
        <Table stickyHeader stickyHeaderOffset={60}>
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
            {courseManagement.map((course, index) => (
              <Table.Tr>
                <Table.Td className="py-4 pl-5">{course.courseNo}</Table.Td>
                <Table.Td className="py-4 pl-5 flex items-start ">
                  <Icon IconComponent={CheckIcon} />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  );
}
