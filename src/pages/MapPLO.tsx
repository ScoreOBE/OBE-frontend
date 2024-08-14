import {
  Button,
  Select,
  Table,
  Tabs,
  Drawer,
  ScrollArea,
  Tooltip,
} from "@mantine/core";
import {
  IconEdit,
  IconPlus,
  IconInfoCircle,
  IconTrash,
} from "@tabler/icons-react";
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
import DrawerPLOdes from "@/components/DrawerPLO";
import { getPLOs } from "@/services/plo/plo.service";
import { IModelPLO, IModelPLONo } from "@/models/ModelPLO";
import { useSearchParams } from "react-router-dom";

import { rem, Text } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { IconGripVertical } from "@tabler/icons-react";

export default function MapPLO() {
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear);
  const [params, setParams] = useSearchParams();
  const [openedDropdown, setOpenedDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState<any>();
  const [ploList, setPloList] = useState<Partial<IModelPLO>>({});
  const [state, handlers] = useListState(ploList.data || []);

  const fetchPLO = async () => {
    let res = await getPLOs({
      role: user.role,
      departmentCode: user.departmentCode,
    });
    if (res) {
      setPloList(res.plos[0].collections[0]);
    }
  };

  const [courseManagement, setCourseManagement] = useState<
    IModelCourseManagement[]
  >([]);

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

  useEffect(() => {
    if (academicYear.length) {
      fetchPLO();
    }
    console.log(state);
  }, [academicYear, params]);

  useEffect(() => {
    if (ploList.data) {
      handlers.setState(ploList.data);
    }
  }, [ploList.data]);

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

  return (
    <>
      <div className=" flex flex-col h-full w-full px-6 pb-2 pt-2 gap-4 overflow-hidden ">
        <Tabs
          color="#5768d5"
          classNames={{ root: "overflow-hidden flex flex-col max-h-full" }}
          defaultValue="plodescription"
        >
          <Tabs.List>
            <Tabs.Tab value="plodescription">PLO Description</Tabs.Tab>
            <Tabs.Tab className="overflow-hidden" value="plomapping">
              Map PLO
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="plodescription" className="overflow-hidden">
            <div className=" overflow-hidden  bg-[#ffffff] flex flex-col h-full w-full  py-3 gap-[12px] ">
              <div className="flex items-center  justify-between  ">
                <div className="flex flex-col items-start ">
                  <div className="flex items-center text-primary gap-1">
                    <p className="text-secondary text-[16px] font-bold">
                      PLO Collection {}
                    </p>
                    {/* Tooltip */}

                    <Tooltip
                      multiline
                      arrowOffset={18}
                      arrowSize={7}
                      label="
                       Use this button to save this information in your profile, after that you will be able to access it any time and share it via email.
                      "
                      withArrow
                      className="w-60"
                      // color="white"
                      position="bottom-start"
                    >
                      <IconInfoCircle size={16} className="-ml-0" />
                    </Tooltip>
                  </div>
                  <div className="text-[#909090] text-[12px] font-medium">
                    <p>เกณฑ์ของ ABET (ABET Criteria)</p>
                  </div>
                </div>
              </div>
              <div className="overflow-y-auto">
                <DragDropContext
                  onDragEnd={({ destination, source }) =>
                    handlers.reorder({
                      from: source.index,
                      to: destination?.index || 0,
                    })
                  }
                >
                  <Droppable droppableId="dnd-list" direction="vertical">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className=" -mt-4 overflow-y-auto"
                      >
                        {state.map((item, index) => (
                          <Draggable
                            key={item.no}
                            index={index}
                            draggableId={item.no.toString()}
                          >
                            {(provided, snapshot) => (
                              <div
                                className="flex p-4 w-full  justify-between   border-b last:border-none"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className=" flex flex-col gap-2 w-[90%]">
                                  <p className="text-secondary font-semibold text-[14px]">
                                    PLO-{item.no}
                                  </p>
                                  <div className="text-tertiary text-[13px] font-medium flex flex-col gap-1">
                                    <div className="flex">
                                      <li></li> {item.descTH}
                                    </div>
                                    <div className="flex">
                                      <li></li> {item.descEN}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-3 items-center">
                                  <IconEdit
                                    size={16}
                                    stroke={1.5}
                                    color="#F39D4E"
                                    className="flex items-center"
                                  />
                                  <IconTrash
                                    size={16}
                                    stroke={1.5}
                                    color="red"
                                    className="flex items-center"
                                  />
                                  <IconGripVertical
                                    style={{
                                      width: rem(18),
                                      height: rem(18),
                                    }}
                                    stroke={1.5}
                                  />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
          </Tabs.Panel>

          <Tabs.Panel className=" overflow-hidden" value="plomapping">
            <div className=" overflow-hidden  bg-[#ffffff] flex flex-col h-full w-full  py-3 gap-[12px] ">
              <div className="flex items-center  justify-between  ">
                <div className="flex flex-col items-start ">
                  <p className="text-secondary text-[16px] font-bold">
                    Map PLO
                  </p>
                  <div className="text-[#909090] text-[12px] font-medium">
                    <p>xxxxxxxxxxxxxxx</p>
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
                    leftSection={
                      <IconPlus className="h-5 w-5 -mr-1" stroke={1.5} />
                    }
                    className="rounded-[8px] text-[12px] h-[32px] w-fit "
                  >
                    Add Course
                  </Button>
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
                      {ploList.data?.map((plo, index) => (
                        <Table.Th key={index}>PLO-{plo.no}</Table.Th>
                      ))}
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody>
                    {courseManagement.map((course, index) => (
                      <Table.Tr key={index}>
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
