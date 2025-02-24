import { Button, MultiSelect, Select, TextInput } from "@mantine/core";
import IconAddCo from "@/assets/icons/addCo.svg?react";
import IconChevronRight from "@/assets/icons/chevronRight.svg?react";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { useAppSelector } from "@/store";
import { validateEmail } from "@/helpers/functions/validation";
import { NOTI_TYPE, ROLE, TITLE_ROLE } from "@/helpers/constants/enum";
import { IModelUser } from "@/models/ModelUser";
import { getInstructor, updateCurrAdmin } from "@/services/user/user.service";
import { getUserName } from "@/helpers/functions/function";
import { IModelSection } from "@/models/ModelCourse";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { useForm } from "@mantine/form";

type actionType =
  | "add"
  | "manageCo"
  | "manageCoSec"
  | "mainIns"
  | "changeMain"
  | "admin";

type Props = {
  opened: boolean;
  type: actionType;
  isManage?: boolean;
  newFetch?: boolean;
  setNewFetch?: (value: boolean) => void;
  currentMainIns?: string;
  value?: any;
  swapMethod?: boolean;
  error?: string;
  sections?: Partial<IModelSection>[] | undefined;
  action?: (input?: any, func?: any) => void;
  setUserList?: React.Dispatch<React.SetStateAction<any[]>>;
  setUserFilter?: React.Dispatch<React.SetStateAction<IModelUser[]>>;
};

