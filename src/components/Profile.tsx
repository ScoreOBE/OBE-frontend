import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { Menu, Button } from "@mantine/core";
import Icon from "./Icon";
import IconUserProfile from "@/assets/icons/profile/userProfile.svg?react";
import IconFeedback from "@/assets/icons/feedback.svg?react";
import IconAdminProfile from "@/assets/icons/profile/adminProfile.svg?react";
import IconSAdminProfile from "@/assets/icons/profile/s.AdminProfile.svg?react";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconLogout from "@/assets/icons/logout.svg?react";
import IconChevronRight from "@/assets/icons/chevronRight.svg?react";
import IconSupreme from "@/assets/icons/supremeAdmin.svg?react";
import IconCourse from "@/assets/icons/course.svg?react";
import IconUserScreen from "@/assets/icons/userScreen.svg?react";
import IconAdjustmentsHorizontal from "@/assets/icons/horizontalAdjustments.svg?react";
import IconStatusChange from "@/assets/icons/statusChange.svg?react";
import IconSO from "@/assets/icons/SO.svg?react";
import IconAdmin from "@/assets/icons/admin.svg?react";
import IconSemester from "@/assets/icons/calendar.svg?react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { ROLE } from "@/helpers/constants/enum";
import ModalManageAdmin from "./Modal/Profile/ModalManageAdmin";
import ModalChangeSupAdmin from "./Modal/Profile/ModalChangeSupremeAdmin";
import ModalManageSemester from "./Modal/Profile/ModalManageSemester";
import { getUserName } from "@/helpers/functions/function";
import ModalCourseManagement from "./Modal/Profile/ModalCourseManagement";
import ModalPLOManagement from "./Modal/Profile/ModalPLOManagement";
import { logout } from "@/services/user/user.service";
import { resetSeachCourseManagement } from "@/store/courseManagement";

