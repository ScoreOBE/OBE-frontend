import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ROUTE_PATH } from "@/helpers/constants/route";
import Loading from "@/components/Loading/Loading";
import notFoundImage from "@/assets/image/notFound.jpg";
import React from "react";
import { Tabs } from "@mantine/core";
import ChartContainer from "@/components/Chart/ChartContainer";
import { ROLE } from "@/helpers/constants/enum";
import { setShowSidebar, setShowNavbar, setDashboard } from "@/store/config";

type TabState = {
  [key: number]: string;
};

export default function StdChart() {
  const { courseNo } = useParams();
  const [tabStates, setTabStates] = useState<TabState>({});
  const handleTabChange = (index: any, newValue: any) => {
    setTabStates((prevStates) => ({
      ...prevStates,
      [index]: newValue,
    }));
  };
  const loading = useAppSelector((state) => state.loading.loading);
  const course = useAppSelector((state) =>
    state.enrollCourse.courses.find((e) => e.courseNo == courseNo)
  );
  const [params] = useSearchParams();
  const dispatch = useAppDispatch();

  const sectionRefs = useRef(
    course?.section?.assignments!.map(() => React.createRef<HTMLDivElement>())
  );
  const [activeSection, setActiveSection] = useState<number>(0);

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    dispatch(setDashboard(ROLE.STUDENT));
    localStorage.setItem("dashboard", ROLE.STUDENT);
  }, []);

  useEffect(() => {
    if (course?.section) {
      sectionRefs.current = course.section.assignments!.map(
        (_, i) => sectionRefs.current?.at(i) || React.createRef()
      );
    }
  }, [course]);

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
  }, [sectionRefs.current]);

  return (
    <div className="bg-white flex flex-col h-full w-full px-6 pt-5  gap-3 overflow-hidden">
      {loading ? (
        <Loading />
      ) : (
        <div className="flex overflow-y-auto overflow-x-hidden max-w-full h-full">
          {course?.section?.assignments?.length !== 0 ? (
            <div className="flex gap-6 w-full h-full">
              <div className="gap-4 flex flex-col my-2 min-w-[86%] max-w-[87%] overflow-y-auto px-1 pt-1 max-h-full">
                {course?.section &&
                  course.section.assignments?.map((item, i) => {
                    const studentScore = course.scores
                      .find(({ assignmentName }) => assignmentName == item.name)
                      ?.questions.reduce((a, { score }) => a + score, 0);
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
                        ref={sectionRefs.current!.at(i)} // Dynamic refs
                      >
                        <Tabs
                          classNames={{
                            root: "overflow-hidden mt-1 mx-3 flex flex-col max-h-full",
                          }}
                          value={tabStates[i] || "bellCurve"} // Default tab for new items
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
                              studentScore={studentScore}
                            />
                          </Tabs.Panel>
                          <Tabs.Panel
                            className="flex flex-col gap-1"
                            value="bellCurve"
                          >
                            <ChartContainer
                              type="curve"
                              data={item}
                              studentScore={studentScore}
                            />
                          </Tabs.Panel>
                        </Tabs>
                      </div>
                    );
                  })}
              </div>

              <div className="max-w-[12%] mt-3 flex flex-col  ">
                {course?.section?.assignments?.map((item, i) => (
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
                  The chart will show when the assignment is publish.
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
      )}
    </div>
  );
}
