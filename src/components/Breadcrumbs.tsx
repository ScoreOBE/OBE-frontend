import { Link } from "react-router-dom";

type Props = {
  items: any[];
};

export default function Breadcrumbs({ items = [] }: Props) {
  // export default function Breadcrumbs() {
  // const breadcrumbs = useAppSelector((state) => state.breadcrumbs);
  return (
    <div className="flex gap-3">
      {items.map((item, index) => (
        <div className="flex gap-3" key={item.title}>
          <Link to={item.path!}>{item?.title}</Link>
          {index !== items.length - 1 && ">"}
        </div>
      ))}
    </div>
  );
}
