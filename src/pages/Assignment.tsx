import { useAppDispatch } from "@/store";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { setShowSidebar } from "@/store/showSidebar";
import { IModelSection } from "@/models/ModelSection";
import { Button } from "@mantine/core";
import eyePublish from "@/assets/icons/eyePublish.svg?react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getSectionNo } from "@/helpers/functions/function";
import { ROUTE_PATH } from "@/helpers/constants/route";

export default function Assignment() {
  const { courseNo, sectionNo } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState<IModelSection>();
  const [items, setItems] = useState<any[]>([
    {
      title: "Your Course",
      path: `${ROUTE_PATH.DASHBOARD_INS}?${params.toString()}`,
    },
    {
      title: "Sections",
      path: `${ROUTE_PATH.COURSE}/${courseNo}/${
        ROUTE_PATH.SECTION
      }?${params.toString()}`,
    },
    { title: getSectionNo(sectionNo) },
  ]);

  useEffect(() => {
    dispatch(setShowSidebar(true));
  }, []);

  return (
    <>
      <div className="bg-white flex flex-col h-full w-full p-6 py-3 gap-3 overflow-hidden">
        <Breadcrumbs items={items} />
        {/* <Breadcrumbs /> */}
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
