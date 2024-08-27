import { Button, Checkbox, Menu, Modal } from "@mantine/core";
import {
  IconUserCircle,
  IconChevronLeft,
  IconUsers,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store";
import {
  getSectionNo,
  getUserName,
  showNotifications,
  sortData,
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
  const [changeMainIns, setChangeMainIns] = useState(false);
  const [editSection, setEditSection] = useState<IModelSectionManagement>();
  const [coInsList, setCoInsList] = useState<any[]>([]);

  useEffect(() => {
    if (opened) {
    } else {
      setChangeMainIns(false);
    }
  }, [opened]);

  const onClickChangeMainIns = (value: string) => {
    console.log(value);
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
      setInstructorOption(updatedInstructorOptions);
      delete inputUser.disabled;
      const updatedSections = data.sections?.map((sec) => {
        const coInsArr = [...(sec.coInstructors ?? []), inputUser];
        sortData(coInsArr, "label", "string");
        inputUser.sections.push(sec.sectionNo);
        inputUser.sections.sort((a: any, b: any) => a - b);
        return { ...sec, coInstructors: [...coInsArr] };
      });
      setCoInsList([inputUser, ...coInsList]);
      data.sections = [...updatedSections!];
    }
    setInputUser({ value: null });
  };

  const removeCoIns = (coIns: any) => {
    const newList = coInsList.filter((e) => e.value !== coIns.value);
    const updatedSections = data.sections?.map((sec) => ({
      ...sec,
      coInstructors: (sec.coInstructors ?? []).filter(
        (p: any) => p.value !== coIns.value
      ),
    }));
    data.sections = [...updatedSections!];
    setCoInsList(newList);
  };

  const editCoInsInSec = (sectionNo: number, checked: boolean, coIns: any) => {
    const updatedSections = data.sections;
    updatedSections?.forEach((sec, index) => {
      const secNo = sec.sectionNo;
      if (sectionNo == secNo) {
        if (checked) {
          coIns.sections.push(secNo);
          coIns.sections.sort((a: any, b: any) => a - b);
          sec.coInstructors?.push({ ...coIns });
        } else {
          coIns.sections = coIns.sections.filter((e: any) => e !== secNo);
          sec.coInstructors?.splice(sec.coInstructors.indexOf(coIns), 1);
        }
        sortData(sec.coInstructors, "label", "string");
      }
      return sec;
    });
    data.sections = [...updatedSections!];
  };

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
            </p>
          </div>
        </div>
      }
      size="45vw"
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        content:
          "flex flex-col justify-start bg-[#F6F7FA] text-[14px] item-center px-2 pb-2 overflow-hidden ",
      }}
    >
      {/* <motion.div
        initial={{ height: !changeMainIns ? "h-fit" : "240px" }}
        animate={{ height: changeMainIns ? "240px" : "h-fit" }} // Adjust height based on state
        transition={{ duration: 0.3 }}
        key={changeMainIns.toString()}
      > */}
      <div
        className={`height-animation ${changeMainIns ? "collaps" : "expand"}`}
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
                  Owner Section {getSectionNo(editSection.sectionNo)}{" "}
                </p>
              </div>
            </div>
            <CompoMangementIns
              opened={changeMainIns}
              change={true}
              mainIns={true}
              currentMainIns={editSection.instructor.id}
              action={(value) => onClickChangeMainIns(value)}
            />
          </div>
        ) : (
          <Tabs color="#5768d5" defaultValue="mainInstructor">
            <Tabs.List>
              <Tabs.Tab value="mainInstructor">Owner section</Tabs.Tab>
              <Tabs.Tab value="coInstructor">Co-Instructor section</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="mainInstructor">
              <div className="flex flex-col max-h-[420px] h-fit overflow-y-scroll p-1">
                {data.sections?.map((sec, index) => (
                  <div
                    key={index}
                    className="w-full items-center last:border-none border-b-[1px] justify-between  p-3  flex"
                  >
                    <div className="gap-3 flex items-center">
                      <IconUserCircle
                        size={32}
                        className=" -translate-x-1 "
                        stroke={1}
                      />
                      <div className="flex flex-col">
                        <p className="font-semibold text-[14px] text-tertiary">
                          {getUserName(sec.instructor, 1)}
                        </p>
                        <p className="text-secondary text-[12px] font-normal">
                          Owner Section {getSectionNo(sec.sectionNo)}{" "}
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
            <Tabs.Panel value="coInstructor">
              <div className="flex flex-col mt-3 flex-1 ">
                <CompoMangementIns
                  opened={opened}
                  isManage={true}
                  action={addCoIns}
                  sections={data.sections}
                  setUserList={setCoInsList}
                />

                {!!coInsList.length && (
                  <div className="w-full flex flex-col bg-white border-secondary border-[1px]  rounded-md">
                    <div className="bg-[#e6e9ff] flex gap-3 h-fit font-semibold items-center rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary ">
                      <IconUsers /> Added Co-Instructor
                    </div>
                    <div className="flex flex-col max-h-[300px] h-fit w-full   px-2   overflow-y-auto ">
                      <div className="flex flex-col max-h-[400px] h-fit p-1 ">
                        {coInsList.map((coIns, index) => (
                          <div
                            key={index}
                            className="w-full h-fit p-3 gap-4 flex flex-col border-b-[1px] border-[#c9c9c9] last:border-none "
                          >
                            <div className="flex w-full justify-between items-center">
                              <div className="flex flex-col  font-medium text-[14px]">
                                <span className="text-[#333333] -translate-y-1 font-semibold text-[13px]">
                                  {coIns?.label}
                                </span>
                              </div>
                              <div className="flex justify-end gap-4 mt-1 ">
                                <Menu shadow="md" width={200}>
                                  <Menu.Target>
                                    <Button
                                      variant="outline"
                                      color="#5768d5"
                                      size="xs"
                                      className=" transform-none text-[12px] h-7 px-3 rounded-[6px]"
                                    >
                                      Access
                                    </Button>
                                  </Menu.Target>

                                  <Menu.Dropdown className=" overflow-y-auto max-h-[220px] !w-[220px] h-fit border-b ">
                                    <Menu.Label className=" translate-x-1 mb-2">
                                      Can access
                                    </Menu.Label>
                                    <div className="flex flex-col pl-3  pb-2 h-fit gap-4 w-full">
                                      {data.sections?.map((sec, index) => (
                                        <Checkbox
                                          disabled={
                                            coIns?.sections?.length == 1 &&
                                            coIns?.sections?.includes(
                                              sec.sectionNo
                                            )
                                          }
                                          key={index}
                                          classNames={{
                                            input:
                                              "bg-black bg-opacity-0  border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                                            body: "mr-3",
                                            label: "text-[14px] cursor-pointer",
                                          }}
                                          color="#5768D5"
                                          size="xs"
                                          label={`Section ${getSectionNo(
                                            sec.sectionNo
                                          )}`}
                                          checked={coIns?.sections?.includes(
                                            sec.sectionNo
                                          )}
                                          onChange={(event) =>
                                            editCoInsInSec(
                                              sec.sectionNo,
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
                                  className="text-[12px] transform-none h-7 px-3 rounded-[6px]"
                                  size="xs"
                                  variant="outline"
                                  color="#FF4747"
                                  onClick={() => removeCoIns(coIns)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                            <div className="flex text-secondary flex-row -mt-5 gap-1 font-medium text-[13px]">
                              <div className=" font-semibold">Section:</div>
                              <div className="flex gap-1  w-[60%]  flex-wrap">
                                {coIns?.sections?.map(
                                  (sectionNo: any, index: number) => (
                                    <p key={index}>
                                      {getSectionNo(sectionNo)}
                                      {index !== coIns?.sections?.length - 1 &&
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
            </Tabs.Panel>
          </Tabs>
        )}
      </div>
      {/* </motion.div> */}
    </Modal>
  );
}
