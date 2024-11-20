import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useRef, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useParams, useSearchParams } from "react-router-dom";
import { getSectionNo } from "@/helpers/functions/function";
import { ROUTE_PATH } from "@/helpers/constants/route";
import needAccess from "@/assets/image/needAccess.jpg";
import Loading from "@/components/Loading/Loading";
import notFoundImage from "@/assets/image/notFound.jpg";
import React from "react";
import { Tabs } from "@mantine/core";
import ChartContainer from "@/components/Chart/ChartContainer";
type TabState = {
  [key: number]: string;
};

export default function Histogram() {
  const { courseNo, sectionNo } = useParams();
  const [tabStates, setTabStates] = useState<TabState>({});
  const handleTabChange = (index: any, newValue: any) => {
    setTabStates((prevStates) => ({
      ...prevStates,
      [index]: newValue,
    }));
  };
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
  const course = useAppSelector((state) =>
    state.course.courses.find((e) => e.courseNo == courseNo)
  );
  const section = course?.sections.find(
    (sec) => parseInt(sectionNo!) === sec.sectionNo
  );
  const [params] = useSearchParams();
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<any[]>([
    {
      title: "Your Course",
      path: `${ROUTE_PATH.INS_DASHBOARD}?${params.toString()}`,
    },
    {
      title: "Sections",
      path: `${ROUTE_PATH.COURSE}/${courseNo}/${
        ROUTE_PATH.SECTION
      }?${params.toString()}`,
    },
    { title: `Chart Section ${getSectionNo(sectionNo)}` },
  ]);

  const sectionRefs = useRef(
    section?.assignments!.map(() => React.createRef<HTMLDivElement>())
  );
  const [activeSection, setActiveSection] = useState<number>(0);

  useEffect(() => {
    if (section) {
      sectionRefs.current = section.assignments!.map(
        (_, i) => sectionRefs.current?.at(i) || React.createRef()
      );
    }
  }, [section]);

  useEffect(() => {
    if (sectionRefs.current) {
      if (!sectionRefs.current.every((ref) => ref.current)) return;
      let observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = sectionRefs.current!.findIndex(
                (ref) => ref.current === entry.target
              );
              setActiveSection(index);
            }
          });
        },
        {
          root: null,
          threshold: 0.6,
        }
      );

      sectionRefs.current.forEach((ref, i) => {
        if (ref.current) {
          observer.observe(ref.current);
        }
      });

      return () => {
        sectionRefs.current!.forEach((ref) => {
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        });
      };
    }
  }, [section, sectionRefs]);

  return (
    <div className="bg-white flex flex-col h-full w-full px-6 pt-5  gap-3 overflow-hidden">
      <Breadcrumbs items={items} />
      {loading ? (
        <Loading />
      ) : (section?.instructor as any)?.id === user.id ||
        (section?.coInstructors as any[])
          ?.map(({ id }) => id)
          .includes(user.id) ? (
        <div className="flex overflow-y-auto overflow-x-hidden max-w-full h-full">
          {section?.assignments?.length !== 0 ? (
            <div className="flex gap-6 w-full h-full">
              <div className="gap-4 flex flex-col my-2 min-w-[86%] max-w-[87%] overflow-y-auto px-1 pt-1 max-h-full">
                {section &&
                  section?.assignments?.map((item, i) => {
                    return (
                      <div
                        style={{
                          boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                        }}
                        className={`last:mb-4 flex px-2 flex-col rounded-md gap-10 py-2 ${
                          activeSection === i ? "active" : ""
                        }`}
                        id={`${item.name}`}
                        key={i}
                        ref={sectionRefs.current?.at(i)} // Dynamic refs
                      >
                        <Tabs
                          classNames={{
                            root: "overflow-hidden mt-1 mx-3 flex flex-col max-h-full",
                          }}
                          value={tabStates[i] || "histogram"} // Default tab for new items
                          onChange={(newValue) => handleTabChange(i, newValue)} // Update specific tab
                        >
                          <Tabs.List className="mb-2">
                            <Tabs.Tab value="histogram">Histogram</Tabs.Tab>
                            <Tabs.Tab value="bellCurve">Distribution</Tabs.Tab>
                          </Tabs.List>
                          <Tabs.Panel
                            className="flex flex-col gap-1"
                            value="histogram"
                          >
                            <ChartContainer
                              type="histogram"
                              data={item}
                              students={section.students!}
                            />
                          </Tabs.Panel>
                          <Tabs.Panel
                            className="flex flex-col gap-1"
                            value="bellCurve"
                          >
                            <ChartContainer
                              type="curve"
                              data={item}
                              students={section.students!}
                            />
                          </Tabs.Panel>
                        </Tabs>
                      </div>
                    );
                  })}
              </div>

              <div className="max-w-[12%] mt-3 flex flex-col  ">
                {section?.assignments?.map((item, i) => (
                  <div
                    key={i}
                    className={`max-w-fit  ${
                      activeSection === i ? "active" : ""
                    }`}
                  >
                    <a href={`#${item.name}`}>
                      <p
                        className={`mb-[7px] text-ellipsis font-semibold overflow-hidden whitespace-nowrap text-[13px] ${
                          activeSection === i
                            ? "text-secondary"
                            : "text-[#D2C9C9] "
                        }`}
                      >
                        {item.name}
                      </p>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center !h-full !w-full -mt-[10px] justify-between px-16">
              <div className="flex flex-col gap-3 text-start">
                <p className="!h-full text-[20px] text-secondary font-semibold">
                  No Assignment
                </p>{" "}
                <p className=" text-[#333333] -mt-1 text-b2 break-words font-medium leading-relaxed">
                  The histogram will show when the assignment is uploaded.
                </p>{" "}
              </div>
              <div className=" items-center justify-center flex">
                <img
                  src={notFoundImage}
                  className="h-full items-center  w-[24vw] justify-center flex flex-col"
                  alt="notFound"
                ></img>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex px-16  flex-row items-center justify-between h-full">
          <div className="flex justify-center h-full items-start gap-2 flex-col">
            <p className="text-secondary font-semibold text-[22px]">
              You need access
            </p>
            <p className="text-[#333333] leading-6 font-medium text-[14px]">
              You're not listed as a Co-Instructor. <br /> Please contact the
              Owner section for access.
            </p>
          </div>
          <img
            className="z-50 size-[460px]"
            src={needAccess}
            alt="loginImage"
          />
        </div>
      )}
    </div>
  );
}
