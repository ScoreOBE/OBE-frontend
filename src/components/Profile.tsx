import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { Menu, Button } from "@mantine/core";
import Icon from "./Icon";
import ProfileIcon from "@/assets/icons/profile.svg?react";
import { IconChevronRight, IconList } from "@tabler/icons-react";
import { IconUserScreen } from "@tabler/icons-react";
import { IconStatusChange } from "@tabler/icons-react";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import { IconLogout } from "@tabler/icons-react";
import SupremeIcon from "@/assets/icons/supremeAdmin.svg?react";
import CourseIcon from "@/assets/icons/course.svg?react";
import SOIcon from "@/assets/icons/SO.svg?react";
import TQFIcon from "@/assets/icons/TQF.svg?react";
import AdminIcon from "@/assets/icons/admin.svg?react";
import SemesterIcon from "@/assets/icons/calendar.svg?react";
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

  const getRoleColor = (role: any) => {
    switch (role) {
      case ROLE.STUDENT:
        return "#6869AD";
      case ROLE.INSTRUCTOR:
        return "#13A5A5";
      case ROLE.ADMIN:
        return "#009BCC";
      case ROLE.SUPREME_ADMIN:
        return "#1B75DF";
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
            <Icon IconComponent={ProfileIcon} />
          </Button>
        </Menu.Target>
        <Menu.Dropdown
          className="!z-50 rounded-md -translate-y-[3px] translate-x-[-18px] bg-white"
          style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px" }}
        >
          {user.role !== ROLE.STUDENT && (
            <>
              <div className="flex flex-row p-4 py-3 gap-3">
                <Icon className="pt-[5px]" IconComponent={ProfileIcon} />
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
              <Menu.Item className="text-default text-[14px] h-8 w-full ">
                <div className="flex items-center gap-2">
                  <IconList stroke={1.5} className="size-5" />
                  <span>Activity log</span>
                </div>
              </Menu.Item>
              <Menu.Item>
                <div className="flex items-center gap-2">
                  <IconUserScreen className="size-5" stroke={1.5} />
                  <span>Instructor view</span>
                </div>
              </Menu.Item>
              <Menu.Divider />
            </>
          )}
          <Menu.Item onClick={() => navigate(ROUTE_PATH.SELECTED_DEPARTMENT)}>
            <div className="flex items-center gap-2">
              <IconStatusChange className="size-5" stroke={1.5} />
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
                      <IconAdjustmentsHorizontal
                        className="size-5"
                        stroke={1.5}
                      />
                      <span>Management</span>
                    </div>
                    <IconChevronRight className="size-5" stroke={1.5} />
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
                        <Icon IconComponent={SupremeIcon} className="size-5" />
                        <span>Supreme Admin</span>
                      </div>
                    </Menu.Item>
                    <Menu.Item
                      onMouseDown={() => setOpenModalManageSemester(true)}
                    >
                      <div className="flex items-center gap-2">
                        <Icon IconComponent={SemesterIcon} className="size-5" />
                        <span>Semester</span>
                      </div>
                    </Menu.Item>
                  </>
                )}
                <Menu.Item onMouseDown={() => setOpenModalManageAdmin(true)}>
                  <div className="flex items-center gap-2">
                    <Icon IconComponent={AdminIcon} className="size-5" />
                    <span>Admin</span>
                  </div>
                </Menu.Item>
                <Menu.Item
                  className="text-[#3e3e3e] h-8 w-w-full"
                  onMouseDown={() => setOpenModalCourseManagement(true)}
                >
                  <div className="flex items-center gap-2">
                    <Icon IconComponent={CourseIcon} className="size-5" />
                    <span>Course</span>
                  </div>
                </Menu.Item>
                <Menu.Item
                  className="text-[#3e3e3e] h-8 w-w-full "
                  onMouseDown={() => setOpenModalPLOManagement(true)}
                >
                  <div className="flex items-center gap-2">
                    <Icon IconComponent={SOIcon} className="size-5" />
                    <span>PLO</span>
                  </div>
                </Menu.Item>
                <Menu.Item
                  className="text-[#3e3e3e] h-8 w-w-full"
                  onMouseDown={() => setOpenModalManageTQF(true)}
                >
                  <div className="flex items-center gap-2">
                    <Icon IconComponent={TQFIcon} className="size-5" />
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
              <IconLogout className="size-5" stroke={1.5} color="#FF4747" />
              <span>Log out</span>
            </div>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