export default function Profile() {
  const path = useLocation().pathname;
  const [params, setParams] = useSearchParams({});
  const navigate = useNavigate();
  const dashboard = useAppSelector((state) => state.config.dashboard);
  const user = useAppSelector((state) => state.user);
  const [openModalChangeSupAdmin, setOpenModalChangeSupAdmin] = useState(false);
  const [openModalManageSemester, setOpenModalManageSemester] = useState(false);
  const [openModalManageAdmin, setOpenModalManageAdmin] = useState(false);
  const [openModalCourseManagement, setOpenModalCourseManagement] =
    useState(false);
  const [openModalPLOManagement, setOpenModalPLOManagement] = useState(false);
  const dispatch = useAppDispatch();

  const getRoleColor = (role: ROLE) => {
    switch (role) {
      case ROLE.SUPREME_ADMIN:
        return "#1B75DF";
      case ROLE.ADMIN:
        return "#009BCC";
      case ROLE.INSTRUCTOR:
        return "#13A5A5";
      case ROLE.TA:
        return "#7f0410";
      case ROLE.STUDENT:
        return "#6869AD";
    }
  };

  const getProfileIcon = (role: ROLE) => {
    switch (role) {
      case ROLE.SUPREME_ADMIN:
        return (
          <Icon
            IconComponent={IconSAdminProfile}
            className="size-8 acerSwift:max-macair133:size-7"
            style={{ color: getRoleColor(user.role) }}
          />
        );
      case ROLE.ADMIN:
        return (
          <Icon
            IconComponent={IconAdminProfile}
            className="size-8 acerSwift:max-macair133:size-7"
            style={{ color: getRoleColor(user.role) }}
          />
        );
      default:
        return (
          <Icon
            IconComponent={IconUserProfile}
            className="size-8 acerSwift:max-macair133:size-7"
            style={{ color: getRoleColor(user.role) }}
          />
        );
    }
  };

  return (
    <>
      <ModalManageAdmin
        opened={openModalManageAdmin}
        onClose={() => setOpenModalManageAdmin(false)}
      />
      <ModalChangeSupAdmin
        opened={openModalChangeSupAdmin}
        onClose={() => setOpenModalChangeSupAdmin(false)}
      />
      <ModalManageSemester
        opened={openModalManageSemester}
        onClose={() => setOpenModalManageSemester(false)}
      />
      <ModalCourseManagement
        opened={openModalCourseManagement}
        onClose={() => {
          setOpenModalCourseManagement(false);
          dispatch(resetSeachCourseManagement());
        }}
      />
      <ModalPLOManagement
        opened={openModalPLOManagement}
        onClose={() => setOpenModalPLOManagement(false)}
      />
      <Menu
        trigger="click"
        openDelay={100}
        clickOutsideEvents={["mousedown"]}
        classNames={{ item: "text-[#3e3e3e] h-8 w-full" }}
      >
        <Menu.Target>
          <Button
            color="#fafafa"
            className="flex hover:bg-[#efefef] flex-row pl-4 justify-end px-0 !h-10 items-center"
          >
            <div className="flex flex-col gap-1 text-end mr-3 text-b4 acerSwift:max-macair133:text-b5">
              <p className="font-semibold text-default">{getUserName(user)}</p>
              <p
                className="font-medium"
                style={{ color: getRoleColor(user.role) }}
              >
                {user.role !== ROLE.SUPREME_ADMIN &&
                  user.role !== ROLE.ADMIN &&
                  user.role}
                {(user.role === ROLE.SUPREME_ADMIN ||
                  user.role === ROLE.ADMIN) &&
                  (dashboard === ROLE.ADMIN ? (
                    <span>Admin</span>
                  ) : dashboard === ROLE.INSTRUCTOR ? (
                    <span>Instructor</span>
                  ) : (
                    <span>Student</span>
                  ))}
              </p>
            </div>
            {/* <Icon IconComponent={ProfileIcon} /> */}
            {getProfileIcon(user.role)}
          </Button>
        </Menu.Target>
        <Menu.Dropdown
          className="!z-50 rounded-md -translate-y-[3px] translate-x-[-18px] bg-white"
          style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px" }}
        >
          <>
            <div className="flex items-center px-4 py-3 gap-3">
              {/* <Icon className="pt-[5px]" IconComponent={ProfileIcon} /> */}
              {getProfileIcon(user.role)}
              <div className="flex flex-col text-b4  acerSwift:max-macair133:text-b5">
                <p className=" font-semibold">{getUserName(user, 1)}</p>
                <p
                  className="font-medium"
                  style={{ color: getRoleColor(user.role) }}
                >
                  {user.role}
                </p>
              </div>
            </div>
            <Menu.Divider />
            {(user.role === ROLE.SUPREME_ADMIN || user.role === ROLE.ADMIN) && (
              <Menu.Item
                onClick={() =>
                  navigate({
                    pathname:
                      dashboard == ROLE.ADMIN
                        ? ROUTE_PATH.INS_DASHBOARD
                        : `${ROUTE_PATH.ADMIN_DASHBOARD}/${ROUTE_PATH.TQF}`,
                    search: "?" + params.toString(),
                  })
                }
              >
                <div className="flex items-center gap-2 acerSwift:max-macair133:text-b5">
                  <Icon
                    IconComponent={IconUserScreen}
                    className=" stroke-[1.5px] size-4  acerSwift:max-macair133:size-"
                  />
                  <span>
                    {dashboard == ROLE.ADMIN
                      ? "Switch to Instructor view"
                      : "Switch to Admin view"}
                  </span>
                </div>
              </Menu.Item>
            )}
            {![ROLE.STUDENT, ROLE.TA].includes(user.role) &&
              user.studentId &&
              !path.includes(ROUTE_PATH.STD_DASHBOARD) && (
                <Menu.Item
                  onClick={() =>
                    navigate({
                      pathname: ROUTE_PATH.STD_DASHBOARD,
                      search: "?" + params.toString(),
                    })
                  }
                >
                  <div className="flex items-center gap-2 acerSwift:max-macair133:text-b5">
                    <Icon
                      IconComponent={IconUserScreen}
                      className=" stroke-[1.5px] size-4  acerSwift:max-macair133:size-"
                    />
                    <span>Switch to Student view</span>
                  </div>
                </Menu.Item>
              )}
            {(user.role === ROLE.SUPREME_ADMIN || user.role === ROLE.ADMIN) && (
              <Menu.Divider />
            )}
            {user.role === ROLE.TA && (
              <Menu.Item
                onClick={() =>
                  navigate({
                    pathname: path.includes(ROUTE_PATH.INS_DASHBOARD)
                      ? ROUTE_PATH.STD_DASHBOARD
                      : ROUTE_PATH.INS_DASHBOARD,
                    search: "?" + params.toString(),
                  })
                }
              >
                <div className="flex items-center gap-2 acerSwift:max-macair133:text-b5">
                  <Icon
                    IconComponent={IconUserScreen}
                    className=" stroke-[1.5px] size-4  acerSwift:max-macair133:size-"
                  />
                  <span>
                    {path.includes(ROUTE_PATH.INS_DASHBOARD)
                      ? "Switch to Student view"
                      : "Switch to TA view"}
                  </span>
                </div>
              </Menu.Item>
            )}
            {user.role === ROLE.TA && <Menu.Divider />}
          </>

          {(user.role === ROLE.SUPREME_ADMIN ||
            user.role === ROLE.ADMIN ||
            user.role === ROLE.INSTRUCTOR) && (
            <Menu.Item onClick={() => navigate(ROUTE_PATH.SELECTED_DEPARTMENT)}>
              <div className="flex items-center gap-2 acerSwift:max-macair133:text-b5">
                <Icon
                  IconComponent={IconStatusChange}
                  className="size-4  acerSwift:max-macair133:size- stroke-[1.5px]"
                />
                <span>Department</span>
              </div>
            </Menu.Item>
          )}

          {/* SUB MENU MANAGEMENT */}
          {(user.role === ROLE.SUPREME_ADMIN || user.role === ROLE.ADMIN) && (
            <Menu
              trigger="hover"
              openDelay={100}
              closeDelay={200}
              classNames={{ item: "text-[#3e3e3e] h-8 w-full" }}
            >
              <Menu.Target>
                <Menu.Item>
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex gap-2 items-center acerSwift:max-macair133:text-b5">
                      <Icon
                        IconComponent={IconAdjustmentsHorizontal}
                        className="size-4  acerSwift:max-macair133:size- stroke-[1.5px]"
                      />
                      <span>Management</span>
                    </div>
                    <Icon
                      IconComponent={IconChevronRight}
                      className="size-4  acerSwift:max-macair133:size- stroke-[2px]"
                    />
                  </div>
                </Menu.Item>
              </Menu.Target>
              <Menu.Dropdown
                className="!z-50 rounded-md -translate-y-[62px] -translate-x-[210px] bg-white"
                style={{
                  width: "200px",
                  boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px",
                }}
              >
                {user.role === ROLE.SUPREME_ADMIN && (
                  <>
                    <Menu.Item
                      onMouseDown={() => setOpenModalChangeSupAdmin(true)}
                    >
                      <div className="flex items-center gap-2 acerSwift:max-macair133:text-b5">
                        <Icon
                          IconComponent={IconSupreme}
                          className="size-4  acerSwift:max-macair133:size-"
                        />
                        <span>Supreme Admin</span>
                      </div>
                    </Menu.Item>
                  </>
                )}
                <Menu.Item onMouseDown={() => setOpenModalManageAdmin(true)}>
                  <div className="flex items-center gap-2 acerSwift:max-macair133:text-b5">
                    <Icon
                      IconComponent={IconAdmin}
                      className="size-4  acerSwift:max-macair133:size-"
                    />
                    <span>Admin</span>
                  </div>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  className="text-[#3e3e3e] h-8 w-w-full"
                  onMouseDown={() => setOpenModalCourseManagement(true)}
                >
                  <div className="flex items-center gap-2 acerSwift:max-macair133:text-b5">
                    <Icon
                      IconComponent={IconCourse}
                      className="size-4  acerSwift:max-macair133:size-"
                    />
                    <span>Course</span>
                  </div>
                </Menu.Item>
                {user.role === ROLE.SUPREME_ADMIN && (
                  <>
                    <Menu.Item
                      onMouseDown={() => setOpenModalManageSemester(true)}
                    >
                      <div className="flex items-center gap-2 acerSwift:max-macair133:text-b5">
                        <Icon
                          IconComponent={IconSemester}
                          className="size-4  acerSwift:max-macair133:size-"
                        />
                        <span>Semester</span>
                      </div>
                    </Menu.Item>
                  </>
                )}
                <Menu.Divider />
                <Menu.Item
                  className="text-[#3e3e3e] h-8 w-w-full "
                  onMouseDown={() => setOpenModalPLOManagement(true)}
                >
                  <div className="flex items-center gap-2  acerSwift:max-macair133:text-b5">
                    <Icon
                      IconComponent={IconSO}
                      className="size-4  acerSwift:max-macair133:size-"
                    />
                    <span>PLO</span>
                  </div>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}

          {![ROLE.STUDENT, ROLE.TA].includes(user.role) && <Menu.Divider />}
          {/* <a
            href={
              [ROLE.STUDENT, ROLE.TA].includes(user.role)
                ? "https://docs.google.com/forms/d/e/1FAIpQLSfstqyy0ijNp8u0JU0a7bBU_x0HGPhJ5V7flAD0ZymzD9cZqA/viewform"
                : "https://forms.gle/HwxjaAZAJs99v8aDA"
            }
            target="_blank"
          >
            <Menu.Item className="text-[#3e3e3e] h-8 w-w-full ">
              <div className="flex items-center gap-2">
                <Icon className="size-4  acerSwift:max-macair133:size- " IconComponent={IconFeedback} />
                <span>Feedback</span>
              </div>
            </Menu.Item>
          </a> */}

          <a href="https://forms.gle/haNFpme6KBzyejG18" target="_blank">
            <Menu.Item className="text-[#3e3e3e] h-8 w-w-full ">
              <div className="flex items-center gap-2 acerSwift:max-macair133:text-b5">
                <Icon
                  IconComponent={IconExclamationCircle}
                  className="size-4  acerSwift:max-macair133:size- stroke-[1.5px] stroke-[#3e3e3e]"
                />
                <span>Report issue</span>
              </div>
            </Menu.Item>
          </a>

          <Menu.Divider />
          <Menu.Item
            className="text-delete  hover:bg-[#d55757]/10"
            onClick={logout}
          >
            <div className="flex items-center gap-2  acerSwift:max-macair133:text-b5">
              <Icon
                IconComponent={IconLogout}
                className="size-4  acerSwift:max-macair133:size- stroke-[1.5px] stroke-delete "
              />
              <span>Log out</span>
            </div>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
