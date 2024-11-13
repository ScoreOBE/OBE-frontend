import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Accordion, Table } from "@mantine/core";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getSectionNo } from "@/helpers/functions/function";
import { ROUTE_PATH } from "@/helpers/constants/route";
import needAccess from "@/assets/image/needAccess.jpg";
import { setShowNavbar } from "@/store/showNavbar";
import { setShowSidebar } from "@/store/showSidebar";
import { IModelUser } from "@/models/ModelUser";
import Loading from "@/components/Loading/Loading";
import HistogramChart from "@/components/HistogramChart";
import { BarChart } from "@mantine/charts";
import Icon from "@/components/Icon";
import IconChevronDown from "@/assets/icons/chevronDown.svg?react";
import {
  IModelAssignment,
  IModelQuestion,
  IModelScore,
} from "@/models/ModelCourse";
import { ROLE } from "@/helpers/constants/enum";

export default function Overall() {
  const { courseNo, sectionNo, name } = useParams();
  const loading = useAppSelector((state) => state.loading.loading);
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
      path: `${ROUTE_PATH.INS_DASHBOARD}?${params.toString()}`,
    },
    {
      title: "Sections",
      path: `${ROUTE_PATH.COURSE}/${courseNo}/${
        ROUTE_PATH.SECTION
      }?${params.toString()}`,
    },
    {
      title: `Assignment Section ${getSectionNo(sectionNo)}`,
      path: `${ROUTE_PATH.COURSE}/${courseNo}/${
        ROUTE_PATH.SECTION
      }/${sectionNo}/${ROUTE_PATH.ASSIGNMENT}?${params.toString()}`,
    },
    { title: `${name}` },
  ]);

  const [openAllPublishModal, setOpenAllPublishModal] = useState(false);

  const data = [
    { month: "January", Smartphones: 1200, Laptops: 900, Tablets: 200 },
    { month: "February", Smartphones: 1900, Laptops: 1200, Tablets: 400 },
    { month: "March", Smartphones: 400, Laptops: 1000, Tablets: 200 },
    { month: "April", Smartphones: 1000, Laptops: 200, Tablets: 800 },
    { month: "May", Smartphones: 800, Laptops: 1400, Tablets: 1200 },
    { month: "June", Smartphones: 750, Laptops: 600, Tablets: 1000 },
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

  // Generate assignments mock data for questions
  const questions: Array<IModelQuestion> = Array.from(
    { length: 10 },
    (_, qIndex): IModelQuestion => ({
      name: '',
      desc: `Question ${qIndex + 1} Description`,
      fullScore: 100,
      // fscores: Array.from(
      //   { length: 30 },
      //   (_, sIndex): IModelScore => ({
      //     student: generateMockUser(sIndex), // Generate a mock user for each score
      //     point: Math.floor(Math.random() * 100), // Random score between 0 and 100
      //   })
      // ),
    })
  );

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  }, []);

  return (
    <>
      <div className="bg-white flex flex-col h-full w-full px-6 py-5 gap-3 overflow-hidden">
        <Breadcrumbs items={items} />
        {/* <Breadcrumbs /> */}
        {loading ? (
          <Loading />
        ) : (section?.instructor as IModelUser)?.id === user.id ||
          (section?.coInstructors as IModelUser[])
            ?.map(({ id }) => id)
            .includes(user.id) ? (
          <>
            <div className="flex flex-col border-b-2 border-nodata pt-2 pb-3 items-start gap-4 text-start">
              <p className="text-secondary text-[18px] font-semibold">
                {name} - 5.0 Points
              </p>
              <div className="flex px-10 flex-row justify-between w-full">
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Mean
                  </p>
                  <p className="font-bold text-[28px] text-default">2.0</p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">SD</p>
                  <p className="font-bold text-[28px] text-default">2.15</p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Median
                  </p>
                  <p className="font-bold text-[28px] text-default">1.5</p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Max
                  </p>
                  <p className="font-bold text-[28px] text-default">4.5</p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Min
                  </p>
                  <p className="font-bold text-[28px] text-default">0</p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">Q3</p>
                  <p className="font-bold text-[28px] text-default">3.75</p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">Q1</p>
                  <p className="font-bold text-[28px] text-default">1.75</p>
                </div>
              </div>
            </div>
            {/* Table */}
            <div
              className="overflow-y-auto mt-2 overflow-x-auto w-full h-fit max-h-full border flex flex-col rounded-lg border-secondary"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
                height: "fit-content",
              }}
            >
              <Table stickyHeader className="">
                <Table.Thead>
                  <Table.Tr className="bg-[#e5e7f6]">
                    <Table.Th className="w-[15%] ">Question</Table.Th>
                    <Table.Th className="text-end pr-[70px] w-[11%]">
                      Points
                    </Table.Th>
                    <Table.Th className="text-end pr-[70px]  w-[11%]">
                      Mean
                    </Table.Th>
                    <Table.Th className="text-end pr-[70px]  w-[11%]">
                      SD
                    </Table.Th>
                    <Table.Th className="text-end pr-[70px]  w-[11%]">
                      Median
                    </Table.Th>
                    <Table.Th className="text-end pr-[70px] w-[11%]">
                      Max
                    </Table.Th>
                    <Table.Th className="text-end pr-[70px] w-[11%]">
                      Q3
                    </Table.Th>
                    <Table.Th className="text-end pr-[70px] w-[11%] ">
                      Q1
                    </Table.Th>
                    <Table.Th className="text-end pr-[70px] w-[8%]"></Table.Th>
                  </Table.Tr>
                </Table.Thead>
              </Table>

              <Accordion chevron={false} unstyled>
                {questions.map((ques, index) => (
                  <Accordion.Item
                    value={`${index + 1}`}
                    key={index}
                    className={`!px-0 ${index % 2 === 0 ? "bg-[#F8F9FA]" : ""}`}
                  >
                    <Accordion.Control
                      className="pl-0 py-1.5 w-full"
                      classNames={{
                        label: `flex-itemstart w-full`,
                      }}
                    >
                      <Table>
                        <Table.Tbody className="text-default">
                          {/* Entire Table Row as Control */}
                          <Table.Tr className="text-[13px] font-normal py-[14px] w-full ">
                            <Table.Td className="text-start w-[15%] ">
                              No. {index + 1}
                            </Table.Td>
                            <Table.Td className="text-end pr-[70px] w-[11%]">
                              5.0
                            </Table.Td>
                            <Table.Td className="text-end pr-[70px] w-[11%]">
                              2.0
                            </Table.Td>
                            <Table.Td className="text-end pr-[70px] w-[11%]">
                              10.0
                            </Table.Td>
                            <Table.Td className="text-end pr-[70px] w-[11%]">
                              25
                            </Table.Td>
                            <Table.Td className="text-end pr-[70px]  w-[11%]">
                              5.0
                            </Table.Td>
                            <Table.Td className="text-end pr-[70px] w-[11%]">
                              2.0
                            </Table.Td>
                            <Table.Td className="text-end pr-[70px] w-[11%]">
                              10.0
                            </Table.Td>
                            <Table.Th className="text-end pr-[70px] w-[8%]">
                              <Icon
                                IconComponent={IconChevronDown}
                                className="size-4"
                              />
                            </Table.Th>
                          </Table.Tr>
                        </Table.Tbody>
                      </Table>
                    </Accordion.Control>

                    <Accordion.Panel className="!py-0">
                      <div className="flex justify-between px-20 pb-6 pt-0">
                        <p className="text-secondary text-[16px] font-semibold">
                          No.{index + 1} - 5.0 Points
                        </p>
                        <p className="text-secondary text-[16px] font-semibold">
                          120 Students
                        </p>
                      </div>

                      <HistogramChart data={ques} isQuestions={true} />
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </>
        ) : (
          <div className="flex px-16  flex-row items-center justify-between h-full">
            <div className="flex justify-center  h-full items-start gap-2 flex-col">
              <p className="   text-secondary font-semibold text-[22px]">
                You need access
              </p>
              <p className=" text-[#333333] leading-6 font-medium text-[14px]">
                You're not listed as a Co-Instructor. <br /> Please contact the
                Owner section for access.
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
