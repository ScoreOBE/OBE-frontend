import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { useParams, useSearchParams } from "react-router-dom";
import { setLoading } from "@/store/loading";
import { setShowSidebar, setShowNavbar, setDashboard } from "@/store/config";
import { COURSE_TYPE, ROLE } from "@/helpers/constants/enum";
import { setDataTQF3, setPloTQF3, setSelectTqf3Topic } from "@/store/tqf3";
import { getOneCourseManagement } from "@/services/courseManagement/courseManagement.service";
import { IModelSection } from "@/models/ModelCourse";
import { unionBy, uniq } from "lodash";
import Icon from "@/components/Icon";
import React from "react";
import { getPLOs } from "@/services/plo/plo.service";
import Part1TQF3 from "@/components/TQF3/Part1TQF3";
import Part2TQF3 from "@/components/TQF3/Part2TQF3";
import Part3TQF3 from "@/components/TQF3/Part3TQF3";
import Part4TQF3 from "@/components/TQF3/Part4TQF3";
import Part5TQF3 from "@/components/TQF3/Part5TQF3";
import Part6TQF3 from "@/components/TQF3/Part6TQF3";
import Part7TQF3 from "@/components/TQF3/Part7TQF3";
import Loading from "@/components/Loading/Loading";
import Bottombar from "@/components/Bottombar";

