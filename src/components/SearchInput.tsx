import { ellipsisText } from "@/helpers/functions/validation";
import { useAppDispatch } from "@/store";
import { resetSeachCourse } from "@/store/course";
import { resetSeachCourseManagement } from "@/store/courseManagement";
import { TextInput, Tooltip, CloseButton } from "@mantine/core";
import { useEffect, useState } from "react";
import { AiOutlineEnter } from "react-icons/ai";
import { TbSearch } from "react-icons/tb";

type Props = {
  onSearch: (value: string, reset?: boolean) => void;
};

export function SearchInput({ onSearch }: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsFocused(false);
    setSearchValue("");
    dispatch(resetSeachCourseManagement());
    dispatch(resetSeachCourse());
  }, [location]);

  const reset = () => {
    setSearchValue("");
    setIsFocused(false);
    onSearch("", true);
  };

  return (
    <div className="relative md:w-[400px] w-[220px]">
      <TextInput
        autoFocus={false}
        leftSection={!isFocused && <TbSearch className="size-4" />}
        placeholder="Course No / Course Name"
        size="xs"
        value={searchValue}
        onChange={(event: any) => setSearchValue(event.currentTarget.value)}
        onKeyDown={(event: any) => {
          if (event.key == "Enter") {
            setIsFocused(false);
            onSearch(searchValue);
          }
        }}
        onInput={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 300)}
        onFocus={() => setIsFocused(true)}
        rightSectionPointerEvents="all"
        rightSection={
          !!searchValue.length && (
            <Tooltip className="text-b3" label="Reset">
              <CloseButton size="sm" onClick={reset} />
            </Tooltip>
          )
        }
      />
      {isFocused && (
        <div
          className="mt-2 absolute cursor-pointer w-full rounded-md bg-white text-slate-800 p-3 text-b3 flex md:flex-row flex-col md:gap-0 gap-2 justify-between items-center"
          onClick={() => {
            setIsFocused(false);
            onSearch(searchValue);
          }}
          style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px" }}
        >
          <div className="flex md:w-fit w-full items-center gap-3">
            <TbSearch className="size-4" />
            {!!searchValue.length ? (
              <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                {ellipsisText(searchValue, 40)}
              </p>
            ) : (
              <p>Show All Your Course</p>
            )}
          </div>

          <div className="flex md:w-fit w-full justify-end items-center text-secondary gap-1">
            Press
            <div className="ml-1 flex items-center gap-1 border border-secondary p-1 font-semibold rounded-[6px]">
              Enter <AiOutlineEnter className="stroke-[50px]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
