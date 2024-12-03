import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  Group,
  Menu,
  Modal,
  Table,
  Tabs,
  TextInput,
} from "@mantine/core";
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
import notFoundImage from "@/assets/image/notFound.jpg";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { dateFormatter, getSectionNo } from "@/helpers/functions/function";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import Loading from "@/components/Loading/Loading";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import { useForm } from "@mantine/form";
import {
  deleteAssignment,
  publishScore,
  updateAssignmentName,
} from "@/services/score/score.service";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { NOTI_TYPE, ROLE } from "@/helpers/constants/enum";
import { updateAssignments } from "@/store/course";
import { setLoadingOverlay } from "@/store/loading";
import { isEqual } from "lodash";
import MainPopup from "@/components/Popup/MainPopup";
import { IModelAssignment } from "@/models/ModelCourse";
import ChartContainer from "@/components/Chart/ChartContainer";
import React from "react";
type TabState = {
  [key: number]: string;
};
export default function AllAssignment() {
  const { courseNo } = useParams();
  const path = useLocation().pathname;
  const loading = useAppSelector((state) => state.loading);
  const user = useAppSelector((state) => state.user);
  const course = useAppSelector((state) =>
    state.course.courses.find((e) => e.courseNo == courseNo)
  );
  const allAssignments: IModelAssignment[] = [];
  const assignmentsMap: Map<string, IModelAssignment> = new Map();
  course?.sections.forEach((sec) => {
    sec.assignments?.forEach((assign) => {
      if (assign?.name && !assignmentsMap.has(assign.name)) {
        assignmentsMap.set(assign.name, assign);
      }
    });
  });
  allAssignments.push(...assignmentsMap.values());
  const [tabStates, setTabStates] = useState<TabState>({});
  const handleTabChange = (index: any, newValue: any) => {
    setTabStates((prevStates) => ({
      ...prevStates,
      [index]: newValue,
    }));
  };
  const sectionRefs = useRef(
    allAssignments!.map(() => React.createRef<HTMLDivElement>())
  );
  const [activeSection, setActiveSection] = useState<number>(0);
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [openPublishScoreModal, setOpenPublishScoreModal] = useState(false);
  const [openSelectSecModal, setOpenSelectSecModal] = useState(false);
  const [isPublishAll, setIsPublishAll] = useState(false);
  const [editDeleteAssignment, setEditDeleteAssignment] = useState("");
  const [editName, setEditName] = useState("");
  const [openModalEditAssignment, setOpenModalEditAssignment] = useState(false);
  const [openModalDeleteAssignment, setOpenModalDeleteAssignment] =
    useState(false);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      isPublish: false,
      sections: [] as any[],
      assignments: [] as string[],
    },
  });

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    dispatch(setDashboard(ROLE.INSTRUCTOR));
    localStorage.setItem("dashboard", ROLE.INSTRUCTOR);
  }, []);

  useEffect(() => {
    if (allAssignments.length) {
      sectionRefs.current = allAssignments.map(
        (_, i) => sectionRefs.current?.at(i) || React.createRef()
      );
    }
  }, [allAssignments]);

  useEffect(() => {
    if (sectionRefs.current) {
      if (!sectionRefs.current.every((ref) => ref.current)) return;
      let observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = sectionRefs.current!.findIndex(
                (ref) => ref.current === entry.target
              );
              setActiveSection(index);
            }
          });
        },
        {
          root: null,
          threshold: 0.6,
        }
      );

      sectionRefs.current.forEach((ref, i) => {
        if (ref.current) {
          observer.observe(ref.current);
        }
      });

      return () => {
        sectionRefs.current!.forEach((ref) => {
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        });
      };
    }
  }, [sectionRefs.current]);

  const onClosePublishModal = () => {
    setOpenPublishScoreModal(false);
    setOpenSelectSecModal(false);
    form.reset();
  };

  const onClickPublishScore = () => {
    form.setFieldValue("isPublish", true);
    if (isPublishAll) {
      const allSec = course?.sections?.map((sec) => sec.sectionNo) || [];
      form.setFieldValue("sections", allSec);
    }
    const sectionsToNum = form
      .getValues()
      .sections.map((sec: string) => parseInt(sec));
    form.setFieldValue("sections", sectionsToNum);
    onClickPublish();
  };

  const onClickPublish = async () => {
    dispatch(setLoadingOverlay(true));
    const res = await publishScore({
      course: course?.id,
      ...form.getValues(),
    });
    if (res) {
      dispatch(updateAssignments({ ...res }));
      showNotifications(
        NOTI_TYPE.SUCCESS,
        `${
          form.getValues().isPublish ? "Published" : "Unpublished"
        } score successfully`,
        `evaluation ${form.getValues().assignments.join(", ")} in ${form
          .getValues()
          .sections.map((item) => getSectionNo(item))
          .join(", ")} ${
          form.getValues().assignments.length > 1 ? "are" : "is"
        } ${form.getValues().isPublish ? "published" : "unpublished"}`
      );
      setOpenPublishScoreModal(false);
      setOpenSelectSecModal(false);
      form.reset();
    }
    dispatch(setLoadingOverlay(false));
  };

  const onClickEditAssignmentName = async () => {
    dispatch(setLoadingOverlay(true));
    const res = await updateAssignmentName({
      course: course?.id,
      oldName: editDeleteAssignment,
      name: editName,
    });
    if (res) {
      dispatch(updateAssignments({ ...res }));
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Edit Evaluation Name successfully",
        `evaluation change from ${editDeleteAssignment} to ${editName}.`
      );
      setOpenModalEditAssignment(false);
      setEditDeleteAssignment("");
      setEditName("");
    }
    dispatch(setLoadingOverlay(false));
  };

  const onClickDeleteAssignment = async () => {
    dispatch(setLoadingOverlay(true));
    const res = await deleteAssignment({
      course: course?.id,
      name: editDeleteAssignment,
    });
    if (res) {
      dispatch(updateAssignments({ ...res }));
      showNotifications(
        NOTI_TYPE.SUCCESS,
        `Delete Evaluation successfully`,
        `evaluation ${editDeleteAssignment} is deleted.`
      );
      setOpenModalDeleteAssignment(false);
      setEditDeleteAssignment("");
    }
    dispatch(setLoadingOverlay(false));
  };

  const goToAssignment = (name: string) => {
    navigate({
      pathname: `${path}/${name}`,
      search: "?" + params.toString(),
    });
  };

  return (
    <>
      {/* Select assignment to publish */}
      <Modal
        opened={openPublishScoreModal}
        closeOnClickOutside={false}
        size="30vw"
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
                form.getValues().assignments.length === allAssignments!.length
              }
              onChange={() => {
                if (
                  form.getValues().assignments.length === allAssignments!.length
                ) {
                  form.setFieldValue("assignments", []);
                } else {
                  form.setFieldValue("assignments", [
                    ...allAssignments.map((as) => as.name),
                  ]);
                }
              }}
            >
              All Evaluation
            </Chip>
          )}
          <Chip.Group
            {...form.getInputProps("assignments")}
            multiple
            value={form.getValues().assignments?.map((as) => as)}
            onChange={(event) => form.setFieldValue("assignments", event)}
          >
            <Group>
              <div className="flex gap-3">
                {allAssignments.map((as, index) => (
                  <Chip
                    key={index}
                    classNames={{
                      root: "h-8 !rounded-[10px] text-center justify-center items-center",
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
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={onClickPublishScore}
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
          title={
            <p>
              You choose{" "}
              {form
                .getValues()
                .assignments.join(", ")
                .replace(/, ([^,]*)$/, " and $1")}{" "}
              to publish.
            </p>
          }
          icon={<Icon IconComponent={IconInfo2} />}
          classNames={{ icon: "size-6" }}
          className="mb-5"
        ></Alert>

        {(() => {
          const assignments = form.getValues().assignments;
          const selectedSectionNumbers = form
            .getValues()
            .sections.map((item) => Number(item));

          const missingAssignments = assignments
            .map((assign) => {
              const sectionsNotFound = course?.sections
                ?.filter((sec) =>
                  selectedSectionNumbers.includes(sec.sectionNo!)
                )
                ?.filter(
                  (sec) =>
                    !sec.assignments?.some((item) => item.name === assign)
                )
                ?.map((sec) => sec.sectionNo);

              return sectionsNotFound?.length
                ? { assign, sections: sectionsNotFound }
                : null;
            })
            .filter(Boolean);

          return missingAssignments.length > 0 ? (
            <Alert
              variant="light"
              color="#D0820C"
              title={
                <p className="font-medium">
                  <span className="font-extrabold text-[#D0820C]">
                    The following assignments were not found in the selected
                    sections:
                  </span>
                </p>
              }
              icon={<Icon IconComponent={IconExclamationCircle} />}
              classNames={{ icon: "size-6" }}
              className="mb-5 -mt-2"
            >
              <ul className="list-disc pl-5">
                {missingAssignments.map(({ assign, sections }: any) => (
                  <li key={assign}>
                    {assign} not found in Section
                    {sections.length > 1 ? "s" : ""} {sections.join(", ")}
                  </li>
                ))}
              </ul>
            </Alert>
          ) : null;
        })()}

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
            onClick={onClickPublishScore}
            disabled={!form.getValues().sections.length}
          >
            Publish
          </Button>
        </div>
      </Modal>
      {/* Edit Evaluation Name */}
      <Modal
        opened={openModalEditAssignment}
        onClose={() => setOpenModalEditAssignment(false)}
        centered
        transitionProps={{ transition: "pop" }}
        title="Edit Evaluation Name"
      >
        <TextInput
          classNames={{ input: "focus:border-primary" }}
          label="Evaluation name"
          size="xs"
          withAsterisk
          placeholder="Ex. Quiz 1"
          value={editName}
          onChange={(event) => setEditName(event.target.value)}
        />
        <div className="flex gap-2 sm:max-macair133:fixed sm:max-macair133:bottom-6 sm:max-macair133:right-8 mt-6  items-end  justify-end h-fit">
          <Button
            onClick={() => setOpenModalEditAssignment(false)}
            loading={loading.loadingOverlay}
            variant="subtle"
          >
            Cancel
          </Button>
          <Button
            onClick={onClickEditAssignmentName}
            disabled={isEqual(editName, editDeleteAssignment)}
            loading={loading.loadingOverlay}
          >
            Save Changes
          </Button>
        </div>
      </Modal>
      {/* Delete Evaluation */}
      <MainPopup
        opened={openModalDeleteAssignment}
        onClose={() => setOpenModalDeleteAssignment(false)}
        action={onClickDeleteAssignment}
        type="delete"
        labelButtonRight="Delete Evaluation"
        title={`Delete' ${editDeleteAssignment}'`}
        message={
          <>
            <Alert
              variant="light"
              color="red"
              title={
                <p>
                  This action cannot be undone. After you delete this
                  assignment, <br /> it will be permanently deleted from this
                  course.
                </p>
              }
              icon={<Icon IconComponent={IconExclamationCircle} />}
              classNames={{ icon: "size-6" }}
            ></Alert>
          </>
        }
      />

      <div className="bg-white flex flex-col h-full w-full px-6 py-5 gap-2 overflow-hidden">
        {loading.loading ? (
          <Loading />
        ) : (
          <>
            {allAssignments.length !== 0 && (
              <div className="flex flex-row items-center justify-between">
                <p className="text-secondary text-[16px] font-semibold">
                  {allAssignments.length} Evaluation
                  {allAssignments.length! > 1 && "s"}
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
                        <Icon
                          IconComponent={IconEyePublish}
                          className="size-5"
                        />
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
            )}
            {allAssignments.length !== 0 ? (
              <Tabs
                defaultValue="assignment"
                classNames={{
                  root: "overflow-hidden w-full flex flex-col max-h-full gap-4",
                  panel: "overflow-hidden w-full flex flex-col max-h-full",
                }}
              >
                <Tabs.List>
                  <Tabs.Tab value="assignment">List</Tabs.Tab>
                  <Tabs.Tab value="chart">Chart</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="assignment">
                  <div
                    className="overflow-auto w-full h-fit max-h-full border flex flex-col rounded-lg border-secondary"
                    style={{
                      boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
                    }}
                  >
                    <Table stickyHeader>
                      <Table.Thead>
                        <Table.Tr className="bg-[#e5e7f6]">
                          <Table.Th className="w-20 sm:max-macair133:text-b3">
                            Name
                          </Table.Th>
                          <Table.Th className="w-20 sm:max-macair133:text-b3  text-end pr-14 !pl-0">
                            Full Scores
                          </Table.Th>
                          <Table.Th className=" w-10 sm:max-macair133:text-b3 text-end pr-20 !pl-0">
                            Mean
                          </Table.Th>
                          <Table.Th className="!pl-12 w-20 sm:max-macair133:text-b3">
                            Created
                          </Table.Th>
                          <Table.Th className="w-10 sm:max-macair133:text-b3">
                            Student(s)
                          </Table.Th>
                          <Table.Th className="w-10 !px-4 sm:max-macair133:text-b3 text-center">
                            Published
                          </Table.Th>
                          <Table.Th className="w-5 sm:max-macair133:text-b3"></Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody className="text-default sm:max-macair133:text-b3 font-medium text-[13px]">
                        {allAssignments.map((assignment, index) => {
                          const students =
                            course?.sections
                              .map((sec) => sec.students!)
                              .flat() || [];
                          const totalStudent = students.filter(({ scores }) =>
                            scores.find(
                              ({ assignmentName }) =>
                                assignmentName == assignment.name
                            )
                          ).length;
                          const totalScore = students.reduce(
                            (a, b) =>
                              a +
                              (b.scores
                                .find(
                                  ({ assignmentName }) =>
                                    assignmentName == assignment.name
                                )
                                ?.questions.filter(({ score }) => score >= 0)
                                .reduce((sum, { score }) => sum + score, 0) ||
                                0),
                            0
                          );
                          return (
                            <Table.Tr
                              key={index}
                              className={`hover:bg-[#F3F3F3] cursor-pointer ${
                                index % 2 === 0 && "bg-[#F8F9FA]"
                              }`}
                              onClick={() =>
                                goToAssignment(`${assignment.name}`)
                              }
                            >
                              <Table.Td>{assignment.name}</Table.Td>
                              <Table.Td className="text-end pr-14 !pl-0">
                                {assignment.questions.reduce(
                                  (sum, { fullScore }) => sum + fullScore,
                                  0
                                )}
                              </Table.Td>
                              <Table.Td className="text-end pr-20 !pl-0">
                                {(
                                  (totalScore || 0) / (totalStudent || 1)
                                ).toFixed(2)}
                              </Table.Td>
                              <Table.Td className="!pl-12">
                                {dateFormatter(assignment.createdAt, 3)}
                              </Table.Td>
                              <Table.Td>{totalStudent || 0}</Table.Td>
                              <Table.Td className="text-center justify-items-center">
                                <div
                                  className="rounded-full hover:bg-gray-300 p-1 w-fit cursor-pointer"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    form.setFieldValue(
                                      "isPublish",
                                      !assignment.isPublish
                                    );
                                    form.setFieldValue(
                                      "sections",
                                      course?.sections.map(
                                        (sec) => sec.sectionNo
                                      ) || []
                                    );
                                    form.setFieldValue("assignments", [
                                      assignment.name,
                                    ]);
                                    onClickPublish();
                                  }}
                                >
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
                                </div>
                              </Table.Td>
                              <Table.Td className="text-center flex items-center justify-center">
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
                                      <Menu.Item
                                        className="text-[#3E3E3E] font-semibold text-[12px] h-7 w-[180px]"
                                        onClick={() => {
                                          setEditDeleteAssignment(
                                            assignment.name
                                          );
                                          setEditName(assignment.name);
                                          setOpenModalEditAssignment(true);
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <Icon
                                            IconComponent={IconPencilMinus}
                                            className="size-4 stroke-[2px]"
                                          />
                                          <span>Edit Evaluation Name</span>
                                        </div>
                                      </Menu.Item>
                                      <Menu.Item
                                        className="text-[#FF4747] disabled:text-[#adb5bd] hover:bg-[#d55757]/10 font-semibold text-[12px] h-7 w-[180px]"
                                        onClick={() => {
                                          setEditDeleteAssignment(
                                            assignment.name
                                          );
                                          setOpenModalDeleteAssignment(true);
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <Icon
                                            IconComponent={IconTrash}
                                            className="size-4 stroke-[2px]"
                                          />
                                          <span>Delete Evaluation</span>
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
                    </Table>
                  </div>
                </Tabs.Panel>
                <Tabs.Panel value="chart">
                  <div className="flex overflow-y-auto overflow-x-hidden max-w-full h-full">
                    <div className="flex gap-6 w-full h-full">
                      <div className="gap-4 flex flex-col min-w-[86%] max-w-[87%] overflow-y-auto px-1 pt-1 max-h-full">
                        {allAssignments.map((item, i) => {
                          const students =
                            course?.sections
                              .map((sec) => sec.students!)
                              .flat() || [];
                          return (
                            <div
                              style={{
                                boxShadow:
                                  "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                              }}
                              className={`last:mb-4 flex px-2 flex-col rounded-md gap-10 py-2 ${
                                activeSection === i ? "active" : ""
                              }`}
                              id={`${item.name}`}
                              key={i}
                              ref={sectionRefs.current!.at(i)} // Dynamic refs
                            >
                              <Tabs
                                classNames={{
                                  root: "overflow-hidden mt-1 mx-3 flex flex-col max-h-full",
                                }}
                                value={tabStates[i] || "bellCurve"} // Default tab for new items
                                onChange={(newValue) =>
                                  handleTabChange(i, newValue)
                                } // Update specific tab
                              >
                                <Tabs.List className="mb-2">
                                  <Tabs.Tab value="bellCurve">
                                    Distribution
                                  </Tabs.Tab>
                                  <Tabs.Tab value="histogram">
                                    Histogram
                                  </Tabs.Tab>
                                </Tabs.List>
                                <Tabs.Panel
                                  className="flex flex-col gap-1"
                                  value="histogram"
                                >
                                  <ChartContainer
                                    type="histogram"
                                    data={item}
                                    students={students}
                                  />
                                </Tabs.Panel>
                                <Tabs.Panel
                                  className="flex flex-col gap-1"
                                  value="bellCurve"
                                >
                                  <ChartContainer
                                    type="curve"
                                    data={item}
                                    students={students}
                                  />
                                  <p className=" text-[10px] translate-x-6 mb-2">
                                    Score distribution powered by Andrew C.
                                    Myers (Cornell University)
                                  </p>
                                </Tabs.Panel>
                              </Tabs>
                            </div>
                          );
                        })}
                      </div>

                      <div className="max-w-[12%] mt-3 flex flex-col  ">
                        {allAssignments.map((item, i) => (
                          <div
                            key={i}
                            className={`max-w-fit  ${
                              activeSection === i ? "active" : ""
                            }`}
                          >
                            <a href={`#${item.name}`}>
                              <p
                                className={`mb-[7px] text-ellipsis font-semibold overflow-hidden whitespace-nowrap text-[13px] ${
                                  activeSection === i
                                    ? "text-secondary"
                                    : "text-[#D2C9C9] "
                                }`}
                              >
                                {item.name}
                              </p>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Tabs.Panel>
              </Tabs>
            ) : (
              <div className="flex items-center  !h-full !w-full justify-between px-16">
                <div className="flex flex-col gap-3 text-start">
                  <p className="!h-full text-[20px] text-secondary font-semibold">
                    No Evaluation
                  </p>{" "}
                  <p className=" text-[#333333] -mt-1  text-b2 break-words font-medium leading-relaxed">
                    It seems like no evaluations have been added to this course
                    yet.
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
            )}
          </>
        )}
      </div>
    </>
  );
}
