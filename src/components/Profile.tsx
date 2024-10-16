import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { Menu, Button } from "@mantine/core";
import Icon from "./Icon";
import IconUserProfile from "@/assets/icons/profile/userProfile.svg?react";
import IconAdminProfile from "@/assets/icons/profile/adminProfile.svg?react";
import IconSAdminProfile from "@/assets/icons/profile/s.AdminProfile.svg?react";
import IconLogout from "@/assets/icons/logout.svg?react";
import IconChevronRight from "@/assets/icons/chevronRight.svg?react";
import IconSupreme from "@/assets/icons/supremeAdmin.svg?react";
import IconCourse from "@/assets/icons/course.svg?react";
import IconUserScreen from "@/assets/icons/userScreen.svg?react";
import IconAdjustmentsHorizontal from "@/assets/icons/horizontalAdjustments.svg?react";
import IconStatusChange from "@/assets/icons/statusChange.svg?react";
import IconSO from "@/assets/icons/SO.svg?react";
import IconTQF from "@/assets/icons/TQF.svg?react";
import IconAdmin from "@/assets/icons/admin.svg?react";
import IconSemester from "@/assets/icons/calendar.svg?react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { setUser } from "@/store/user";
import { ROLE } from "@/helpers/constants/enum";
import ModalManageAdmin from "./Modal/Profile/ModalManageAdmin";
import ModalChangeSupAdmin from "./Modal/Profile/ModalChangeSupremeAdmin";
import ModalManageSemester from "./Modal/Profile/ModalManageSemester";
import ModalManageTQF from "./Modal/Profile/ModalManageTQF";
import { getUserName } from "@/helpers/functions/function";
import ModalCourseManagement from "./Modal/Profile/ModalCourseManagement";
import ModalPLOManagement from "./Modal/Profile/ModalPLOManagement";

