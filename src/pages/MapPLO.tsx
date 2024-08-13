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
      <Drawer.Root
        position="right"
        opened={drawerPLO}
        onClose={closeDrawerPLO}
        padding={"sm"}
        className="max-h-screen overflow-hidden"
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header className="flex flex-col gap-2">
            <div className="flex justify-between w-full">
              <Drawer.Title className="w-full">
                <div className="flex flex-col gap-1 items-start">
                  <p className="text-secondary text-[16px] font-bold">
                    PLO Description
                  </p>

                  <p className="text-[#909090] text-[12px] font-medium">
                    PLO Collection 1
                  </p>
                </div>
              </Drawer.Title>
              <Drawer.CloseButton />
            </div>
            <div className="mt-2 border-b border-[#B7B5B5] w-full"></div>
            <div className="flex w-full justify-between items-start ">
              <p className="flex items-center font-medium text-tertiary h-9">
                ABET Criteria
              </p>
              <Tabs defaultValue="first" variant="pills">
                <Tabs.List className="leading-none">
                  <Tabs.Tab value="first">
                    <div className="flex flex-row items-center gap-2 ">
                      <Icon IconComponent={ThIcon} />
                      ไทย
                    </div>
                  </Tabs.Tab>
                  <Tabs.Tab value="Second">
                    <div className="flex flex-row items-center gap-2 ">
                      <Icon IconComponent={EngIcon} />
                      Eng
                    </div>
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs>
            </div>
          </Drawer.Header>
          <Drawer.Body className="flex h-[92%] overflow-hidden ">
            {/* List of PLO */}
            <div className="flex flex-col gap-3 w-full h-full overflow-y-auto ">
              <div className="flex flex-col gap-2 bg-[#eff0ff] px-6 py-4 text-[13px]  rounded-lg">
                <p className="text-[14px] font-semibold text-secondary">
                  PLO-1
                </p>
                <div className="flex flex-row">
                  <li></li>
                  An ability to identify, formulate, and solve complex
                  engineering problems by applying principles of engineering,
                  sciences, and mathematics.
                </div>
              </div>

              <div className="flex flex-col gap-2 bg-[#eff0ff] px-6 py-4 text-[13px]  rounded-lg">
                <p className="text-[14px] font-semibold text-secondary">
                  PLO-2
                </p>
                <div className="flex flex-row">
                  <li></li>
                  An ability to identify, formulate, and solve complex
                  engineering problems by applying principles of engineering,
                  sciences, and mathematics.
                </div>
              </div>

              <div className="flex flex-col gap-2 bg-[#eff0ff] px-6 py-4 text-[13px]  rounded-lg">
                <p className="text-[14px] font-semibold text-secondary">
                  PLO-3
                </p>
                <div className="flex flex-row">
                  <li></li>
                  An ability to identify, formulate, and solve complex
                  engineering problems by applying principles of engineering,
                  sciences, and mathematics.
                </div>
              </div>

              <div className="flex flex-col gap-2 bg-[#eff0ff] px-6 py-4 text-[13px]  rounded-lg">
                <p className="text-[14px] font-semibold text-secondary">
                  PLO-4
                </p>
                <div className="flex flex-row">
                  <li></li>
                  An ability to identify, formulate, and solve complex
                  engineering problems by applying principles of engineering,
                  sciences, and mathematics.
                </div>
              </div>

              <div className="flex flex-col gap-2 bg-[#eff0ff] px-6 py-4 text-[13px]  rounded-lg">
                <p className="text-[14px] font-semibold text-secondary">PLO-</p>
                <div className="flex flex-row">
                  <li></li>
                  An ability to identify, formulate, and solve complex
                  engineering problems by applying principles of engineering,
                  sciences, and mathematics.
                </div>
              </div>
            </div>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
      <div className="bg-[#ffffff] flex flex-col h-full w-full px-6 py-5 gap-3 ">
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
              onClick={() => opendDrawerPLO()}
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
            />
          </div>
        </div>
        {/* Table */}
        <InfiniteScroll
          dataLength={courseManagement.length}
          next={onShowMore}
          height={"100%"}
          hasMore={payload?.hasMore}
          className="w-full border rounded-lg border-secondary"
          style={{ height: "fit-content", maxHeight: "100%" }}
          loader={<Loading />}
        >
          <Table stickyHeader>
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
        </InfiniteScroll>
      </div>
    </>
  );
}
