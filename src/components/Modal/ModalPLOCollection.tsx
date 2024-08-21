import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  CheckboxGroup,
  Group,
  Modal,
  Radio,
  Stepper,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  IconArrowRight,
  IconCircleFilled,
  IconHome2,
  IconHierarchy,
  IconInfoCircle,
} from "@tabler/icons-react";
import { IModelPLO } from "@/models/ModelPLO";
import { getDepartment } from "@/services/faculty/faculty.service";
import { useAppSelector } from "@/store";
import { log } from "console";
import { sortData } from "@/helpers/functions/function";
import SelectDepartment from "@/pages/SelectDepartment";
import Icon from "../Icon";
import { useListState } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { isEqual } from "lodash";
import { ROLE } from "@/helpers/constants/enum";

type Props = {
  opened: boolean;
  onClose: () => void;
  collection: Partial<IModelPLO>;
};
export default function ModalAddPLOCollection({
  opened,
  onClose,
  collection,
}: Props) {
  const user = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [department, setDepartment] = useState<any>([]);
  const [selectDepartment, setSelectDepartment] = useState<string[]>([]);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { departmentCode: [] } as Partial<IModelPLO>,
    // validate: {
    //   type: (value) => !value && "Course Type is required",
    //   courseNo: (value) => validateCourseNo(value),
    //   courseName: (value) => validateCourseNameorTopic(value, "Course Name"),
    //   sections: {
    //     topic: (value) => validateCourseNameorTopic(value, "Topic"),
    //     sectionNo: (value) => validateSectionNo(value),
    //     semester: (value) => {
    //       return value?.length ? null : "Please select semester at least one.";
    //     },
    //   },
    // },
    validateInputOnBlur: true,
  });

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((cur) => (cur > 0 ? cur - 1 : cur));
  const closeModal = () => {
    setActive(0);
    form.reset();
    onClose();
  };

  const setDepartmentCode = (checked: boolean) => {
    let departmentCode = form.getValues().departmentCode;

    if (checked) {
      departmentCode = department.map((dep: any) => dep.departmentCode);
    } else {
      departmentCode = [];
    }
    form.setFieldValue("departmentCode", departmentCode);
  };

  const fetchDep = async () => {
    const res = await getDepartment(user.facultyCode);
    if (res) {
      if (user.role === ROLE.SUPREME_ADMIN) {
        setDepartment(res.department);
      } else {
        const dep = res.department.filter((e: any) =>
          user.departmentCode.includes(e.departmentCode)
        );
        setDepartment(dep);
      }
      sortData(res.department, "departmentEN", "string");
    }
  };

  useEffect(() => {
    if (opened) {
      fetchDep();
    }
    console.log(user);
  }, [opened]);

  // useEffect(() => {
  //   // Assuming departmentCode is a string or a key you want to get values for
  //   const departmentCodes = form.getValues();

  //   console.log("Selected Department Codes:", departmentCodes);
  // }, [form]); // Add departmentCode if it's a dependency

  return (
    <Modal
      opened={opened}
      onClose={closeModal}
      closeOnClickOutside={false}
      title="Add PLO Collection"
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
          separator: ` mb-12 h-[3px]  `,
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
          label="PLO Info"
          description="STEP 1"
        >
          <div className="flex flex-col gap-3 mt-3">
            <div className=" border-b border-gray">
              <TextInput
                size="xs"
                withAsterisk={true}
                label="PLO Collection Name"
                className="w-full border-none pb-5 "
                classNames={{
                  input: "flex p-3 ",
                  label: "flex pb-1 gap-1",
                }}
                placeholder="Ex. PLO 1/67"
                {...form.getInputProps("name")}
              />
            </div>
            <TextInput
              size="xs"
              withAsterisk={true}
              label={
                <p className="font-semibold flex gap-1">
                  Criteria <span className="text-secondary">Thai language</span>
                </p>
              }
              className="w-full border-none "
              classNames={{
                input: "flex p-3 ",
                label: "flex pb-1 gap-1",
              }}
              placeholder="Ex. เกณฑ์ของ ABET"
              {...form.getInputProps("criteriaTH")}
            />
            <TextInput
              size="xs"
              withAsterisk={true}
              label={
                <p className=" flex gap-1">
                  Criteria{" "}
                  <span className="text-secondary">English language</span>
                </p>
              }
              className="w-full border-none "
              classNames={{
                input: "flex p-3 ",
                label: "flex pb-1 gap-1",
              }}
              placeholder="Ex. ABET Criteria"
              {...form.getInputProps("criteriaEN")}
            />
          </div>
        </Stepper.Step>
        <Stepper.Step
          allowStepSelect={false}
          label="Add PLO"
          description="STEP 2"
        >
          <div className="flex flex-col mt-3 gap-3">
            <Textarea
              withAsterisk={true}
              label={
                <p className="text-b2 font-semibold flex gap-1">
                  PLO <span className="text-secondary">Thai language</span>
                </p>
              }
              className="w-full border-none   rounded-r-none "
              classNames={{
                input: "flex  h-[150px] p-3 ",
                label: "flex pb-1",
              }}
              placeholder="Ex. ความสามารถในการแก้ปัญหาทางวิศวกรรม"
            />
            <Textarea
              withAsterisk={true}
              label={
                <p className="text-b2 font-semibold flex gap-1 ">
                  PLO <span className="text-secondary">English language</span>
                </p>
              }
              className="w-full border-none rounded-r-none"
              classNames={{
                input: "flex  h-[150px] p-3",
                label: "flex pb-1",
              }}
              placeholder="Ex. An ability to solve complex engineering problems."
            />

            <div className="flex gap-2 mt-3 justify-end">
              <Button
                // onClick={submit}
                className="rounded-[8px] text-[12px] h-[32px] w-fit "
                color="#5768d5"
              >
                Add Another
              </Button>
            </div>
          </div>
        </Stepper.Step>
        <Stepper.Step
          allowStepSelect={false}
          label="Map Department"
          description="STEP 3"
        >
          <div className="mt-3 flex flex-col">
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
              title={<p>lorem ipsum</p>}
            ></Alert>
            <div
              className="w-full  flex flex-col bg-white border-secondary border-[1px] rounded-md overflow-clip"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div className="bg-[#e6e9ff] flex items-center justify-between rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold">
                <div className="flex items-center gap-2">
                  <IconHome2 className="text-secondary" size={19} />

                  <span>List of Departments</span>
                </div>
                <p>{department.length} departments</p>
              </div>
              <div className="flex flex-col w-full h-[280px] px-4 overflow-y-auto">
                <Checkbox
                  className="p-3 py-5 rounded-md w-full last:border-none border-b-[1px]"
                  classNames={{ label: "ml-2", input: "cursor-pointer" }}
                  label="All"
                  checked={isEqual(
                    form.getValues().departmentCode,
                    department.map((dep: any) => dep.departmentCode)
                  )}
                  onChange={(event) => {
                    setDepartmentCode(event.target.checked);
                  }}
                />
                <Checkbox.Group
                  {...form.getInputProps("departmentCode")}
                  value={form.getValues().departmentCode}
                  onChange={(event) => {
                    form.setFieldValue("departmentCode", event);
                  }}
                >
                  <Group className="gap-0">
                    {department.map((dep: any, index: any) => (
                      <Checkbox
                        key={index}
                        value={dep.departmentCode}
                        className="p-3 py-5 rounded-md w-full last:border-none border-b-[1px] "
                        classNames={{ label: "ml-2", input: "cursor-pointer" }}
                        label={`${dep.departmentEN} (${dep.departmentCode})`}
                      />
                    ))}
                  </Group>
                </Checkbox.Group>
              </div>
            </div>
          </div>
        </Stepper.Step>
        <Stepper.Step
          allowStepSelect={false}
          label="Review"
          description="STEP 4"
        ></Stepper.Step>
      </Stepper>
      {active >= 0 && (
        <Group className="flex w-full h-fit items-end justify-between mt-7">
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
            rightSection={
              active != 3 && <IconArrowRight stroke={2} size={20} />
            }
          >
            {active == 3 ? "Done" : "Next step"}
          </Button>
        </Group>
      )}
    </Modal>
  );
}
