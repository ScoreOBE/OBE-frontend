import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useRef, useState } from "react";
import HistogramChart from "@/components/HistogramChart";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getSectionNo } from "@/helpers/functions/function";
import { ROUTE_PATH } from "@/helpers/constants/route";
import needAccess from "@/assets/image/needAccess.jpg";
import Loading from "@/components/Loading";
import React from "react";
import {
  IModelAssignment,
  IModelQuestion,
  IModelScore,
} from "@/models/ModelSection";
import { IModelUser } from "@/models/ModelUser";
import { ROLE } from "@/helpers/constants/enum";

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
  const [params] = useSearchParams();
  const navigate = useNavigate();
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
    { title: `Histogram Section ${getSectionNo(sectionNo)}` },
  ]);

  const mockData = [
    { name: "สอบกลางภาค" },
    { name: "สอบเก็บคะแนนครั้งที่ 1 hhhmmmmmmmและ 2" },
    { name: "Quiz 3" },
  ];

  // Mock Data for HistogramChart Component
  const generateMockUser = (index: number): IModelUser => ({
    id: `user-${index + 1}`,
    studentId: `student-${index + 1}`,
    firstNameTH: `ชื่อ${index + 1}`,
    lastNameTH: `นามสกุล${index + 1}`,
    firstNameEN: `FirstName${index + 1}`,
    lastNameEN: `LastName${index + 1}`,
    email: `student${index + 1}@example.com`,
    facultyCode: `FAC${index % 5}`, // Example faculty code
    departmentCode: [`DEP${index % 3}`], // Example department codes
    role: index % 2 === 0 ? ROLE.STUDENT : ROLE.ADMIN, // Use the ROLE enum
    enrollCourses: [], // Can add specific courses if needed
  });

  // Generate assignments mock data
  const assignments: IModelAssignment[] = Array.from(
    { length: 12 },
    (_, index) => ({
      name: `Assignment ${index + 1}`,
      desc: `Description for Assignment ${index + 1}`,
      isPublish: index % 2 === 0,
      weight: Math.floor(index) + 1,
      questions: Array.from(
        { length: 5 },
        (_, qIndex): IModelQuestion => ({
          no: qIndex + 1,
          desc: `Question ${qIndex + 1} Description`,
          fullScore: 100,
          scores: Array.from(
            { length: 30 },
            (_, sIndex): IModelScore => ({
              student: generateMockUser(sIndex), // Generate a mock user for each score
              point: Math.floor(Math.random() * 100),
            })
          ),
        })
      ),
    })
  );
  const sectionRefs = useRef(
    assignments.map(() => React.createRef<HTMLDivElement>())
  );
  const [activeSection, setActiveSection] = useState<number>(0);

  useEffect(() => {
    sectionRefs.current = assignments.map(
      (_, i) => sectionRefs.current[i] || React.createRef()
    );
  }, [assignments.length]);

  useEffect(() => {
    if (!sectionRefs.current.every((ref) => ref.current)) return;

    let observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex(
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
      sectionRefs.current.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [section, sectionRefs, assignments.length]);

  return (
    <div className="bg-white flex flex-col h-full w-full px-6 pt-5  gap-3 overflow-hidden">
      <Breadcrumbs items={items} />
      {loading ? (
        <Loading />
      ) : (section?.instructor as any)?.id === user.id ||
        (section?.coInstructors as any[])
          ?.map(({ id }) => id)
          .includes(user.id) ? (
        <div className="flex overflow-y-auto overflow-x-hidden  max-w-full h-full">
          <div className="flex gap-6 w-full h-full">
            <div className="gap-4 flex flex-col my-2 min-w-[86%] max-w-[87%] overflow-y-auto px-1 pt-1 max-h-full">
              {assignments.map((item, i) => (
                <div
                  style={{
                    boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                  }}
                  className={`last:mb-4 flex px-2 flex-col rounded-md gap-10 py-2 ${
                    activeSection === i ? "active" : ""
                  }`}
                  id={`${item.name}`}
                  key={i}
                  ref={sectionRefs.current[i]} // Dynamic refs
                >
                  <HistogramChart data={item} isQuestions={false} />
                </div>
              ))}
            </div>

            <div className="max-w-[12%] mt-3 flex flex-col  ">
              {assignments.map((item, i) => (
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
        </div>
      ) : (
        <div className="flex px-16 flex-row items-center justify-between h-full">
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
