import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Alert, Button, Menu, Switch } from "@mantine/core";
import {
  IconDots,
  IconExclamationCircle,
  IconPencilMinus,
  IconPlus,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import ManageAdminIcon from "@/assets/icons/addCo.svg?react";
import { IModelCourse } from "@/models/ModelCourse";
import { getOneCourse } from "@/services/course/course.service";
import { editCourse, editSection, removeSection } from "@/store/course";
import {
  getSectionNo,
  getUserName,
  showNotifications,
} from "@/helpers/functions/function";
import PageError from "./PageError";
import MainPopup from "@/components/Popup/MainPopup";
import { COURSE_TYPE, NOTI_TYPE } from "@/helpers/constants/enum";
import ModalEditSection from "@/components/Modal/CourseManage/ModalEditSection";
import Icon from "@/components/Icon";
import ExcelIcon from "@/assets/icons/excel.svg?react";
import Loading from "@/components/Loading";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { IModelSection } from "@/models/ModelSection";
import {
  deleteSection,
  updateSectionActive,
} from "@/services/section/section.service";
import ModalAddSection from "@/components/Modal/CourseManage/ModalAddSection";
import { IModelUser } from "@/models/ModelUser";
import ModalManageIns from "@/components/Modal/CourseManage/ModalManageIns";
import { setShowNavbar } from "@/store/showNavbar";
import { setShowSidebar } from "@/store/showSidebar";

export default function Section() {
  const navigate = useNavigate();
  const { courseNo } = useParams();
  const [params, setParams] = useSearchParams();
  const error = useAppSelector((state) => state.errorResponse);
  const user = useAppSelector((state) => state.user);
  const loading = useAppSelector((state) => state.loading);
  const dispatch = useAppDispatch();
  const academicYear = useAppSelector((state) => state.academicYear);
  const activeTerm = academicYear.find(
    (term) => term.id == params.get("id")
  )?.isActive;
  const course = useAppSelector((state) =>
    state.course.courses.find((c) => c.courseNo == courseNo)
  );
  const [editCourseData, setEditCourseData] = useState<any>();
  const [editSec, setEditSec] = useState<
    Partial<IModelSection> & Record<string, any>
  >({});
  const [addSec, setAddSec] = useState<Partial<IModelCourse>>();
  const [openMainPopupDelCourse, setOpenMainPopupDelCourse] = useState(false);
  const [openModalEditSec, setOpenModalEditSec] = useState(false);
  const [openModalAddSec, setOpenModalAddSec] = useState(false);
  const [openModalManageIns, setOpenModalManageIns] = useState(false);

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  }, []);

  const fetchOneCourse = async () => {
    const res = await getOneCourse({
      academicYear: params.get("id"),
      courseNo,
    });
    if (res) {
      dispatch(editCourse(res));
    }
  };

  const onClickActiveSection = async (
    sec: Partial<IModelSection>,
    checked: boolean
  ) => {
    const res = await updateSectionActive(sec.id!, { isActive: checked });
    if (res) {
      // fetchOneCourse();
      dispatch(
        editSection({
          id: course?.id,
          secId: sec.id,
          data: { isActive: checked },
        })
      );

      showNotifications(
        NOTI_TYPE.SUCCESS,
        `${checked ? "Open" : "Close"} section success`,
        `Section ${getSectionNo(sec.sectionNo)} is ${
          checked ? "opened" : "closed"
        }`
      );
    }
  };

  const onClickDeleteSec = async () => {
    const id = editSec.id;
    if (id) {
      const res = await deleteSection(id, editSec);
      if (res) {
        setOpenMainPopupDelCourse(false);
        dispatch(removeSection({ id: editSec.courseId, secId: id }));
        showNotifications(
          NOTI_TYPE.SUCCESS,
          "Delete Section Success",
          `${getSectionNo(editSec?.sectionNo)} is deleted`
        );
      }
    }
  };

  const goToAssignment = (sectionNo: number) => {
    const pathname = `${ROUTE_PATH.COURSE}/${courseNo}/${ROUTE_PATH.SECTION}`;
    navigate({
      pathname: `${pathname}/${sectionNo}/${ROUTE_PATH.ASSIGNMENT}`,
      search: "?" + params.toString(),
    });
  };

  return (
    <>
      <ModalEditSection
        opened={openModalEditSec}
        onClose={() => setOpenModalEditSec(false)}
        value={editSec}
      />
      <MainPopup
        opened={openMainPopupDelCourse}
        onClose={() => setOpenMainPopupDelCourse(false)}
        action={() => onClickDeleteSec()}
        type="delete"
        labelButtonRight="Delete section"
        title={`Delete section`}
        message={
          <>
            <Alert
              variant="light"
              color="red"
              title=" After you delete this section, it's permanently deleted all data from
          the current semester. Data from previous semesters will not be affected. 
          "
              icon={<IconExclamationCircle />}
              classNames={{ icon: "size-6" }}
            ></Alert>
            <div className="flex flex-col mt-3 gap-2">
              <div className="flex flex-col  ">
                <p className="text-b3 text-[#808080]">Course no.</p>
                <p className="  -translate-y-[2px] text-b1">{`${editSec?.courseNo}`}</p>
              </div>
              <div className="flex flex-col ">
                <p className="text-b3  text-[#808080]">Course name</p>
                <p className=" -translate-y-[2px] text-b1">{`${editSec?.courseName}`}</p>
              </div>
              <div className="flex flex-col ">
                <p className="text-b3  text-[#808080]">Section</p>
                <p className=" -translate-y-[2px] text-b1">{`${getSectionNo(
                  editSec?.sectionNo
                )}`}</p>
              </div>
            </div>
          </>
        }
      />
      <ModalAddSection
        opened={openModalAddSec}
        onClose={() => setOpenModalAddSec(false)}
        data={addSec!}
        fetchOneCourse={fetchOneCourse}
      />
      <ModalManageIns
        opened={openModalManageIns}
        onClose={() => setOpenModalManageIns(false)}
        type="course"
        data={editCourseData}
        setNewData={setEditCourseData}
      />
      {error.statusCode ? (
        <PageError />
      ) : loading ? (
        <Loading />
      ) : (
        <div className=" flex flex-col h-full w-full overflow-hidden">
          <div className="flex flex-row  px-6 pt-3 min-h-[60px]  items-center justify-between">
            <p className="text-secondary text-[16px] font-semibold">
              {course?.sections.length} Section
              {course?.sections.length! > 1 && "s"}
            </p>
            <div className="flex gap-5 items-center">
              {activeTerm ? (
                <Button
                  leftSection={<IconUpload className="size-4" />}
                  className="px-3"
                >
                  Upload and Assets
                </Button>
              ) : (
                <Button
                  color="#20884f"
                  leftSection={
                    <Icon className="size-4" IconComponent={ExcelIcon} />
                  }
                  className="!font-medium px-3"
                >
                  Export score
                </Button>
              )}
              {activeTerm && (
                <div className="rounded-full hover:bg-gray-300 p-1 cursor-pointer">
                  <Menu trigger="click" position="bottom-end" offset={6}>
                    <Menu.Target>
                      <IconDots />
                    </Menu.Target>
                    <Menu.Dropdown
                      className="rounded-md translate-y-1 backdrop-blur-xl bg-white "
                      style={{
                        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                      }}
                    >
                      <Menu.Item
                        className=" text-[#3e3e3e] font-semibold text-[12px] h-7 w-[180px]"
                        onClick={() => {
                          setAddSec({ ...course });
                          setOpenModalAddSec(true);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <IconPlus stroke={2} className="h-4 w-4" />
                          <span>Add section</span>
                        </div>
                      </Menu.Item>
                      {course?.sections.find(
                        (sec) => (sec.instructor as IModelUser).id == user.id
                      ) && (
                        <Menu.Item
                          className="text-[#3e3e3e] font-semibold text-[12px] h-7 w-[180px]"
                          onClick={() => {
                            setEditCourseData({
                              ...course,
                              sections: course?.sections.filter(
                                (sec) =>
                                  (sec.instructor as IModelUser)?.id == user.id
                              ),
                            });
                            setOpenModalManageIns(true);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Icon
                              className="h-4 w-4"
                              IconComponent={ManageAdminIcon}
                            />
                            <span>Manage Co-Instructor</span>
                          </div>
                        </Menu.Item>
                      )}
                      <Menu.Item className=" text-[#20884f] hover:bg-[#06B84D]/20 font-semibold text-[12px] h-7 w-[180px]">
                        <div className="flex items-center  gap-2">
                          <Icon
                            className="h-4 w-4 "
                            IconComponent={ExcelIcon}
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
          <div className="flex h-full w-full rounded-[5px] overflow-hidden">
            <div className="overflow-y-auto w-full h-fit max-h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-6 p-3">
              {course?.sections.map((sec, index) => {
                return (
                  <div
                    onClick={() => goToAssignment(sec.sectionNo!)}
                    key={index}
                    className={`card relative justify-between xl:h-[135px] md:h-[120px]  rounded-[4px] ${
                      sec.isActive ? "hover:bg-[#F3F3F3] cursor-pointer" : ""
                    }`}
                  >
                    <div onClick={(event) => event.stopPropagation()}>
                      {activeTerm &&
                        (sec.instructor as IModelUser).id == user.id &&
                        (course.addFirstTime || sec.addFirstTime ? (
                          <Menu
                            trigger="click"
                            position="bottom-end"
                            offset={2}
                          >
                            <Menu.Target>
                              <IconDots className="absolute top-2 right-2 rounded-full hover:bg-gray-300" />
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
                                  setEditSec({
                                    id: sec.id,
                                    courseId: course.id,
                                    oldSectionNo: sec.sectionNo,
                                    courseNo: course.courseNo,
                                    type: course.type,
                                    isActive: sec.isActive,
                                    data: {
                                      topic: sec.topic,
                                      sectionNo: sec.sectionNo,
                                      semester: sec.semester?.map((e) =>
                                        e.toString()
                                      ),
                                    },
                                  });
                                  setOpenModalEditSec(true);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <IconPencilMinus
                                    stroke={1.5}
                                    className="h-4 w-4"
                                  />
                                  <span>Edit Section</span>
                                </div>
                              </Menu.Item>
                              <Menu.Item
                                className="text-[#FF4747] disabled:text-[#adb5bd] hover:bg-[#d55757]/10 font-semibold text-[12px] h-7 w-[180px]"
                                disabled={course.sections.length == 1}
                                onClick={() => {
                                  setEditSec({
                                    id: sec.id,
                                    courseId: course.id,
                                    courseNo: course.courseNo,
                                    sectionNo: sec.sectionNo,
                                    courseName: course.courseName,
                                  });
                                  setOpenMainPopupDelCourse(true);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <IconTrash className="h-4 w-4" stroke={1.5} />
                                  <span>Delete Section</span>
                                </div>
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        ) : (
                          <Switch
                            size="md"
                            onLabel="ON"
                            offLabel="OFF"
                            className="absolute top-3 right-3"
                            checked={sec.isActive}
                            onChange={(event) =>
                              onClickActiveSection(sec, event.target.checked)
                            }
                          />
                        ))}
                    </div>
                    <div className="p-2.5 flex h-full justify-between  flex-col">
                      <div>
                        <p
                          className={`font-semibold text-sm ${
                            !sec.isActive && "text-[#c8c8c8]"
                          }`}
                        >
                          Section {getSectionNo(sec.sectionNo)}
                        </p>
                        <p
                          className={`font-semibold text-xs ${
                            !sec.isActive && "text-[#c8c8c8]"
                          }`}
                        >
                          {sec?.topic}
                        </p>
                      </div>
                      {course?.type !== COURSE_TYPE.SEL_TOPIC.en && (
                        <div
                          className={` text-xs font-medium text-[#757575]  ${
                            !sec.isActive && "text-[#c8c8c8]"
                          }`}
                        >
                          {getUserName(sec.instructor as IModelUser, 1)}
                        </div>
                      )}
                    </div>
                    {sec.isActive && (
                      <div className="bg-[#e7eaff] flex h-8 items-center justify-between rounded-b-[4px]">
                        <p className="p-2.5 text-secondary font-semibold text-[12px]">
                          {(sec.assignments?.length ?? 0) === 1
                            ? "Assignment"
                            : (sec.assignments?.length ?? 0) > 1
                            ? "Assignments"
                            : "No Assignment"}
                        </p>
                        {course.type == COURSE_TYPE.SEL_TOPIC.en && (
                          <div className="flex gap-3 px-2.5 font-semibold py-1 justify-end items-center">
                            <p
                              className="tag-tqf"
                              tqf-status={sec.TQF3?.status}
                            >
                              TQF 3
                            </p>
                            <p
                              className="tag-tqf"
                              tqf-status={sec.TQF5?.status}
                            >
                              TQF 5
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
