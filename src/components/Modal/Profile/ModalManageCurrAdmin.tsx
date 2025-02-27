import {
  Alert,
  Button,
  Checkbox,
  CheckboxGroup,
  Group,
  Menu,
  Modal,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import { IModelUser } from "@/models/ModelUser";
import { useAppDispatch, useAppSelector } from "@/store";
import { NOTI_TYPE, ROLE } from "@/helpers/constants/enum";
import { getUserName } from "@/helpers/functions/function";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import CompoManageIns from "@/components/CompoManageIns";
import { updateCurrAdmin } from "@/services/user/user.service";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconUserCicle from "@/assets/icons/userCircle.svg?react";
import IconUsers from "@/assets/icons/users.svg?react";
import Icon from "@/components/Icon";
import MainPopup from "@/components/Popup/MainPopup";
import { setLoadingOverlay } from "@/store/loading";
import { useForm } from "@mantine/form";
import { isEqual } from "lodash";

type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalManageCurrAdmin({ opened, onClose }: Props) {
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const user = useAppSelector((state) => state.user);
  const curriculum = useAppSelector((state) => state.faculty.curriculum);
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [searchCurrValue, setSearchCurrValue] = useState("");
  const [adminList, setAdminList] = useState<IModelUser[]>([]);
  const [adminFilter, setAdminFilter] = useState<IModelUser[]>([]);
  const [curriculumFilter, setCurriculumFilter] = useState<string[]>([]);
  const [isNewFetch, setIsNewFetch] = useState(false);
  const [openMainPopupDelAdmin, setOpenMainPopupDelAdmin] = useState(false);
  const [targetAdminId, setTargetAdminId] = useState("");
  const [targetAdminName, setTargetAdminName] = useState("");
  const [prevCurr, setPrevCurr] = useState<string[]>([]);

  useEffect(() => {
    if (opened && curriculum?.length) {
      setSearchValue("");
      setCurriculumFilter(curriculum.map((e) => e.code));
    }
  }, [opened, curriculum]);

  useEffect(() => {
    if (searchCurrValue.length) {
      setCurriculumFilter(
        curriculum
          .filter((curr) =>
            curr.code.toLowerCase().includes(searchCurrValue.toLowerCase())
          )
          .map((e) => e.code)
      );
    } else if (curriculum?.length) {
      setCurriculumFilter(curriculum.map((e) => e.code));
    }
  }, [searchCurrValue]);

  useEffect(() => {
    setAdminFilter(
      adminList.filter(
        (admin) =>
          `${getUserName(admin, 2)}`.includes(searchValue.toLowerCase()) ||
          admin.email?.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue, adminList]);

  const form = useForm({
    mode: "controlled",
    initialValues: { id: "", curriculums: [] as string[] },
    validate: {
      curriculums: (value) => !value.length && "Curriculum is required",
    },
    validateInputOnBlur: true,
  });

  const updateUser = async () => {
    if (form.getValues().id) {
      if (form.validate().hasErrors) return;
      const payload: Partial<IModelUser> = {
        role: ROLE.CURRICULUM_ADMIN,
        ...form.getValues(),
      };

      const res = await updateCurrAdmin(payload);
      if (res) {
        const name = res.firstNameEN?.length ? getUserName(res, 1) : res.email;

        setAdminList((prev) =>
          prev.map((admin) =>
            admin.id === form.getValues().id
              ? { ...admin, curriculums: form.getValues().curriculums }
              : admin
          )
        );
        form.reset();
        showNotifications(
          NOTI_TYPE.SUCCESS,
          "Update curriculum successfully",
          `${name} is updated `
        );
      }
    }
  };

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
                  have access to the management system.
                </p>
              }
              icon={<Icon IconComponent={IconExclamationCircle} />}
              classNames={{ icon: "size-6" }}
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
        <Modal.Root
          opened={opened}
          onClose={onClose}
          fullScreen={true}
          size="45vw"
          centered
          transitionProps={{ transition: "pop" }}
          classNames={{
            content:
              "flex flex-col justify-start bg-[#F6F7FA] text-[14px] item-center px-2 pb-2 overflow-hidden max-h-full ",
          }}
        >
          <Modal.Overlay />
          <Modal.Content className="overflow-hidden !rounded-none !px-0">
            <Modal.Header>
              <div className="flex absolute left-12 gap-2">
                <Modal.CloseButton className="ml-0" />
                <p className="font-semibold text-h2 text-secondary">
                  Curriculum Admin Management
                </p>
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className="flex flex-1 flex-col h-full px-28">
                <CompoManageIns
                  opened={opened}
                  type="admin"
                  newFetch={isNewFetch}
                  setNewFetch={setIsNewFetch}
                  setUserList={setAdminList}
                  setUserFilter={setAdminFilter}
                />

                {/* Added Admin */}
                <div className="w-full  flex flex-col bg-white mt-3 border-secondary border-[1px]  rounded-md">
                  <div className=" bg-bgTableHeader flex gap-3 items-center rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold">
                    <Icon IconComponent={IconUsers} /> Added Curriculum Admin
                  </div>
                  {/* Show List Of Admin */}
                  <div className="flex flex-col gap-2 w-full sm:max-macair133:h-[300px] macair133:max-h-[220px] h-full  p-4 py-3  overflow-y-auto">
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
                      {adminFilter.length > 0 ? (
                        adminFilter.map((admin, index) => (
                          <div
                            key={index}
                            className="w-full items-center last:border-none border-b-[1px] justify-between p-3 flex"
                          >
                            <div className="gap-3 flex items-center">
                              <Icon
                                IconComponent={IconUserCicle}
                                className=" size-8 stroke-1 -translate-x-1"
                              />
                              <div className="flex flex-col gap-1">
                                <p className="font-semibold text-[14px] text-tertiary">
                                  {getUserName(admin, 1)}
                                </p>
                                {/* <p className="text-secondary text-[12px] font-normal">
                            {admin.email}
                          </p> */}
                                <div className="flex !flex-nowrap text-secondary flex-row acerSwift:max-macair133:-mt-6 gap-1 font-medium text-b3  acerSwift:max-macair133:!text-b4">
                                  <div className=" font-semibold">
                                    Can access curriculum:
                                  </div>

                                  <div className="flex gap-1 flex-wrap mt-0.5 max-w-[55%]">
                                    {admin.curriculums?.map((cur, indexCur) => (
                                      <p
                                        key={cur}
                                        className="text-secondary text-[12px] font-semibold"
                                      >
                                        {cur}
                                        {indexCur !==
                                        admin.curriculums!.length - 1
                                          ? ","
                                          : ""}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {admin.firstNameEN === user.firstNameEN &&
                            admin.lastNameEN === user.lastNameEN ? (
                              <p className="mr-1 text-secondary text-[14px] font-normal">
                                You
                              </p>
                            ) : (
                              <div className="flex justify-end gap-4 mt-1">
                                <Menu shadow="md" width={200}>
                                  <Menu.Target>
                                    <Button
                                      variant="outline"
                                      className="!h-7 px-3"
                                      onClick={() => {
                                        setSearchCurrValue("");
                                        form.setFieldValue(
                                          "curriculums",
                                          admin.curriculums || []
                                        );
                                        setPrevCurr(admin.curriculums || []);
                                        form.setFieldValue("id", admin.id);
                                      }}
                                    >
                                      Access
                                    </Button>
                                  </Menu.Target>

                                  <Menu.Dropdown className="overflow-y-auto max-h-[350px] !w-[220px] h-fit border-b flex flex-col !py-0 !px-1">
                                    <div className="sticky top-0 bg-white z-10">
                                      <Menu.Label className="translate-x-1 !pt-3">
                                        Can access curriculum
                                      </Menu.Label>
                                      <div className="mb-2 px-3 -mt-1 py-2">
                                        <TextInput
                                          leftSection={<TbSearch />}
                                          placeholder="Curriculum code"
                                          size="xs"
                                          value={searchCurrValue}
                                          onChange={(event: any) =>
                                            setSearchCurrValue(
                                              event.currentTarget.value
                                            )
                                          }
                                          rightSectionPointerEvents="all"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex flex-col px-3 mt-1 pb-3 h-fit gap-4 w-full">
                                      {curriculumFilter.length > 0 ? (
                                        <Checkbox.Group
                                          value={form.getValues().curriculums}
                                          {...form.getInputProps("curriculums")}
                                          onChange={(event) =>
                                            form.setFieldValue(
                                              "curriculums",
                                              event.sort()
                                            )
                                          }
                                        >
                                          <Group>
                                            {curriculumFilter.map(
                                              (curr, index) => (
                                                <Checkbox
                                                  key={index}
                                                  classNames={{
                                                    input:
                                                      "bg-black bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                                                    body: "mr-3",
                                                    label:
                                                      "text-b2 cursor-pointer acerSwift:max-macair133:text-b4",
                                                  }}
                                                  size="xs"
                                                  label={`${curr}`}
                                                  value={curr}
                                                />
                                              )
                                            )}
                                          </Group>
                                        </Checkbox.Group>
                                      ) : (
                                        <div className="text-deemphasize text-b3 font-medium text-center flex flex-col gap-2 items-center">
                                          <div className="bg-bgTableHeader text-primary/70 w-fit rounded-full p-2">
                                            <TbSearch className="size-4" />
                                          </div>
                                          <p>No result</p>{" "}
                                        </div>
                                      )}
                                    </div>
                                    <div className="sticky bottom-0 bg-white z-20 px-3 pt-2 pb-3">
                                      <Button
                                        className="!h-[36px] acerSwift:max-macair133:text-b5 !w-full"
                                        disabled={isEqual(
                                          form.getValues().curriculums,
                                          prevCurr
                                        )}
                                        onClick={updateUser}
                                        loading={loading}
                                      >
                                        Save
                                      </Button>
                                    </div>
                                  </Menu.Dropdown>
                                </Menu>
                                <Button
                                  color="#FF4747"
                                  variant="outline"
                                  className="!h-7 px-3 "
                                  onClick={() => {
                                    setTargetAdminId(admin.id);
                                    setTargetAdminName(
                                      `${admin.firstNameEN} ${admin.lastNameEN}`
                                    );
                                    setOpenMainPopupDelAdmin(true);
                                  }}
                                  loading={loading}
                                >
                                  Remove
                                </Button>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-deemphasize text-b3 font-medium text-center flex flex-col gap-2 items-center py-2">
                          <div className="bg-bgTableHeader text-primary/70 w-fit rounded-full p-2">
                            <TbSearch className="size-4" />
                          </div>
                          <p>No result</p>{" "}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal.Content>
        </Modal.Root>
      )}
    </>
  );
}