export default function CourseSyllabus() {
  const { courseNo } = useParams();
  const [searchParams] = useSearchParams();
  const year = searchParams.get("year");
  const semester = searchParams.get("semester");
  const topic = searchParams.get("topic") ?? null;
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
  const course = useAppSelector((state) =>
    state.courseSyllabus.courses.find(
      (e) => e.courseNo == courseNo && e.sections[0].topic == topic
    )
  );
  const tqf3 = useAppSelector((state) => state.tqf3);
  const dispatch = useAppDispatch();
  const section = [
    "Part 1",
    "Part 2",
    "Part 3",
    "Part 4",
    "Part 5",
    "Part 6",
    "Part 7",
  ];
  const partSections = [
    {
      value: section[0],
      compo: <Part1TQF3 />,
    },
    {
      value: section[1],
      compo: <Part2TQF3 />,
    },
    {
      value: section[2],
      compo: <Part3TQF3 />,
    },
    {
      value: section[3],
      compo: <Part4TQF3 />,
    },
    {
      value: section[4],
      compo: <Part5TQF3 />,
    },
    {
      value: section[5],
      compo: <Part6TQF3 />,
    },
    {
      value: section[6],
      compo: <Part7TQF3 />,
    },
  ];
  const sectionRefs = useRef(
    section.map(() => React.createRef<HTMLDivElement>())
  );
  const [activeSection, setActiveSection] = useState<number>(0);

  useEffect(() => {
    dispatch(setShowNavbar(true));
    dispatch(setShowSidebar(!!user.id));
  }, [user]);

  useEffect(() => {
    if (tqf3.id) {
      sectionRefs.current = section.map(
        (_, i) => sectionRefs.current.at(i) || React.createRef<HTMLDivElement>()
      );
    }
  }, [tqf3]);

  useEffect(() => {
    let observer = new IntersectionObserver(
      (entries) => {
        let visibleIndex = activeSection;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex(
              (ref) => ref.current === entry.target
            );
            visibleIndex = index;
          }
        });
        setActiveSection(visibleIndex);
      },
      {
        root: null,
        threshold: 0.2,
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, [sectionRefs.current, activeSection]);

  useEffect(() => {
    if (user.id) {
      dispatch(setDashboard(ROLE.STUDENT));
      localStorage.setItem("dashboard", ROLE.STUDENT);
    }
  }, [user]);

  useEffect(() => {
    dispatch(setSelectTqf3Topic(topic));
    if (course && tqf3.topic == topic && !tqf3.coursePLO?.length) {
      fetchPLO();
    }
  }, [course, topic, tqf3.topic]);

  const uniqueCurriculum = () => {
    if (course?.type == COURSE_TYPE.SEL_TOPIC.en) {
      return uniq(
        course?.sections
          .filter((item) => item.topic == tqf3.topic)
          .flatMap(({ curriculum }) => curriculum)
          .flat()
          .filter(Boolean)
      );
    } else {
      return uniq(
        course?.sections
          .flatMap(({ curriculum }) => curriculum)
          .flat()
          .filter(Boolean)
      );
    }
  };

  useEffect(() => {
    if (courseNo && year && semester && tqf3.coursePLO) {
      fetchOneCourse();
    }
  }, [tqf3.topic, tqf3.coursePLO]);

  const fetchPLO = async () => {
    const curriculum = uniqueCurriculum();
    if (curriculum.length) {
      const resPloCol = await getPLOs({ curriculum });
      if (resPloCol) {
        dispatch(setPloTQF3({ curriculum, coursePLO: resPloCol.plos }));
      }
    } else {
      dispatch(setPloTQF3({ curriculum, coursePLO: [] }));
    }
  };

  const fetchOneCourse = async () => {
    dispatch(setLoading(true));
    let resPloRequired = await getOneCourseManagement({
      courseNo,
      courseSyllabus: true,
    });
    if (course) {
      if (course.type == COURSE_TYPE.SEL_TOPIC.en) {
        const section = course.sections.find(
          (sec: Partial<IModelSection>) => sec.topic == tqf3.topic
        );
        const ploRequire = unionBy(
          resPloRequired?.sections
            .filter((item: any) => item.topic == tqf3.topic)
            .flatMap((item: any) => item.ploRequire),
          "curriculum"
        )?.filter((plo: any) =>
          tqf3.coursePLO?.find((cPlo) => cPlo.id == plo.plo)
        );
        dispatch(
          setDataTQF3({
            courseSyllabus: true,
            ploRequired: ploRequire || [],
            ...section?.TQF3,
            type: course.type,
            sections: [...course.sections],
          })
        );
      } else {
        const ploRequire = resPloRequired?.ploRequire.filter((plo: any) =>
          tqf3.coursePLO?.find((cPlo) => cPlo.id == plo.plo)
        );
        dispatch(
          setDataTQF3({
            courseSyllabus: true,
            ploRequired: ploRequire || [],
            ...course.TQF3!,
            type: course.type,
            sections: [...course.sections],
          })
        );
      }
    }
    dispatch(setLoading(false));
  };

  return (
    <>
      <div className="flex overflow-hidden justify-center items-center w-full h-full">
        {loading || !tqf3.id ? (
          <Loading />
        ) : (
          <div className="flex overflow-hidden w-full  h-full gap-3 py-2">
      
            <div className="flex flex-col h-full max-w-[87%] pt-5 px-10 bg gap-4 overflow-auto">
            <p className=" font-semibold text-[18px] text-secondary mb-3">{courseNo}-{course?.courseName}</p>
              {section.map((name, i) => (
                <div
                  id={name}
                  key={i}
                  ref={sectionRefs.current.at(i)}
                  className={`${activeSection === i ? "active" : ""}`}
                >
                  {partSections[i].compo}
                </div>
              ))}
            </div>

            <div className="max-w-[12%] mt-3 flex flex-col gap-[7px]">
              {section.map((name, i) => (
                <div
                  key={name}
                  className={`max-w-fit cursor-pointer ${
                    activeSection === i ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveSection(i);
                    sectionRefs.current[i].current?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  <p
                    className={`text-ellipsis font-semibold overflow-hidden whitespace-nowrap text-b3 acerSwift:max-macair133:!text-b4 ${
                      activeSection === i ? "text-secondary" : "text-[#D2C9C9]"
                    }`}
                  >
                    {name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* <Bottombar /> */}
    </>
  );
}
