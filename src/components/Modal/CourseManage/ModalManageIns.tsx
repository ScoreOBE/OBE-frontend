import { Alert, Button, Checkbox, Menu, Modal } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import store, { useAppDispatch, useAppSelector } from "@/store";
import {
  getSectionNo,
  getUserName,
  sortData,
} from "@/helpers/functions/function";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { Tabs } from "@mantine/core";
import { IModelCourseManagement } from "@/models/ModelCourseManagement";
import CompoManageIns from "@/components/CompoManageIns";
import Icon from "@/components/Icon";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import IconUserCicle from "@/assets/icons/userCircle.svg?react";
import IconChevronLeft from "@/assets/icons/chevronLeft.svg?react";
import IconUsers from "@/assets/icons/users.svg?react";
import {
  getOneCourseManagement,
  updateCoInsSections,
  updateSectionManagement,
} from "@/services/courseManagement/courseManagement.service";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import { IModelSection } from "@/models/ModelCourse";
import { IModelUser } from "@/models/ModelUser";
import {
  editCourseManagement,
  editSectionManagement,
} from "@/store/courseManagement";
import { cloneDeep, isEqual } from "lodash";
import { editCourse, updateSections } from "@/store/course";
import { setLoadingOverlay } from "@/store/loading";

type actionType = "course" | "courseManagement";