export default function CompoMangeIns({
  opened,
  type,
  isManage = false,
  newFetch = false,
  setNewFetch,
  currentMainIns,
  value,
  swapMethod = false,
  error,
  sections,
  action,
  setUserList,
  setUserFilter,
}: Props) {
  const user = useAppSelector((state) => state.user);
  const curriculum = useAppSelector((state) => state.faculty.curriculum);
  const [openFirst, setOpenFirst] = useState(false);
  const [swapMethodAddUser, setSwapMethodAddUser] = useState(false);
  const [instructorOption, setInstructorOption] = useState<any[]>([]);
  const [inputUser, setInputUser] = useState<any>({ value: null });
  const [isFocus, setIsFocus] = useState(false);
  const [firstInput, setFirstInput] = useState(true);
  const [invalidEmail, setInvalidEmail] = useState(false);

  const form = useForm({
    mode: "controlled",
    initialValues: { curriculums: [] as string[] },
    validate: {
      curriculums: (value) => !value.length && "Curriculum is required",
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    if (opened) {
      setOpenFirst(true);
      setFirstInput(true);
      setInputUser({ value: null });
      setSwapMethodAddUser(swapMethod);
      fetchIns();
    }
  }, [opened]);

  useEffect(() => {
    if (swapMethodAddUser) {
      if (inputUser?.value) setInvalidEmail(!validateEmail(inputUser?.value));
      else setInvalidEmail(false);
    }
  }, [inputUser]);

  useEffect(() => {
    if (instructorOption.length) {
      if (sections && !sections.length) {
        instructorOption.forEach((option) => (option.disabled = false));
      } else if (sections) {
        const coInsList = [
          ...new Set(
            sections
              .map((sec) =>
                sec.coInstructors?.map((coIns) => coIns.value ?? coIns.id)
              )
              .flatMap((coIns: any) => coIns)
              .filter((coIns) => coIns)
          ),
        ];
        const list: any[] = [];
        instructorOption.forEach((option) => {
          if (coInsList.includes(option.value)) {
            option.disabled = true;
            list.push({ ...option });
          } else option.disabled = false;
        });
        list.forEach((coIns) => {
          coIns.sections = sections
            .filter((sec) =>
              sec.coInstructors?.some((e) => e.id == coIns.value)
            )
            .map((sec) => sec.sectionNo);
        });
        if (
          ["manageCo", "manageCoSec"].includes(type) &&
          openFirst &&
          setUserList
        ) {
          setOpenFirst(false);
          setUserList(list);
        }
      }
    }
  }, [sections, instructorOption]);

  useEffect(() => {
    if (newFetch && setNewFetch) {
      fetchIns();
      setNewFetch(false);
    }
  }, [newFetch]);

  const fetchIns = async () => {
    let res = await getInstructor();
    if (res) {
      setInstructorOption(
        res
          .filter((e: IModelUser) =>
            ["add", "admin", "manageCoSec"].includes(type) && !isManage
              ? e.id !== user.id
              : e
          )
          .map((e: IModelUser) => {
            return {
              label: getUserName(e, 1),
              value: e.id,
              disabled:
                (type == "admin" && e.role == ROLE.CURRICULUM_ADMIN) ||
                currentMainIns == e.id
                  ? true
                  : false,
            };
          })
      );
      // Manage Curr. Admin
      if (type == "admin") {
        let adminList = res.filter((e: IModelUser) => {
          if (e.id !== user.id && e.role === ROLE.CURRICULUM_ADMIN) {
            return { ...e };
          }
        });
        // Add current user to the top of the admin list
        if (user.role === ROLE.ADMIN || user.role === ROLE.CURRICULUM_ADMIN) {
          adminList = [{ ...user }, ...adminList];
        }
        if (setUserList) setUserList(adminList);
        if (setUserFilter) setUserFilter(adminList);
      }
    }
  };

  const addUser = async () => {
    if (inputUser?.value) {
      // Add Admin
      if (type == "admin") {
        if (form.validate().hasErrors) return;
        const payload: Partial<IModelUser> = { role: ROLE.CURRICULUM_ADMIN };
        if (swapMethodAddUser) {
          if (invalidEmail) return;
          payload.email = inputUser.value;
        } else payload.id = inputUser.value;
        payload.curriculums = form.getValues().curriculums;
        const res = await updateCurrAdmin(payload);
        if (res) {
          const name = res.firstNameEN?.length
            ? getUserName(res, 1)
            : res.email;
          form.reset();
          setInputUser({ value: null });
          fetchIns();
          showNotifications(
            NOTI_TYPE.SUCCESS,
            "Curriculum Admin added successfully",
            `${name} is added to curriculum admin`
          );
        }
      }
      // Add coIns (Add Course, Section)
      else if (
        ["add", "manageCo", "manageCoSec"].includes(type) &&
        sections &&
        action
      ) {
        action(
          { inputUser, instructorOption },
          { setInputUser, setInstructorOption }
        );
      }
    }
  };

  const getLabel = () => {
    return type == "changeMain" || type == "mainIns"
      ? TITLE_ROLE.OWNER_SEC
      : type == "admin"
      ? TITLE_ROLE.CURR_ADMIN
      : TITLE_ROLE.CO_INS;
  };

  return (
    <div
      className={`flex flex-col gap-3 max-h-[320px] rounded-md h-fit w-full mt-2 p-4
        ${["add", "admin"].includes(type) && "mb-1"}`}
      style={{
        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div
        onClick={() => {
          if (type == "mainIns" && action) action({ value: null });
          setInputUser({ value: null });
          setSwapMethodAddUser(!swapMethodAddUser);
        }}
        className="bg-bgTableHeader hover:bg-[#d4e1f7] cursor-pointer  h-fit rounded-lg text-secondary flex justify-between items-center py-3 px-5  "
      >
        <div className="flex gap-6 items-center">
          <Icon IconComponent={IconAddCo} className="text-secondary" />
          <p className="font-semibold">
            {type == "changeMain" ? "Change" : "Add"} {getLabel()} by using
            <span className="font-extrabold">
              {swapMethodAddUser ? " Dropdown list" : " CMU Account"}
            </span>
          </p>
        </div>
        <Icon IconComponent={IconChevronRight} className="stroke-[2px]" />
      </div>

      {type == "admin" && (
        <MultiSelect
          label="Select Curriculums for access management"
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
            label: "acerSwift:max-macair133:!text-b4",
          }}
          {...form.getInputProps("curriculums")}
        />
      )}

      <div className="flex w-full  items-end h-fit ">
        {swapMethodAddUser ? (
          <TextInput
            withAsterisk={true}
            size="sm"
            description="Make sure CMU account correct"
            label="CMU account"
            className={`w-full border-none`}
            classNames={{
              input: `${
                type != "mainIns" && "!rounded-r-none"
              } acerSwift:max-macair133:text-b4`,
              label: "acerSwift:max-macair133:!text-b4",
              description: "acerSwift:max-macair133:text-b5",
            }}
            placeholder="example@cmu.ac.th"
            value={type == "mainIns" ? value.value : inputUser?.value!}
            onChange={(event) => {
              if (type == "mainIns" && action)
                action({
                  label: event.target.value,
                  value: event.target.value,
                });
              else
                setInputUser({
                  label: event.target.value,
                  value: event.target.value,
                });
            }}
            onFocus={() => {
              setFirstInput(false);
              setIsFocus(true);
            }}
            onBlur={() => setIsFocus(false)}
            error={
              type == "mainIns" && error
                ? "Please enter the instructor's email address."
                : value &&
                  !isFocus &&
                  !validateEmail(value) &&
                  !firstInput &&
                  "Please enter a valid email address (e.g., example@cmu.ac.th)."
            }
          />
        ) : (
          <Select
            rightSectionPointerEvents="all"
            label={`Select ${getLabel()}`}
            placeholder={getLabel()}
            data={instructorOption}
            allowDeselect
            searchable
            clearable
            size="sm"
            nothingFoundMessage="No result"
            className="w-full border-none "
            classNames={{
              input: `rounded-md acerSwift:max-macair133:text-b4 ${
                type != "mainIns" && "rounded-e-none"
              }`,
              option: `py-1 acerSwift:max-macair133:text-b4`,
              label: "acerSwift:max-macair133:!text-b4",
            }}
            value={type == "mainIns" ? value?.value : inputUser?.value!}
            onChange={(value, option) => {
              if (type == "mainIns" && action) action(option);
              else if (value) setInputUser(option);
              else setInputUser({ value: null });
            }}
            onClear={() => setInputUser({ value: null })}
            error={type == "mainIns" && error && "Please select the instructor"}
          />
        )}
        {type != "mainIns" && (
          <Button
            color="#13A9A1"
            className="!rounded-s-none !rounded-e-md !h-[36px] min-w-fit border-l-0 disabled:border-[#cecece]"
            disabled={!inputUser?.value || (swapMethodAddUser && invalidEmail)}
            onClick={() =>
              type == "changeMain" && action ? action(inputUser) : addUser()
            }
          >
            {type == "changeMain" ? "Change" : "Add"}
          </Button>
        )}
      </div>
    </div>
  );
}
