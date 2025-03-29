import { Alert, Button, Modal, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import { IModelUser } from "@/models/ModelUser";
import { useAppDispatch, useAppSelector } from "@/store";
import { NOTI_TYPE, ROLE } from "@/helpers/constants/enum";
import { checkStringContain, getUserName } from "@/helpers/functions/function";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import CompoManageIns from "@/components/CompoManageIns";
import { updateCurrAdmin } from "@/services/user/user.service";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconUserCicle from "@/assets/icons/userCircle.svg?react";
import IconUsers from "@/assets/icons/users.svg?react";
import Icon from "@/components/Icon";
import MainPopup from "@/components/Popup/MainPopup";
import { setLoadingOverlay } from "@/store/loading";

type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalManageCurrAdmin({ opened, onClose }: Props) {
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [adminList, setAdminList] = useState<IModelUser[]>([]);
  const [adminFilter, setAdminFilter] = useState<IModelUser[]>([]);
  const [isNewFetch, setIsNewFetch] = useState(false);
  const [openMainPopupDelAdmin, setOpenMainPopupDelAdmin] = useState(false);
  const [targetAdminId, setTargetAdminId] = useState("");
  const [targetAdminName, setTargetAdminName] = useState("");

  useEffect(() => {
    if (opened) {
      setSearchValue("");
    }
  }, [opened]);

  useEffect(() => {
    setAdminFilter(
      adminList.filter((admin) =>
        checkStringContain(
          [`${getUserName(admin, 2)}`, admin.email],
          searchValue
        )
      )
    );
  }, [searchValue, adminList]);

  const deleteAdmin = async (id: string) => {
    dispatch(setLoadingOverlay(true));
    const payload: Partial<IModelUser> = { id, role: ROLE.INSTRUCTOR };
    const res = await updateCurrAdmin(payload);
    if (res) {
      setIsNewFetch(true);
      setAdminList(adminList.filter((admin) => admin.id !== res.id));
      const name = res.firstNameEN?.length ? getUserName(res, 1) : res.email;
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Curriculum Admin Deleted Successfully",
        `${name} has been successfully removed from the curriculum admin list.`
      );
    }
    dispatch(setLoadingOverlay(false));
  };

  return (
    <>
      <MainPopup
        opened={openMainPopupDelAdmin}
        onClose={() => setOpenMainPopupDelAdmin(false)}
        action={() => {
          deleteAdmin(targetAdminId);
          setOpenMainPopupDelAdmin(false);
        }}
        type="delete"
        labelButtonRight="Delete Curriculum admin"
        title={`Delete Curriculum admin`}
        message={
          <>
            <Alert
              variant="light"
              color="red"
              title={
                <p>
                  After you delete this curriculum admin, they will no longer
                  have access to the ScoreOBE+ management.
                </p>
              }
              icon={<Icon IconComponent={IconExclamationCircle} />}
              className="border border-red-100 rounded-xl bg-red-50"
              classNames={{
                title: "acerSwift:max-macair133:!text-b3",
                icon: "size-6",
                root: "p-4",
                wrapper: "items-start",
              }}
            ></Alert>
            <div className="flex flex-col mt-3 gap-2">
              <div className="flex flex-col  ">
                <p className="text-b4 text-[#808080]">Curriculum Admin</p>
                <p className="-translate-y-[2px] text-b1">{`${targetAdminName}`}</p>
              </div>
            </div>
          </>
        }
      />
      {!openMainPopupDelAdmin && (
        <Modal
          opened={opened}
          onClose={onClose}
          title="Curriculum Admin Management"
          size="50vw"
          centered
          transitionProps={{ transition: "pop" }}
          classNames={{
            content:
              "flex flex-col justify-start bg-[#F6F7FA]  text-[14px] item-center px-2 pb-2 overflow-hidden max-h-fit ",
          }}
        >
          <div className="flex flex-col flex-1 gap-2  h-full ">
            <CompoManageIns
              opened={opened}
              type="admin"
              newFetch={isNewFetch}
              setNewFetch={setIsNewFetch}
              setUserList={setAdminList}
              setUserFilter={setAdminFilter}
            />

            {/* Added Admin */}
            <div className="w-full  flex flex-col bg-white mt-2 border-secondary border-[1px]  rounded-md">
              <div className=" bg-bgTableHeader flex gap-3 items-center rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold">
                <Icon IconComponent={IconUsers} /> Added Curriculum Admin
              </div>
              {/* Show List Of Admin */}
              <div className="flex flex-col gap-2 w-full sm:max-macair133:h-[250px] macair133:h-[300px] p-4 py-3  overflow-y-auto">
                <TextInput
                  leftSection={<TbSearch />}
                  placeholder="Name / CMU account"
                  size="xs"
                  value={searchValue}
                  onChange={(event: any) =>
                    setSearchValue(event.currentTarget.value)
                  }
                  rightSectionPointerEvents="all"
                />
                {/* List of Curriculum Admin */}
                <div className="flex flex-col overflow-y-auto p-1">
                  {adminFilter.map((admin, index) => (
                    <div
                      key={index}
                      className="w-full items-center last:border-none border-b-[1px] justify-between p-3 flex"
                    >
                      <div className="gap-3 flex items-center">
                        <Icon
                          IconComponent={IconUserCicle}
                          className=" size-8 stroke-1 -translate-x-1"
                        />
                        <div className="flex flex-col">
                          <p className="font-semibold text-[14px] text-tertiary">
                            {getUserName(admin, 1)}
                          </p>
                          <p className="text-secondary text-[12px] font-normal">
                            {admin.email}
                          </p>
                        </div>
                      </div>

                      {admin.firstNameEN === user.firstNameEN &&
                      admin.lastNameEN === user.lastNameEN ? (
                        <p className="mr-1 text-secondary text-[14px] font-normal">
                          You
                        </p>
                      ) : (
                        <div className="flex gap-4">
                          <div className="flex flex-col">
                            {admin.curriculums?.map((cur) => (
                              <p
                                key={cur}
                                className="text-secondary text-[12px] font-normal"
                              >
                                {cur}
                              </p>
                            ))}
                          </div>
                          <Button
                            color="red"
                            variant="outline"
                            onClick={() => {
                              setTargetAdminId(admin.id);
                              setTargetAdminName(
                                `${admin.firstNameEN} ${admin.lastNameEN}`
                              );
                              setOpenMainPopupDelAdmin(true);
                            }}
                            loading={loading}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