export default function Profile() {
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [openModalChangeSupAdmin, setOpenModalChangeSupAdmin] = useState(false);
  const [openModalManageSemester, setOpenModalManageSemester] = useState(false);
  const [openModalManageAdmin, setOpenModalManageAdmin] = useState(false);
  const [openModalCourseManagement, setOpenModalCourseManagement] =
    useState(false);
  const [openModalPLOManagement, setOpenModalPLOManagement] = useState(false);
  const [openModalManageTQF, setOpenModalManageTQF] = useState(false);

  const getRoleColor = (role: ROLE) => {
    switch (role) {
      case ROLE.SUPREME_ADMIN:
        return "#1B75DF";
      case ROLE.ADMIN:
        return "#009BCC";
      case ROLE.INSTRUCTOR:
        return "#13A5A5";
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
            className="size-8"
            style={{ color: getRoleColor(user.role) }}
          />
        );
      case ROLE.ADMIN:
        return (
          <Icon
            IconComponent={IconAdminProfile}
            className="size-8"
            style={{ color: getRoleColor(user.role) }}
          />
        );
      default:
        return (
          <Icon
            IconComponent={IconUserProfile}
            className="size-8"
            style={{ color: getRoleColor(user.role) }}
          />
        );
    }
  };

  const Logout = () => {
    localStorage.removeItem("token");
    dispatch(setUser({}));
    navigate(ROUTE_PATH.LOGIN, { replace: true });
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
      <ModalManageTQF
        opened={openModalManageTQF}
        onClose={() => setOpenModalManageTQF(false)}
      />
      <ModalManageSemester
        opened={openModalManageSemester}
        onClose={() => setOpenModalManageSemester(false)}
      />
      <ModalCourseManagement
        opened={openModalCourseManagement}
        onClose={() => setOpenModalCourseManagement(false)}
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
            color="#ffffff"
            className="flex flex-row pl-4 justify-end px-0 !h-10 items-center"
          >
            <div className="flex flex-col gap-1 text-end mr-3 text-b3">
              <p className="font-semibold text-default">{getUserName(user)}</p>
              <p
                className="font-medium"
                style={{ color: getRoleColor(user.role) }}
              >
                {user.role}
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
          {user.role !== ROLE.STUDENT && (
            <>
              <div className="flex items-center px-4 py-3 gap-3">
                {/* <Icon className="pt-[5px]" IconComponent={ProfileIcon} /> */}
                {getProfileIcon(user.role)}
                <div className="flex flex-col text-b3">
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
              {/* <Menu.Item className="text-default text-[14px] h-8 w-full ">
                <div className="flex items-center gap-2">
                  <IconList stroke={1.5} className="size-5" />
                  <span>Activity log</span>
                </div>
              </Menu.Item> */}
              <Menu.Item>
                <div className="flex items-center gap-2">
                  <Icon
                    IconComponent={IconUserScreen}
                    className=" stroke-[1.5px] size-4"
                  />
                  <span>Instructor view</span>
                </div>
              </Menu.Item>
              <Menu.Divider />
            </>
          )}
          <Menu.Item onClick={() => navigate(ROUTE_PATH.SELECTED_DEPARTMENT)}>
            <div className="flex items-center gap-2">
              <Icon
                IconComponent={IconStatusChange}
                className="size-4 stroke-[1.5px]"
              />
              <span>Department</span>
            </div>
          </Menu.Item>

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
                    <div className="flex gap-2 items-center">
                      <Icon
                        IconComponent={IconAdjustmentsHorizontal}
                        className="size-4 stroke-[1.5px]"
                      />
                      <span>Management</span>
                    </div>
                    <Icon
                      IconComponent={IconChevronRight}
                      className="size-4 stroke-[2px]"
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
                      <div className="flex items-center gap-2">
                        <Icon IconComponent={IconSupreme} className="size-4" />
                        <span>Supreme Admin</span>
                      </div>
                    </Menu.Item>
                    <Menu.Item
                      onMouseDown={() => setOpenModalManageSemester(true)}
                    >
                      <div className="flex items-center gap-2">
                        <Icon IconComponent={IconSemester} className="size-4" />
                        <span>Semester</span>
                      </div>
                    </Menu.Item>
                  </>
                )}
                <Menu.Item onMouseDown={() => setOpenModalManageAdmin(true)}>
                  <div className="flex items-center gap-2">
                    <Icon IconComponent={IconAdmin} className="size-4" />
                    <span>Admin</span>
                  </div>
                </Menu.Item>
                <Menu.Item
                  className="text-[#3e3e3e] h-8 w-w-full"
                  onMouseDown={() => setOpenModalCourseManagement(true)}
                >
                  <div className="flex items-center gap-2">
                    <Icon IconComponent={IconCourse} className="size-4" />
                    <span>Course</span>
                  </div>
                </Menu.Item>
                <Menu.Item
                  className="text-[#3e3e3e] h-8 w-w-full "
                  onMouseDown={() => setOpenModalPLOManagement(true)}
                >
                  <div className="flex items-center gap-2">
                    <Icon IconComponent={IconSO} className="size-4" />
                    <span>PLO</span>
                  </div>
                </Menu.Item>
                <Menu.Item
                  className="text-[#3e3e3e] h-8 w-w-full"
                  onMouseDown={() => setOpenModalManageTQF(true)}
                >
                  <div className="flex items-center gap-2">
                    <Icon IconComponent={IconTQF} className="size-4 stroke-[0.5px]" />
                    <span>TQF</span>
                  </div>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}

          <Menu.Divider />
          <Menu.Item
            className="text-[#FF4747] hover:bg-[#d55757]/10"
            onClick={Logout}
          >
            <div className="flex items-center gap-2">
              <Icon
                IconComponent={IconLogout}
                className="size-4 stroke-[1.5px] stroke-[#ff4747]"
              />
              <span>Log out</span>
            </div>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
