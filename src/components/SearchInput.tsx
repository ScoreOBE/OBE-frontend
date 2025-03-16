import { ellipsisText } from "@/helpers/functions/validation";
import { TextInput, Tooltip, CloseButton } from "@mantine/core";
import { useEffect, useState } from "react";
import { AiOutlineEnter } from "react-icons/ai";
import { TbSearch } from "react-icons/tb";

type Props = {
  value?: string;
  onSearch: (value: string, reset?: boolean) => void;
  placeholder?: string;
};

export function SearchInput({ value, onSearch, placeholder }: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value == "" && searchValue != "") reset();
  }, [value]);

  const reset = () => {
    setSearchValue("");
    setIsFocused(false);
    onSearch("", true);
  };

  return (
    <div className="relative z-50 ipad11:w-[280px] macair133:w-[400px] w-[220px] acerSwift:max-macair133:w-[380px]">
      <TextInput
        autoFocus={false}
        leftSection={!isFocused && <TbSearch className="size-4" />}
        placeholder={placeholder}
        size="xs"
        className="z-50 acerSwift:max-macair133:text-b5"
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
            <Tooltip
              className="text-b4 acerSwift:max-macair133:text-b5"
              label="Reset"
            >
              <div className="border-none">
                <CloseButton size="sm" onClick={reset} />
              </div>
            </Tooltip>
          )
        }
      />
      {isFocused && (
        <div
          className="z-50 mt-2 absolute cursor-pointer w-full rounded-md bg-white text-slate-800 p-3 text-b4  acerSwift:max-macair133:text-b5 flex md:flex-row flex-col md:gap-0 gap-2 justify-between items-center"
          onClick={() => {
            setIsFocused(false);
            onSearch(searchValue);
          }}
          style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px" }}
        >
          <div className="flex z-50 md:w-fit w-full items-center gap-3">
            <TbSearch className="size-4" />
            {!!searchValue.length ? (
              <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                {ellipsisText(searchValue, 40)}
              </p>
            ) : (
              <p className="sm:max-ipad11:text-b5 acerSwift:max-macair133:text-b6">
                Show All Course
              </p>
            )}
          </div>

          <div className="flex md:w-fit sm:max-ipad11:text-b5 acerSwift:max-macair133:text-b6 w-full justify-end items-center text-secondary gap-1">
            Press
            <div className="ml-1 flex items-center gap-1 border border-secondary p-1 font-semibold rounded-[6px]">
              Enter{" "}
              <AiOutlineEnter className="stroke-[50px] sm:max-ipad11:text-b5 acerSwift:max-macair133:text-b6" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
