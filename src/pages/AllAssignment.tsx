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
import IconUpload from "@/assets/icons/upload.svg?react";
import IconPublish from "@/assets/icons/publish.svg?react";
import IconUnPublish from "@/assets/icons/unPublish.svg?react";
import IconPublishEach from "@/assets/icons/publishEach.svg?react";
import IconChevron from "@/assets/icons/chevronRight.svg?react";
import IconChevronRight from "@/assets/icons/chevronRight.svg?react";
import IconPublishAll from "@/assets/icons/publishAll.svg?react";
import IconDots from "@/assets/icons/dots.svg?react";
import IconTrash from "@/assets/icons/trash.svg?react";
import IconPencilMinus from "@/assets/icons/pencilMinus.svg?react";
import IconArrowRight from "@/assets/icons/arrowRight.svg?react";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import IconExcel from "@/assets/icons/excel.svg?react";
import notFoundImage from "@/assets/image/notFound.jpg";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  dateFormatter,
  getSectionNo,
  isMobile,
} from "@/helpers/functions/function";
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
import ModalStudentList from "@/components/Modal/ModalStudentList";
import ModalUploadScore from "@/components/Modal/Score/ModalUploadScore";
import ModalPublishScore from "@/components/Modal/Score/ModalPublishScore";
import ChartContainer from "@/components/Chart/ChartContainer";
import React from "react";
import ModalExportScore from "@/components/Modal/Score/ModalExportScore";
type TabState = {
  [key: number]: string;
};
export default function AllAssignment() {
  const { courseNo } = useParams();
  const path = useLocation().pathname;
  const [params, setParams] = useSearchParams();
  const loading = useAppSelector((state) => state.loading);
  const academicYear = useAppSelector((state) => state.academicYear);
  const activeTerm = academicYear.find(
    (term) =>
      term.year == parseInt(params.get("year") || "") &&
      term.semester == parseInt(params.get("semester") || "")
  )?.isActive;
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
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [openPublishScoreModal, setOpenPublishScoreModal] = useState(false);
  const [isPublishAll, setIsPublishAll] = useState(false);
  const [editDeleteAssignment, setEditDeleteAssignment] = useState("");
  const [editName, setEditName] = useState("");
  const [openModalEditAssignment, setOpenModalEditAssignment] = useState(false);
  const [openModalDeleteAssignment, setOpenModalDeleteAssignment] =
    useState(false);
  const [openModalUploadScore, setOpenModalUploadScore] = useState(false);
  const [openModalExportScore, setOpenModalExportScore] = useState(false);
  const [openModalUploadStudentList, setOpenModalUploadStudentList] =
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
        `Score${
          form.getValues().isPublish ? " Published" : " Unpublished"
        }  Successfully`,
        `Scores ${form.getValues().assignments.join(", ")} in ${form
          .getValues()
          .sections.map((item) => getSectionNo(item))
          .join(", ")} ${
          form.getValues().assignments.length > 1 ? "are" : "is"
        } ${
          form.getValues().isPublish
            ? "has been published"
            : "has been unpublished"
        }`
      );
      setOpenPublishScoreModal(false);
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
        "Scores Edited Successfully",
        `Scores has been successfully updated.`
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
        `Scores Deleted Successfully`,
        `Scores ${editDeleteAssignment} has been deleted.`
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

  const uploadButton = () => {
    return (
      <>
        {!isMobile && (
          <Button
            className="text-center px-4 acerSwift:max-macair133:!text-b5"
            leftSection={
              <Icon
                IconComponent={IconUpload}
                className="size-4 acerSwift:max-macair133:size-3.5 acerSwift:max-macair133:stroke-2"
              />
            }
            onClick={() =>
              course?.sections.find(({ students }) => students?.length)
                ? setOpenModalUploadScore(true)
                : setOpenModalUploadStudentList(true)
            }
          >
            Import score
          </Button>
        )}
      </>
    );
  };

  return (
    <>
      {course && (
        <ModalUploadScore
          data={course}
          opened={openModalUploadScore}
          onClose={() => setOpenModalUploadScore(false)}
        />
      )}
      {course && (
        <ModalStudentList
          type="import"
          opened={openModalUploadStudentList}
          onClose={() => setOpenModalUploadStudentList(false)}
          data={course}
          selectCourse={false}
          onBack={() => {
            setOpenModalUploadStudentList(false);
          }}
          onNext={() => {
            setOpenModalUploadStudentList(false);
            setOpenModalUploadScore(true);
          }}
        />
      )}

      {/* Publish Score */}
      <ModalPublishScore
        opened={openPublishScoreModal}
        onClose={() => setOpenPublishScoreModal(false)}
        isPublishAll={isPublishAll}
      />
      {/* Edit Evaluation Name */}
      <Modal
        opened={openModalEditAssignment}
        onClose={() => setOpenModalEditAssignment(false)}
        centered
        transitionProps={{ transition: "pop" }}
        title="Edit Scores Name"
        classNames={{ title: "acerSwift:max-macair133:!text-b1" }}
      >
        <TextInput
          classNames={{ input: "focus:border-primary" }}
          label="Scores name"
          size="xs"
          withAsterisk
          placeholder="Quiz 1"
          value={editName}
          onChange={(event) => setEditName(event.target.value)}
        />
        <div className="flex gap-2 mt-6 items-end justify-end h-fit">
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
        labelButtonRight="Delete Scores"
        title={`Delete '${editDeleteAssignment}'`}
        message={
          <>
            <Alert
              variant="light"
              color="red"
              title={
                <p className="acerSwift:max-macair133:!text-b3">
                  This action cannot be undone. After you delete this scores,{" "}
                  <br /> it will be permanently deleted from this course.
                </p>
              }
              icon={
                <Icon
                  IconComponent={IconExclamationCircle}
                  className="acerSwift:max-macair133:!size-5"
                />
              }
              classNames={{ icon: "size-6" }}
            ></Alert>
          </>
        }
      />
      <ModalExportScore
        opened={openModalExportScore}
        onClose={() => setOpenModalExportScore(false)}
      />

      <div className="bg-white flex flex-col h-full w-full sm:px-6 iphone:max-sm:px-3 py-5 gap-2 overflow-hidden">
        {loading.loading ? (
          <Loading />
        ) : (
          <>
            {allAssignments.length !== 0 && !isMobile && (
              <div className="flex flex-row items-center justify-between">
                <p className="text-secondary text-b1 acerSwift:max-macair133:text-b2 font-semibold">
                  Score Items
                </p>
                <div className="flex flex-wrap justify-end items-center gap-3">
                  {activeTerm ? (
                    <div className=" mr-2">{uploadButton()}</div>
                  ) : (
                    <Button
                      color="#20884f"
                      onClick={() => setOpenModalExportScore(true)}
                      leftSection={
                        <Icon className="size-4" IconComponent={IconExcel} />
                      }
                      className="!font-medium px-3"
                    >
                      Export score
                    </Button>
                  )}

                  {activeTerm && user.role != ROLE.TA && (
                    <div className="rounded-full hover:bg-gray-300 p-1 cursor-pointer">
                      <Menu trigger="click" position="bottom-end">
                        <Menu.Target>
                          <div>
                            <Icon IconComponent={IconDots} />
                          </div>
                        </Menu.Target>
                        <Menu.Dropdown
                          className="rounded-md translate-y-1 backdrop-blur-xl bg-white"
                          style={{
                            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                          }}
                        >
                          <Menu
                            trigger="hover"
                            openDelay={100}
                            closeDelay={200}
                            classNames={{ item: "text-[#3e3e3e] h-8 w-full " }}
                          >
                            <Menu.Target>
                              <Menu.Item className=" text-[#3e3e3e] mb-[2px] font-semibold text-b4 h-7  acerSwift:max-macair133:!text-b5">
                                <div className="flex justify-between items-center gap-2">
                                  <div className="flex gap-2 items-center acerSwift:max-macair133:text-b5">
                                    <Icon
                                      IconComponent={IconEyePublish}
                                      className="size-5 acerSwift:max-macair133:size-4 -ml-1"
                                    />

                                    <span className="pr-10">
                                      {" "}
                                      Publish score{" "}
                                    </span>
                                  </div>{" "}
                                  <Icon
                                    IconComponent={IconChevronRight}
                                    className="size-4  acerSwift:max-macair133:size- stroke-[2px]"
                                  />
                                </div>
                              </Menu.Item>
                            </Menu.Target>
                            <Menu.Dropdown
                              className="z-50 rounded-md -translate-y-[45px] -translate-x-[195px] bg-white"
                              style={{
                                width: "200px",
                                boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px",
                              }}
                            >
                              <>
                                <Menu.Item
                                  onClick={() => {
                                    setIsPublishAll(false);
                                    setOpenPublishScoreModal(true);
                                  }}
                                >
                                  <div className="flex items-center gap-2 acerSwift:max-macair133:text-b5">
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
                                >
                                  <div className="flex items-center gap-2 acerSwift:max-macair133:text-b5">
                                    <Icon
                                      IconComponent={IconPublishAll}
                                      className="size-4 text-[#000000]"
                                    />
                                    <span>All Sections</span>
                                  </div>
                                </Menu.Item>
                              </>
                            </Menu.Dropdown>
                          </Menu>

                          <Menu.Item
                            onClick={() => setOpenModalExportScore(true)}
                            className=" text-[#20884f] hover:bg-[#06B84D]/10 font-semibold text-b4 acerSwift:max-macair133:!text-b5 h-7 "
                          >
                            <div className="flex items-center  gap-2">
                              <Icon
                                className="size-4 acerSwift:max-macair133:!size-3.5"
                                IconComponent={IconExcel}
                              />
                              <span>Export score</span>
                            </div>
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </div>
                  )}
                </div>
              </div>
            )}
            {allAssignments.length !== 0 ? (
              !isMobile ? (
                <Tabs
                  defaultValue="assignment"
                  classNames={{
                    root: "overflow-hidden w-full flex flex-col max-h-full gap-4",
                    panel: "overflow-hidden w-full flex flex-col max-h-full",
                  }}
                >
                  {!isMobile && (
                    <Tabs.List>
                      <Tabs.Tab
                        value="assignment"
                        className="acerSwift:max-macair133:!text-b3"
                      >
                        List
                      </Tabs.Tab>
                      <Tabs.Tab
                        value="charts"
                        className="acerSwift:max-macair133:!text-b3"
                      >
                        Charts
                      </Tabs.Tab>
                    </Tabs.List>
                  )}
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
                            <Table.Th className="w-20 sm:max-macair133:text-b4 ">
                              Score name
                            </Table.Th>
                            <Table.Th className="w-20 sm:max-macair133:text-b4  text-end pr-14 !pl-0">
                              Full Scores
                            </Table.Th>
                            <Table.Th className=" w-10 sm:max-macair133:text-b4 text-end pr-20 !pl-0">
                              Mean
                            </Table.Th>
                            <Table.Th className="!pl-12 w-20 sm:max-macair133:text-b4">
                              Created
                            </Table.Th>
                            <Table.Th className="w-10 sm:max-macair133:text-b4">
                              Student(s)
                            </Table.Th>
                            {activeTerm && (
                              <Table.Th className="w-10 !px-4 sm:max-macair133:text-b4 text-center">
                                Published
                              </Table.Th>
                            )}
                            {activeTerm && (
                              <Table.Th className="w-5 sm:max-macair133:text-b4"></Table.Th>
                            )}
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody className="text-default sm:max-macair133:text-b4 font-medium text-b3 acerSwift:max-macair133:text-b4">
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
                                className={`hover:bg-[#F3F3F3] cursor-pointer acerSwift:max-macair133:!text-b4 ${
                                  index % 2 === 0 && "bg-[#F8F9FA]"
                                }`}
                                onClick={() =>
                                  goToAssignment(`${assignment.name}`)
                                }
                              >
                                <Table.Td>{assignment.name}</Table.Td>
                                <Table.Td className="text-end pr-14 !pl-0 ">
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
                                {activeTerm && (
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
                                          className="text-default "
                                        />
                                      ) : (
                                        <Icon
                                          IconComponent={IconUnPublish}
                                          className="text-default"
                                        />
                                      )}
                                    </div>
                                  </Table.Td>
                                )}
                                {activeTerm && (
                                  <Table.Td className="text-center flex items-center justify-center">
                                    <div
                                      className="rounded-full hover:bg-gray-300 p-1 w-fit cursor-pointer"
                                      onClick={(event) =>
                                        event.stopPropagation()
                                      }
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
                                            className="text-[#3E3E3E] font-semibold text-b4 acerSwift:max-macair133:text-b5 h-7 w-[180px]"
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
                                              <span>Edit Scores Name</span>
                                            </div>
                                          </Menu.Item>
                                          <Menu.Item
                                            className="text-[#FF4747] disabled:text-[#adb5bd] hover:bg-[#d55757]/10 font-semibold text-b4 acerSwift:max-macair133:text-b5 h-7 w-[180px]"
                                            onClick={() => {
                                              setEditDeleteAssignment(
                                                assignment.name
                                              );
                                              setOpenModalDeleteAssignment(
                                                true
                                              );
                                            }}
                                          >
                                            <div className="flex items-center gap-2">
                                              <Icon
                                                IconComponent={IconTrash}
                                                className="size-4 stroke-[2px]"
                                              />
                                              <span>Delete Scores</span>
                                            </div>
                                          </Menu.Item>
                                        </Menu.Dropdown>
                                      </Menu>
                                    </div>
                                  </Table.Td>
                                )}
                              </Table.Tr>
                            );
                          })}
                        </Table.Tbody>
                      </Table>
                    </div>
                  </Tabs.Panel>
                  <Tabs.Panel value="charts">
                    <div className="flex overflow-y-auto overflow-x-hidden max-w-full h-full">
                      <div className="flex gap-6 w-full h-full">
                        <div className="gap-5 flex flex-col min-w-[86%] max-w-[87%] overflow-y-auto px-1 pt-1 max-h-full">
                          {allAssignments.map((item, i) => {
                            const students =
                              course?.sections
                                .map((sec) => sec.students!)
                                .flat() || [];
                            return (
                              <div
                                className={`last:mb-[2px] flex px-2  bg-[#ffffff] flex-col rounded-md gap-10 py-2 ${
                                  activeSection === i ? "active" : ""
                                }`}
                                style={{
                                  boxShadow:
                                    "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                                }}
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
                                    <Tabs.Tab
                                      value="bellCurve"
                                      className="acerSwift:max-macair133:!text-b3"
                                    >
                                      Distribution
                                    </Tabs.Tab>
                                    <Tabs.Tab
                                      value="histogram"
                                      className="acerSwift:max-macair133:!text-b3"
                                    >
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
                              <a
                                href={`#${item.name}`}
                                onClick={() => setActiveSection(i)}
                              >
                                <p
                                  className={`mb-[7px] text-ellipsis font-semibold overflow-hidden whitespace-nowrap text-b3 acerSwift:max-macair133:!text-b4 ${
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
                <div className="flex flex-col gap-3 overflow-y-auto h-full ">
                  {allAssignments.map((assignment, index) => {
                    const students =
                      course?.sections.map((sec) => sec.students!).flat() || [];
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
                          .reduce((sum, { score }) => sum + score, 0) || 0),
                      0
                    );
                    return (
                      <div
                        key={index}
                        className={`border flex flex-col hover:bg-slate-50 justify-between rounded-md p-3 `}
                        onClick={() => goToAssignment(`${assignment.name}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <div className=" font-semibold text-default text-[14px]">
                              {assignment.name}
                            </div>
                            <div className="font-semibold text-secondary text-[14px] ">
                              Full score:{" "}
                              {assignment.questions.reduce(
                                (sum, { fullScore }) => sum + fullScore,
                                0
                              )}
                            </div>
                          </div>
                          <Icon IconComponent={IconChevron} />
                        </div>
                        <div className="mt-3 border-t rounded-md p-4 text-[12px] grid grid-cols-2  ">
                          <div>
                            Mean{" "}
                            {((totalScore || 0) / (totalStudent || 1)).toFixed(
                              2
                            )}
                          </div>
                          <div>Student(s): {totalStudent || 0}</div>
                        </div>
                        {activeTerm && (
                          <div className="text-start  !w-full justify-items-center">
                            <Button
                              variant="light"
                              classNames={{ label: "!font-semibold " }}
                              className={`rounded-full mt-3 ${
                                assignment.isPublish
                                  ? " bg-orange-600/20 text-orange-600 hover:text-orange-600 hover:bg-orange-700/20"
                                  : " bg-teal-500/20 text-teal-600 hover:text-teal-600 hover:bg-teal-600/20"
                              } items-center justify-center  !h-10 flex !rounded-xl flex-1 !w-full cursor-pointer`}
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
                                <p className="!font-semibold">Unpublish</p>
                              ) : (
                                <p className="!font-semibold ">Publish</p>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="flex items-center  !h-full !w-full justify-between  sm:px-16">
                <div className="flex flex-col gap-3 iphone:max-sm:text-center sm:text-start">
                  <p className="!h-full text-[20px] text-secondary font-semibold">
                    No Score
                  </p>{" "}
                  <p className=" text-[#333333] -mt-1  text-b2 break-words font-medium leading-relaxed">
                    It seems like no score have been added to this course yet.
                  </p>{" "}
                  {activeTerm && <div className="mt-3">{uploadButton()}</div>}
                </div>
                {!isMobile && (
                  <div className=" items-center justify-center flex">
                    <img
                      src={notFoundImage}
                      className="h-full items-center  w-[24vw] justify-center flex flex-col"
                      alt="notFound"
                    ></img>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
