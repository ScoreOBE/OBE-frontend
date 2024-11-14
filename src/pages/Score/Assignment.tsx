import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Alert, Button, Chip, Group, Menu, Modal, Table } from "@mantine/core";
import Icon from "@/components/Icon";
import IconEyePublish from "@/assets/icons/eyePublish.svg?react";
import IconPublish from "@/assets/icons/publish.svg?react";
import IconUnPublish from "@/assets/icons/unPublish.svg?react";
import IconPublishEach from "@/assets/icons/publishEach.svg?react";
import IconPublishAll from "@/assets/icons/publishAll.svg?react";
import IconDots from "@/assets/icons/dots.svg?react";
import IconTrash from "@/assets/icons/trash.svg?react";
import IconPencilMinus from "@/assets/icons/pencilMinus.svg?react";
import IconArrowRight from "@/assets/icons/arrowRight.svg?react";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import Breadcrumbs from "@/components/Breadcrumbs";
import notFoundImage from "@/assets/image/notFound.jpg";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { dateFormatter, getSectionNo } from "@/helpers/functions/function";
import { ROUTE_PATH } from "@/helpers/constants/route";
import needAccess from "@/assets/image/needAccess.jpg";
import { setShowNavbar } from "@/store/showNavbar";
import { setShowSidebar } from "@/store/showSidebar";
import { IModelUser } from "@/models/ModelUser";
import Loading from "@/components/Loading/Loading";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import { useForm } from "@mantine/form";
import { IModelAssignment } from "@/models/ModelCourse";

