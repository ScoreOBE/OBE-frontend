import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  Group,
  Menu,
  Modal,
  Table,
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
import Breadcrumbs from "@/components/Breadcrumbs";
import notFoundImage from "@/assets/image/notFound.jpg";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { dateFormatter, getSectionNo, isMobile } from "@/helpers/functions/function";
import { ROUTE_PATH } from "@/helpers/constants/route";
import needAccess from "@/assets/image/needAccess.jpg";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import { IModelUser } from "@/models/ModelUser";
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

export default function Assignment() {
  const { courseNo, sectionNo } = useParams();
  const path = useLocation().pathname;
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
      path: `${ROUTE_PATH.INS_DASHBOARD}?${params.toString()}`,
    },
    {
      title: "Sections",
      path: `${ROUTE_PATH.COURSE}/${courseNo}/${
        ROUTE_PATH.SECTION
      }?${params.toString()}`,
    },
    { title: `Evaluation Section ${getSectionNo(sectionNo)}` },
  ]);
  const [editDeleteAssignment, setEditDeleteAssignment] = useState("");
  const [editName, setEditName] = useState("");
   const academicYear = useAppSelector((state) => state.academicYear);
    const activeTerm = academicYear.find(
      (term) =>
        term.year == parseInt(params.get("year") || "") &&
        term.semester == parseInt(params.get("semester") || "")
    )?.isActive;
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

  const goToOverall = (name: string) => {
    navigate({
      pathname: `${path}/${name}/${ROUTE_PATH.SCORE}`,
      search: "?" + params.toString(),
    });
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
          form.getValues().isPublish ? "Published" : "Unpublished"
        }  Successfully`,
        `Evaluation ${form.getValues().assignments.join(", ")} in ${form
          .getValues()
          .sections.map((item) => getSectionNo(item))
          .join(", ")} ${
          form.getValues().assignments.length > 1 ? "are" : "is"
        } ${
          form.getValues().isPublish
            ? "has been successfully published"
            : "has been successfully unpublished"
        }`
      );
      form.reset();
    }
    dispatch(setLoadingOverlay(false));
  };

  const onClickEditAssignmentName = async () => {
    dispatch(setLoadingOverlay(true));
    const res = await updateAssignmentName({
      course: course?.id,
      sectionNo: parseInt(sectionNo!),
      oldName: editDeleteAssignment,
      name: editName,
    });
    if (res) {
      dispatch(updateAssignments({ ...res }));
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Evaluation Edited Successfully",
        `Evaluation has been successfully updated`
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
      sectionNo: parseInt(sectionNo!),
      name: editDeleteAssignment,
    });
    if (res) {
      dispatch(updateAssignments({ ...res }));
      showNotifications(
        NOTI_TYPE.SUCCESS,
        `Evaluation Deleteed successfully`,
        `Evaluation ${editDeleteAssignment} has been successfully deleted`
      );
      setOpenModalDeleteAssignment(false);
      setEditDeleteAssignment("");
    }
    dispatch(setLoadingOverlay(false));
  };

  return (
    <>
      {/* Edit Evaluation Name */}
      <Modal
        opened={openModalEditAssignment}
        onClose={() => setOpenModalEditAssignment(false)}
        centered
        transitionProps={{ transition: "pop" }}
        title="Edit Evaluation Name"
        classNames={{ title: "acerSwift:max-macair133:!text-b1" }}
      >
        <TextInput
          classNames={{
            input: "focus:border-primary acerSwift:max-macair133:!text-b4",
            label: "acerSwift:max-macair133:!text-b4",
          }}
          label="Evaluation name"
          size="xs"
          withAsterisk
          placeholder="Quiz 1"
          value={editName}
          onChange={(event) => setEditName(event.target.value)}
        />
        <div className="flex gap-2 mt-6  items-end  justify-end h-fit">
          <Button
            className="acerSwift:max-macair133:!text-b5"
            onClick={() => setOpenModalEditAssignment(false)}
            loading={loading.loadingOverlay}
            variant="subtle"
          >
            Cancel
          </Button>
          <Button
            className="acerSwift:max-macair133:!text-b5"
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
                <p className="acerSwift:max-macair133:!text-b3">
                  This action cannot be undone. After you delete this
                  assignment, <br /> it will be permanently deleted from this
                  course.
                </p>
              }
              icon={
                <Icon
                  IconComponent={IconExclamationCircle}
                  className="acerSwift:max-macair133:size-5.5"
                />
              }
              classNames={{ icon: "size-6" }}
            ></Alert>
          </>
        }
      />

      <div className="bg-white flex flex-col h-full w-full sm:px-6 iphone:max-sm:px-3 py-5 gap-3 overflow-hidden">
      <Breadcrumbs items={items} />
        {loading.loading ? (
          <Loading />
        ) : (section?.instructor as IModelUser)?.id === user.id ||
          (section?.coInstructors as IModelUser[])
            ?.map(({ id }) => id)
            .includes(user.id) ? (
          <>
            {section?.assignments?.length !== 0 && !isMobile && (
              <div className="flex flex-row  py-1  items-center justify-between">
                <p className="text-secondary text-h1 macair133:text-b1  py-2 acerSwift:max-macair133:!text-b2 font-semibold">
                  {section?.assignments?.length} Evaluation
                  {section?.assignments?.length! > 1 && "s"}
                </p>
              </div>
            )}
            {/* Table */}
            {section?.assignments?.length !== 0 ? (
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
                     {activeTerm && <Table.Th className="w-10 !px-4 sm:max-macair133:text-b3 text-center">
                        Published
                      </Table.Th>}
                  { activeTerm && !isMobile &&   <Table.Th className="w-5 sm:max-macair133:text-b3"></Table.Th>}
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody className="text-default sm:max-macair133:text-b4 font-medium text-[13px] ">
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
                            ?.questions.filter(({ score }) => score >= 0)
                            .reduce((sum, { score }) => sum + score, 0) || 0),
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
                              (sum, { fullScore }) => sum + fullScore,
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
                         {activeTerm && <Table.Td className="text-center justify-items-center">
                            <div
                              className="rounded-full hover:bg-gray-300 p-1 w-fit cursor-pointer"
                              onClick={(event) => {
                                event.stopPropagation();
                                form.setFieldValue(
                                  "isPublish",
                                  !assignment.isPublish
                                );
                                form.setFieldValue("sections", [
                                  parseInt(sectionNo!),
                                ]);
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
                          </Table.Td>}
                         {activeTerm && !isMobile &&    <Table.Td className="text-center flex items-center justify-center">
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
                                    className="text-[#3E3E3E] font-semibold text-b4 h-7 w-[180px] acerSwift:max-macair133:!text-b5"
                                    onClick={() => {
                                      setEditDeleteAssignment(assignment.name);
                                      setEditName(assignment.name);
                                      setOpenModalEditAssignment(true);
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Icon
                                        IconComponent={IconPencilMinus}
                                        className="size-4 stroke-[2px]   acerSwift:max-macair133:!size-3.5"
                                      />
                                      <span>Edit Evaluation Name</span>
                                    </div>
                                  </Menu.Item>
                                  <Menu.Item
                                    className="text-[#FF4747] disabled:text-[#adb5bd] hover:bg-[#d55757]/10 font-semibold text-b4 acerSwift:max-macair133:!text-b5 h-7 w-[180px]"
                                    onClick={() => {
                                      setEditDeleteAssignment(assignment.name);
                                      setOpenModalDeleteAssignment(true);
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Icon
                                        IconComponent={IconTrash}
                                        className="size-4 stroke-[2px] acerSwift:max-macair133:!size-3.5"
                                      />
                                      <span>Delete Evaluation</span>
                                    </div>
                                  </Menu.Item>
                                </Menu.Dropdown>
                              </Menu>
                            </div>
                          </Table.Td>}
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </div>
            ) : (
              <div className="flex items-center  !h-full !w-full  justify-between  sm:px-16">
              <div className="flex flex-col gap-3 iphone:max-sm:text-center sm:text-start">
                  <p className="!h-full text-h1  acerSwift:max-macair133:!text-h2 text-secondary font-semibold">
                    No Evaluation
                  </p>{" "}
                  <p className=" text-[#333333] -mt-1  text-b2 break-words font-medium leading-relaxed">
                    It seems like no evaluations have been added to this course
                    yet.
                  </p>{" "}
                </div>
                { !isMobile && <div className=" items-center justify-center flex">
                  <img
                    src={notFoundImage}
                    className="h-full items-center  w-[24vw] justify-center flex flex-col"
                    alt="notFound"
                  ></img>
                </div>}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center  !h-full !w-full justify-between  sm:px-16">
          <div className="flex flex-col gap-2 iphone:max-sm:text-center sm:text-start">
              <p className="   text-secondary font-semibold text-[22px]">
                You need access
              </p>
              <p className=" text-[#333333] leading-6 font-medium text-[14px]">
                You're not listed as a Co-Instructor. <br /> Please contact the
                instructor for access.
              </p>
            </div>
            { !isMobile && <img
              className=" z-50  size-[460px] "
              src={needAccess}
              alt="loginImage"
            />}
          </div>
        )}
      </div>
    </>
  );
}
