import { useEffect, useState } from "react";
import {
  Stepper,
  Button,
  Group,
  Modal,
  TextInput,
  Checkbox,
  TagsInput,
  List,
  Menu,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconCircleFilled,
  IconArrowRight,
  IconUsers,
} from "@tabler/icons-react";
import { COURSE_TYPE, NOTI_TYPE } from "@/helpers/constants/enum";
import { SEMESTER } from "@/helpers/constants/enum";
import { useAppSelector } from "@/store";
import {
  validateCourseNameorTopic,
  validateSectionNo,
} from "@/helpers/functions/validation";
import {
  getSectionNo,
  getUserName,
  showNotifications,
  sortData,
} from "@/helpers/functions/function";
import CompoMangementIns from "../CompoManageIns";
import { IModelSection } from "@/models/ModelSection";
import { IModelCourse } from "@/models/ModelCourse";

type Props = {
  opened: boolean;
  onClose: () => void;
  data: Partial<IModelCourse>;
};
export default function ModalAddSection({ opened, onClose, data = {} }: Props) {
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [sectionNoList, setSectionNoList] = useState<string[]>([]);
  const [coInsList, setCoInsList] = useState<any[]>([]);
  const [firstInput, setFirstInput] = useState(true);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: [{}] as Partial<IModelSection>[],
    validate: [
      {
        topic: (value) => validateCourseNameorTopic(value, "Topic"),
        sectionNo: (value) => validateSectionNo(value),
        semester: (value) => {
          return value?.length ? null : "Please select semester at least one.";
        },
      },
    ],
    validateInputOnBlur: true,
  });

  const nextStep = async () => {
    setLoading(true);
    setFirstInput(false);
    let isValid = true;
    // const length = form.getValues().length || 0;
    // switch (active) {
    //   case 0:
    //     for (let i = 0; i < length; i++) {
    //       isValid = !form.validateField(`${i}.sectionNo`).hasError;
    //       if (!isValid) break;
    //     }
    //     form.validateField("0.topic");
    //     isValid =
    //       isValid &&
    //       (!form.validateField("0.topic").hasError ||
    //         data.type !== COURSE_TYPE.SEL_TOPIC);
    //     // if (isValid) {
    //     //   const res = await checkCanCreateCourse(setPayload());
    //     //   if (!res) isValid = false;
    //     // }
    //     break;
    //   case 2:
    //     const secNoList: string[] = [];
    //     for (let i = 0; i < length; i++) {
    //       const isError = form.validateField(`${i}.semester`).hasError;
    //       if (isValid) {
    //         isValid = !isError;
    //       } else {
    //         form.validateField(`${i}.semester`);
    //       }
    //       if (isError) {
    //         secNoList.push(getSectionNo(form.getValues().at(i)?.sectionNo));
    //       }
    //     }
    //     if (secNoList.length) {
    //       secNoList.sort((a: any, b: any) => parseInt(a) - parseInt(b));
    //       showNotifications(
    //         NOTI_TYPE.ERROR,
    //         "iiiii",
    //         `ooooooo ${secNoList.join(", ")}`
    //       );
    //     }
    //     break;
    // }
    if (isValid) {
      setFirstInput(true);
      if (active == 4) {
        // await addSection();
      }
      setActive((cur) => (cur < 3 ? cur + 1 : cur));
    }
    setLoading(false);
  };
  const prevStep = () => setActive((cur) => (cur > 0 ? cur - 1 : cur));
  const closeModal = () => {
    setActive(0);
    setSectionNoList([]);
    setCoInsList([]);
    form.reset();
    onClose();
  };

  useEffect(() => {
    console.log(form.getValues());
  }, [form]);

  // const setPayload = () => {
  //   let payload = {
  //     ...form.getValues(),
  //     academicYear: academicYear.id,
  //     updatedYear: academicYear.year,
  //     updatedSemester: academicYear.semester,
  //   };
  //   payload?.forEach((sec: any) => {
  //     sec.semester = sec.semester?.map((term: string) => parseInt(term));
  //     sec.coInstructors = sec.coInstructors?.map((coIns: any) => coIns.value);
  //   });
  //   return payload;
  // };

  // const setSectionList = (value: string[]) => {
  //   let sections = form.getValues();
  //   const lastValue = value[value.length - 1];
  //   // validate section No
  //   if (value.length >= sections.length) {
  //     if (
  //       !parseInt(lastValue) ||
  //       lastValue.length > 3 ||
  //       sections.some((sec) => sec?.sectionNo === parseInt(lastValue))
  //     )
  //       return;
  //   }
  //   const sectionNo: string[] = value.sort((a, b) => parseInt(a) - parseInt(b));
  //   setSectionNoList(sectionNo.map((secNo) => getSectionNo(secNo)));
  //   let newSections: any[] = [];
  //   if (sections) {
  //     // reset sections and instructors
  //     if (!sectionNo.length) {
  //       let initialSection = {};
  //       if (data.type == COURSE_TYPE.SEL_TOPIC) {
  //         initialSection = { topic: sections[0]?.topic };
  //       }
  //       setCoInsList([]);
  //     }
  //     // adjust coInstructors
  //     else if (sections?.length! > sectionNo.length) {
  //       coInsList.forEach((coIns) => {
  //         coIns.sections = coIns.sections.filter((sec: string) =>
  //           sectionNo.includes(sec)
  //         );
  //       });
  //       setCoInsList(coInsList.filter((coIns) => coIns.sections.length > 0));
  //     }
  //     sectionNo.forEach((secNo) => {
  //       const data: any = {
  //         ...(sections.find((sec) => sec?.sectionNo == parseInt(secNo)) || {}),
  //         sectionNo: parseInt(secNo),
  //         instructor: user.id,
  //         coInstructors: coInsList.map((coIns) => ({ ...coIns })),
  //       };
  //       if (data.type == COURSE_TYPE.SEL_TOPIC) {
  //         data.topic = sections[0]?.topic;
  //       }
  //       coInsList.forEach((coIns) => {
  //         if (!coIns.sections.includes(getSectionNo(secNo))) {
  //           coIns.sections.push(getSectionNo(secNo));
  //           coIns.sections.sort(
  //             (a: string, b: string) => parseInt(a) - parseInt(b)
  //           );
  //         }
  //       });
  //       newSections?.push(data);
  //     });
  //   }
  //   newSections.forEach((sec) =>
  //     sortData(sec.coInstructors!, "label", "string")
  //   );
  //   sortData(newSections, "sectionNo");
  //   form.setValues([...newSections]);
  // };

  // const addCoIns = (
  //   {
  //     inputUser,
  //     instructorOption,
  //   }: { inputUser: any; instructorOption: any[] },
  //   {
  //     setInputUser,
  //     setInstructorOption,
  //   }: {
  //     setInputUser: React.Dispatch<React.SetStateAction<any>>;
  //     setInstructorOption: React.Dispatch<React.SetStateAction<any[]>>;
  //   }
  // ) => {
  //   if (inputUser?.value) {
  //     inputUser.sections = [];
  //     const updatedInstructorOptions = instructorOption.map((option: any) =>
  //       option?.value == inputUser.value
  //         ? { ...option, disabled: true }
  //         : option
  //     );
  //     setInstructorOption(updatedInstructorOptions);
  //     delete inputUser.disabled;
  //     const updatedSections = form.getValues()?.map((sec) => {
  //       const coInsArr = [...(sec.coInstructors ?? []), inputUser];
  //       sortData(coInsArr, "label", "string");
  //       inputUser.sections.push(getSectionNo(sec.sectionNo));
  //       inputUser.sections.sort((a: any, b: any) => parseInt(a) - parseInt(b));
  //       return {
  //         ...sec,
  //         coInstructors: [...coInsArr],
  //       };
  //     });
  //     setCoInsList([inputUser, ...coInsList]);
  //     form.setFieldValue("sections", [...updatedSections!]);
  //   }
  //   setInputUser({ value: null });
  // };

  // const removeCoIns = (coIns: any) => {
  //   const newList = coInsList.filter((e) => e.value !== coIns.value);
  //   const updatedSections = form.getValues()?.map((sec) => ({
  //     ...sec,
  //     coInstructors: (sec?.coInstructors ?? []).filter(
  //       (p) => p.value !== coIns.value
  //     ),
  //   }));
  //   form.setFieldValue("sections", [...updatedSections!]);
  //   setCoInsList(newList);
  // };

  // const editCoInsInSec = (sectionNo: string, checked: boolean, coIns: any) => {
  //   const updatedSections = form.getValues();
  //   updatedSections?.forEach((sec, index) => {
  //     const secNo = getSectionNo(sec?.sectionNo);
  //     if (sectionNo == secNo) {
  //       if (checked) {
  //         coIns.sections.push(secNo);
  //         coIns.sections.sort((a: any, b: any) => parseInt(a) - parseInt(b));
  //         sec?.coInstructors?.push({ ...coIns });
  //       } else {
  //         coIns.sections = coIns.sections.filter((e: any) => e !== secNo);
  //         sec?.coInstructors?.splice(sec?.coInstructors.indexOf(coIns), 1);
  //       }
  //       sortData(sec?.coInstructors, "label", "string");
  //     }
  //     return sec;
  //   });
  //   form.setFieldValue("sections", [...updatedSections!]);
  // };

  // const setSemesterInSec = (
  //   index: number,
  //   checked: boolean,
  //   semester?: string[]
  // ) => {
  //   const semesterList: any[] = form.getValues()?.at(index)?.semester ?? [];
  //   if (!semester) {
  //     form.setFieldValue(`sections.${index}.openThisTerm`, checked);
  //     if (
  //       checked &&
  //       !semesterList?.includes(academicYear?.semester.toString())
  //     ) {
  //       semesterList.push(academicYear?.semester.toString());
  //       semesterList.sort((a: any, b: any) => parseInt(a) - parseInt(b));
  //       form.setFieldValue(`sections.${index}.semester`, semesterList);
  //     }
  //   } else {
  //     form.setFieldValue(`sections.${index}.semester`, semester.sort());
  //   }
  // };

  return (
    <Modal
      opened={opened}
      onClose={closeModal}
      closeOnClickOutside={false}
      title="Add Course"
      size="50vw"
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        content:
          "flex flex-col justify-center bg-[#F6F7FA] item-center overflow-hidden",
      }}
    >
      <Stepper
        active={active}
        color="#6869AD"
        onStepClick={setActive}
        allowNextStepsSelect={false}
        icon={<IconCircleFilled />}
        classNames={{
          separator: "text-primary -mx-1 mb-12 h-[3px] -translate-x-5",
          step: "flex flex-col  items-start mr-2",
          stepIcon: "mb-2 text-[#E6E6FF] bg-[#E6E6FF] border-[#E6E6FF]",
          stepBody: "flex-col-reverse m-0 ",
          stepLabel: "text-[13px] font-semibold",
          stepDescription: "text-[13px] font-semibold",
        }}
        className=" justify-center items-center mt-1  text-[14px] max-h-full"
      >
        <Stepper.Step
          allowStepSelect={false}
          label="Section"
          description="STEP 1"
        >
          <div className="w-full  mt-2 h-fit  bg-white mb-5 rounded-md">
            <div className="flex flex-col gap-3">
              {data.type == COURSE_TYPE.SEL_TOPIC && (
                <TextInput
                  label="Course Topic"
                  withAsterisk
                  size="xs"
                  classNames={{ input: "focus:border-primary" }}
                  placeholder="Ex. Full Stack Development"
                  {...form.getInputProps("")}
                />
              )}
              <TagsInput
                label="Section"
                withAsterisk
                classNames={{
                  input:
                    " h-[145px] bg-[#ffffff] mt-[2px] p-3 text-[12px]  rounded-md",
                  pill: "bg-secondary text-white font-bold",
                  label: "font-semibold text-[#3e3e3e] text-b2",
                  error: "text-[10px] !border-none",
                }}
                placeholder="Ex. 001 or 1 (Press Enter for fill the next section)"
                splitChars={[",", " ", "|"]}
                {...form.getInputProps("sectionNo")}
                error={!firstInput && form.validateField(`0.sectionNo`).error}
                // value={sectionNoList}
                // onChange={setSectionList}
              ></TagsInput>
              <p>{form.validateField("sectionNo").error}</p>
            </div>
          </div>
        </Stepper.Step>
        <Stepper.Step
          allowStepSelect={false}
          label="Semester"
          description="STEP 2"
        >
          <div className="flex flex-col max-h-[380px] h-fit w-full mt-2 mb-5   p-[2px]    overflow-y-scroll  ">
            <div className="flex flex-col font-medium text-[14px] gap-5">
              {form.getValues()?.map((sec: any, index) => (
                <div className="flex flex-col gap-1" key={index}>
                  <span className="text-secondary font-semibold">
                    Select Semester for Section {getSectionNo(sec.sectionNo)}{" "}
                    <span className="text-red-500">*</span>
                  </span>
                  <div
                    style={{
                      boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                    }}
                    className="w-full p-3 py-4 bg-white rounded-md gap-2 flex flex-col "
                  >
                    <div className="flex flex-row items-center justify-between">
                      <div className="gap-3 flex flex-col">
                        <span className="font-semibold">Open Semester</span>
                        <Checkbox
                          classNames={{
                            input:
                              "bg-[black] bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                            body: "mr-3 px-0",
                            label: "text-[14px] text-[#615F5F] cursor-pointer",
                          }}
                          color="#5768D5"
                          size="xs"
                          label={`Open in this semester (${
                            academicYear?.semester
                          }/${academicYear?.year.toString()?.slice(-2)})`}
                          checked={sec.openThisTerm}
                          // onChange={(event) =>
                          //   setSemesterInSec(index, event.target.checked)
                          // }
                        />
                      </div>
                      <Checkbox.Group
                        classNames={{ error: "mt-2" }}
                        {...form.getInputProps(`${index}.semester`)}
                        value={sec.semester}
                        // onChange={(event) => {
                        //   setSemesterInSec(index, true, event);
                        // }}
                      >
                        <Group className="flex flex-row gap-1 justify-end ">
                          {SEMESTER.map((item) => (
                            <Checkbox
                              key={item}
                              classNames={{
                                input:
                                  "bg-black bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                                body: "mr-3",
                                label: "text-[14px] cursor-pointer",
                              }}
                              color="#5768D5"
                              size="xs"
                              label={item}
                              value={item.toString()}
                              disabled={
                                sec.openThisTerm &&
                                item == academicYear.semester &&
                                sec.semester?.includes(item.toString())
                              }
                            />
                          ))}
                        </Group>
                      </Checkbox.Group>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Stepper.Step>
        <Stepper.Step
          allowStepSelect={false}
          label="Co-Instructor"
          description="STEP 3"
        >
          <div className="flex flex-col mt-3 flex-1 ">
            <CompoMangementIns
              opened={active == 3}
              // action={addCoIns}
              sections={form.getValues()}
              setUserList={setCoInsList}
            />

            {!!coInsList.length && (
              <div
                className="w-full flex flex-col mb-5 bg-white border-secondary border-[1px]  rounded-md"
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="bg-[#e6e9ff] flex gap-3 h-fit font-semibold items-center rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary ">
                  <IconUsers /> Added Co-Instructor
                </div>
                <div className="flex flex-col max-h-[250px] h-fit w-full   px-2   overflow-y-scroll ">
                  <div className="flex flex-col max-h-[400px] h-fit p-1">
                    {coInsList.map((coIns, index) => (
                      <div
                        key={index}
                        className="w-full h-fit p-3   gap-4 flex flex-col"
                      >
                        <div className="flex w-full justify-between items-center">
                          <div className="flex flex-col  font-medium text-[14px]">
                            <span className="text-[#3e3e3e] -translate-y-1 font-semibold text-[14px]">
                              {coIns.label}
                            </span>
                          </div>
                          <div className="flex justify-end gap-3 ">
                            <Menu shadow="md" width={200}>
                              <Menu.Target>
                                <Button
                                  variant="outline"
                                  color="#5768d5"
                                  size="xs"
                                  className=" transform-none text-[12px] rounded-md"
                                >
                                  Access
                                </Button>
                              </Menu.Target>

                              <Menu.Dropdown className=" overflow-y-scroll max-h-[180px] h-fit">
                                <Menu.Label className=" -translate-x-1">
                                  Can access
                                </Menu.Label>
                                <div className="flex flex-col pb-2 h-fit gap-2 w-full">
                                  {sectionNoList.map((sectionNo, index) => (
                                    <Checkbox
                                      disabled={
                                        coIns.sections?.length == 1 &&
                                        coIns.sections?.includes(sectionNo)
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
                                      label={`Section ${sectionNo}`}
                                      checked={coIns.sections?.includes(
                                        sectionNo
                                      )}
                                      // onChange={(event) =>
                                      //   editCoInsInSec(
                                      //     sectionNo,
                                      //     event.currentTarget.checked,
                                      //     coIns
                                      //   )
                                      // }
                                    />
                                  ))}
                                </div>
                              </Menu.Dropdown>
                            </Menu>
                            <Button
                              className="text-[12px] transform-none rounded-[8px]"
                              size="xs"
                              variant="outline"
                              color="#FF4747"
                              // onClick={() => removeCoIns(coIns)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                        <div className="flex text-secondary flex-row w-[70%] flex-wrap -mt-5 gap-1 font-medium text-[13px]">
                          <p className=" font-semibold">Section</p>
                          {coIns.sections?.map(
                            (sectionNo: any, index: number) => (
                              <p key={index}>
                                {sectionNo}
                                {index !== coIns.sections?.length - 1 && ","}
                              </p>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Stepper.Step>
        <Stepper.Step
          allowStepSelect={false}
          label="Review"
          description="STEP 5"
        >
          <div
            className="w-full flex flex-col bg-white border-secondary border-[1px] mb-5 rounded-md"
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="bg-[#e6e9ff] flex flex-col justify-start gap-[2px] font-semibold  rounded-t-md border-b-secondary border-[1px] px-4 py-2 text-secondary ">
              <p>
                {data.courseNo} - {data.courseName}{" "}
              </p>
              {data.sections?.at(0)?.topic && (
                <p className="text-secondary text-b3">
                  Topic: {form.getValues().at(0)?.topic}
                </p>
              )}
              <p className="text-b3">Course owner: {getUserName(user, 1)}</p>
            </div>
            <div className="flex flex-col max-h-[320px] h-fit w-full   px-2   overflow-y-scroll ">
              <div className="flex flex-col gap-3 mt-3   font-medium text-[12px]">
                {form.getValues().map((sec, index) => (
                  <div
                    key={index}
                    className="w-full border-b-[1px] border-[#c9c9c9] pb-2  h-fit px-4    gap-1 flex flex-col"
                  >
                    <span className="text-secondary font-semibold text-[14px] mb-2">
                      Section {getSectionNo(sec.sectionNo)}
                    </span>

                    {!!sec.coInstructors?.length && (
                      <div className="flex flex-col gap-1">
                        <span className="text-[#3E3E3E] font-semibold">
                          Co-Instructor
                        </span>
                        <div className="ps-1.5 text-secondary mb-2">
                          <List size="sm" listStyleType="disc">
                            {sec.coInstructors?.map((coIns, index) => (
                              <List.Item className="mb-[3px]" key={index}>
                                {coIns?.label}
                              </List.Item>
                            ))}
                          </List>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <span className="text-[#3E3E3E] font-semibold">
                        Open in Semester
                      </span>
                      <div className="ps-1.5 text-secondary mb-2">
                        <List
                          size="sm"
                          listStyleType="disc"
                          className="flex flex-col gap-1"
                        >
                          <List.Item>
                            {sec.semester
                              ?.join(", ")
                              .replace(/, ([^,]*)$/, " and $1")}
                          </List.Item>
                          {sec.openThisTerm && (
                            <List.Item className="mb-[3px]">
                              Open in this semester ({academicYear.semester}/
                              {academicYear.year.toString().slice(-2)})
                            </List.Item>
                          )}
                        </List>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Stepper.Step>
      </Stepper>

      <Group className="flex w-full h-fit items-end justify-between">
        <div>
          {active > 0 && (
            <Button
              color="#575757"
              variant="subtle"
              className="rounded-[8px] text-[12px] h-[32px] w-fit "
              justify="start"
              onClick={prevStep}
            >
              Back
            </Button>
          )}
        </div>
        <Button
          color="#5768d5"
          className="rounded-[8px] text-[12px] h-[32px] w-fit "
          loading={loading}
          onClick={() => nextStep()}
          rightSection={active != 3 && <IconArrowRight stroke={2} size={20} />}
        >
          {active == 3 ? "Done" : "Next step"}
        </Button>
      </Group>
    </Modal>
  );
}
