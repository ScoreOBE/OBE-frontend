import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import notFoundImage from "@/assets/image/notFound.jpg";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import { CLO_EVAL, ROLE } from "@/helpers/constants/enum";
import Loading from "@/components/Loading/Loading";
import { Alert, Button, Table, Tooltip } from "@mantine/core";
import Icon from "@/components/Icon";
import IconBulb from "@/assets/icons/bulb.svg?react";
import { isMobile } from "@/helpers/functions/function";

export default function StdCLO() {
  const { courseNo } = useParams();
  const loading = useAppSelector((state) => state.loading.loading);
  const course = useAppSelector((state) =>
    state.enrollCourse.courses.find((c) => c.courseNo == courseNo)
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    dispatch(setDashboard(ROLE.STUDENT));
    localStorage.setItem("dashboard", ROLE.STUDENT);
  }, []);

  return (
    <div className="bg-white flex flex-col h-full w-full sm:px-6 iphone:max-sm:px-3 iphone:max-sm:py-3 sm:py-5 gap-3 overflow-hidden">
      {loading ? (
        <Loading />
      ) : (
        <div className="bg-white  overflow-y-auto ">
          {/* Content */}

          {loading ? (
            <Loading />
          ) : (
            <div className="flex flex-col overflow-y-auto overflow-x-hidden max-w-full">
              {course?.clos.length !== 0 ? (
                <>
                  {/* Title */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#1f69f3] font-semibold text-lg iphone:max-sm:text-base">
                      ผลลัพธ์การเรียนรู้ของกระบวนวิชา
                      <br />
                      <span className="text-gray-700">
                        Course Learning Outcome
                      </span>
                    </h3>
                  </div>

                  {/* CLO Info Box */}
                  <div className="bg-blue-50 border-l-4 border-[#1f69f3] p-4 rounded-r-lg mb-6">
                    <div className="flex items-start">
                      <div className="bg-[#1f69f3]/10 p-2 rounded-full mr-3 mt-1">
                        <Icon
                          IconComponent={IconBulb}
                          className="h-5 w-5 text-[#1f69f3]"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1f69f3] mb-2">
                          What is CLO?
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          <span className="font-semibold">
                            Course Learning Outcome (CLO)
                          </span>{" "}
                          refers to
                          <span className="font-semibold">
                            {" "}
                            what students should be able to know, understand,
                            and do{" "}
                          </span>
                          after completing a course. It serves as a guideline
                          for both instructors and students to ensure that
                          learning objectives are met effectively. CLOs are
                          typically designed to be measurable and specific,
                          focusing on different aspects of learning, such as:
                          <span className="font-semibold"> Knowledge</span>{" "}
                          (understanding theories, concepts, and principles),
                          <span className="font-semibold"> Skills</span>{" "}
                          (applying knowledge to solve problems or perform
                          tasks),
                          <span className="font-semibold">
                            {" "}
                            Attitudes and Values
                          </span>{" "}
                          (developing ethical perspectives, teamwork, or
                          communication skills)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CLO Table/Cards */}
                  {!isMobile ? (
                    // Desktop Table View with Sticky Header
                    <div className="border border-[#1f69f3]/20 rounded-xl shadow-sm overflow-hidden">
                       <Table stickyHeader>
                    <Table.Thead>
                      <Table.Tr className="bg-[#e5e7f6]">
                        <Table.Th>CLO No.</Table.Th>
                        <Table.Th>CLO Description</Table.Th>
                        <Table.Th>Score</Table.Th>
                        <Table.Th>Evaluation</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                          <Table.Tbody  className="text-default sm:max-macair133:text-b4 font-medium text-[13px]">
                            {course?.clos.map(({ clo, score }, index) => (
                              <Table.Tr
                                key={index}
                                className={`hover:bg-blue-50/30 transition-colors ${
                                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                }`}
                              >
                                <Table.Td className="py-4 px-4 border-b border-gray-100 font-semibold text-[#1f69f3]">
                                  {clo.no}
                                </Table.Td>
                                <Table.Td className="py-4 px-4 border-b border-gray-100">
                                  <p className="font-medium text-gray-800">
                                    {clo.descTH}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {clo.descEN}
                                  </p>
                                </Table.Td>
                                <Table.Td className="py-4 px-4 text-center border-b border-gray-100">
                                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1f69f3] text-white font-bold">
                                    {score}
                                  </span>
                                </Table.Td>
                                <Table.Td className="py-4 px-4 text-center border-b border-gray-100 font-medium">
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm ${
                                      score === 4
                                        ? "bg-purple-100 text-purple-700"
                                        : score === 3
                                        ? "bg-green-100 text-green-700"
                                        : score === 2
                                        ? "bg-blue-100 text-blue-700"
                                        : score === 1
                                        ? "bg-yellow-100 text-yellow-700"
                                        : score === 0
                                        ? "bg-red-100 text-red-700"
                                        : "bg-gray-100 text-gray-700"
                                    }
`}
                                  >
                                    {score !== "-" ? CLO_EVAL[score] : "-"}
                                  </span>
                                </Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      </div>
               
                  ) : (
                    // Mobile Card View
                    <div className="space-y-4 overflow-y-auto">
                      {course?.clos.map(({ clo, score }, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                        >
                          <div className="bg-[#1f69f3]/10 px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-[#1f69f3]">
                                CLO-{clo.no}
                              </h4>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                  Score:
                                </span>
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#1f69f3] text-white font-bold text-sm">
                                  {score }
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-4">
                            <p className="font-medium text-gray-800 text-sm">
                              {clo.descTH}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              {clo.descEN}
                            </p>

                            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                              <span className="text-sm text-gray-600">
                                Evaluation:
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  score === 4
                                    ? "bg-purple-100 text-purple-700"
                                    : score === 3
                                    ? "bg-green-100 text-green-700"
                                    : score === 2
                                    ? "bg-blue-100 text-blue-700"
                                    : score === 1
                                    ? "bg-yellow-100 text-yellow-700"
                                    : score === 0
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                                }
`}
                              >
                                {score !== "-" ? CLO_EVAL[score] : "-"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // No CLO State
                <div className="flex items-center  !h-full !w-full justify-between -mt-[8px]  sm:px-16">
                  <div className="flex flex-col gap-3 iphone:max-sm:text-center sm:text-start">
                    <p className="!h-full text-[20px] text-secondary font-semibold">
                      No CLO
                    </p>
                    <p className=" text-[#333333] -mt-1  text-b2 break-words font-medium leading-relaxed">
                      The CLO will show when the TQF 3 (Course Specification) is
                      submitted <br /> by the instructor or co-instructor.
                    </p>
                    {!isMobile && (
                      <Tooltip
                        arrowOffset={125}
                        arrowSize={8}
                        arrowRadius={1}
                        events={{ hover: true, focus: true, touch: true }}
                        transitionProps={{
                          transition: "fade",
                          duration: 300,
                        }}
                        multiline
                        withArrow
                        label={
                          <div className=" text-default text-b3 acerSwift:max-macair133:text-b4 p-2 flex flex-col gap-1 w-[40vw]">
                            <p className="text-secondary font-bold">
                              What is CLO?
                            </p>

                            <p className="font-normal text-b3 acerSwift:max-macair133:text-b4  ">
                              <span className="font-bold">
                                {" "}
                                Course Learning Outcome (CLO)
                              </span>{" "}
                              refers to{" "}
                              <span className="font-bold">
                                what students should be able to know,
                                understand, and do{" "}
                              </span>{" "}
                              after completing a course. It serves as a
                              guideline for both instructors and students to
                              ensure that learning objectives are met
                              effectively. CLOs are typically designed to be
                              measurable and specific, focusing on different
                              aspects of learning, such as:{" "}
                              <span className="font-bold"> Knowledge</span>{" "}
                              (understanding theories, concepts, and
                              principles),{" "}
                              <span className="font-bold"> Skills</span>{" "}
                              (applying knowledge to solve problems or perform
                              tasks),{" "}
                              <span className="font-bold">
                                {" "}
                                Attitudes and Values
                              </span>{" "}
                              (developing ethical perspectives, teamwork, or
                              communication skills)
                            </p>
                          </div>
                        }
                        color="#FCFCFC"
                        className="w-fit border rounded-md sm:max-acerSwift:!-ml-2"
                        position="bottom-start"
                      >
                        <Button
                          className="mt-3 flex justify-center items-center"
                          variant="light"
                          leftSection={
                            <Icon
                              IconComponent={IconBulb}
                              className="size-[20px] stroke-[1.5px] -mt-[2px]  items-center"
                            />
                          }
                        >
                          What is CLO?
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                  {!isMobile && (
                    <div className=" items-center justify-center flex">
                      <img
                        src={notFoundImage}
                        className="h-full items-center  w-[24vw] justify-center flex flex-col"
                        alt="notFound"
                      ></img>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
