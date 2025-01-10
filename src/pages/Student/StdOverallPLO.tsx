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
  const [activeItem, setActiveItem] = useState();
  const [activeSection, setActiveSection] = useState<string | null>(); // Track active section
  const user = useAppSelector((state) => state.user);
  const term = useAppSelector((state) =>
    state.academicYear.find(
      (term) =>
        term.year == parseInt(params.get("year") || "") &&
        term.semester == parseInt(params.get("semester") || "")
    )
  );

  const fetchPLO = async () => {
    const departmentCode = user?.departmentCode?.[0];

    const resPloCol = await getOnePLO({
      year: term?.year,
      semester: term?.semester,
      codeEN: departmentCode,
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

  const searchCourse = async (searchValue: string, reset?: boolean) => {
    // const path = "/" + location.split("/")[1];
    // let res;
    // let payloadCourse: any = {};
    // if (reset) payloadCourse.search = "";
    // else payloadCourse.search = searchValue;
    // switch (path) {
    //   case ROUTE_PATH.INS_DASHBOARD:
    //   case ROUTE_PATH.ADMIN_DASHBOARD:
    //     payloadCourse = {
    //       ...new CourseRequestDTO(),
    //       ...payloadCourse,
    //       departmentCode,
    //       manage: path.includes(ROUTE_PATH.ADMIN_DASHBOARD),
    //     };
    //     payloadCourse.year = parseInt(params.get("year") ?? "");
    //     payloadCourse.semester = parseInt(params.get("semester") ?? "");
    //     res = await getCourse(payloadCourse);
    //     if (res) {
    //       res.search = payloadCourse.search;
    //       if (path.includes(ROUTE_PATH.ADMIN_DASHBOARD)) {
    //         dispatch(setAllCourseList(res));
    //       } else {
    //         dispatch(setCourseList(res));
    //       }
    //     }
    //     break;
    //   default:
    //     break;
    // }
    // localStorage.setItem("search", "true");
  };

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
          {departmentPLO && (
            <DrawerPLOdes
              opened={openDrawerPLOdes}
              onClose={() => setOpenDrawerPLOdes(false)}
              data={departmentPLO}
              department={user.departmentCode?.at(0)}
            />
          )}

          <div className="flex flex-row -mt-2 items-center justify-between">
            {test ? (
              // <p className="text-secondary text-[16px] font-semibold">
              //   ผลการเรียนรู้ของผู้เรียน
              //   <span className="">ตลอดหลักสูตร</span> อ้างอิงตามเกณฑ์ของ ABET
              //   <br />
              //   Overall Program Learning Outcome
              // </p>
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
                className="text-center px-4"
                onClick={() => setOpenDrawerPLOdes(true)}
              >
                <div className="flex gap-2 acerSwift:max-macair133:!text-b5">
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
              root: "overflow-hidden -mt-0.5 flex flex-col max-h-full",
            }}
            value={activeTab}
            onChange={setActiveTab}
          >
            <Tabs.List className="mb-2">
              <Tabs.Tab value="curriculum">Curriculum</Tabs.Tab>
              <Tabs.Tab value="course">Course</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel className="flex h-full max-h-[75vh]" value="curriculum">
              <div className="flex py-6 items-between justify-center rounded-lg rounded-r-none mt-2 w-[62%] ">
                <div className="flex flex-col justify-between items-center h-full w-[90vw]">
                  <div className="flex flex-col">
                    <p className="text-secondary text-b1 font-semibold text-center ">
                      ผลการเรียนรู้ของผู้เรียนตลอดหลักสูตร
                    </p>
                    <p className="text-[#575757] text-[14px] text-center">
                      Overall Program Learning Outcome
                    </p>
                  </div>
                  <div className="w-full h-full flex items-center justify-center">
                    <SpiderChart data={data} height={450} />
                  </div>
                </div>
              </div>
              {/* <div className="flex flex-col items-start justify-start w-[38%] rounded-lg mt-2 px-5 py-5 border ">
                <div className="flex overflow-y-auto overflow-x-hidden w-full max-h-full gap-4">
                  <div className="gap-5 flex flex-col my-2 px-[2px] w-full overflow-y-auto max-h-full text-b2">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={`sidebar-${i}`}
                        className="flex flex-col gap-2 text-b3 border-b pb-5 last:pb-0 last:border-none"
                      >
                        <p className="text-secondary/90 text-b2 mb-2">
                          <span className="text-secondary text-h1 font-semibold">
                            PLO {i + 1}
                          </span>{" "}
                          is based on the following{" "}
                          <span className="text-secondary font-semibold">
                            6 courses.
                          </span>{" "}
                        </p>

                        <div className="flex flex-col gap-2.5">
                          <div className="flex gap-0.5 ml-2 text-pretty mr-2">
                            <p className="font-semibold text-default !w-[50px]">
                              261101
                            </p>
                            <p className="break-words">
                              Introduction to Programming
                            </p>
                          </div>
                          <div className="flex gap-0.5 ml-2 text-pretty mr-2">
                            <p className="font-semibold text-default !w-[50px]">
                              261102
                            </p>
                            <p className="break-words">
                              Object-Oriented Programming
                            </p>
                          </div>
                          <div className="flex gap-0.5 ml-2 text-pretty mr-2">
                            <p className="font-semibold text-default !w-[50px]">
                              261103
                            </p>
                            <p className="break-words"> Data Structures</p>
                          </div>
                          <div className="flex gap-0.5 ml-2 text-pretty mr-2">
                            <p className="font-semibold text-default !w-[50px]">
                              261104
                            </p>
                            <p className="break-words"> Algorithms</p>
                          </div>
                          <div className="flex gap-0.5 ml-2 text-pretty mr-2">
                            <p className="font-semibold text-default !w-[50px]">
                              261105
                            </p>
                            <p className="break-words"> Database Systems</p>
                          </div>
                          <div className="flex gap-0.5 ml-2 text-pretty mr-2">
                            <p className="font-semibold text-default !w-[50px]">
                              261106
                            </p>
                            <p className="break-words"> Operating Systems</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className=" mt-3 flex flex-col">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={`sidebar-${i}`}
                        className={`max-w-fit ${
                          activeSection === i ? "active" : ""
                        }`}
                      >
                        <a href={`#${i}`}>
                          <p
                            className={`mb-[7px] text-ellipsis font-semibold overflow-hidden whitespace-nowrap text-[13px] ${
                              activeSection === i
                                ? "text-secondary"
                                : "text-[#D2C9C9]"
                            }`}
                          >
                            PLO {i + 1}
                          </p>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div> */}

              <div className="flex flex-col items-start justify-start w-[38%] rounded-lg mt-2 border overflow-y-auto overflow-x-hidden max-h-full ">
                <Accordion
                  defaultValue="1"
                  className="w-full"
                  onChange={(value) => setActiveSection(value)} // Update active section
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
                        <p className="text-secondary text-b1 font-semibold h-full">
                          PLO {i + 1}
                        </p>
                        <p className="text-[14px] font-medium text-deemphasize">
                          is based on the following{" "}
                          <span className="text-secondary font-semibold">
                            12 courses.
                          </span>{" "}
                        </p>
                      </Accordion.Control>
                      <Accordion.Panel className="text-start text-b3 !p-0">
                        <div className="flex flex-col">
                          {courses.map((co) => (
                            <div
                              key={co.code}
                              className="flex w-full text-pretty py-3 pl-6 border-b last:border-none last:pb-0"
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
                ;
              </div>
            </Tabs.Panel>
            <Tabs.Panel
              className="flex flex-col gap-1 overflow-y-auto mb-12"
              value="course"
            >
              <div className="grid grid-cols-3 gap-4 mt-2 h-full ">
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
          </Tabs>
          {/* <div className=" flex flex-col h-full w-full  overflow-hidden">
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
          </div> */}
        </>
      )}
    </div>
  );
}