export default function Assignment() {
  const { courseNo, sectionNo } = useParams();
  const path = useLocation().pathname;
  const loading = useAppSelector((state) => state.loading.loading);
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
      path: `${ROUTE_PATH.INS_DASHBOARD}?${params.toString()}`,
    },
    {
      title: "Sections",
      path: `${ROUTE_PATH.COURSE}/${courseNo}/${
        ROUTE_PATH.SECTION
      }?${params.toString()}`,
    },
    { title: `Assignment Section ${getSectionNo(sectionNo)}` },
  ]);
  const [openPublishScoreModal, setOpenPublishScoreModal] = useState(false);
  const [openSelectSecModal, setOpenSelectSecModal] = useState(false);
  const [isPublishAll, setIsPublishAll] = useState(false);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      isPublish: false,
      sections: [] as any[],
      assignments: [] as string[],
    },
    validate: {},
  });

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  }, []);

  const onClosePublishModal = () => {
    setOpenPublishScoreModal(false);
    setOpenSelectSecModal(false);
    form.reset();
  };

  const goToOverall = (name: string) => {
    navigate({
      pathname: `${path}/${name}/${ROUTE_PATH.SCORE}`,
      search: "?" + params.toString(),
    });
  };

  const publishScore = (isPublishAll: boolean) => {
    form.setFieldValue("isPublish", true);
    if (isPublishAll) {
      const allSec = course?.sections?.map((sec) => sec.sectionNo) || [];
      form.setFieldValue("sections", allSec);
    }
    const sectionsToNum = form
      .getValues()
      .sections.map((sec: string) => Number(sec));
    form.setFieldValue("sections", sectionsToNum);
  };

  return (
    <>
      {/* Select assignment to publish */}
      <Modal
        opened={openPublishScoreModal}
        closeOnClickOutside={false}
        size="38vw"
        title={
          <div className="flex flex-col gap-2">
            <p>Publish score {isPublishAll ? "all" : "each"} sections</p>
            <p className=" text-[12px] text-noData">
              {courseNo} {course?.courseName}
            </p>
          </div>
        }
        transitionProps={{ transition: "pop" }}
        centered
        onClose={onClosePublishModal}
      >
        {isPublishAll && (
          <Alert
            variant="light"
            color="blue"
            title={
              <p>
                <span className="font-extrabold underline">All students</span>
                {` enrolled in this course will be able to see the assignments score you publish.`}
              </p>
            }
            icon={<Icon IconComponent={IconInfo2} />}
            classNames={{ icon: "size-6" }}
            className="mb-5"
          ></Alert>
        )}
        <div className="mb-6 flex flex-col gap-3">
          {course?.sections.length! > 1 && (
            <Chip
              classNames={{
                label:
                  "text-[13px] text-default font-semibold translate-y-[3px]",
              }}
              size="md"
              checked={
                form.getValues().assignments.length ===
                section?.assignments!.length
              }
              onChange={() => {
                if (
                  form.getValues().assignments.length ===
                  section?.assignments!.length
                ) {
                  form.setFieldValue("assignments", []);
                } else {
                  const allAssign =
                    section?.assignments?.map((as) => as.name) || [];
                  form.setFieldValue("assignments", [...allAssign]);
                }
              }}
            >
              All Assignment
            </Chip>
          )}
          <Chip.Group
            {...form.getInputProps("assignments")}
            multiple
            value={form.getValues().assignments?.map((as) => as)}
            onChange={(event) => {
              form.setFieldValue("assignments", event);
            }}
          >
            <Group>
              <div className="flex gap-3">
                {section?.assignments?.map((as, index) => (
                  <Chip
                    key={index}
                    classNames={{
                      root: "h-8 min-w-[114px]  !rounded-[10px] text-center justify-center items-center",
                      label:
                        "text-[13px] text-default font-semibold translate-y-[3px] ",
                    }}
                    size="md"
                    value={as.name}
                  >
                    {as.name}
                  </Chip>
                ))}
              </div>
            </Group>
          </Chip.Group>
        </div>

        <div className="flex gap-2 justify-end w-full">
          <Button onClick={onClosePublishModal} variant="subtle">
            Cancel
          </Button>
          {!isPublishAll ? (
            <Button
              rightSection={
                <Icon
                  IconComponent={IconArrowRight}
                  className="size-5 stroke-2"
                />
              }
              disabled={!form.getValues().assignments.length}
              onClick={() => {
                setOpenPublishScoreModal(false);
                setOpenSelectSecModal(true);
                form.setFieldValue("sections", []);
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={() => publishScore(true)}
              disabled={!form.getValues().assignments.length}
            >
              Publish
            </Button>
          )}
        </div>
      </Modal>
      {/* Select section to publish */}
      <Modal
        opened={openSelectSecModal}
        closeOnClickOutside={false}
        size="38vw"
        title={
          <div className="flex flex-col gap-2">
            <p>Publish score {isPublishAll ? "all" : "each"} sections</p>
            <p className=" text-[12px] text-noData">
              {courseNo} {course?.courseName}
            </p>
          </div>
        }
        transitionProps={{ transition: "pop" }}
        centered
        onClose={onClosePublishModal}
      >
        <Alert
          variant="light"
          color="blue"
          title={<p>You choose Quiz 1, Quiz 4 and Prelim 2 to publish.</p>}
          icon={<Icon IconComponent={IconInfo2} />}
          classNames={{ icon: "size-6" }}
          className="mb-5"
        ></Alert>

        <Alert
          variant="light"
          color="#D0820C"
          title={
            <p className="font-medium">
              <span className="font-extrabold text-[#D0820C]">
                Oops! Looks like Quiz 1 and Prelim 2 couldn't find in section
                801.
              </span>
            </p>
          }
          icon={<Icon IconComponent={IconExclamationCircle} />}
          classNames={{ icon: "size-6" }}
          className="mb-5 -mt-2"
        ></Alert>

        <div className="-mt-1 gap-2 flex flex-col mb-6">
          <p className="text-[14px] mb-1 font-semibold text-secondary">
            Select section to publish
          </p>
          {/* Chip */}
          {course?.sections.length! > 1 && (
            <Chip
              classNames={{
                label:
                  "text-[13px] text-default font-semibold translate-y-[3px]",
              }}
              size="md"
              checked={
                form.getValues().sections.length === course?.sections.length
              }
              onChange={() => {
                if (
                  form.getValues().sections.length === course?.sections.length
                ) {
                  form.setFieldValue("sections", []);
                } else {
                  const allSec =
                    course?.sections?.map((sec) => sec.sectionNo!.toString()) ||
                    [];
                  form.setFieldValue("sections", allSec);
                }
              }}
            >
              All Sections
            </Chip>
          )}
          <Chip.Group
            {...form.getInputProps("sections")}
            multiple
            value={form.getValues().sections.map((sec) => sec.toString())}
            onChange={(event) => {
              form.setFieldValue("sections", event);
            }}
          >
            <Group className="flex gap-3">
              <div className="flex gap-3">
                {course?.sections.map((sec) => (
                  <Chip
                    key={sec.id}
                    classNames={{
                      root: "h-8 min-w-[114px]  !rounded-[10px] text-center justify-center items-center",
                      label:
                        "text-[13px] text-default font-semibold translate-y-[3px] ",
                    }}
                    size="md"
                    value={sec.sectionNo?.toString()}
                  >
                    Section {sec.sectionNo}
                  </Chip>
                ))}
              </div>
            </Group>
          </Chip.Group>
        </div>

        <div className="flex gap-2 justify-end w-full">
          <Button
            onClick={() => {
              setOpenSelectSecModal(false);
              setOpenPublishScoreModal(true);
            }}
            variant="subtle"
          >
            Back
          </Button>

          <Button
            onClick={() => publishScore(false)}
            disabled={!form.getValues().sections.length}
          >
            Publish
          </Button>
        </div>
      </Modal>

      <div className="bg-white flex flex-col h-full w-full px-6 py-5 gap-3 overflow-hidden">
        <Breadcrumbs items={items} />
        {loading ? (
          <Loading />
        ) : (section?.instructor as IModelUser)?.id === user.id ||
          (section?.coInstructors as IModelUser[])
            ?.map(({ id }) => id)
            .includes(user.id) ? (
          <>
            <div className="flex flex-row  py-1  items-center justify-between">
              <p className="text-secondary text-[18px] font-semibold">
                {section?.assignments?.length} Assignment
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
                      <Icon IconComponent={IconEyePublish} className="size-5" />
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
                  <Menu.Item
                    className="text-[#3E3E3E] text-[14px] h-8 w-full "
                    onClick={() => {
                      setIsPublishAll(false);
                      setOpenPublishScoreModal(true);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        IconComponent={IconPublishEach}
                        className="size-4 text-[#000000]"
                      />
                      <span>Each Section</span>
                    </div>
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      setIsPublishAll(true);
                      setOpenPublishScoreModal(true);
                    }}
                    className="text-[#3E3E3E] text-[14px] h-8 w-full "
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        IconComponent={IconPublishAll}
                        className="size-4 text-[#000000]"
                      />
                      <span>All Sections</span>
                    </div>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
            {/* Table */}
            <div
              className="overflow-y-auto overflow-x-auto w-full h-fit max-h-full  border flex flex-col rounded-lg border-secondary"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
                height: "fit-content",
              }}
            >
              <Table stickyHeader>
                <Table.Thead>
                  <Table.Tr className="bg-[#e5e7f6]">
                    <Table.Th className="w-60">Name</Table.Th>
                    <Table.Th className="w-40 text-end pr-14 !pl-0">
                      Full Scores
                    </Table.Th>
                    <Table.Th className="w-40 text-end pr-20 !pl-0">
                      Mean
                    </Table.Th>
                    <Table.Th className="!pl-12">Created</Table.Th>
                    <Table.Th className="w-40">Student(s)</Table.Th>
                    <Table.Th className="w-40 !px-4 text-center">
                      Published
                    </Table.Th>
                    <Table.Th className="w-50"></Table.Th>
                  </Table.Tr>
                </Table.Thead>

                {section?.assignments?.length !== 0 ? (
                  <Table.Tbody className="text-default font-semibold text-[14px] ">
                    {section?.assignments?.map((assignment, index) => {
                      const totalStudent = section.students?.filter(
                        ({ scores }) =>
                          scores.find(
                            ({ assignmentName }) =>
                              assignmentName == assignment.name
                          )
                      ).length;
                      const totalScore = section.students?.reduce(
                        (a, b) =>
                          a +
                          (b.scores
                            .find(
                              ({ assignmentName }) =>
                                assignmentName == assignment.name
                            )
                            ?.questions.reduce((a, b) => a + b.score, 0) || 0),
                        0
                      );
                      return (
                        <Table.Tr
                          key={index}
                          className={`hover:bg-[#F3F3F3] cursor-pointer ${
                            index % 2 === 0 && "bg-[#F8F9FA]"
                          }`}
                          onClick={() => goToOverall(`${assignment.name}`)}
                        >
                          <Table.Td>{assignment.name}</Table.Td>
                          <Table.Td className="text-end pr-14 !pl-0">
                            {assignment.questions.reduce(
                              (a, b) => a + b.fullScore,
                              0
                            )}
                          </Table.Td>
                          <Table.Td className="text-end pr-20 !pl-0">
                            {((totalScore || 0) / (totalStudent || 1)).toFixed(
                              2
                            )}
                          </Table.Td>
                          <Table.Td className="!pl-12">
                            {dateFormatter(assignment.createdAt, 3)}
                          </Table.Td>
                          <Table.Td>{totalStudent || 0}</Table.Td>
                          <Table.Td className="text-center !pl-3">
                            {assignment.isPublish ? (
                              <Icon
                                IconComponent={IconPublish}
                                className="text-default"
                              />
                            ) : (
                              <Icon
                                IconComponent={IconUnPublish}
                                className="text-default"
                              />
                            )}
                          </Table.Td>
                          <Table.Td className="text-center flex  items-center justify-center">
                            <div
                              className="rounded-full hover:bg-gray-300 p-1 w-fit cursor-pointer"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <Menu
                                trigger="click"
                                position="bottom-end"
                                offset={2}
                              >
                                <Menu.Target>
                                  <div>
                                    <Icon
                                      IconComponent={IconDots}
                                      className=" rounded-full w-fit hover:bg-gray-300"
                                    />
                                  </div>
                                </Menu.Target>
                                <Menu.Dropdown
                                  className="rounded-md backdrop-blur-xl bg-white/70 "
                                  style={{
                                    boxShadow:
                                      "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                                  }}
                                >
                                  <Menu.Item className="text-[#3E3E3E] font-semibold text-[12px] h-7 w-[180px]">
                                    <div className="flex items-center gap-2">
                                      <Icon
                                        IconComponent={IconPencilMinus}
                                        className="size-4 stroke-[2px]"
                                      />
                                      <span>Edit Assignment Name</span>
                                    </div>
                                  </Menu.Item>
                                  <Menu.Item className="text-[#FF4747] disabled:text-[#adb5bd] hover:bg-[#d55757]/10 font-semibold text-[12px] h-7 w-[180px]">
                                    <div className="flex items-center gap-2">
                                      <Icon
                                        IconComponent={IconTrash}
                                        className="size-4 stroke-[2px]"
                                      />
                                      <span>Delete Assignment</span>
                                    </div>
                                  </Menu.Item>
                                </Menu.Dropdown>
                              </Menu>
                            </div>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                ) : (
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td
                        colSpan={7}
                        className=" text-center items-center !h-full  !w-full"
                      >
                        <div className="flex items-center !h-full justify-between px-20">
                          <div className="flex flex-col gap-3 text-start">
                            <p className="!h-full text-[20px] font-semibold">
                              No Assignment
                            </p>{" "}
                            <p className=" text-[#333333] -mt-2 text-b2 break-words font-medium leading-relaxed">
                              It looks like no assignment have been added <br/> in this
                              course yet.
                            </p>{" "}
                          </div>
                          <div className=" items-center justify-center flex">
                            <img
                              src={notFoundImage}
                              className="h-full items-center  w-[24vw] justify-center flex flex-col"
                              alt="notFound"
                            ></img>
                          </div>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                )}
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
