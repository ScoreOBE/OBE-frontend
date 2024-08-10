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
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { setUser } from "@/store/user";
import { ROLE } from "@/helpers/constants/enum";
import ModalManageAdmin from "./Modal/ModalManageAdmin";
import ModalChangeSupAdmin from "./Modal/ModalChangeSupremeAdmin";
import { useDisclosure } from "@mantine/hooks";
import ModalManageSemester from "./Modal/ModalManageSemester";
import ModalManageTQF from "./Modal/ModalManageTQF";
import { getUserName } from "@/helpers/functions/function";

export default function Profile() {
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [
    modalManageAdmin,
    { open: openModalManageAdmin, close: closeModalManageAdmin },
  ] = useDisclosure(false);
  const [
    modalChangeSupAdmin,
    { open: openModalChangeSupAdmin, close: closeModalChangeSupAdmin },
  ] = useDisclosure(false);
  const [
    modalManageSemester,
    { open: openModalManageSemester, close: closeModalManageSemester },
  ] = useDisclosure(false);
  const [
    modalManageTQF,
    { open: openModalManageTQF, close: closeModalManageTQF },
  ] = useDisclosure(false);

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
        opened={modalManageAdmin}
        onClose={closeModalManageAdmin}
      />
      <ModalChangeSupAdmin
        opened={modalChangeSupAdmin}
        onClose={closeModalChangeSupAdmin}
      />
      <ModalManageTQF opened={modalManageTQF} onClose={closeModalManageTQF} />
      <ModalManageSemester
        opened={modalManageSemester}
        onClose={closeModalManageSemester}
      />
      <Menu
        trigger="click"
        openDelay={100}
        clickOutsideEvents={["click"]}
        classNames={{ item: "text-[#3e3e3e] h-8 w-full" }}
      >
        <Menu.Target>
          <Button className="flex flex-row justify-end px-0 pl-4 h-10  bg-white items-center rounded-lg  cursor-pointer hover:bg-[#f0f0f0]">
            <div className="flex flex-col gap-1 text-end mr-3 text-[12px]">
              <p className="text-black font-semibold">{getUserName(user)}</p>
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
          className="rounded-md -translate-y-[3px] translate-x-[-18px] bg-white"
          style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px" }}
        >
          {user.role !== ROLE.STUDENT && (
            <>
              <div className="flex flex-row p-4 py-3 gap-3">
                <Icon className="pt-[5px]" IconComponent={ProfileIcon} />
                <div className="flex flex-col text-[12px]   ">
                  <p className="text-black font-semibold">
                    {getUserName(user, 1)}
                  </p>
                  <p
                    className="font-medium"
                    style={{ color: getRoleColor(user.role) }}
                  >
                    {user.role}
                  </p>
                </div>
              </div>
              <Menu.Divider />
              <Menu.Item>
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
              trigger="click-hover"
              openDelay={100}
              closeDelay={200}
              classNames={{ item: "text-[#3e3e3e] h-8 w-full" }}
            >
              <Menu.Target>
                <Menu.Item>
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex gap-2">
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
                className="rounded-md -translate-y-[62px] -translate-x-[210px] bg-white"
                style={{
                  width: "200px",
                  boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px",
                }}
              >
                {user.role === ROLE.SUPREME_ADMIN && (
                  <>
                    <Menu.Item onClick={openModalChangeSupAdmin}>
                      <div className="flex items-center gap-2">
                        <Icon IconComponent={SupremeIcon} className="size-5" />
                        <span>Supreme Admin</span>
                      </div>
                    </Menu.Item>
                    <Menu.Item onClick={openModalManageSemester}>
                      <div className="flex items-center gap-2">
                        <Icon IconComponent={SemesterIcon} className="size-5" />
                        <span>Semester</span>
                      </div>
                    </Menu.Item>
                  </>
                )}
                <Menu.Item onClick={openModalManageAdmin}>
                  <div className="flex items-center gap-2">
                    <Icon IconComponent={AdminIcon} className="size-5" />
                    <span>Admin</span>
                  </div>
                </Menu.Item>
                <Menu.Item
                  className="text-[#3e3e3e] h-8 w-w-full"
                  onClick={() => navigate(ROUTE_PATH.COURSE_MANAGEMENT)}
                >
                  <div className="flex items-center gap-2">
                    <Icon IconComponent={CourseIcon} className="size-5" />
                    <span>Course</span>
                  </div>
                </Menu.Item>
                <Menu.Item className="text-[#3e3e3e] h-8 w-w-full ">
                  <div className="flex items-center gap-2">
                    <Icon IconComponent={SOIcon} className="size-5" />
                    <span>SO</span>
                  </div>
                </Menu.Item>
                <Menu.Item
                  className="text-[#3e3e3e] h-8 w-w-full"
                  onClick={openModalManageTQF}
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