type Props = {
  opened: boolean;
  onClose: () => void;
  type?: actionType;
  data: Partial<IModelCourseManagement>;
  setNewData?: React.Dispatch<React.SetStateAction<any>>;
};
export default function ModalManageIns({
  opened,
  onClose,
  type = "courseManagement",
  data = {},
  setNewData = () => {},
}: Props) {
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const dispatch = useAppDispatch();
  const [changeMainIns, setChangeMainIns] = useState(false);
  const [editSec, setEditSec] = useState<
    Partial<IModelSection> & Record<string, any>
  >();
  const [coInsList, setCoInsList] = useState<any[]>();
  const [editCoSec, setEditCoSec] = useState<any[]>([]);
  const [editCoInsList, setEditCoInsList] = useState<any[]>();
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);

  useEffect(() => {
    if (opened) {
      setContentHeight(null);
      setCoInsList(undefined);
      setEditCoInsList(undefined);
      setEditSec(undefined);
      setEditCoSec(data.sections!);
      setChangeMainIns(false);
    }
  }, [opened]);

  useEffect(() => {
    if (opened && !coInsList && data.sections?.length && editCoInsList) {
      setCoInsList(cloneDeep(editCoInsList));
    }
  }, [editCoInsList]);

  const onClickChangeMainIns = async (value: any) => {
    let payload: any = {
      ...editSec,
      year: academicYear.year,
      semester: academicYear.semester,
      data: { ...editSec?.data, instructor: value.value },
    };
    const id = payload.id;
    const secId = payload.secId;
    delete payload.id;
    const res = await updateSectionManagement(id, secId, payload);
    if (res) {
      setChangeMainIns(false);
      setEditSec(undefined);
      setNewData({
        ...data,
        sections: data.sections?.map((sec) => {
          let instructor = sec.instructor;
          if (sec.id == editSec?.secId) {
            instructor = res.updateSection.instructor;
          }
          return { ...sec, instructor };
        }),
      });
      dispatch(
        editSectionManagement({
          id,
          secId,
          data: { instructor: res.updateSection.instructor },
        })
      );
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Instrcutor Updated Successfully",
        `${value.label} is a instructor ${getSectionNo(
          editSec?.data.sectionNo
        )}.`
      );
    }
  };

  const onClickSave = async () => {
    dispatch(setLoadingOverlay(true));
    const payload = editCoSec.map((sec) => {
      return {
        sectionNo: sec.sectionNo,
        coInstructors: sec.coInstructors.map(
          (coIns: any) => coIns.id ?? coIns.value
        ),
      };
    });
    const res = await updateCoInsSections({
      year: academicYear.year,
      semester: academicYear.semester,
      courseNo: data.courseNo,
      data: payload,
      actionType: type,
    });
    if (res) {
      if (type == "courseManagement") {
        const resOne = await getOneCourseManagement({
          courseNo: data.courseNo!,
        });
        if (resOne) {
          dispatch(editCourseManagement(resOne));
        }
        dispatch(
          editCourse({
            id: res.courseId,
            ...res,
          })
        );
      }
      if (res.course)
        dispatch(
          updateSections({ id: res.course.id, sections: res.course.sections })
        );
      setCoInsList(cloneDeep(editCoInsList));
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Co-Instructor Updated Successfull",
        `Co-Instructor for ${data.courseNo} has been successfully updated`
      );
      if (type == "course") onClose();
    }
    dispatch(setLoadingOverlay(false));
  };

  const addCoIns = (
    {
      inputUser,
      instructorOption,
    }: { inputUser: any; instructorOption: any[] },
    {
      setInputUser,
      setInstructorOption,
    }: {
      setInputUser: React.Dispatch<React.SetStateAction<any>>;
      setInstructorOption: React.Dispatch<React.SetStateAction<any[]>>;
    }
  ) => {
    if (inputUser?.value) {
      inputUser.sections = [];
      const updatedInstructorOptions = instructorOption.map((option: any) =>
        option?.value == inputUser.value
          ? { ...option, disabled: true }
          : option
      );
      delete inputUser.disabled;
      const updatedSections = editCoSec?.map((sec) => {
        const coInsArr = [...(sec.coInstructors ?? [])];
        if (sec.instructor.id != inputUser.value) {
          inputUser.sections.push(sec.sectionNo);
          inputUser.sections.sort((a: any, b: any) => a - b);
          coInsArr.push({ ...inputUser });
        }
        sortData(coInsArr, "label", "string");
        return { ...sec, coInstructors: [...coInsArr] };
      });
      setEditCoInsList([inputUser, ...editCoInsList!]);
      setEditCoSec([...updatedSections!]);
      setInstructorOption(updatedInstructorOptions);
    }
    setInputUser({ value: null });
  };

  const removeCoIns = (coIns: any) => {
    const newList = editCoInsList?.filter(
      (e) => (e.id ?? e.value) !== coIns.value
    );
    const updatedSections = editCoSec?.map((sec) => ({
      ...sec,
      coInstructors: (sec.coInstructors ?? []).filter(
        (p: any) => (p.id ?? p.value) !== coIns.value
      ),
    }));
    setEditCoSec([...updatedSections!]);
    setEditCoInsList(newList);
  };

  const editCoInsInSec = (sectionNo: number, checked: boolean, coIns: any) => {
    const updatedSections = editCoSec.map((sec, index) => {
      if (sectionNo == sec.sectionNo) {
        let updatedCoInstructors = sec.coInstructors
          ? [...sec.coInstructors]
          : [];
        if (checked) {
          if (!coIns.sections.includes(sec.sectionNo)) {
            coIns.sections = [...coIns.sections, sec.sectionNo].sort(
              (a: any, b: any) => a - b
            );
          }
          updatedCoInstructors.push({ ...coIns });
        } else {
          coIns.sections = coIns.sections.filter(
            (e: any) => e !== sec.sectionNo
          );
          updatedCoInstructors = updatedCoInstructors.filter(
            (p: any) => (p.id ?? p.value) !== coIns.value
          );
        }
        sortData(updatedCoInstructors, "label", "string");
        return { ...sec, coInstructors: updatedCoInstructors };
      }
      return sec;
    });
    setEditCoSec(updatedSections);
  };

  useEffect(() => {
    if (
      contentRef.current &&
      contentRef.current.offsetHeight !== contentHeight
    ) {
      const maxHeight =
        window.innerHeight * 0.7 < contentRef.current.offsetHeight
          ? window.innerHeight * 0.7
          : contentRef.current.offsetHeight;
      setContentHeight(maxHeight);
    }
  }, [contentRef, opened, type, data, editCoInsList]);

  const ManageCoInstructor = () => {
    return (
      <div
        ref={contentRef}
        className={`flex flex-col pb-2 max-h-full ${
          type == "courseManagement" && "mt-3"
        }`}
      >
        <div
          className={`flex flex-col px-5 pb-1 gap-3 overflow-y-auto`}
          style={{
            maxHeight: contentHeight ? `${contentHeight}px` : "auto",
          }}
        >
          {type == "courseManagement" ||
            (data?.sections?.find(
              (sec: any) =>
                (sec.instructor as IModelUser).id == store.getState().user.id
            ) && (
              <div>
                <Alert
                  radius="md"
                  icon={
                    <Icon
                      IconComponent={IconUserCicle}
                      className="stroke-2  acerSwift:max-macair133:size-6"
                    />
                  }
                  variant="light"
                  color="orange"
                  classNames={{
                    icon: "size-6",
                    body: "flex justify-center",
                    root: "border border-amber-200 rounded-xl",
                  }}
                  title={
                    <p className=" acerSwift:max-macair133:!text-b3">
                      Co-instructors added through this modal will only have
                      access to the course for the current semester. They will
                      not automatically gain access to future semesters or years
                      if the course is repeated.
                    </p>
                  }
                ></Alert>
              </div>
            ))}
          {type != "courseManagement" &&
          !data?.sections?.find(
            (sec: any) =>
              (sec.instructor as IModelUser).id == store.getState().user.id
          ) ? (
            <div className="h-full">
              <Alert
                radius="md"
                icon={<Icon IconComponent={IconInfo2} />}
                variant="light"
                color="blue"
                className="mb-2"
                classNames={{
                  icon: "size-6",
                  body: " flex justify-center",
                  root: "bg-blue-50 border border-blue-100 rounded-xl text-blue-700",
                }}
                title={
                  <p className=" acerSwift:max-macair133:!text-b3  text-blue-700">
                    You don't have permission to manage co-instructors in this
                    course. <br /> Please contact to the instructor for manage.
                  </p>
                }
              ></Alert>
              <Button
                className="mt-1 min-w-fit !h-[36px] !text-b2  acerSwift:max-macair133:!text-b5 !w-full"
                onClick={onClose}
              >
                I understood
              </Button>
            </div>
          ) : (
            <div>
              <Alert
                radius="md"
                icon={<Icon IconComponent={IconInfo2} />}
                variant="light"
                color="blue"
                classNames={{
                  icon: "size-6",
                  body: " flex justify-center",
                  root: "bg-blue-50 border border-blue-100 rounded-xl text-blue-700",
                }}
                className="mb-4"
                title={
                  <p className="acerSwift:max-macair133:!text-b3 text-blue-700">
                    Co-instructors can only access and import scores for your
                    selected sections and manage the course TQF documents.
                  </p>
                }
              ></Alert>
              <CompoManageIns
                opened={opened}
                type={type == "course" ? "manageCoSec" : "manageCo"}
                action={addCoIns}
                sections={editCoSec}
                setUserList={
                  setEditCoInsList as React.Dispatch<
                    React.SetStateAction<any[]>
                  >
                }
              />
            </div>
          )}
          {!!editCoInsList?.length && (
            <div className="w-full flex flex-col bg-white border-secondary border-[1px] rounded-md">
              <div className="bg-bgTableHeader flex gap-3  acerSwift:max-macair133:!text-b3 h-fit font-semibold items-center rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary ">
                <Icon IconComponent={IconUsers} /> Added Co-Instructor
              </div>
              <div className="flex flex-col h-fit w-full px-2">
                <div className="flex flex-col h-fit p-1 ">
                  {editCoInsList.map((coIns, index) => (
                    <div
                      key={index}
                      className="w-full h-fit p-3 gap-4 flex flex-col border-b-[1px] border-[#c9c9c9] last:border-none "
                    >
                      <div className="flex w-full justify-between items-center">
                        <div className="flex flex-col  font-medium text-b2  acerSwift:max-macair133:!text-b3">
                          <span className=" -translate-y-1 font-semibold text-b3  acerSwift:max-macair133:!text-b4">
                            {coIns?.label}
                          </span>
                        </div>
                        <div className="flex justify-end gap-4 mt-1">
                          <Menu shadow="md" width={200}>
                            <Menu.Target>
                              <Button
                                variant="outline"
                                className="!h-7 px-3 acerSwift:max-macair133:!text-b5"
                              >
                                Access
                              </Button>
                            </Menu.Target>

                            <Menu.Dropdown className="overflow-y-auto max-h-[220px] !w-[220px] h-fit border-b ">
                              <Menu.Label className="translate-x-1 mb-2">
                                Can access
                              </Menu.Label>
                              <div className="flex flex-col pl-3  pb-2 h-fit gap-4 w-full">
                                {data.sections?.map((sec, indexSec) => (
                                  <Checkbox
                                    key={indexSec}
                                    disabled={
                                      coIns.value == sec.instructor?.id ||
                                      (coIns?.sections?.length == 1 &&
                                        coIns?.sections?.includes(
                                          sec.sectionNo
                                        ))
                                    }
                                    classNames={{
                                      body: "mr-3",
                                      input:
                                        "bg-black bg-opacity-0 border-[1.5px] border-tertiary disabled:bg-gray-400",
                                      label:
                                        "text-b2  acerSwift:max-macair133:!text-b4",
                                    }}
                                    size="xs"
                                    label={`Section ${getSectionNo(
                                      sec.sectionNo
                                    )}`}
                                    checked={coIns?.sections?.includes(
                                      sec.sectionNo
                                    )}
                                    onChange={(event) =>
                                      editCoInsInSec(
                                        sec.sectionNo!,
                                        event.currentTarget.checked,
                                        coIns
                                      )
                                    }
                                  />
                                ))}
                              </div>
                            </Menu.Dropdown>
                          </Menu>
                          <Button
                            color="red"
                            variant="outline"
                            className="!h-7 px-3 acerSwift:max-macair133:!text-b5"
                            onClick={() => removeCoIns(coIns)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                      <div className="flex text-secondary flex-row -mt-5 acerSwift:max-macair133:-mt-6 gap-1 font-medium text-b3  acerSwift:max-macair133:!text-b4">
                        <div className=" font-semibold">
                          Can access section:
                        </div>
                        <div className="flex gap-1  w-[50%]  flex-wrap">
                          {coIns?.sections?.map(
                            (sectionNo: any, indexSec: number) => (
                              <p key={indexSec}>
                                {getSectionNo(sectionNo)}
                                {indexSec !== coIns?.sections?.length - 1 &&
                                  ","}
                              </p>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className=" ">
          {(type == "courseManagement" ||
            data?.sections?.find(
              (sec: any) =>
                (sec.instructor as IModelUser).id === store.getState().user.id
            )) && (
            <Button
              className="!h-[36px] acerSwift:max-macair133:text-b5 mt-4 !w-full"
              onClick={onClickSave}
              disabled={isEqual(coInsList, editCoInsList)}
              loading={loading}
            >
              {type === "course" ? "Save Changes" : "Save"}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        type == "course" ? (
          "Co-Instructor Management"
        ) : (
          <div className="flex gap-2 items-center">
            {changeMainIns && (
              <Icon
                IconComponent={IconChevronLeft}
                className="hover:bg-[#f0f0f0] size-6 -translate-x-2 rounded-full"
                onClick={() => setChangeMainIns(false)}
              />
            )}
            <div className="flex flex-col gap-2">
              <p>Instructor Management</p>
              <p className="text-b4  acerSwift:max-macair133:!text-b3 font-medium text-[#575757]">
                {data.courseNo} {data.courseName}
              </p>
            </div>
          </div>
        )
      }
      size="50vw"
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        title: "acerSwift:max-macair133:!text-b1 acerSwift:max-macair133:-mt-2",
        close: "acerSwift:max-macair133:-mt-2",
        content:
          "flex flex-col max-h-fit justify-start bg-[#F6F7FA] text-b2 acerSwift:max-macair133:!text-b3 item-center overflow-hidden max-w-[40vw] max-w-[50vw]",
        body: "!px-0 !pb-0",
      }}
    >
      {changeMainIns && editSec ? (
        <div className="flex flex-col px-4 pb-2 gap-2">
          <div
            className="w-full items-center rounded-md justify-start gap-3 mt-2  px-6 py-3  flex"
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <Icon
              IconComponent={IconUserCicle}
              className=" size-8 -translate-x-1"
            />
            <div className="flex flex-col">
              <p className="font-semibold text-b2  acerSwift:max-macair133:!text-b3 text-tertiary">
                {getUserName(editSec?.instructor as IModelUser, 1)}
              </p>
              <p className="text-secondary text-[12px] font-normal">
                Instructor {getSectionNo(editSec.data.sectionNo)}{" "}
              </p>
            </div>
          </div>
          <CompoManageIns
            opened={changeMainIns}
            type="changeMain"
            currentMainIns={(editSec.instructor as IModelUser)?.id}
            action={(value) => onClickChangeMainIns(value)}
          />
        </div>
      ) : type == "course" ? (
        ManageCoInstructor()
      ) : (
        <Tabs defaultValue="mainInstructor" className="px-4 pb-2">
          <Tabs.List>
            <Tabs.Tab value="mainInstructor">Instructor</Tabs.Tab>
            <Tabs.Tab value="coInstructor">Co-Instructor</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="mainInstructor">
            <div className="flex flex-col max-h-[420px] h-fit overflow-y-scroll p-1">
              {data.sections?.map((sec, index) => (
                <div
                  key={index}
                  className="w-full items-center last:border-none border-b-[1px] justify-between p-3 flex"
                >
                  <div className="gap-3 flex items-center">
                    <Icon
                      IconComponent={IconUserCicle}
                      className="size-8 -translate-x-1"
                    />
                    <div className="flex flex-col">
                      <p className="font-semibold text-b2  acerSwift:max-macair133:!text-b3 text-tertiary">
                        {getUserName(sec.instructor, 1)}
                      </p>
                      <p className="text-secondary text-[12px] font-normal">
                        Instructor {getSectionNo(sec.sectionNo)}{" "}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditSec({
                        id: data.id,
                        courseNo: data.courseNo,
                        secId: sec.id,
                        instructor: sec.instructor,
                        data: {
                          sectionNo: sec.sectionNo,
                        },
                      });
                      setChangeMainIns(true);
                    }}
                  >
                    Change
                  </Button>
                </div>
              ))}
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="coInstructor">{ManageCoInstructor()}</Tabs.Panel>
        </Tabs>
      )}
      {/* </div> */}
      {/* </motion.div> */}
    </Modal>
  );
}
