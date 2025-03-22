import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import cpeLogoRed from "@/assets/image/cpeLogoRed.png";
import { setShowSidebar, setShowNavbar, setDashboard } from "@/store/config";
import { COURSE_TYPE, ROLE } from "@/helpers/constants/enum";
import OBEDocument from "@/assets/document.pdf";
import { setDataTQF3, setPloTQF3, setSelectTqf3Topic } from "@/store/tqf3";
import { getOneCourseManagement } from "@/services/courseManagement/courseManagement.service";
import { IModelSection } from "@/models/ModelCourse";
import { unionBy, uniq } from "lodash";
import Icon from "@/components/Icon";
import React from "react";
import { getPLOs } from "@/services/plo/plo.service";
import Part1TQF3 from "@/components/TQF3/Part1TQF3";
import scoreobe from "@/assets/image/scoreOBElogobold.png";
import Part2TQF3 from "@/components/TQF3/Part2TQF3";
import Part3TQF3 from "@/components/TQF3/Part3TQF3";
import Part4TQF3 from "@/components/TQF3/Part4TQF3";
import Part5TQF3 from "@/components/TQF3/Part5TQF3";
import Part6TQF3 from "@/components/TQF3/Part6TQF3";
import Part7TQF3 from "@/components/TQF3/Part7TQF3";
import Loading from "@/components/Loading/Loading";
import Bottombar from "@/components/Bottombar";
import { getOneCourse } from "@/services/course/course.service";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import { setCourseSyllabus } from "@/store/courseSyllabus";
import IconExternal from "@/assets/icons/externalLink.svg?react";
import ModalTermsOfService from "@/components/Modal/ModalTermOfService";
import { ROUTE_PATH } from "@/helpers/constants/route";

