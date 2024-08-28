import { Alert, Button, Modal, rem, TextInput } from "@mantine/core";
import {
  IconExclamationCircle,
  IconInfoCircle,
  IconUserCircle,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import { AiOutlineSwap } from "react-icons/ai";
import Icon from "@/components/Icon";
import InfoIcon from "@/assets/icons/info.svg?react";
import { IModelUser } from "@/models/ModelUser";
import { getInstructor, updateSAdmin } from "@/services/user/user.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { NOTI_TYPE, ROLE } from "@/helpers/constants/enum";
import { setUser } from "@/store/user";
import { getUserName, showNotifications } from "@/helpers/functions/function";
import { isEqual } from "lodash";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useNavigate } from "react-router-dom";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function ModalChangeSupremeAdmin({ opened, onClose }: Props) {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [adminList, setAdminList] = useState<any[]>([]);
  const [adminFilter, setAdminFilter] = useState<IModelUser[]>([]);
  const [openSetSAdminModal, setOpenSetSAdminModal] = useState(false);
  const [supremeAdmin, setSupremeAdmin] = useState<Partial<IModelUser>>({});
  const [textActivate, setTextActivate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (opened) {
      setSearchValue("");
      setTextActivate("");
      fetchIns();
    }
  }, [opened]);

  useEffect(() => {
    setAdminFilter(
      adminList.filter(
        (admin) =>
          `${getUserName(admin, 2)}`.includes(searchValue.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue]);

  const fetchIns = async () => {
    const res = await getInstructor();
    if (res) {
      const list = res.filter((e: IModelUser) => {
        if (e.id !== user.id && e.role === ROLE.ADMIN) {
          return {
            id: e.id,
            firstNameEN: e.firstNameEN,
            lastNameEN: e.lastNameEN,
            email: e.email,
          };
        }
      });
      setAdminList(list);
      setAdminFilter(list);
    }
  };

  const editSAdmin = async (id: string) => {
    const res = await updateSAdmin({ id });
    if (res) {
      const name = res.newSAdmin.firstNameEN?.length
        ? getUserName(res.newSAdmin, 1)
        : res.newSAdmin.email;
      dispatch(setUser(res.user));
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Change success",
        `${name} is an supreme admin`
      );
      onClose();
      localStorage.removeItem("token");
      dispatch(setUser({}));
      navigate(ROUTE_PATH.LOGIN);
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        closeOnClickOutside={true}
        title="Management Supreme Admin"
        size="43vw"
        centered
        transitionProps={{ transition: "pop" }}
        classNames={{
          content:
            "flex flex-col  justify-start bg-[#F6F7FA] text-[14px] item-center px-2 pb-2 overflow-hidden ",
        }}
      >
        <Alert
          radius="md"
          icon={<IconInfoCircle />}
          variant="light"
          color="blue"
          className="mb-5"
          classNames={{
            icon: "size-6",
            body: " flex justify-center",
          }}
          title={
            <p>
              Changing the Supreme Admin
              <span className=" font-extrabold"> will revoke </span> your
              current role
            </p>
          }
        ></Alert>
        <div
          className=" max-h-[500px]  flex flex-col bg-white border-secondary border-[1px]  rounded-md"
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Show List Of Admin */}
          <div className="flex  flex-col gap-2  flex-1  p-4  overflow-y-hidden">
            <TextInput
              leftSection={<TbSearch />}
              placeholder="Name / CMU account"
              value={searchValue}
              size="xs"
              onChange={(event: any) =>
                setSearchValue(event.currentTarget.value)
              }
              rightSectionPointerEvents="all"
            />

            {/* List of Admin */}
            <div className="flex flex-1 flex-col gap-2  overflow-y-auto">
              {adminFilter.map((admin) => (
                <div
                  key={admin.id}
                  className="flex flex-1 items-center justify-between last:border-none border-b-[1px]  p-3 "
                >
                  <div className="gap-3 flex items-center">
                    <IconUserCircle size={32} stroke={1} />
                    <div className="flex flex-col">
                      <p className="font-semibold text-[14px] text-tertiary">
                        {getUserName(admin, 1)}
                      </p>
                      <p className="text-secondary text-[12px] font-normal">
                        {admin.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                      size="xs"
                    className=" rounded-[8px] font-semibold text-[12px]"
                    onClick={() => {
                      setSupremeAdmin(admin);
                      onClose();
                      setOpenSetSAdminModal(true);
                    }}
                  >
                    Change
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        opened={openSetSAdminModal}
        size="47vw"
        title="Change Supreme Admin"
        transitionProps={{ transition: "pop" }}
        centered
        onClose={() => setOpenSetSAdminModal(false)}
      >
        <Alert
          variant="light"
          color="red"
          title={` After you change Supreme Admin, `}
          icon={<IconExclamationCircle />}
          classNames={{ title: "-mt-[2px]" }}
          className="mb-5"
        ></Alert>
        <TextInput
          label={`To confirm, type "${supremeAdmin?.firstNameEN}${supremeAdmin?.lastNameEN}"`}
          value={textActivate}
          classNames={{ label: " select-none" }}
          onChange={(event) => setTextActivate(event.target.value)}
        ></TextInput>
        <Button
          color="#5768D5"
          disabled={
            !isEqual(
              `${supremeAdmin?.firstNameEN}${supremeAdmin?.lastNameEN}`,
              textActivate
            )
          }
          onClick={() => editSAdmin(supremeAdmin.id!)}
          className="rounded-s-[4px] mt-4 min-w-fit h-[36px]  border-none w-full"
        >
          Change Supreme Admin, Log Out
        </Button>
      </Modal>
    </>
  );
}
