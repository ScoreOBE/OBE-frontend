import { Link } from "react-router-dom";
import { IconChevronRight } from "@tabler/icons-react";
type Props = {
  items: any[];
};

export default function Breadcrumbs({ items = [] }: Props) {
  return (
    <div className="flex gap-3 bg-[#f1f3fe] px-4 py-[10px] rounded-md">
      {items.map((item, index) => (
        <div
          className="flex items-center justify-center gap-3 text-[14px]"
          key={item.title}
        >
          <Link
            to={item.path!}
            className={` ${
              !item.path
                ? "!text-[#3F4474] font-bold cursor-default"
                : "text-secondary hover:underline font-semibold"
            }`}
          >
            {item?.title}
          </Link>
          {index !== items.length - 1 && (
            <div>
              <IconChevronRight color="#8F9AE3" size={13} stroke={3} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
