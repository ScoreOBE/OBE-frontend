import { Alert, Button, Modal, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { IModelUser } from "@/models/ModelUser";
import { useAppDispatch, useAppSelector } from "@/store";
import { TbSearch } from "react-icons/tb";
import { NOTI_TYPE, ROLE } from "@/helpers/constants/enum";
import { getUserName } from "@/helpers/functions/function";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { updateAdmin } from "@/services/user/user.service";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconPaperClip from "@/assets/icons/paperClip.svg?react";
import IconBooks from "@/assets/icons/books.svg?react";
import IconPlus2 from "@/assets/icons/plus2.svg?react";
import Icon from "@/components/Icon";
import MainPopup from "@/components/Popup/MainPopup";
import { setLoadingOverlay } from "@/store/loading";

type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalCurriculum({ opened, onClose }: Props) {
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const user = useAppSelector((state) => state.user);
  const curriculum = useAppSelector((state) => state.faculty.curriculum);
  const [searchValue, setSearchValue] = useState("");
  const [adminList, setAdminList] = useState<IModelUser[]>([]);
  const [adminFilter, setAdminFilter] = useState<IModelUser[]>([]);
  const [openAddCurriculum, setOpenAddCurriculum] = useState(false);
  const [openDeleteCurriculum, setOpenDeleteCurriculum] = useState(false);
  const [targetAdminId, setTargetAdminId] = useState("");
  const [targetAdminName, setTargetAdminName] = useState("");

  useEffect(() => {
    if (opened) {
      setSearchValue("");
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
  }, [searchValue, adminList]);

  const addCurriculum = async () => {};
  const deleteCurriculum = async () => {};

  return (
    <>
      <MainPopup
        opened={openAddCurriculum}
        onClose={() => setOpenAddCurriculum(false)}
        action={() => {
          addCurriculum();
          setOpenAddCurriculum(false);
        }}
        type="unsaved"
        labelButtonRight="Add Curriculum"
        title={`Add Curriculum`}
        message={
          <>
            <div className="flex flex-col gap-4 w-[50vw]  ">
              <TextInput
                withAsterisk
                classNames={{
                  input: ` acerSwift:max-macair133:text-b4`,
                  label: "acerSwift:max-macair133:!text-b4 mb-1",
                  description: "acerSwift:max-macair133:text-b5",
                }}
                label="Curriculum Thai Name"
                placeholder="หลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิศวกรรมคอมพิวเตอร์ (2563)"
                size="xs"
              />
              <TextInput
                withAsterisk
                classNames={{
                  input: ` acerSwift:max-macair133:text-b4`,
                  label: "acerSwift:max-macair133:!text-b4 mb-1",
                  description: "acerSwift:max-macair133:text-b5",
                }}
                label="Curriculum English Name"
                placeholder="Bachelor of Engineering Program in Computer Engineering (2563)"
                size="xs"
              />
              <TextInput
                withAsterisk
                classNames={{
                  input: ` acerSwift:max-macair133:text-b4 mb-3`,
                  label: "acerSwift:max-macair133:!text-b4 mb-1",
                  description: "acerSwift:max-macair133:text-b5",
                }}
                label="Code of Curriculum"
                placeholder="CPE-2563"
                size="xs"
              />
            </div>
          </>
        }
      />
      <MainPopup
        opened={openDeleteCurriculum}
        onClose={() => setOpenDeleteCurriculum(false)}
        action={() => {
          deleteCurriculum();
          setOpenDeleteCurriculum(false);
        }}
        type="delete"
        labelButtonRight="Delete Curriculum"
        title={`Delete Curriculum`}
        message={
          <>
            <Alert
              variant="light"
              color="red"
              title={
                <p>
                  This action cannot be undone. After you delete this
                  curriculum, <br /> it will be permanently deleted from
                  ScoreOBE+.
                </p>
              }
              icon={<Icon IconComponent={IconExclamationCircle} />}
              classNames={{ icon: "size-6" }}
            ></Alert>
            <div className="flex flex-col mt-3 gap-2">
              <div className="flex flex-col  ">
                <p className="text-b4 text-[#808080]">Curriculum Thai Name</p>
                <p className="  -translate-y-[2px] text-b1">test</p>
                <p className="text-b4 text-[#808080]">
                  Curriculum English Name
                </p>
                <p className="  -translate-y-[2px] text-b1">test</p>
              </div>
            </div>
          </>
        }
      />
      {!openDeleteCurriculum && !openAddCurriculum && (
        <Modal
          opened={opened}
          onClose={onClose}
          title="Curriculum Management"
          size="65vw"
          centered
          transitionProps={{ transition: "pop" }}
          classNames={{
            content:
              "flex flex-col justify-start bg-[#F6F7FA]  text-[14px] item-center px-2 pb-2 overflow-hidden max-h-fit ",
          }}
        >
          <div className="flex flex-1 flex-col h-full gap-5 -mt-1 ">
            <div className="w-full  flex flex-col bg-white mt-3 border-secondary border-[1px]  rounded-md">
              <div className=" bg-bgTableHeader flex gap-3 items-center rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold">
                <Icon IconComponent={IconBooks} className=" stroke-[1.4px]" />{" "}
                Added Curriculum
              </div>

              <div className="flex flex-col gap-2 w-full sm:max-macair133:h-[300px] macair133:h-[400px] h-[250px] samsungA24:h-[480px]  px-4  overflow-y-auto">
                <TextInput
                  leftSection={<TbSearch />}
                  className="mt-3 "
                  placeholder="Curriculum English or Thai name"
                  size="xs"
                  value={searchValue}
                  onChange={(event: any) =>
                    setSearchValue(event.currentTarget.value)
                  }
                  rightSectionPointerEvents="all"
                />
                {/* List of Admin */}
                <div className="flex flex-col overflow-y-auto p-1">
                  {curriculum?.map((item) => (
                    <div className="w-full items-center last:border-none border-b-[1px] justify-between  px-3 py-4 first:pt-1  flex">
                      <div className="gap-3 flex items-center">
                        <Icon
                          IconComponent={IconPaperClip}
                          className=" size-6 stroke-1 -translate-x-1"
                        />
                        <div className="flex flex-col">
                          <p className="font-semibold text-[14px] text-tertiary">
                            {item.nameTH}
                          </p>
                          <p className="text-secondary text-[12px] font-normal">
                            {item.nameEN}
                          </p>
                        </div>
                      </div>

                      <Button
                        color="red"
                        variant="outline"
                        onClick={() => setOpenDeleteCurriculum(true)}
                        loading={loading}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Button
              onClick={() => setOpenAddCurriculum(true)}
              leftSection={
                <Icon
                  IconComponent={IconPlus2}
                  className="size-5 stroke-[2px]"
                />
              }
              className="!rounded-s-[4px] font-semibold  min-w-fit !h-[36px] !w-full "
            >
              Add Curriculum
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
