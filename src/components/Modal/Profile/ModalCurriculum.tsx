import {
  Alert,
  Button,
  FocusTrapInitialFocus,
  Modal,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { TbSearch } from "react-icons/tb";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconPaperClip from "@/assets/icons/paperClip.svg?react";
import IconBooks from "@/assets/icons/books.svg?react";
import IconPlus2 from "@/assets/icons/plus2.svg?react";
import Icon from "@/components/Icon";
import MainPopup from "@/components/Popup/MainPopup";
import IconTrash from "@/assets/icons/trash.svg?react";
import IconEdit from "@/assets/icons/edit.svg?react";
import { useForm } from "@mantine/form";
import { IModelCurriculum } from "@/models/ModelFaculty";
import { validateTextInput } from "@/helpers/functions/validation";
import {
  createCurriculum,
  deleteCurriculum,
  getFaculty,
  updateCurriculum,
} from "@/services/faculty/faculty.service";
import { setFaculty, updateCurriculumList } from "@/store/faculty";
import { isEqual } from "lodash";

type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalCurriculum({ opened, onClose }: Props) {
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const user = useAppSelector((state) => state.user);
  const faculty = useAppSelector((state) => state.faculty);
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [curriculumFilter, setCurriculumFilter] = useState<IModelCurriculum[]>(
    []
  );
  const [openAddCurriculum, setOpenAddCurriculum] = useState(false);
  const [openDeleteCurriculum, setOpenDeleteCurriculum] = useState(false);
  const [isEditCurriculum, setIsEditCurriculum] = useState(false);
  const [selectCurriculum, setSelectCurriculum] = useState<
    Partial<IModelCurriculum>
  >({});

  const form = useForm({
    mode: "controlled",
    initialValues: {
      nameTH: "",
      nameEN: "",
      code: "",
    } as IModelCurriculum,
    validate: {
      nameTH: (value) =>
        validateTextInput(value, "Curriculum Thai Name", 250, false),
      nameEN: (value) =>
        validateTextInput(value, "Curriculum English Name", 250, false),
      code: (value) =>
        validateTextInput(value, "Code of Curriculum", 20, false),
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    if (opened) {
      fetchCur();
      setSearchValue("");
    }
  }, [opened]);

  useEffect(() => {
    if (faculty.curriculum) {
      setCurriculumFilter(
        faculty.curriculum.filter(
          (cur) =>
            cur.nameTH.includes(searchValue) ||
            cur.nameEN.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
  }, [searchValue, faculty]);

  const fetchCur = async () => {
    const res = await getFaculty(user.facultyCode);
    if (res) {
      setCurriculumFilter(res.curriculum);
      dispatch(setFaculty({ ...res }));
    }
  };

  const addCurriculum = async () => {
    if (!form.validate().hasErrors) {
      const res = await createCurriculum(faculty.id, form.getValues());
      if (res) {
        dispatch(updateCurriculumList(res.curriculum));
        showNotifications(
          NOTI_TYPE.SUCCESS,
          "Curriculum Added Successfully",
          `${form.getValues().code} has been successfully added.`
        );
        setOpenAddCurriculum(false);
        form.reset();
      }
    }
  };

  const editCurriculum = async () => {
    if (!form.validate().hasErrors) {
      const res = await updateCurriculum(
        faculty.id,
        selectCurriculum.code!,
        form.getValues()
      );
      if (res) {
        dispatch(updateCurriculumList(res.curriculum));
        showNotifications(
          NOTI_TYPE.SUCCESS,
          `Curriculum ${form.getValues().code} Edited Successfully`,
          `${form.getValues().code} has been successfully updated.`
        );
        setOpenAddCurriculum(false);
        setSelectCurriculum({});
        form.reset();
      }
    }
  };

  const removeCurriculum = async () => {
    const res = await deleteCurriculum(faculty.id, selectCurriculum.code!);
    if (res) {
      dispatch(updateCurriculumList(res.curriculum));
      showNotifications(
        NOTI_TYPE.SUCCESS,
        `Curriculum ${form.getValues().code} Deleted Successfully`,
        `${form.getValues().code} has been successfully removed.`
      );
      setOpenDeleteCurriculum(false);
      setSelectCurriculum({});
    }
  };

  const closeModalAddEdit = () => {
    setOpenAddCurriculum(false);
    setIsEditCurriculum(false);
    form.reset();
  };

  return (
    <>
      <Modal
        opened={openAddCurriculum}
        onClose={closeModalAddEdit}
        closeOnClickOutside={false}
        title={`${isEditCurriculum ? "Edit" : "Add"} Curriculum`}
        size="50vw"
        centered
        transitionProps={{ transition: "pop" }}
        classNames={{
          title: "",
          content:
            "flex flex-col justify-start font-medium leading-[24px] text-[14px] item-center  overflow-hidden ",
        }}
      >
        <FocusTrapInitialFocus />
        <div className="flex flex-col gap-4">
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
            {...form.getInputProps("nameTH")}
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
            {...form.getInputProps("nameEN")}
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
            {...form.getInputProps("code")}
          />
          <div className="flex gap-2 justify-end">
            <Button
              onClick={closeModalAddEdit}
              variant="subtle"
              loading={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={isEditCurriculum ? editCurriculum : addCurriculum}
              loading={loading}
              disabled={
                isEditCurriculum && isEqual(selectCurriculum, form.getValues())
              }
            >
              {isEditCurriculum ? "Edit" : "Add"} Curriculum
            </Button>
          </div>
        </div>
      </Modal>
      <MainPopup
        opened={openDeleteCurriculum}
        onClose={() => setOpenDeleteCurriculum(false)}
        action={() => removeCurriculum()}
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
                <p className="  -translate-y-[2px] text-b2">
                  {selectCurriculum.nameTH}
                </p>
                <p className="text-b4 text-[#808080]">
                  Curriculum English Name
                </p>
                <p className="  -translate-y-[2px] text-b2">
                  {selectCurriculum.nameEN}
                </p>
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
          size="70vw"
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
                <div className="flex flex-col overflow-y-auto p-1">
                  {curriculumFilter?.map((item) => (
                    <div
                      key={item.code}
                      className="w-full items-center last:border-none border-b-[1px] justify-between px-3 py-4 first:pt-1  flex"
                    >
                      <div className="gap-3 flex items-center w-[85%]">
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

                      <div className="flex flex-row gap-3">
                        <Button
                          color="#f39d4e"
                          variant="outline"
                          // className="!text-edit border-edit  hover:bg-[#F39D4E]/10"
                          onClick={() => {
                            setSelectCurriculum({
                              nameTH: item.nameTH,
                              nameEN: item.nameEN,
                              code: item.code,
                            });
                            form.setFieldValue("nameTH", item.nameTH);
                            form.setFieldValue("nameEN", item.nameEN);
                            form.setFieldValue("code", item.code);
                            setOpenAddCurriculum(true);
                            setIsEditCurriculum(true);
                          }}
                          loading={loading}
                          disabled={item.disable}
                        >
                          {/* <Icon
                            IconComponent={IconEdit}
                            className="size-4 stroke-2"
                          /> */}
                          Edit
                        </Button>
                        <Button
                          color="red"
                          variant="outline"
                          onClick={() => {
                            setSelectCurriculum(item);
                            setOpenDeleteCurriculum(true);
                          }}
                          loading={loading}
                          disabled={item.disable}
                        >
                          {/* <Icon
                            IconComponent={IconTrash}
                            className="size-4 stroke-2"
                          /> */}
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                setOpenAddCurriculum(true);
                setIsEditCurriculum(false);
              }}
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