export default function CourseSyllabus() {
  const { courseNo } = useParams();
  const enrollCourse = useAppSelector((state) =>
    state.enrollCourse.courses.find((e) => e.courseNo == courseNo)
  );
  const [searchParams] = useSearchParams();
  const location = useLocation().pathname;
  const year = searchParams.get("year");
  const semester = searchParams.get("semester");
  const topic = searchParams.get("topic") ?? enrollCourse?.section.topic;
  const [loading, setLoading] = useState(false);
  const user = useAppSelector((state) => state.user);
  const course = useAppSelector((state) =>
    state.courseSyllabus.courses.find(
      (e) => e.courseNo == courseNo && e.sections[0].topic == topic
    )
  );
  const tqf3 = useAppSelector((state) => state.tqf3);
  const [openModalTOS, setOpenModalTOS] = useState(false);
  const currentYear = new Date().getFullYear();
  const dispatch = useAppDispatch();
  const section = ["Part 1", "Part 2", "Part 3", "Part 4", "Part 5", "Part 6"];
  const partSections = [
    { value: section[0], compo: <Part1TQF3 /> },
    { value: section[1], compo: <Part2TQF3 /> },
    { value: section[2], compo: <Part3TQF3 /> },
    { value: section[3], compo: <Part4TQF3 /> },
    { value: section[4], compo: <Part5TQF3 /> },
    { value: section[5], compo: <Part7TQF3 /> },
  ];
  const sectionRefs = useRef(
    section.map(() => React.createRef<HTMLDivElement>())
  );
  const [activeSection, setActiveSection] = useState<number>(0);

  useEffect(() => {
    const stdOneCourse = location.includes(ROUTE_PATH.STD_DASHBOARD);
    dispatch(setShowSidebar(stdOneCourse));
    dispatch(setShowNavbar(true));
    dispatch(setSelectTqf3Topic(topic));
    if (courseNo && year && semester && !course) fetchCourse();
  }, [course]);

  useEffect(() => {
    if (user.id) {
      dispatch(setDashboard(ROLE.STUDENT));
      localStorage.setItem("dashboard", ROLE.STUDENT);
    }
  }, [user]);

  const fetchCourse = async () => {
    setLoading(true);
    const res = await getOneCourse({
      courseNo,
      topic: enrollCourse?.section?.topic,
      year: parseInt(year!),
      semester: parseInt(semester!),
      courseSyllabus: true,
    });
    if (res) {
      dispatch(setCourseSyllabus({ courses: [{ ...res }] }));
    }
    setLoading(false);
  };

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
        threshold: 0.5,
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
    if (course && tqf3.coursePLO) {
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
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <>
      <ModalTermsOfService
        opened={openModalTOS}
        onClose={() => setOpenModalTOS(false)}
      />
      <div className="flex overflow-hidden justify-center items-center w-full h-full">
        {loading || !tqf3.id ? (
          <Loading />
        ) : (
          <div className="flex overflow-hidden w-full  h-full gap-3 py-2">
            <div className="flex flex-col h-full max-w-[87%]  iphone:max-sm:max-w-[100%] py-5 px-10 iphone:max-sm:px-5 bg gap-4 overflow-auto">
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-xl sm:text-2xl">
                      <span className="!drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                        ScoreOBE+{" "}
                      </span>
                    </p>
                    <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Course View
                    </div>
                  </div>

                  <div className=" border-gray-200  ">
                    <h1 className="font-semibold text-lg sm:text-xl text-[#1f69f3]">
                      {courseNo} - {course?.courseName}
                    </h1>
                    <ul className="mt-4 space-y-1  text-gray-700 text-sm sm:text-base">
                      <li className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-[#1f69f3] rounded-full mt-2 mr-2"></span>
                        {course?.descTH}
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-[#1f69f3] rounded-full mt-2 mr-2"></span>
                        {course?.descEN}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

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
              <footer className="w-full border-t  text-default  pt-10 ">
                <div className=" px-8 sm:px-4  mx-auto">
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                    {/* Logo and main info */}
                    <div className="md:col-span-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={scoreobe}
                          alt="cpeLogo"
                          className=" sm:h-[28px] h-[22px] "
                        />
                        <h2 className="font-[600] sm:text-[18px] text-[14px] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                          ScoreOBE+
                        </h2>
                      </div>
                      <p className="sm:text-sm iphone:max-sm:text-[12px]  max-w-md">
                        Advanced scoring and assessment software designed to
                        streamline educational evaluation processes.
                      </p>
                    </div>

                    <div className="md:col-span-3 space-y-4">
                      <h3 className="text-sm font-semibold text-secondary ">
                        Quick Links
                      </h3>
                      <ul className="space-y-2 sm:text-[14px] iphone:max-sm:text-[12px]">
                      <li>
                      <a
                        href={OBEDocument}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Documentation
                      </a>
                    </li>

                        <li>
                          <a href="https://www.cmu.ac.th/th/privacy">
                            Privacy Policy
                          </a>
                        </li>
                        <li>
                          <a
                            className=" cursor-pointer"
                            onClick={() => setOpenModalTOS(true)}
                          >
                            Terms of Service
                          </a>
                        </li>
                      </ul>
                    </div>

                    {/* University links */}
                    <div className="md:col-span-4 space-y-4">
                      <h3 className="text-sm font-semibold text-secondary ">
                        Chiang Mai University
                      </h3>
                      <ul className="space-y-2 sm:text-[14px] iphone:max-sm:text-[12px]">
                        <div className="flex items-center flex-row ">
                          <a
                            href="https://www.cpe.eng.cmu.ac.th/"
                            target="_blank"
                          >
                            Department of Computer Engineering
                          </a>
                          <Icon
                            IconComponent={IconExternal}
                            className="size-4 ml-1"
                          />
                        </div>
                        <div className="flex items-center flex-row ">
                          <a href="https://eng.cmu.ac.th/" target="_blank">
                            Faculty of Engineering
                          </a>
                          <Icon
                            IconComponent={IconExternal}
                            className="size-4 ml-1"
                          />
                        </div>
                        <div className="flex items-center flex-row ">
                          <a href="https://www.cmu.ac.th/" target="_blank">
                            Chiang Mai University
                          </a>
                          <Icon
                            IconComponent={IconExternal}
                            className="size-4 ml-1"
                          />
                        </div>
                      </ul>
                    </div>
                  </div>

                  <div className="my-8 border-[1px]  "></div>

                  <div className="flex flex-col md:flex-row justify-between md:items-center items-start  gap-4">
                    <p className="sm:text-xs iphone:max-sm:text-[10px] text-slate-600  text-center md:text-left">
                      &copy; {currentYear} ScoreOBE+ Software. All rights
                      reserved.
                    </p>
                    <div className="flex flex-col md:items-end md:text-end gap-1">
                      <img
                        src={cpeLogoRed}
                        alt="cpeLogo"
                        className="sm:h-[36px] mb-2 h-[30px] sm:w-[125px] w-[105px] iphone:max-sm:-ml-[4px] "
                      />
                      <p className="sm:text-xs iphone:max-sm:text-[10px] text-slate-600 ">
                        Designed and developed by the Department of Computer
                        Engineering,
                      </p>
                      <p className="sm:text-xs iphone:max-sm:text-[10px] text-slate-600 ">
                        Faculty of Engineering, Chiang Mai University
                      </p>
                    </div>
                  </div>
                </div>
              </footer>
            </div>

            <div className="max-w-[12%] iphone:max-sm:hidden mt-3 flex flex-col gap-[7px]">
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
    </>
  );
}
