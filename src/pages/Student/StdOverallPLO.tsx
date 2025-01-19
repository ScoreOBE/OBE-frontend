import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import maintenace from "@/assets/image/maintenance.jpg";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import IconPLO from "@/assets/icons/PLOdescription.svg?react";
import { ROLE } from "@/helpers/constants/enum";
import Loading from "@/components/Loading/Loading";
import { RadarChart } from "@mantine/charts";
import { Accordion, Button, Table, Tabs } from "@mantine/core";
import DrawerPLOdes from "@/components/DrawerPLO";
import SpiderChart from "@/components/Chart/SpiderChart";
import { IModelPLO } from "@/models/ModelPLO";
import { getOnePLO } from "@/services/plo/plo.service";
import Icon from "@/components/Icon";
import { SearchInput } from "@/components/SearchInput";

export default function StdOverallPLO() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.loading.loading);
  const [activeTab, setActiveTab] = useState<string | null>("curriculum");
  const [departmentPLO, setDepartmentPLO] = useState<Partial<IModelPLO>>({});
  const [activeSection, setActiveSection] = useState<string | null>();
  const user = useAppSelector((state) => state.user);
  const term = useAppSelector((state) =>
    state.academicYear.find(
      (term) =>
        term.year == parseInt(params.get("year") || "") &&
        term.semester == parseInt(params.get("semester") || "")
    )
  );
  const height = window.innerWidth >= 1800 ? 650 : 450;
  const fetchPLO = async () => {
    const resPloCol = await getOnePLO({
      year: term?.year,
      semester: term?.semester,
    });
    if (resPloCol) {
      setDepartmentPLO(resPloCol);
    }
  };

  const dispatch = useAppDispatch();
  const [openDrawerPLOdes, setOpenDrawerPLOdes] = useState(false);
  const [test, setTest] = useState(true);

  useEffect(() => {
    console.log(user);
  });

  useEffect(() => {
    if (user) {
      fetchPLO();
    }
  }, [user]);

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    dispatch(setDashboard(ROLE.STUDENT));
    localStorage.setItem("dashboard", ROLE.STUDENT);
  }, []);

  const data = [
    {
      product: "PLO 1",
      AveragePLO: 2.7,
    },
    {
      product: "PLO 2",
      AveragePLO: 3.2,
    },
    {
      product: "PLO 3",
      AveragePLO: 3.5,
    },
    {
      product: "PLO 4",
      AveragePLO: 4.0,
    },
    {
      product: "PLO 5",
      AveragePLO: 2.8,
    },
    {
      product: "PLO 6",
      AveragePLO: 2.0,
    },
    {
      product: "PLO 7",
      AveragePLO: 3,
    },
  ];
  const searchCourse = async (searchValue: string, reset?: boolean) => {};
  type Course = {
    id: number;
    code: string;
    name: string;
    data: any;
  };
  const courses: Course[] = [
    { id: 1, code: "261101", name: "Introduction to Programming", data: [] },
    { id: 2, code: "261102", name: "Object-Oriented Programming", data: [] },
    { id: 3, code: "261103", name: "Data Structures", data: [] },
    { id: 4, code: "261104", name: "Algorithms", data: [] },
    { id: 5, code: "261105", name: "Database Systems", data: [] },
    { id: 6, code: "261106", name: "Operating Systems", data: [] },
    { id: 7, code: "261107", name: "Computer Networks", data: [] },
    { id: 8, code: "261108", name: "Software Engineering", data: [] },
    { id: 9, code: "261109", name: "Web Development", data: [] },
    {
      id: 10,
      code: "261110",
      name: "Mobile Application Development",
      data: [],
    },
    { id: 11, code: "261111", name: "Machine Learning", data: [] },
    { id: 12, code: "261112", name: "Artificial Intelligence", data: [] },
  ];

  return (
    <div className="bg-white flex flex-col h-full w-full px-6 py-5 gap-3">
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* {departmentPLO && (
            <DrawerPLOdes
              opened={openDrawerPLOdes}
              onClose={() => setOpenDrawerPLOdes(false)}
              data={departmentPLO}
              department={user.departmentCode?.at(0)}
            />
          )}

          <div className="flex flex-row -mt-2 items-center justify-between">
            {test ? (
              <div className="flex flex-col">
                <p className="text-secondary text-[18px] font-semibold ">
                  Hi there, {user.firstNameEN}
                </p>
                <p className="text-[#575757] text-[14px]">
                  You have completed{" "}
                  <span className="text-[#1f69f3] font-semibold">
                    12 Courses{" "}
                  </span>
                  In CPE curriculum
                </p>
              </div>
            ) : (
              <></>
            )}
            <div className="flex gap-3">
              {activeTab === "course" && (
                <SearchInput
                  onSearch={searchCourse}
                  placeholder="Course No / Course Name"
                />
              )}
              <Button
                color="#e9e9e9"
                className="text-center px-4"
                onClick={() => setOpenDrawerPLOdes(true)}
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
          </div>

          <Tabs
            classNames={{
              root: "overflow-hidden -mt-0.5 flex flex-col h-full max-h-full mb-12",
            }}
            value={activeTab}
            onChange={setActiveTab}
          >
            <Tabs.List className="mb-2">
              <Tabs.Tab value="curriculum">Curriculum</Tabs.Tab>
              <Tabs.Tab value="course">Course</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel className="flex h-full max-h-full " value="curriculum">
              <div className="flex py-6 items-between justify-center rounded-lg rounded-r-none mt-2 w-[62%] mb-12">
                <div className="flex flex-col justify-between items-center h-full w-[90vw]">
                  <div className="flex flex-col">
                    <p className="text-secondary text-b1 sm:max-acerSwift:text-[15px] font-semibold text-center ">
                      ผลการเรียนรู้ของผู้เรียนตลอดหลักสูตร
                    </p>
                    <p className="text-[#575757] text-b2 sm:max-acerSwift:text-b3 text-center">
                      Overall Program Learning Outcome
                    </p>
                  </div>
                  <div className="w-full h-full flex items-start justify-center sm:max-acerSwift:-mt-5">
                    <SpiderChart data={data} height={height} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start justify-start w-[38%] sm:max-acerSwift:w-[40%] rounded-lg mt-2 border overflow-y-auto overflow-x-hidden max-h-[100vh] mb-12">
                <Accordion
                  defaultValue="1"
                  className="w-full "
                  onChange={(value) => setActiveSection(value)}
                >
                  {[...Array(7)].map((_, i) => (
                    <Accordion.Item
                      key={i}
                      value={i.toString()}
                      className={`group w-full`}
                    >
                      <Accordion.Control
                        className={`px-7 py-1 h-full  ${
                          activeSection === i.toString()
                            ? "bg-bgTableHeader hover:bg-[#D3E4FF]"
                            : ""
                        }`}
                      >
                        <p className="text-secondary text-b1 sm:max-acerSwift:text-b2 font-semibold h-full">
                          PLO {i + 1}
                        </p>
                        <p className="text-b2 sm:max-acerSwift:text-b4 font-medium text-deemphasize">
                          is based on the following{" "}
                          <span className="text-secondary font-semibold">
                            12 courses.
                          </span>{" "}
                        </p>
                      </Accordion.Control>
                      <Accordion.Panel className="text-start text-b3 sm:max-acerSwift:text-b4 !p-0">
                        <div className="flex flex-col">
                          {courses.map((co) => (
                            <div
                              key={co.code}
                              className="flex w-full text-pretty py-3 sm:max-acerSwift:py-2.5 pl-6 border-b last:border-none last:pb-0"
                            >
                              <p className="font-semibold text-default !w-[50px]">
                                {co.code}
                              </p>
                              <p className="break-words">{co.name}</p>
                            </div>
                          ))}
                        </div>
                      </Accordion.Panel>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </div>
            </Tabs.Panel>
            <Tabs.Panel
              className="flex flex-col gap-1 overflow-y-auto mb-12 "
              value="course"
            >
              <div className="grid grid-cols-2 acerSwift:grid-cols-3 samsungA24:grid-cols-4 gap-4 mt-2 h-full ">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="border rounded-lg text-b2 shadow-sm flex flex-col gap-0 overflow-clip pb-4"
                  >
                    <div className="px-5 pt-4 flex justify-between">
                      <div>
                        <p className="font-bold">{course.code}</p>
                        <p className="text-b4 text-[#4b5563] font-medium">
                          {course.name}
                        </p>
                      </div>
                    </div>

                    <SpiderChart data={data} height={350} />
                  </div>
                ))}
              </div>
            </Tabs.Panel>
          </Tabs> */}
          <div className=" flex flex-col h-full w-full  overflow-hidden">
            <div className="flex flex-row px-6 pt-3   items-center justify-between">
              <div className="flex flex-col">
                <p className="text-secondary text-[18px] font-semibold "></p>
              </div>
            </div>

            <div className="flex items-center  !h-full !w-full justify-between px-16">
              <div className="h-full  translate-y-2  justify-center flex flex-col">
                <p className="text-secondary text-[21px] font-semibold">
                  Overall PLO is coming soon to{" "}
                  <span className="font-[600] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                    ScoreOBE +{" "}
                  </span>{" "}
                </p>
                <br />
                <p className=" -mt-4 mb-6 text-b2 break-words font-medium leading-relaxed">
                  Overall PLO will be available for students February 2025.
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
