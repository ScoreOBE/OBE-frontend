import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { Alert, Button, Menu, Modal, Pill, Table } from "@mantine/core";
import eyePublish from "@/assets/icons/eyePublish.svg?react";
import publish from "@/assets/icons/publish.svg?react";
import publishEach from "@/assets/icons/publishEach.svg?react";
import publishAll from "@/assets/icons/publishAll.svg?react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getSectionNo } from "@/helpers/functions/function";
import { ROUTE_PATH } from "@/helpers/constants/route";
import needAccess from "@/assets/image/needAccess.jpg";
import {
  IconArrowRight,
  IconDots,
  IconInfoCircle,
  IconPencilMinus,
  IconTrash,
} from "@tabler/icons-react";
import { setShowNavbar } from "@/store/showNavbar";
import { setShowSidebar } from "@/store/showSidebar";
import { IModelUser } from "@/models/ModelUser";
import Loading from "@/components/Loading";

export default function Assignment() {
  const { courseNo, sectionNo } = useParams();
  const loading = useAppSelector((state) => state.loading);
  const user = useAppSelector((state) => state.user);
  const course = useAppSelector((state) =>
    state.course.courses.find((e) => e.courseNo == courseNo)
  );
  const section = course?.sections.find(
    (sec) => parseInt(sectionNo!) === sec.sectionNo
  );
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<any[]>([
    {
      title: "Your Course",
      path: `${ROUTE_PATH.DASHBOARD_INS}?${params.toString()}`,
    },
    {
      title: "Sections",
      path: `${ROUTE_PATH.COURSE}/${courseNo}/${
        ROUTE_PATH.SECTION
      }?${params.toString()}`,
    },
    { title: `Assignment Section ${getSectionNo(sectionNo)}` },
  ]);
  const [openAllPublishModal, setOpenAllPublishModal] = useState(false);

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  }, []);

  return (
    <>
      <Modal
        opened={openAllPublishModal}
        closeOnClickOutside={false}
        size="38vw"
        title={
          <div className="flex flex-col gap-2">
            <p>Publish score all sections</p>
            <p className=" text-[12px] text-noData">
              {courseNo} {course?.courseName}
            </p>
          </div>
        }
        transitionProps={{ transition: "pop" }}
        centered
        onClose={() => setOpenAllPublishModal(false)}
      >
        <Alert
          variant="light"
          color="blue"
          title={
            <p>
              <span className="font-extrabold underline">All students</span>
              {` enrolled in this course will be able to see the assignments score you publish.`}
            </p>
          }
          icon={<IconInfoCircle />}
          classNames={{ icon: "size-6" }}
          className="mb-5"
        ></Alert>
        <div className="-mt-1 gap-2 flex flex-col mb-6">
          <p className="text-[14px] mb-1 font-semibold text-secondary">
            Select assignment to publish
          </p>
          <div className=" flex flex-col gap-3">
            <div>
              <Pill
                classNames={{
                  root: "px-4 h-8 w-36 rounded-[10px] text-center justify-center items-center",
                  label:
                    "text-[13px] text-default font-semibold translate-y-[3px]",
                }}
                size="md"
              >
                All assignments
              </Pill>
            </div>
            <div className=" flex gap-3">
              <Pill
                classNames={{
                  root: "px-4 h-8 rounded-[10px] text-center justify-center items-center",
                  label:
                    "text-[13px] text-default font-medium translate-y-[3px]",
                }}
                size="md"
              >
                Quiz 1
              </Pill>
              <Pill
                classNames={{
                  root: "px-4 h-8 rounded-[10px] text-center justify-center items-center",
                  label:
                    "text-[13px] text-default font-medium translate-y-[3px]",
                }}
                size="md"
              >
                Test
              </Pill>
              <Pill
                classNames={{
                  root: "px-4 h-8 rounded-[10px] text-center justify-center items-center",
                  label:
                    "text-[13px] text-default font-medium translate-y-[3px]",
                }}
                size="md"
              >
                Quiz 2
              </Pill>
              <Pill
                classNames={{
                  root: "px-4 h-8 rounded-[10px] text-center justify-center items-center",
                  label:
                    "text-[13px] text-default font-medium translate-y-[3px]",
                }}
                size="md"
              >
                Quiz 3
              </Pill>
              <Pill
                classNames={{
                  root: "px-4 h-8 rounded-[10px] text-center justify-center items-center",
                  label:
                    "text-[13px] text-default font-medium translate-y-[3px]",
                }}
                size="md"
              >
                Quiz 4
              </Pill>
            </div>
            <div className=" flex gap-3">
              <Pill
                classNames={{
                  root: "px-4 h-8 rounded-[10px] text-center justify-center items-center",
                  label:
                    "text-[13px] text-default font-medium translate-y-[3px]",
                }}
                size="md"
              >
                Prelim 1
              </Pill>
              <Pill
                classNames={{
                  root: "px-4 h-8 rounded-[10px] text-center justify-center items-center",
                  label:
                    "text-[13px] text-default font-medium translate-y-[3px]",
                }}
                size="md"
              >
                Quiz 4
              </Pill>
              <Pill
                classNames={{
                  root: "px-4 h-8 rounded-[10px] text-center justify-center items-center",
                  label:
                    "text-[13px] text-default font-medium translate-y-[3px]",
                }}
                size="md"
              >
                Quiz 5
              </Pill>
              <Pill
                classNames={{
                  root: "px-4 h-8 rounded-[10px] text-center justify-center items-center",
                  label:
                    "text-[13px] text-default font-medium translate-y-[3px]",
                }}
                size="md"
              >
                Quiz 6
              </Pill>
              <Pill
                classNames={{
                  root: "px-4 h-8 rounded-[10px] text-center justify-center items-center",
                  label:
                    "text-[13px] text-default font-medium translate-y-[3px]",
                }}
                size="md"
              >
                Midterm
              </Pill>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end w-full">
          <Button
            onClick={() => setOpenAllPublishModal(false)}
            variant="subtle"
          >
            Cancel
          </Button>
          <Button rightSection={<IconArrowRight stroke={2} size={20} />}>
            Next
          </Button>
        </div>
      </Modal>

      <div className="bg-white flex flex-col h-full w-full p-6 pb-3 pt-5 gap-3 overflow-hidden">
        <Breadcrumbs items={items} />
        {/* <Breadcrumbs /> */}
        {loading ? (
          <Loading />
        ) : (section?.instructor as IModelUser)?.id === user.id ||
          (section?.coInstructors as IModelUser[])
            ?.map(({ id }) => id)
            .includes(user.id) ? (
          <>
            <div className="flex flex-row  py-2  items-center justify-between">
              <p className="text-secondary text-[18px] font-semibold">
                {section?.assignments?.length} 1 Assignment
                {section?.assignments?.length! > 1 && "s"}
              </p>
              <Menu
                trigger="click"
                openDelay={100}
                clickOutsideEvents={["mousedown"]}
                classNames={{ item: "text-[#3e3e3e] h-8 w-full" }}
              >
                <Menu.Target>
                  <Button
                    color="#13a9a1"
                    leftSection={
                      <Icon IconComponent={eyePublish} className="h-5 w-5" />
                    }
                    className="px-3"
                  >
                    Publish score
                  </Button>
                </Menu.Target>
                <Menu.Dropdown
                  className="!z-50 -translate-y-[3px] translate-x-[5px] bg-white"
                  style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px" }}
                >
                  <Menu.Item className="text-[#3E3E3E] text-[14px] h-8 w-full ">
                    <div className="flex items-center gap-2">
                      <Icon IconComponent={publishEach} className="h-4 w-4" />
                      <span>Each Section</span>
                    </div>
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => setOpenAllPublishModal(true)}
                    className="text-[#3E3E3E] text-[14px] h-8 w-full "
                  >
                    <div className="flex items-center gap-2">
                      <Icon IconComponent={publishAll} className="h-4 w-4" />
                      <span>All Sections</span>
                    </div>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
            {/* Table */}
            <div
              className="overflow-y-auto overflow-x-auto w-full h-fit max-h-full border flex flex-col rounded-lg border-secondary"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
                height: "fit-content",
              }}
            >
              <Table stickyHeader striped>
                <Table.Thead>
                  <Table.Tr className="bg-[#e5e7f6]">
                    <Table.Th className="w-60">Name</Table.Th>
                    <Table.Th>Points</Table.Th>
                    <Table.Th>Mean</Table.Th>
                    <Table.Th>Created</Table.Th>
                    <Table.Th className="w-40">Student(s)</Table.Th>
                    <Table.Th className="w-40 !px-4 text-center">
                      Published
                    </Table.Th>
                    <Table.Th className="w-50"></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody className="text-default text-b3">
                  <Table.Tr className=" hover:bg-hover">
                    <Table.Td>Quiz 1</Table.Td>
                    <Table.Td>5.0</Table.Td>
                    <Table.Td>2.0</Table.Td>
                    <Table.Td>8 Dec 2023</Table.Td>
                    <Table.Td>25</Table.Td>
                    <Table.Td className="text-center">
                      <Icon IconComponent={publish} className="text-default" />
                      {/* <Icon IconComponent={unPublish} className="text-default" /> */}
                    </Table.Td>
                    <Table.Td className="text-center flex  items-center justify-center">
                      <div className="rounded-full hover:bg-gray-300 p-1 w-fit cursor-pointer">
                        <Menu trigger="click" position="bottom-end" offset={2}>
                          <Menu.Target>
                            <IconDots className=" rounded-full w-fit hover:bg-gray-300" />
                          </Menu.Target>
                          <Menu.Dropdown
                            className="rounded-md backdrop-blur-xl bg-white/70 "
                            style={{
                              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                            }}
                          >
                            <Menu.Item className="text-[#3E3E3E] font-semibold text-[12px] h-7 w-[180px]">
                              <div className="flex items-center gap-2">
                                <IconPencilMinus
                                  stroke={1.5}
                                  className="h-4 w-4"
                                />
                                <span>Edit Assignment Name</span>
                              </div>
                            </Menu.Item>
                            <Menu.Item className="text-[#FF4747] disabled:text-[#adb5bd] hover:bg-[#d55757]/10 font-semibold text-[12px] h-7 w-[180px]">
                              <div className="flex items-center gap-2">
                                <IconTrash className="h-4 w-4" stroke={1.5} />
                                <span>Delete Assignment</span>
                              </div>
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr className=" hover:bg-hover">
                    <Table.Td>Quiz 1</Table.Td>
                    <Table.Td>5.0</Table.Td>
                    <Table.Td>2.0</Table.Td>
                    <Table.Td>8 Dec 2023</Table.Td>
                    <Table.Td>25</Table.Td>
                    <Table.Td className="text-center">
                      <Icon IconComponent={publish} className="text-default" />
                      {/* <Icon IconComponent={unPublish} className="text-default" /> */}
                    </Table.Td>
                    <Table.Td className="text-center flex  items-center justify-center">
                      <div className="rounded-full hover:bg-gray-300 p-1 w-fit cursor-pointer">
                        <Menu trigger="click" position="bottom-end" offset={2}>
                          <Menu.Target>
                            <IconDots className=" rounded-full w-fit hover:bg-gray-300" />
                          </Menu.Target>
                          <Menu.Dropdown
                            className="rounded-md backdrop-blur-xl bg-white/70 "
                            style={{
                              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                            }}
                          >
                            <Menu.Item className="text-[#3E3E3E] font-semibold text-[12px] h-7 w-[180px]">
                              <div className="flex items-center gap-2">
                                <IconPencilMinus
                                  stroke={1.5}
                                  className="h-4 w-4"
                                />
                                <span>Edit Assignment Name</span>
                              </div>
                            </Menu.Item>
                            <Menu.Item className="text-[#FF4747] disabled:text-[#adb5bd] hover:bg-[#d55757]/10 font-semibold text-[12px] h-7 w-[180px]">
                              <div className="flex items-center gap-2">
                                <IconTrash className="h-4 w-4" stroke={1.5} />
                                <span>Delete Assignment</span>
                              </div>
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr className=" hover:bg-hover">
                    <Table.Td>Quiz 1</Table.Td>
                    <Table.Td>5.0</Table.Td>
                    <Table.Td>2.0</Table.Td>
                    <Table.Td>8 Dec 2023</Table.Td>
                    <Table.Td>25</Table.Td>
                    <Table.Td className="text-center">
                      <Icon IconComponent={publish} className="text-default" />
                      {/* <Icon IconComponent={unPublish} className="text-default" /> */}
                    </Table.Td>
                    <Table.Td className="text-center flex  items-center justify-center">
                      <div className="rounded-full hover:bg-gray-300 p-1 w-fit cursor-pointer">
                        <Menu trigger="click" position="bottom-end" offset={2}>
                          <Menu.Target>
                            <IconDots className=" rounded-full w-fit hover:bg-gray-300" />
                          </Menu.Target>
                          <Menu.Dropdown
                            className="rounded-md backdrop-blur-xl bg-white/70 "
                            style={{
                              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                            }}
                          >
                            <Menu.Item className="text-[#3E3E3E] font-semibold text-[12px] h-7 w-[180px]">
                              <div className="flex items-center gap-2">
                                <IconPencilMinus
                                  stroke={1.5}
                                  className="h-4 w-4"
                                />
                                <span>Edit Assignment Name</span>
                              </div>
                            </Menu.Item>
                            <Menu.Item className="text-[#FF4747] disabled:text-[#adb5bd] hover:bg-[#d55757]/10 font-semibold text-[12px] h-7 w-[180px]">
                              <div className="flex items-center gap-2">
                                <IconTrash className="h-4 w-4" stroke={1.5} />
                                <span>Delete Assignment</span>
                              </div>
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr className=" hover:bg-hover">
                    <Table.Td>Quiz 1</Table.Td>
                    <Table.Td>5.0</Table.Td>
                    <Table.Td>2.0</Table.Td>
                    <Table.Td>8 Dec 2023</Table.Td>
                    <Table.Td>25</Table.Td>
                    <Table.Td className="text-center">
                      <Icon IconComponent={publish} className="text-default" />
                      {/* <Icon IconComponent={unPublish} className="text-default" /> */}
                    </Table.Td>
                    <Table.Td className="text-center flex  items-center justify-center">
                      <div className="rounded-full hover:bg-gray-300 p-1 w-fit cursor-pointer">
                        <Menu trigger="click" position="bottom-end" offset={2}>
                          <Menu.Target>
                            <IconDots className=" rounded-full w-fit hover:bg-gray-300" />
                          </Menu.Target>
                          <Menu.Dropdown
                            className="rounded-md backdrop-blur-xl bg-white/70 "
                            style={{
                              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                            }}
                          >
                            <Menu.Item className="text-[#3E3E3E] font-semibold text-[12px] h-7 w-[180px]">
                              <div className="flex items-center gap-2">
                                <IconPencilMinus
                                  stroke={1.5}
                                  className="h-4 w-4"
                                />
                                <span>Edit Assignment Name</span>
                              </div>
                            </Menu.Item>
                            <Menu.Item className="text-[#FF4747] disabled:text-[#adb5bd] hover:bg-[#d55757]/10 font-semibold text-[12px] h-7 w-[180px]">
                              <div className="flex items-center gap-2">
                                <IconTrash className="h-4 w-4" stroke={1.5} />
                                <span>Delete Assignment</span>
                              </div>
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr className=" hover:bg-hover">
                    <Table.Td>Quiz 1</Table.Td>
                    <Table.Td>5.0</Table.Td>
                    <Table.Td>2.0</Table.Td>
                    <Table.Td>8 Dec 2023</Table.Td>
                    <Table.Td>25</Table.Td>
                    <Table.Td className="text-center">
                      <Icon IconComponent={publish} className="text-default" />
                      {/* <Icon IconComponent={unPublish} className="text-default" /> */}
                    </Table.Td>
                    <Table.Td className="text-center flex  items-center justify-center">
                      <div className="rounded-full hover:bg-gray-300 p-1 w-fit cursor-pointer">
                        <Menu trigger="click" position="bottom-end" offset={2}>
                          <Menu.Target>
                            <IconDots className=" rounded-full w-fit hover:bg-gray-300" />
                          </Menu.Target>
                          <Menu.Dropdown
                            className="rounded-md backdrop-blur-xl bg-white/70 "
                            style={{
                              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                            }}
                          >
                            <Menu.Item className="text-[#3E3E3E] font-semibold text-[12px] h-7 w-[180px]">
                              <div className="flex items-center gap-2">
                                <IconPencilMinus
                                  stroke={1.5}
                                  className="h-4 w-4"
                                />
                                <span>Edit Assignment Name</span>
                              </div>
                            </Menu.Item>
                            <Menu.Item className="text-[#FF4747] disabled:text-[#adb5bd] hover:bg-[#d55757]/10 font-semibold text-[12px] h-7 w-[180px]">
                              <div className="flex items-center gap-2">
                                <IconTrash className="h-4 w-4" stroke={1.5} />
                                <span>Delete Assignment</span>
                              </div>
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr className=" hover:bg-hover">
                    <Table.Td>Quiz 1</Table.Td>
                    <Table.Td>5.0</Table.Td>
                    <Table.Td>2.0</Table.Td>
                    <Table.Td>8 Dec 2023</Table.Td>
                    <Table.Td>25</Table.Td>
                    <Table.Td className="text-center">
                      <Icon IconComponent={publish} className="text-default" />
                      {/* <Icon IconComponent={unPublish} className="text-default" /> */}
                    </Table.Td>
                    <Table.Td className="text-center flex  items-center justify-center">
                      <div className="rounded-full hover:bg-gray-300 p-1 w-fit cursor-pointer">
                        <Menu trigger="click" position="bottom-end" offset={2}>
                          <Menu.Target>
                            <IconDots className=" rounded-full w-fit hover:bg-gray-300" />
                          </Menu.Target>
                          <Menu.Dropdown
                            className="rounded-md backdrop-blur-xl bg-white/70 "
                            style={{
                              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                            }}
                          >
                            <Menu.Item className="text-[#3E3E3E] font-semibold text-[12px] h-7 w-[180px]">
                              <div className="flex items-center gap-2">
                                <IconPencilMinus
                                  stroke={1.5}
                                  className="h-4 w-4"
                                />
                                <span>Edit Assignment Name</span>
                              </div>
                            </Menu.Item>
                            <Menu.Item className="text-[#FF4747] disabled:text-[#adb5bd] hover:bg-[#d55757]/10 font-semibold text-[12px] h-7 w-[180px]">
                              <div className="flex items-center gap-2">
                                <IconTrash className="h-4 w-4" stroke={1.5} />
                                <span>Delete Assignment</span>
                              </div>
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr className=" hover:bg-hover">
                    <Table.Td>Quiz 1</Table.Td>
                    <Table.Td>5.0</Table.Td>
                    <Table.Td>2.0</Table.Td>
                    <Table.Td>8 Dec 2023</Table.Td>
                    <Table.Td>25</Table.Td>
                    <Table.Td className="text-center">
                      <Icon IconComponent={publish} className="text-default" />
                      {/* <Icon IconComponent={unPublish} className="text-default" /> */}
                    </Table.Td>
                    <Table.Td className="text-center flex  items-center justify-center">
                      <div className="rounded-full hover:bg-gray-300 p-1 w-fit cursor-pointer">
                        <Menu trigger="click" position="bottom-end" offset={2}>
                          <Menu.Target>
                            <IconDots className=" rounded-full w-fit hover:bg-gray-300" />
                          </Menu.Target>
                          <Menu.Dropdown
                            className="rounded-md backdrop-blur-xl bg-white/70 "
                            style={{
                              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                            }}
                          >
                            <Menu.Item className="text-[#3E3E3E] font-semibold text-[12px] h-7 w-[180px]">
                              <div className="flex items-center gap-2">
                                <IconPencilMinus
                                  stroke={1.5}
                                  className="h-4 w-4"
                                />
                                <span>Edit Assignment Name</span>
                              </div>
                            </Menu.Item>
                            <Menu.Item className="text-[#FF4747] disabled:text-[#adb5bd] hover:bg-[#d55757]/10 font-semibold text-[12px] h-7 w-[180px]">
                              <div className="flex items-center gap-2">
                                <IconTrash className="h-4 w-4" stroke={1.5} />
                                <span>Delete Assignment</span>
                              </div>
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr className=" hover:bg-hover">
                    <Table.Td>Quiz 1</Table.Td>
                    <Table.Td>5.0</Table.Td>
                    <Table.Td>2.0</Table.Td>
                    <Table.Td>8 Dec 2023</Table.Td>
                    <Table.Td>25</Table.Td>
                    <Table.Td className="text-center">
                      <Icon IconComponent={publish} className="text-default" />
                      {/* <Icon IconComponent={unPublish} className="text-default" /> */}
                    </Table.Td>
                    <Table.Td className="text-center flex  items-center justify-center">
                      <div className="rounded-full hover:bg-gray-300 p-1 w-fit cursor-pointer">
                        <Menu trigger="click" position="bottom-end" offset={2}>
                          <Menu.Target>
                            <IconDots className=" rounded-full w-fit hover:bg-gray-300" />
                          </Menu.Target>
                          <Menu.Dropdown
                            className="rounded-md backdrop-blur-xl bg-white/70 "
                            style={{
                              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                            }}
                          >
                            <Menu.Item className="text-[#3E3E3E] font-semibold text-[12px] h-7 w-[180px]">
                              <div className="flex items-center gap-2">
                                <IconPencilMinus
                                  stroke={1.5}
                                  className="h-4 w-4"
                                />
                                <span>Edit Assignment Name</span>
                              </div>
                            </Menu.Item>
                            <Menu.Item className="text-[#FF4747] disabled:text-[#adb5bd] hover:bg-[#d55757]/10 font-semibold text-[12px] h-7 w-[180px]">
                              <div className="flex items-center gap-2">
                                <IconTrash className="h-4 w-4" stroke={1.5} />
                                <span>Delete Assignment</span>
                              </div>
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </div>
          </>
        ) : (
          <div className="flex px-16  flex-row items-center justify-between h-full">
            <div className="flex justify-center  h-full items-start gap-2 flex-col">
              <p className="   text-secondary font-semibold text-[22px]">
                You need access
              </p>
              <p className=" text-[#333333] leading-6 font-medium text-[14px]">
                You're not listed as a Co-Instructor. <br /> Please contact the
                Owner section for access.
              </p>
            </div>
            <img
              className=" z-50  size-[460px] "
              src={needAccess}
              alt="loginImage"
            />
          </div>
        )}
      </div>
    </>
  );
}
