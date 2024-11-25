import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import notFoundImage from "@/assets/image/notFound.jpg";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import { ROLE } from "@/helpers/constants/enum";
import Loading from "@/components/Loading/Loading";
import { Table } from "@mantine/core";

export default function StdCLO() {
  const { courseNo } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
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
    <div className="bg-white flex flex-col h-full w-full px-6 py-5 gap-3 overflow-hidden">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex flex-row  py-1  items-center justify-between">
            <p className="text-secondary text-[16px] font-semibold">
              ผลลัพธ์การเรียนรู้ของกระบวนวิชา
              <br />
              Course Learning Outcome
            </p>
          </div>
          {course?.clos.length !== 0 ? (
            <div
              className="overflow-y-auto overflow-x-auto w-full h-fit max-h-full  border flex flex-col rounded-lg border-secondary"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
              }}
            >
              <Table stickyHeader>
                <Table.Thead>
                  <Table.Tr className="bg-[#e5e7f6]">
                    <Table.Th>CLO No.</Table.Th>
                    <Table.Th>CLO Description</Table.Th>
                    <Table.Th>Score</Table.Th>
                    <Table.Th>Evaluation</Table.Th>
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody className="text-default sm:max-macair133:text-b3 font-medium text-[13px] ">
                  {course?.clos.map(({ clo }, index) => {
                    return (
                      <Table.Tr key={index}>
                        <Table.Td>{clo.no}</Table.Td>
                        <Table.Td>
                          <p>{clo.descTH}</p>
                          <p>{clo.descEN}</p>
                        </Table.Td>
                        <Table.Td>-</Table.Td>
                        <Table.Td>-</Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </div>
          ) : (
            <div className="flex items-center  !h-full !w-full justify-between px-16">
              <div className="flex flex-col gap-3 text-start">
                <p className="!h-full text-[20px] text-secondary font-semibold">
                  No CLO
                </p>
                <p className=" text-[#333333] -mt-1  text-b2 break-words font-medium leading-relaxed">
                The CLO will show when the TQF 3 is submitted by the instructor.
                </p>
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
        </>
      )}
    </div>
  );
}
