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

export default function StdPLO() {
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
  const { courseNo } = useParams();
  const course = useAppSelector((state) =>
    state.course.courses.find((c) => c.courseNo == courseNo)
  );
  const courseDep = department.find(
    (dep) => dep.courseCode == parseInt(course?.courseNo.substring(0, 3)!)
  );

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
      ผลการประเมินเฉลี่ยรวม: 1,
    },
    {
      product: "PLO 2",
      ผลการประเมินเฉลี่ยรวม: 4,
    },
    {
      product: "PLO 3",
      ผลการประเมินเฉลี่ยรวม: 3,
    },
    {
      product: "PLO 4",
      ผลการประเมินเฉลี่ยรวม: 2,
    },
    {
      product: "PLO 5",
      ผลการประเมินเฉลี่ยรวม: 4,
    },
    {
      product: "PLO 6",
      ผลการประเมินเฉลี่ยรวม: 2,
    },
    {
      product: "PLO 7",
      ผลการประเมินเฉลี่ยรวม: 4,
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

          <div className="flex flex-row  py-1  items-center justify-between">
            {test ? (
              <p className="text-secondary text-[16px] font-semibold">
                ผลการเรียนรู้ของผู้เรียนอ้างอิงตามเกณฑ์ของ ABET
                <br />
                Program Learning Outcome
              </p>
            ) : (
              <></>
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

          <div className="flex px-24 h-full items-center border rounded-lg">
            <div className="flex flex-col justify-center items-center w-[50%] -mt-8">
              <RadarChart
                h={500}
                data={data}
                dataKey="product"
                series={[
                  {
                    name: "ผลการประเมินเฉลี่ยรวม",
                    color: "blue",
                    strokeColor: "blue",
                  },
                ]}
                gridColor="#C5C5DA"
                textColor="#000000"
                withPolarAngleAxis
                className="w-full"
              />
              <div className="flex gap-2 items-center -mt-8">
                <div className="bg-blue-600 h-3 w-3 rounded-full"></div>
                <p> ผลการประเมินเฉลี่ยรวม </p>
              </div>
            </div>
            <div className="flex items-center justify-center w-[50%] ">
              <div className="overflow-y-auto flex overflow-x-auto w-80 h-fit max-h-full border rounded-lg border-secondary">
                <Table stickyHeader>
                  <Table.Thead>
                    <Table.Tr className="bg-[#e5e7f6]">
                      <Table.Th>PLO</Table.Th>
                      <Table.Th>Score</Table.Th>
                      <Table.Th>Evaluation</Table.Th>
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody className="text-default sm:max-macair133:text-b4 font-medium text-[13px] ">
                    {data.map((Item, index) => {
                      return (
                        <Table.Tr key={index}>
                          <Table.Td>PLO {index + 1}</Table.Td>
                          <Table.Td>
                            <p>4</p>
                          </Table.Td>
                          <Table.Td>
                            <p>Excellent</p>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </div>
            </div>
          </div> */}

          <div className=" flex flex-col h-full w-full  overflow-hidden">
            <div className="flex flex-row px-6 pt-3   items-center justify-between">
              <div className="flex flex-col">
                <p className="text-secondary text-[18px] font-semibold "></p>
              </div>
            </div>

            <div className="flex items-center  !h-full !w-full justify-between px-[88px]">
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
