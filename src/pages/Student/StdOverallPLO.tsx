import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import Icon from "@/components/Icon";
import IconPLO from "@/assets/icons/PLOdescription.svg?react";
import { ROLE } from "@/helpers/constants/enum";
import Loading from "@/components/Loading/Loading";
import { Accordion, Button, Tabs, TextInput } from "@mantine/core";
import DrawerPLOdes from "@/components/DrawerPLO";
import SpiderChart from "@/components/Chart/SpiderChart";
import { TbSearch } from "react-icons/tb";
import { IModelEnrollCourse } from "@/models/ModelEnrollCourse";
import { setLoading } from "@/store/loading";
import { getEnrollCourse } from "@/services/student/student.service";
import { checkStringContain } from "@/helpers/functions/function";

export default function StdOverallPLO() {
  const loading = useAppSelector((state) => state.loading.loading);
  // const [activeTab, setActiveTab] = useState<string | null>("curriculum");
  // const [activeSection, setActiveSection] = useState<string | null>();
  const user = useAppSelector((state) => state.user);
  const height = window.innerWidth >= 1800 ? 650 : 450;
  const dispatch = useAppDispatch();
  const [courses, setCourses] = useState<IModelEnrollCourse[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [openDrawerPLOdes, setOpenDrawerPLOdes] = useState(false);

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    dispatch(setDashboard(ROLE.STUDENT));
    localStorage.setItem("dashboard", ROLE.STUDENT);
  }, []);

  useEffect(() => {
    if (!courses.length) {
      fetchCourse();
    }
  }, [user]);

  const fetchCourse = async () => {
    if (!user.termsOfService) return;
    dispatch(setLoading(true));
    const res: any = await getEnrollCourse({ all: true });
    if (res) {
      setCourses(res.courses);
    }
    dispatch(setLoading(false));
  };

  return (
    <div className=" flex flex-col h-full w-full  overflow-hidden">
      <div className="bg-white flex flex-col h-full w-full px-6 py-5 gap-3">
        {loading ? (
          <Loading />
        ) : (
          <>
            {!!courses.length && (
              <DrawerPLOdes
                opened={openDrawerPLOdes}
                onClose={() => setOpenDrawerPLOdes(false)}
                data={courses[0].plo}
              />
            )}

            <div className="flex flex-row -mt-2 items-center justify-between">
              {!!courses.length ? (
                <div className="flex flex-col">
                  <p className="text-secondary text-[18px] font-semibold ">
                    Hi there, {user.firstNameEN}
                  </p>
                  <p className="text-[#575757] text-[14px]">
                    You have completed{" "}
                    <span className="text-[#1f69f3] font-semibold">
                     {courses.length} Course {" "} 
                    </span>
                    in CPE curriculum
                  </p>
                </div>
              ) : (
                <></>
              )}
              <div className="flex gap-3">
                {/* {activeTab === "course" && ( */}
                <TextInput
                  leftSection={<TbSearch />}
                  className="w-[350px]"
                  placeholder="Course No / Course Name / Course Topic"
                  size="xs"
                  value={searchValue}
                  onChange={(event: any) =>
                    setSearchValue(event.currentTarget.value)
                  }
                />
                {/* )} */}
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

            {/* <Tabs
            classNames={{
              root: "overflow-hidden -mt-0.5 flex flex-col h-full max-h-full mb-12",
            }}
            value={activeTab}
            onChange={setActiveTab}
          >
            <Tabs.List className="mb-2">
              <Tabs.Tab value="curriculum">Curriculum</Tabs.Tab>
              <Tabs.Tab value="course">Course</Tabs.Tab>
            </Tabs.List> */}
            {/* <Tabs.Panel className="flex h-full max-h-full " value="curriculum">
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
            </Tabs.Panel> */}
            <div className="flex flex-col gap-1 overflow-auto">
              <div className="grid grid-cols-2 acerSwift:grid-cols-3 samsungA24:grid-cols-4 gap-4 mt-2 h-full">
                {courses
                  .filter(({ courseNo, courseName, section }) =>
                    checkStringContain(
                      [courseNo, courseName, section.topic],
                      searchValue
                    )
                  )
                  .map((course) => (
                    <div
                      key={course.id}
                      className="border rounded-lg text-b2 shadow-sm flex flex-col gap-0 overflow-clip pb-4"
                    >
                      <div className="px-5 pt-4 flex justify-between">
                        <div>
                          <p className="font-bold text-secondary">
                            {course.courseNo} ({course.semester}/{course.year})
                          </p>
                          <p className="text-b4 text-[#4b5563] font-medium">
                            {course.courseName}
                            <br />{" "}
                            {course.section.topic &&
                              `(${course.section.topic})`}
                          </p>
                        </div>
                      </div>
                      {course.plos.length ? (
                        <SpiderChart data={course.plos} height={350} />
                      ) : (
                        <div className="flex h-full justify-center items-center">
                         This Course has no PLO data
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
            {/* </Tabs> */}
          </>
        )}
      </div>
    </div>
  );
}
