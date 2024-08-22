import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button, Menu, Switch } from "@mantine/core";
import {
  IconDots,
  IconPencilMinus,
  IconPlus,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { IModelCourse } from "@/models/ModelCourse";
import { getCourse, getOneCourse } from "@/services/course/course.service";
import { removeSection, setCourseList } from "@/store/course";
import { getSectionNo, showNotifications } from "@/helpers/functions/function";
import PageError from "./PageError";
import MainPopup from "@/components/Popup/MainPopup";
import { useDisclosure } from "@mantine/hooks";
import { NOTI_TYPE, POPUP_TYPE } from "@/helpers/constants/enum";
import ModalEditSection from "@/components/Modal/ModalEditSection";
import Icon from "@/components/Icon";
import ManageAdminIcon from "@/assets/icons/manageAdmin.svg?react";
import ExcelIcon from "@/assets/icons/excel.svg?react";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import Loading from "@/components/Loading";
import { setLoading } from "@/store/loading";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { IModelSection } from "@/models/ModelSection";
import { deleteSection } from "@/services/section/section.service";
import ModalAddSection from "@/components/Modal/ModalAddSection";

export default function Course() {
  const navigate = useNavigate();
  const { courseNo } = useParams();
  const [params, setParams] = useSearchParams();
  const error = useAppSelector((state) => state.errorResponse);
  const user = useAppSelector((state) => state.user);
  const loading = useAppSelector((state) => state.loading);
  const dispatch = useAppDispatch();
  const academicYear = useAppSelector((state) => state.academicYear);
  // const activeTerm = useLocation().state?.activeTerm;
  const activeTerm = academicYear.find(
    (term) => term.id == params.get("id")
  )?.isActive;
  const courseList = useAppSelector((state) => state.course.courses);
  const [course, setCourse] = useState<IModelCourse>();
  const [editSec, setEditSec] = useState<
    Partial<IModelSection> & Record<string, any>
  >({});
  const [addSec, setAddSec] = useState<Partial<IModelCourse>>();
  const [openMainPopupDelCourse, setOpenMainPopupDelCourse] = useState(false);
  const [openModalEditSec, setOpenModalEditSec] = useState(false);
  const [openModalAddSec, setOpenModalAddSec] = useState(false);

  useEffect(() => {
    if (!params.get("id") || !params.get("year") || !params.get("semester"))
      navigate(ROUTE_PATH.DASHBOARD_INS);
    else if (!courseList.length && params.get("id")) fetchCourse();

    if (courseNo) {
      setCourse(courseList.find((e) => e.courseNo == courseNo));
    }
  }, [academicYear, courseList, params]);

  const fetchCourse = async () => {
    dispatch(setLoading(true));
    const payloadCourse = new CourseRequestDTO();
    payloadCourse.academicYear = params.get("id")!;
    const resCourse = await getCourse(payloadCourse);
    if (resCourse) {
      dispatch(setCourseList(resCourse));
    }
    const res = await getOneCourse({
      academicYear: params.get("id"),
      courseNo,
    });
    if (res) {
      setCourse(res);
    }
    dispatch(setLoading(false));
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
          "Delete Course Success",
          `${getSectionNo(editSec?.sectionNo)} is deleted`
        );
      }
    }
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
        type={POPUP_TYPE.DELETE}
        labelButtonRight="Delete section"
        title={`Delete section ${getSectionNo(editSec.sectionNo)} in ${
          editSec.courseNo
        }?`}
        message={
          <p>
            Deleting this section will permanently remove all data from the
            current semester. Data from previous semesters will not be affected.{" "}
            <br /> <span>Are you sure you want to deleted this section? </span>
          </p>
        }
      />
      <ModalAddSection
        opened={openModalAddSec}
        onClose={() => setOpenModalAddSec(false)}
        data={addSec!}
      />

      {error.statusCode ? (
        <PageError />
      ) : loading ? (
        <Loading />
      ) : (
        <div className="bg-white flex flex-col h-full w-full p-6 py-3 gap-3 overflow-hidden">
          <div className="flex flex-row  py-2  items-center justify-between">
            <p className="text-secondary text-[16px] font-semibold">
              {course?.sections.length} Section
              {course?.sections.length! > 1 && "s"}
            </p>
            <div className="flex gap-5 items-center">
              {activeTerm && (
                <Button
                  leftSection={<IconUpload className="h-5 w-5" />}
                  color="#5768D5"
                  className="rounded-[8px] text-[12px] w-fit font-medium  h-8 px-2 "
                >
                  Upload and Assets
                </Button>
              )}
              <div className="rounded-full hover:bg-gray-300 p-1 cursor-pointer">
                <Menu trigger="click" position="bottom-end" offset={2}>
                  <Menu.Target>
                    <IconDots />
                  </Menu.Target>
                  <Menu.Dropdown
                    className="rounded-md translate-y-1 backdrop-blur-xl bg-white "
                    style={{
                      boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    {activeTerm && (
                      <>
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
                        <Menu.Item className="text-[#3e3e3e] font-semibold text-[12px] h-7 w-[180px]">
                          <div className="flex items-center gap-2">
                            <Icon
                              className="h-4 w-4"
                              IconComponent={ManageAdminIcon}
                            />
                            <span>Manage Co-Instructor</span>
                          </div>
                        </Menu.Item>
                      </>
                    )}
                    <Menu.Item className=" text-[#20884f] hover:bg-[#06B84D]/20 font-semibold text-[12px] h-7 w-[180px]">
                      <div className="flex items-center  gap-2">
                        <Icon className="h-4 w-4 " IconComponent={ExcelIcon} />
                        <span>Export score</span>
                      </div>
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </div>
            </div>
          </div>
          <div className="flex h-full w-full rounded-[5px] pt-1 overflow-hidden">
            <div className="overflow-y-auto w-full h-fit max-h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-1">
              {course?.sections.map((sec, index) => {
                return (
                  <div
                    key={index}
                    className="card relative justify-between xl:h-[135px] md:h-[120px] cursor-pointer rounded-[4px] hover:bg-[#F3F3F3]"
                  >
                    <div className="p-2.5 flex flex-col">
                      <p className="font-semibold text-sm">
                        Section {getSectionNo(sec.sectionNo)}
                      </p>
                      <p className="text-xs font-medium text-gray-600">
                        {sec?.topic}
                      </p>
                      <div onClick={(event) => event.stopPropagation()}>
                        {activeTerm &&
                          (course.addFirstTime ? (
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
                                    });
                                    setOpenMainPopupDelCourse(true);
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    <IconTrash
                                      className="h-4 w-4"
                                      stroke={1.5}
                                    />
                                    <span>Delete Section</span>
                                  </div>
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          ) : (
                            <Switch
                              size="xs"
                              className="absolute top-3 right-3"
                              defaultChecked
                              // checked={sec.isActive}
                            />
                          ))}
                      </div>
                    </div>
                    <div className="bg-[#e7eaff] flex h-8 items-center justify-between rounded-b-[4px]">
                      <p className="p-2.5 text-secondary font-semibold text-[12px]">
                        {(sec.assignments?.length ?? 0) === 1
                          ? "Assignment"
                          : (sec.assignments?.length ?? 0) > 1
                          ? "Assignments"
                          : "No Assignment"}
                      </p>
                    </div>
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
