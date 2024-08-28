import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { getPLOs } from "@/services/plo/plo.service";
import { IModelPLO, IModelPLOCollection } from "@/models/ModelPLO";

import dupTQF from "@/assets/icons/dupTQF.svg?react";
import Icon from "@/components/Icon";
import { setShowSidebar } from "@/store/showSidebar";
import { IModelSection } from "@/models/ModelSection";
import { Button } from "@mantine/core";
import eyePublish from "@/assets/icons/eyePublish.svg?react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { upperFirst } from "lodash";

export default function Assignment() {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const { courseNo } = useParams();
  const [section, setSection] = useState<IModelSection>();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [totalPLOs, setTotalPLOs] = useState<number>(0);
  const [tqf3Part, setTqf3Part] = useState<string | null>("tqf3p1");
// const [items, setItems] = useState<any[]>([]);
//   useEffect(() => {
//     dispatch(setShowSidebar(true));
//     if (path) {
//       const locationList = path.split("/").filter(x => x && !parseInt(x)).map((x) => upperFirst(x));
//       const list: any[] = [];
//       locationList.forEach((location) => {
//         list.push({ title: location, link: location });
//       });
//       setItems(list);
//     }
//   }, []);

  //   const items = [
  //     { title: "Mantine", href: "#" },
  //     { title: "Mantine hooks", href: "#" },
  //     { title: "use-id", href: "#" },
  //   ];

  return (
    <>
      <div className="bg-white flex flex-col h-full w-full p-6 py-3 gap-3 overflow-hidden">
        {/* <Breadcrumbs items={items} /> */}
        <Breadcrumbs />
        <div className="flex flex-row  py-2  items-center justify-between">
          <p className="text-secondary text-[16px] font-semibold">
            {section?.assignments.length} Assignment
            {section?.assignments.length! > 1 && "s"}
          </p>

          <Button
            color="#178F51"
            leftSection={
              <Icon IconComponent={eyePublish} className="h-5 w-5" />
            }
            className="rounded-[8px] font-semibold text-[12px] w-fit  h-8 px-3 "
          >
            Publish
          </Button>
        </div>
      </div>
      <div className=" text-secondary font-semibold  whitespace-break-spaces">
        u need access na
      </div>
    </>
  );
}
