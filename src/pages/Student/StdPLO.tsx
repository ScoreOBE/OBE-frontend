import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import maintenace from "@/assets/image/maintenance.jpg";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import IconPLO from "@/assets/icons/PLOdescription.svg?react";
import { ROLE } from "@/helpers/constants/enum";
import Loading from "@/components/Loading/Loading";
import { RadarChart } from "@mantine/charts";
import { Button, Table } from "@mantine/core";
import DrawerPLOdes from "@/components/DrawerPLO";
import Icon from "@/components/Icon";
import { log } from "console";
import { IModelPLO } from "@/models/ModelPLO";
import { getOnePLO } from "@/services/plo/plo.service";
import SpiderChart from "@/components/Chart/SpiderChart";

export default function StdPLO() {
  const { courseNo } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.loading.loading);
  const [departmentPLO, setDepartmentPLO] = useState<Partial<IModelPLO>>({});
  const user = useAppSelector((state) => state.user);
  const term = useAppSelector((state) =>
    state.academicYear.find(
      (term) =>
        term.year == parseInt(params.get("year") || "") &&
        term.semester == parseInt(params.get("semester") || "")
    )
  );
  const department = useAppSelector((state) =>
    state.faculty.department.slice(1)
  );

  const course = useAppSelector((state) =>
    state.course.courses.find((c) => c.courseNo == courseNo)
  );
  const courseDep = department.find(
    (dep) => dep.courseCode == parseInt(course?.courseNo.substring(0, 3)!)
  );

  const height = window.innerWidth >= 1800 ? 650 : 450;

  useEffect(() => {
    if (courseDep) {
      fetchPLO();
    }
  }, [courseDep]);

  const fetchPLO = async () => {
    const resPloCol = await getOnePLO({
      year: term?.year,
      semester: term?.semester,
      codeEN: courseDep?.codeEN,
    });
    if (resPloCol) {
      setDepartmentPLO(resPloCol);
    }
  };

  const enrollCourses = useAppSelector((state) => state.enrollCourse);
  const dispatch = useAppDispatch();

  const [openDrawerPLOdes, setOpenDrawerPLOdes] = useState(false);
  const [test, setTest] = useState(true);

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    dispatch(setDashboard(ROLE.STUDENT));
    localStorage.setItem("dashboard", ROLE.STUDENT);
  }, []);

  const data = [
    {
      product: "PLO 1",
      AveragePLO: 1.9,
    },
    {
      product: "PLO 2",
      AveragePLO: 3.2,
    },
    {
      product: "PLO 3",
      AveragePLO: 3.3,
    },
    {
      product: "PLO 4",
      AveragePLO: 2.2,
    },
    {
      product: "PLO 5",
      AveragePLO: 4,
    },
    {
      product: "PLO 6",
      AveragePLO: 2,
    },
    {
      product: "PLO 7",
      AveragePLO: 4,
    },
  ];

  return (
    <div className="bg-white flex flex-col h-full w-full px-6 py-5 gap-3 overflow-hidden">
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* {departmentPLO && (
            <DrawerPLOdes
              opened={openDrawerPLOdes}
              onClose={() => setOpenDrawerPLOdes(false)}
              data={departmentPLO}
            />
          )}

          <div className="flex flex-row pb-2 items-center justify-between">
            {test ? (
              <p className="text-secondary text-[16px] font-semibold">
                ผลการเรียนรู้ของผู้เรียน
                <br />
                Program Learning Outcome
              </p>
            ) : (
              <></>
            )}
            <Button
              className="text-center px-4"
              onClick={() => setOpenDrawerPLOdes(true)}
              color="#e9e9e9"
            >
              <div className="flex gap-2 acerSwift:max-macair133:!text-b5 !text-default">
                <Icon
                  IconComponent={IconPLO}
                  className="acerSwift:max-macair133:!size-3"
                />
                PLO Description
              </div>
            </Button>
          </div>
          <div
            className="flex flex-col justify-center items-center border rounded-lg h-full mt-0.5 py-8"
            style={{ boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)" }}
          >
            <div className="flex flex-col">
              <p className="text-secondary text-b1 font-semibold text-center">
                ผลการเรียนรู้ของผู้เรียนประจำรหัสวิชา {courseNo}
              </p>
              <p className="text-[#575757] text-[14px] text-center">
                Program Learning Outcome
              </p>
            </div>
            <SpiderChart data={data} height={height} />
          </div> */}

          <div className=" flex flex-col h-full w-full  overflow-hidden">
            <div className="flex flex-row px-6 pt-3   items-center justify-between">
              <div className="flex flex-col">
                <p className="text-secondary text-[18px] font-semibold "></p>
              </div>
            </div>

            <div className="flex items-center  !h-full !w-full justify-between px-16">
              <div className="h-full  translate-y-2  justify-center flex flex-col">
                <p className="text-secondary text-[21px] font-semibold">
                  PLO is coming soon to{" "}
                  <span className="font-[600] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                    ScoreOBE +{" "}
                  </span>{" "}
                </p>
                <br />
                <p className=" -mt-4 mb-6 text-b2 break-words font-medium leading-relaxed">
                  PLO will be available for students February 2025.
                </p>
              </div>
              <div className="h-full  w-[25vw] justify-center flex flex-col">
                <img src={maintenace} alt="notFound"></img>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
