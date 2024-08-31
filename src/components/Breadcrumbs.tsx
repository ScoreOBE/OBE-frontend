import { Link, useLocation } from "react-router-dom";
import { IconChevronRight } from "@tabler/icons-react";
type Props = {
  items: any[];
};

export default function Breadcrumbs({ items = [] }: Props) {
  const location = useLocation();

  return (
    <div className="flex gap-3 bg-bgSecond px-3 py-2 rounded-md">
      {items.map((item, index) => (
        <div
          className="flex items-center justify-center gap-3 text-[14px]"
          key={item.title}
        >
          <Link
            to={item.path!}
            className={`font-medium ${
              !item.path ? "text-[#3F4474]" : "text-secondary"
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
