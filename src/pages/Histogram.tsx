import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { BarChart } from "@mantine/charts";
import { Scrollspy, useScrollspy } from "@makotot/ghostui";
import { IModelSection } from "@/models/ModelSection";
import { Alert, Button, Menu, Modal, Pill, Table } from "@mantine/core";
import eyePublish from "@/assets/icons/eyePublish.svg?react";
import publish from "@/assets/icons/publish.svg?react";
import publishEach from "@/assets/icons/publishEach.svg?react";
import publishAll from "@/assets/icons/publishAll.svg?react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getSectionNo } from "@/helpers/functions/function";
import { ROUTE_PATH } from "@/helpers/constants/route";
import needAccess from "@/assets/image/needAccess.jpg";
import {
  IconArrowRight,
  IconDots,
  IconInfoCircle,
  IconPencilMinus,
  IconTrash,
} from "@tabler/icons-react";
import { setShowNavbar } from "@/store/showNavbar";
import { setShowSidebar } from "@/store/showSidebar";
import { IModelUser } from "@/models/ModelUser";
import Loading from "@/components/Loading";

export default function Histogram() {
  const { courseNo, sectionNo } = useParams();
  const loading = useAppSelector((state) => state.loading);
  const user = useAppSelector((state) => state.user);
  const course = useAppSelector((state) =>
    state.course.courses.find((e) => e.courseNo == courseNo)
  );
  const section = course?.sections.find(
    (sec) => parseInt(sectionNo!) === sec.sectionNo
  );
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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
    { title: `Histogram Section ${getSectionNo(sectionNo)}` },
  ]);
  const [openAllPublishModal, setOpenAllPublishModal] = useState(false);
  const mockData = [{ name: "Quiz 1" }, { name: "Quiz 2" }, { name: "Quiz 3" }];

  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    // useRef<HTMLDivElement>(null),
    // useRef<HTMLDivElement>(null),
  ];

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  }, []);
  const data = [
    { month: "January", Smartphones: 1200, Laptops: 900, Tablets: 200 },
    { month: "February", Smartphones: 1900, Laptops: 1200, Tablets: 400 },
    { month: "March", Smartphones: 400, Laptops: 1000, Tablets: 200 },
    { month: "April", Smartphones: 1000, Laptops: 200, Tablets: 800 },
    { month: "May", Smartphones: 800, Laptops: 1400, Tablets: 1200 },
    { month: "June", Smartphones: 750, Laptops: 600, Tablets: 1000 },
  ];

  return (
    <>
      <div className="bg-white flex flex-col h-full w-full px-6 pt-5 gap-3 overflow-hidden">
        <Breadcrumbs items={items} />
        {/* <Breadcrumbs /> */}
        {loading ? (
          <Loading />
        ) : (section?.instructor as IModelUser)?.id === user.id ||
          (section?.coInstructors as IModelUser[])
            ?.map(({ id }) => id)
            .includes(user.id) ? (
          <div className="flex overflow-y-hidden w-full h-full  ">
            <Scrollspy sectionRefs={sectionRefs}>
              {({ currentElementIndexInViewport }) => {
                return (
                  <div className="flex gap-1  w-full h-full ">
                    <div className=" gap-6 flex flex-col my-1 w-[90%] overflow-y-auto overflow-x-visible px-1 pt-1   max-h-full ">
                      {mockData.map((item, i) => {
                        console.log(item.name, sectionRefs[i]);
                        return (
                          <div
                            style={{
                              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                            }}
                            className={` last:mb-4 flex flex-col rounded-md gap-10 px-5 py-3
                          ${currentElementIndexInViewport === i ? "active" : ""}
                          `}
                            id={`${item.name}`}
                            key={i}
                            ref={sectionRefs[i]}
                          >
                            <div className="flex flex-col border-b-2 border-nodata  py-2  items-start gap-5 text-start">
                              <p className="text-secondary text-[18px] text-start justify-start font-semibold">
                                {item.name} - 5.0 Points
                              </p>
                              <div className="flex px-8 flex-row justify-between w-full">
                                <div className="flex flex-col">
                                  <p className="font-semibold text-[16px] text-[#777777]">
                                    Mean
                                  </p>
                                  <p className="font-bold text-[28px] text-default">
                                    2.0
                                  </p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="font-semibold text-[16px] text-[#777777]">
                                    SD
                                  </p>
                                  <p className="font-bold text-[28px] text-default">
                                    2.15
                                  </p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="font-semibold text-[16px] text-[#777777]">
                                    Median
                                  </p>
                                  <p className="font-bold text-[28px] text-default">
                                    1.5
                                  </p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="font-semibold text-[16px] text-[#777777]">
                                    Max
                                  </p>
                                  <p className="font-bold text-[28px] text-default">
                                    4.5
                                  </p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="font-semibold text-[16px] text-[#777777]">
                                    Min
                                  </p>
                                  <p className="font-bold text-[28px] text-default">
                                    0
                                  </p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="font-semibold text-[16px] text-[#777777]">
                                    Q3
                                  </p>
                                  <p className="font-bold text-[28px] text-default">
                                    3.75
                                  </p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="font-semibold text-[16px] text-[#777777]">
                                    Q1
                                  </p>
                                  <p className="font-bold text-[28px] text-default">
                                    1.75
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="h-full w-full">
                              <BarChart
                                h={450}
                                tickLine="x"
                                data={data}
                                dataKey="month"
                                series={[
                                  { name: "Smartphones", color: "violet.6" },
                                  { name: "Laptops", color: "blue.6" },
                                  { name: "Tablets", color: "teal.6" },
                                ]}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <ul>
                      {mockData.map((item, i) => (
                        <li
                          key={i}
                          className={
                            currentElementIndexInViewport === i ? "active" : ""
                          }
                        >
                          <a
                            href={`#${item.name}`}
                            className={
                              currentElementIndexInViewport === i
                                ? "text-[#849524]"
                                : "text-default"
                            }
                          >
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }}
            </Scrollspy>
          </div>
        ) : (
          <div className="flex px-16  flex-row items-center justify-between h-full">
            <div className="flex justify-center  h-full items-start gap-2 flex-col">
              <p className="   text-secondary font-semibold text-[22px]">
                You need access
              </p>
              <p className=" text-[#333333] leading-6 font-medium text-[14px]">
                You're not listed as a Co-Instructor. <br /> Please contact the
                section owner for access.
              </p>
            </div>
            <img
              className=" z-50  size-[460px] "
              src={needAccess}
              alt="loginImage"
            />
          </div>
        )}
      </div>
    </>
  );
}
