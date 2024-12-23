import { Link } from "react-router-dom";
import IconChevronRight from "@/assets/icons/chevronRight.svg?react";
import Icon from "./Icon";
type Props = {
  items: any[];
};

export default function Breadcrumbs({ items = [] }: Props) {
  return (
    <div className="flex gap-3 bg-[#e7f0ff] px-4 py-[10px] rounded-md">
      {items.map((item, index) => (
        <div
          className="flex items-center justify-center gap-3 text-b2  acerSwift:max-macair133:!text-b3"
          key={item.title}
        >
          <Link
            to={item.path!}
            className={` ${
              !item.path
                ? "!text-[#3F4474] font-bold cursor-default"
                : "text-secondary hover:underline cursor-pointer font-semibold"
            }`}
          >
            {item?.title}
          </Link>
          {index !== items.length - 1 && (
            <div>
              <Icon
                IconComponent={IconChevronRight}
                className=" stroke-[#6674d3] size-4   acerSwift:max-macair133:!size-3 stroke-[2.5px]"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
