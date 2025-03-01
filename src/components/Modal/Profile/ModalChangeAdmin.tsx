import { Alert, Button, Modal, MultiSelect, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import { IModelUser } from "@/models/ModelUser";
import { getInstructor, updateAdmin } from "@/services/user/user.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { NOTI_TYPE, ROLE } from "@/helpers/constants/enum";
import { setUser } from "@/store/user";
import { getUserName } from "@/helpers/functions/function";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { isEqual } from "lodash";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/Icon";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconUserCicle from "@/assets/icons/userCircle.svg?react";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import { setLoadingOverlay } from "@/store/loading";
import { useForm } from "@mantine/form";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function ModalChangeAdmin({ opened, onClose }: Props) {
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const user = useAppSelector((state) => state.user);
  const curriculum = useAppSelector((state) => state.faculty.curriculum);
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [adminList, setAdminList] = useState<any[]>([]);
  const [adminFilter, setAdminFilter] = useState<IModelUser[]>([]);
  const [openSetSAdminModal, setOpenSetSAdminModal] = useState(false);
  const [admin, setAdmin] = useState<Partial<IModelUser>>({});
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
        if (e.id !== user.id && e.role === ROLE.CURRICULUM_ADMIN) {
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

  const form = useForm({
    mode: "controlled",
    initialValues: { curriculums: [] as string[] },
    validate: {
      curriculums: (value) => !value.length && "Curriculum is required",
    },
    validateInputOnBlur: true,
  });

  const editAdmin = async (id: string) => {
    dispatch(setLoadingOverlay(true));
    const res = await updateAdmin({
      id,
      curriculums: form.getValues().curriculums,
    });
    dispatch(setLoadingOverlay(false));
    if (res) {
      const name = res.newAdmin.firstNameEN?.length
        ? getUserName(res.newAdmin, 1)
        : res.newAdmin.email;
      dispatch(setUser(res.user));
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Admin Changed Successfully",
        `${name} is an admin.`
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
        title="Admin Management"
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
          icon={
            <Icon IconComponent={IconExclamationCircle} className="size-6" />
          }
          variant="light"
          color="red"
          className="mb-2"
          classNames={{
            body: " flex justify-center",
          }}
          title={
            <p>
              Changing the Admin
              <span className=" font-extrabold underline">
                {" "}
                will revoke{" "}
              </span>{" "}
              your current role
            </p>
          }
        ></Alert>
        <Alert
          radius="md"
          icon={<Icon IconComponent={IconInfo2} className="size-6" />}
          variant="light"
          color="blue"
          className="mb-4"
          classNames={{
            body: " flex justify-center",
          }}
          title={
            <p>
              You can only change the Admin who currently holds a curriculum
              admin role.
            </p>
          }
        ></Alert>
        <div
          className=" max-h-[500px] sm:max-macair133:max-h-[320px]  flex flex-col bg-white border-secondary border-[1px]  rounded-md"
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

            {/* List of Curriculum Admin */}
            <div className="flex flex-1 flex-col gap-2 sm:max-macair133:h-[300px] macair133:h-[400px] h-[250px] overflow-y-auto">
              {adminFilter.length > 0 ? (
                adminFilter.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex flex-1 items-center justify-between last:border-none border-b-[1px]  p-3 "
                  >
                    <div className="gap-3 flex items-center">
                      <Icon
                        IconComponent={IconUserCicle}
                        className=" size-8 stoke-1"
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
                    <Button
                      variant="outline"
                      onClick={() => {
                        setAdmin(admin);
                        onClose();
                        setOpenSetSAdminModal(true);
                      }}
                    >
                      Change
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-deemphasize text-b3 font-medium text-center flex flex-col gap-2 items-center pt-2">
                  <div className="bg-bgTableHeader text-primary/70 w-fit rounded-full p-2">
                    <TbSearch className="size-4" />
                  </div>
                  <p>No result</p>{" "}
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        opened={openSetSAdminModal}
        closeOnClickOutside={false}
        size="50vw"
        title="Change Admin"
        transitionProps={{ transition: "pop" }}
        centered
        onClose={() => setOpenSetSAdminModal(false)}
      >
        <Alert
          variant="light"
          color="red"
          title={`After you change your role, it will automatically be updated from Admin to Curriculum Admin.`}
          icon={<Icon IconComponent={IconInfo2} className="size-6" />}
          className="mb-5"
        ></Alert>
        <div className="px-4 pt-3 pb-4 rounded-md bg-gray-100 mb-4">
        <MultiSelect
          label="Select the curriculums you want to access as a Curriculum Admin."
          size="xs"
          placeholder="Select curriculum"
          searchable
          clearable
          nothingFoundMessage="No result"
          data={[
            ...(curriculum?.map((item) => ({
              value: item.code,
              label: `${item.nameTH} [${item.code}]`,
            })) || []),
          ]}
          classNames={{
            input: "focus:border-primary acerSwift:max-macair133:!text-b5",
            label: "text-[13px]",
          }}
          {...form.getInputProps("curriculums")}
        />
        </div>
      
        <TextInput
          label={`To confirm, type "${admin?.firstNameEN}${admin?.lastNameEN}"`}
          value={textActivate}
          classNames={{ label: "select-none" }}
          onChange={(event) => setTextActivate(event.target.value)}
        ></TextInput>
        <Button
          disabled={
            !isEqual(
              `${admin?.firstNameEN}${admin?.lastNameEN}`,
              textActivate
            ) || !form.getValues().curriculums.length
          }
          onClick={() => editAdmin(admin.id!)}
          loading={loading}
          className="mt-4 bg-delete hover:bg-[#e83f3f] font-bold min-w-fit !h-[36px] !w-full"
        >
          Change Admin, Log Out
        </Button>
      </Modal>
    </>
  );
}
