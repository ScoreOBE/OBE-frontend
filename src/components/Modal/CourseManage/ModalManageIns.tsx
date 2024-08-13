import { Button, Input, Modal, Select, TextInput } from "@mantine/core";
import { IconUserCircle, IconChevronLeft } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import Icon from "@/components/Icon";
import { IModelUser } from "@/models/ModelUser";
import { getInstructor, updateAdmin } from "@/services/user/user.service";
import { useAppSelector } from "@/store";
import { NOTI_TYPE, ROLE } from "@/helpers/constants/enum";
import { validateEmail } from "@/helpers/functions/validation";
import {
  getSection,
  getUserName,
  showNotifications,
} from "@/helpers/functions/function";
import { Tabs } from "@mantine/core";
import {
  IModelCourseManagement,
  IModelSectionManagement,
} from "@/models/ModelCourseManagement";
import CompoMangementIns from "@/components/CompoManageIns";
import { motion } from "framer-motion";

type Props = {
  opened: boolean;
  onClose: () => void;
  data: Partial<IModelCourseManagement>;
};
export default function ModalManageIns({ opened, onClose, data = {} }: Props) {
  const user = useAppSelector((state) => state.user);
  const [swapMethodAddAdmin, setSwapMethodAddAdmin] = useState(false);
  const [openedDropdown, setOpenedDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [instructorOption, setInstructorOption] = useState<any[]>([]);
  const [adminList, setAdminList] = useState<IModelUser[]>([]);
  const [adminFilter, setAdminFilter] = useState<IModelUser[]>([]);
  const [editUser, setEditUser] = useState<string | null>();
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [changeMainIns, setChangeMainIns] = useState(false);
  const [editSection, setEditSection] = useState<IModelSectionManagement>();

  const fetchIns = async () => {
    const res = await getInstructor();
    if (res) {
      const insList = res.filter(
        (e: any) => e.id != user.id && e.role === ROLE.INSTRUCTOR
      );
      let adminList = res.filter((e: IModelUser) => {
        if (e.id !== user.id && e.role === ROLE.ADMIN) {
          return {
            id: e.id,
            firstNameEN: e.firstNameEN,
            lastNameEN: e.lastNameEN,
            email: e.email,
          };
        }
      });
      // Add current user to the top of the admin list
      if (user.role === ROLE.SUPREME_ADMIN || user.role === ROLE.ADMIN) {
        adminList = [
          {
            id: user.id,
            firstNameEN: user.firstNameEN,
            lastNameEN: user.lastNameEN,
            email: user.email,
          },
          ...adminList,
        ];
      }

      setInstructorOption(
        insList.map((e: IModelUser) => {
          return { label: getUserName(e, 1), value: e.id };
        })
      );
      setAdminList(adminList);
      setAdminFilter(adminList);
    }
  };

  const editAdmin = async (id: string, role: ROLE) => {
    const payload: Partial<IModelUser> = { role };
    if (swapMethodAddAdmin && role === ROLE.ADMIN) {
      if (invalidEmail) return;
      payload.email = id;
    } else payload.id = id;
    const res = await updateAdmin(payload);
    if (res) {
      const name = res.firstNameEN?.length ? getUserName(res, 1) : res.email;
      const message =
        res.role == ROLE.ADMIN
          ? `${name} is an admin`
          : `Delete ${name} from admin`;
      setEditUser(null);
      fetchIns();
      showNotifications(NOTI_TYPE.SUCCESS, "Success", message);
    }
  };

  useEffect(() => {
    if (opened) {
      setEditUser(null);
      setSearchValue("");
      setSwapMethodAddAdmin(false);
      fetchIns();
    }
  }, [opened]);

  useEffect(() => {
    if (swapMethodAddAdmin) {
      if (editUser?.length) setInvalidEmail(!validateEmail(editUser));
      else setInvalidEmail(false);
    }
  }, [editUser]);

  useEffect(() => {
    setAdminFilter(
      adminList.filter(
        (admin) =>
          `${getUserName(admin, 2)}`.includes(searchValue.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <div className="flex gap-2 items-center">
          {changeMainIns && (
            <IconChevronLeft
              className="hover:bg-[#f0f0f0] size-6 -translate-x-2 rounded-full"
              onClick={() => setChangeMainIns(false)}
            />
          )}
          <div className="flex flex-col gap-2">
            <p>Management Instructor</p>{" "}
            <p className="text-b3 font-medium text-[#575757]">
              {data.courseNo} {data.courseName}
            </p>{" "}
          </div>
        </div>
      }
      size="45vw"
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        content:
          "flex flex-col justify-start bg-[#F6F7FA] text-[14px] item-center px-2 pb-2 overflow-hidden max-h-fit ",
      }}
    >
      {/* <motion.div
        initial={{ height: !changeMainIns ? "h-fit" : "240px" }}
        animate={{ height: changeMainIns ? "240px" : "h-fit" }} // Adjust height based on state
        transition={{ duration: 0.3 }}
        key={changeMainIns.toString()}
      > */}
      <div
        className={`height-animation ${
          changeMainIns ?  "collaps" : "expand"}`}
      >
        {changeMainIns && editSection ? (
          <div className="flex flex-col gap-2">
            <div
              className="w-full items-center rounded-md justify-start gap-3 mt-2  px-6 py-3  flex"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              <IconUserCircle
                size={32}
                className=" -translate-x-1"
                stroke={1}
              />
              <div className="flex flex-col">
                <p className="font-semibold text-[14px] text-tertiary">
                  {getUserName(editSection?.instructor, 1)}
                </p>
                <p className="text-secondary text-[12px] font-normal">
                  Owner Section {getSection(editSection.sectionNo)}{" "}
                </p>
              </div>
            </div>
            <CompoMangementIns opened={changeMainIns} change={true} />
          </div>
        ) : (
          <Tabs color="#5768d5" defaultValue="mainInstructor">
            <Tabs.List>
              <Tabs.Tab value="mainInstructor">Owner section</Tabs.Tab>
              <Tabs.Tab value="coInstructor">Co-Instructor section</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="mainInstructor">
              <div className="flex flex-col max-h-[300px] h-fit  mt-3 overflow-y-scroll p-1">
                {data.sections?.map((sec, index) => (
                  <div
                    key={index}
                    className="w-full items-center last:border-none border-b-[1px] justify-between  p-3  flex"
                  >
                    <div className="gap-3 flex items-center">
                      <IconUserCircle
                        size={32}
                        className=" -translate-x-1"
                        stroke={1}
                      />
                      <div className="flex flex-col">
                        <p className="font-semibold text-[14px] text-tertiary">
                          {getUserName(sec.instructor, 1)}
                        </p>
                        <p className="text-secondary text-[12px] font-normal">
                          Owner Section {getSection(sec.sectionNo)}{" "}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      color="#5768d5"
                      size="xs"
                      className="rounded-[8px] font-semibold text-[12px]"
                      onClick={() => {
                        setEditSection(sec);
                        setChangeMainIns(true);
                      }}
                    >
                      Change
                    </Button>
                  </div>
                ))}
              </div>
            </Tabs.Panel>
          </Tabs>
        )}
      </div>
      {/* </motion.div> */}
    </Modal>
  );
}
