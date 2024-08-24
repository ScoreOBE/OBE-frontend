import { Button, Select, TextInput } from "@mantine/core";
import AddCoIcon from "@/assets/icons/addCo.svg?react";
import { IconChevronRight, IconChevronDown, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { useAppSelector } from "@/store";
import { validateEmail } from "@/helpers/functions/validation";
import { NOTI_TYPE, ROLE, TITLE_ROLE } from "@/helpers/constants/enum";
import { IModelUser } from "@/models/ModelUser";
import { getInstructor, updateAdmin } from "@/services/user/user.service";
import { getUserName, showNotifications } from "@/helpers/functions/function";
import { IModelSection } from "@/models/ModelSection";

type Props = {
  opened: boolean;
  role?: ROLE;
  newFetch?: boolean;
  setNewFetch?: (value: boolean) => void;
  mainIns?: boolean;
  value?: string;
  swapMethod?: boolean;
  error?: string;
  change?: boolean;
  sections?: Partial<IModelSection>[] | undefined;
  action?: (input?: any, func?: any) => void;
  setUserList?: React.Dispatch<React.SetStateAction<any[]>>;
  setUserFilter?: React.Dispatch<React.SetStateAction<IModelUser[]>>;
};

export default function CompoMangementIns({
  opened,
  role,
  newFetch = false,
  setNewFetch,
  mainIns = false,
  value,
  swapMethod = false,
  error,
  change = false,
  sections,
  action,
  setUserList,
  setUserFilter,
}: Props) {
  const user = useAppSelector((state) => state.user);
  const [swapMethodAddUser, setSwapMethodAddUser] = useState(false);
  const [openedDropdown, setOpenedDropdown] = useState(false);
  const [instructorOption, setInstructorOption] = useState<any[]>([]);
  const [inputUser, setInputUser] = useState<any>({ value: null });
  const [invalidEmail, setInvalidEmail] = useState(false);

  useEffect(() => {
    if (opened) {
      setInputUser({ value: null });
      setSwapMethodAddUser(swapMethod);
      fetchIns();
    }
  }, [opened]);

  useEffect(() => {
    if (swapMethodAddUser) {
      if (inputUser.value) setInvalidEmail(!validateEmail(inputUser.value));
      else setInvalidEmail(false);
    }
  }, [inputUser]);

  useEffect(() => {
    if (!sections?.length) {
      instructorOption.forEach((option) => (option.disabled = false));
    } else {
      const coInsList = [
        ...new Set(
          sections
            .map((sec) => sec.coInstructors?.map((coIns) => coIns.value))
            .flatMap((coIns: any) => coIns)
        ),
      ];
      instructorOption.forEach((option) => {
        if (coInsList.includes(option.value)) option.disabled = true;
        else option.disabled = false;
      });
    }
  }, [sections]);

  useEffect(() => {
    if (newFetch && setNewFetch) {
      fetchIns();
      setNewFetch(false);
    }
  }, [newFetch]);

  const fetchIns = async () => {
    let res = await getInstructor();
    if (res) {
      const list = !role
        ? res
        : res.filter((e: any) => e.id != user.id && e.role === ROLE.INSTRUCTOR);
      setInstructorOption(
        list.map((e: IModelUser) => {
          return { label: getUserName(e, 1), value: e.id };
        })
      );
      // Manage Admin
      if (role) {
        let adminList = res.filter((e: IModelUser) => {
          if (e.id !== user.id && e.role === ROLE.ADMIN) {
            return { ...e };
          }
        });
        // Add current user to the top of the admin list
        if (user.role === ROLE.SUPREME_ADMIN || user.role === ROLE.ADMIN) {
          adminList = [{ ...user }, ...adminList];
        }
        if (setUserList) setUserList(adminList);
        if (setUserFilter) setUserFilter(adminList);
      }
    }
  };

  const addUser = async () => {
    if (inputUser.value) {
      // Add Admin
      if (role) {
        const payload: Partial<IModelUser> = { role };
        if (swapMethodAddUser) {
          if (invalidEmail) return;
          payload.email = inputUser.value;
        } else payload.id = inputUser.value;
        const res = await updateAdmin(payload);
        if (res) {
          const name = res.firstNameEN?.length
            ? getUserName(res, 1)
            : res.email;
          setInputUser({ value: null });
          fetchIns();
          showNotifications(
            NOTI_TYPE.SUCCESS,
            "Add success",
            `${name} is added to admin`
          );
        }
      }
      // Add coIns (Add Course)
      else if (sections && action) {
        action(
          { inputUser, instructorOption },
          { setInputUser, setInstructorOption }
        );
      }
    }
  };

  const getLabel = () => {
    return change
      ? TITLE_ROLE.OWNER_SEC
      : role
      ? ROLE.ADMIN
      : mainIns
      ? TITLE_ROLE.MAIN_INS
      : TITLE_ROLE.CO_INS;
  };

  return (
    <div
      className="flex flex-col gap-3 max-h-[320px] mb-5 rounded-md h-fit w-full mt-2 p-4  "
      style={{
        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div
        onClick={() => {
          if (mainIns && action) action(undefined);
          setInputUser({ value: null });
          setSwapMethodAddUser(!swapMethodAddUser);
        }}
        className="bg-[#e6e9ff] hover:bg-[#dee1fa] cursor-pointer  h-fit rounded-lg text-secondary flex justify-between items-center py-3 px-5  "
      >
        <div className="flex gap-6 items-center">
          <Icon IconComponent={AddCoIcon} className="text-secondary" />
          <p className="font-semibold">
            {change ? "Change" : "Add"} {getLabel()} by using
            <span className="font-extrabold">
              {swapMethodAddUser ? " Dropdown list" : " CMU Account"}
            </span>
          </p>
        </div>
        <IconChevronRight stroke={2} />
      </div>

      <div className="flex w-full  items-end h-fit ">
        {swapMethodAddUser ? (
          <TextInput
            withAsterisk={true}
            description="Make sure CMU account correct"
            label="CMU account"
            className={`w-full border-none`}
            style={{ boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)" }}
            classNames={{ input: `${!mainIns && "!rounded-r-none"}` }}
            placeholder="example@cmu.ac.th"
            value={mainIns ? value : inputUser.value!}
            onChange={(event) => {
              if (mainIns && action) action(event.target.value);
              else
                setInputUser({
                  label: event.target.value,
                  value: event.target.value,
                });
            }}
            error={
              mainIns && error
                ? "Please input instructor email"
                : value && !validateEmail(value) && "Please input valid email"
            }
          />
        ) : (
          <Select
            rightSectionPointerEvents="all"
            label={`Select ${getLabel()}`}
            placeholder="Admin"
            data={instructorOption}
            allowDeselect
            searchable
            nothingFoundMessage="No result"
            className="w-full border-none "
            classNames={{
              input: `rounded-md ${!mainIns && "rounded-e-none"}`,
            }}
            rightSection={
              <template className="flex items-center gap-2 absolute right-2">
                {inputUser.value && (
                  <IconX
                    size={"1.25rem"}
                    stroke={2}
                    className={`cursor-pointer`}
                    onClick={() => setInputUser({ value: null })}
                  />
                )}
                <IconChevronDown
                  stroke={2}
                  className={`${
                    openedDropdown ? "rotate-180" : ""
                  } stroke-primary cursor-pointer`}
                  onClick={() => setOpenedDropdown(!openedDropdown)}
                />
              </template>
            }
            dropdownOpened={openedDropdown}
            // onDropdownOpen={() => setOpenedDropdown(true)}
            onDropdownClose={() => setOpenedDropdown(false)}
            value={mainIns ? value : inputUser.value!}
            onChange={(value, option) => {
              if (mainIns && action) action(value);
              else setInputUser(option);
            }}
            error={mainIns && error}
            onClick={() => setOpenedDropdown(!openedDropdown)}
          />
        )}
        {!mainIns && (
          <Button
            className="rounded-s-none min-w-fit border-l-0"
            color="#5768D5"
            disabled={!inputUser.value || (swapMethodAddUser && invalidEmail)}
            onClick={() => addUser()}
          >
            {change ? "Change" : "Add"}
          </Button>
        )}
      </div>
    </div>
  );
}
