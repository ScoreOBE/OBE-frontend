import { Button, Select, Table, Tabs, Drawer, ScrollArea } from "@mantine/core";
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
import { useDisclosure } from "@mantine/hooks";
import ThIcon from "@/assets/icons/thai.svg?react";
import EngIcon from "@/assets/icons/eng.svg?react";

export default function MapPLO() {
  const user = useAppSelector((state) => state.user);
  const [openedDropdown, setOpenedDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState<any>();
  const [courseManagement, setCourseManagement] = useState<
    IModelCourseManagement[]
  >([]);
  const [drawerPLO, { open: opendDrawerPLO, close: closeDrawerPLO }] =
    useDisclosure(false);
    

  useEffect(() => {
    if (user.departmentCode) {
      const payloadCourse = {
        ...new CourseManagementRequestDTO(),
        limit: 20,
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
    <>
      <div className="  flex flex-col h-full w-full px-6 pb-2 pt-2 gap-4 overflow-hidden ">
        <Tabs color="#5768d5"  classNames={{root: "overflow-hidden flex flex-col max-h-full"}} defaultValue="plodescription">
          <Tabs.List>
            <Tabs.Tab value="plodescription">PLO Description</Tabs.Tab>
            <Tabs.Tab className="overflow-hidden" value="plomapping">Map PLO</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="plodescription">

          </Tabs.Panel>

          <Tabs.Panel className=" overflow-hidden" value="plomapping">
            <div className=" overflow-hidden  bg-[#ffffff] flex flex-col h-full w-full  py-3 gap-[12px] ">
              <div className="flex items-center  justify-between  ">
                <div className="flex flex-col items-start ">
                  <p className="text-secondary text-[16px] font-bold">
                    Map PLO 
                  </p>
                  <div className="text-[#909090] text-[12px] font-medium">
                    <p>PLO Collection 1</p>
                    <p>Affected to: Semester 1/67</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {/* <Button
              color="#E9E9E9"
              leftSection={
                <Icon IconComponent={PLOdescIcon} className="h-5 w-5 -mr-1" />
              }
              className="rounded-[8px] text-[#575757] font-bold hover:text-[#323232] text-[12px] h-[32px] w-fit "
              onClick={() => opendDrawerPLO()}
            >
              PLO Description
            </Button> */}
                  <Button
                    color="#F39D4E"
                    leftSection={<IconEdit className="size-4" stroke={1.5} />}
                    className="rounded-[8px] text-[12px] h-[32px] w-fit "
                  >
                    Map PLO
                  </Button>
                  <Button
                    color="#5768D5"
                    leftSection={
                      <IconPlus className="h-5 w-5 -mr-1" stroke={1.5} />
                    }
                    className="rounded-[8px] text-[12px] h-[32px] w-fit "
                  >
                    Add Course
                  </Button>

                  {/* <Select
              rightSectionPointerEvents="all"
              // data={instructorOption}
              allowDeselect
              size="xs"
              placeholder="Collection 1"
              className="w-36 border-none"
              classNames={{
                input: "rounded-md  h-[32px] border-secondary",
              }}
              rightSection={
                <template className="flex items-center gap-2 absolute right-2">
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
            /> */}
                </div>
              </div>
              {/* Table */}

              <InfiniteScroll
                dataLength={courseManagement.length}
                next={onShowMore}
                height={"100%"}
                hasMore={payload?.hasMore}
                className="overflow-y-auto w-full h-fit max-h-full border flex flex-col  rounded-lg border-secondary"
                style={{ height: "fit-content" }}
                loader={<Loading />}
              >
                <Table stickyHeader>
                  <Table.Thead>
                    <Table.Tr className="bg-[#F4F5FE]">
                      <Table.Th>Course No.</Table.Th>
                      <Table.Th>PLO-1</Table.Th>
                      <Table.Th>PLO-2</Table.Th>
                      <Table.Th>PLO-3</Table.Th>
                      <Table.Th>PLO-4</Table.Th>
                      <Table.Th>PLO-5</Table.Th>
                      <Table.Th>PLO-6</Table.Th>
                      <Table.Th>PLO-7</Table.Th>
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody>
                    {courseManagement.map((course, index) => (
                      <Table.Tr>
                        <Table.Td className="py-4 font-bold pl-5">
                          {course.courseNo}
                        </Table.Td>
                        <Table.Td className="py-4 pl-5 flex items-start ">
                          <Icon IconComponent={CheckIcon} />
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </InfiniteScroll>
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  );
}
