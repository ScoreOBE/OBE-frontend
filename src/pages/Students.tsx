import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getSectionNo } from "@/helpers/functions/function";
import { ROUTE_PATH } from "@/helpers/constants/route";
import needAccess from "@/assets/image/needAccess.jpg";
import { setShowNavbar } from "@/store/showNavbar";
import { setShowSidebar } from "@/store/showSidebar";
import { IModelUser } from "@/models/ModelUser";
import Loading from "@/components/Loading";
import { Button, Modal, NumberInput, Table, TextInput } from "@mantine/core";
import Icon from "@/components/Icon";
import IconEdit from "@/assets/icons/edit.svg?react";
import { SearchInput } from "@/components/SearchInput";

export default function Students() {
  const { name } = useParams();
  const { courseNo, sectionNo } = useParams();
  const loading = useAppSelector((state) => state.loading);
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
  const [openEditScore, setOpenEditScore] = useState(false);
  const [items, setItems] = useState<any[]>([
    {
      title: "Your Course",
      path: `${ROUTE_PATH.DASHBOARD_INS}?${params.toString()}`,
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

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  }, []);

  return (
    <>
      <Modal
        opened={openEditScore}
        onClose={() => setOpenEditScore(false)}
        title="Edit Score 640610653"
        size="22vw"
        centered
        closeOnClickOutside={false}
        transitionProps={{ transition: "pop" }}
        className="flex items-center justify-center"
        classNames={{
          title: "",
          content:
            "flex flex-col justify-center w-full font-medium leading-[24px] text-[14px] item-center  overflow-hidden ",
        }}
      >
        <div className="flex flex-col  gap-5 w-full">
          <div className="flex items-center justify-center w-full">
            <TextInput
              label="Score"
              size="sm"
              withAsterisk
              value={2.0}
              classNames={{
                input:
                  "focus:border-primary text-[16px] w-28 h-10 text-center text-default ",
              }}
            />
          </div>

          <div className="flex gap-2 mt-3 justify-end">
            <Button onClick={() => setOpenEditScore(false)} variant="subtle">
              Cancel
            </Button>
            <Button onClick={() => setOpenEditScore(false)}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
      <div className="bg-white flex flex-col h-full w-full p-6 pb-3 pt-5 gap-3 overflow-hidden">
        <Breadcrumbs items={items} />
        {/* <Breadcrumbs /> */}
        {loading ? (
          <Loading />
        ) : (section?.instructor as IModelUser)?.id === user.id ||
          (section?.coInstructors as IModelUser[])
            ?.map(({ id }) => id)
            .includes(user.id) ? (
          <>
            <div className="flex flex-col border-b-2 border-nodata py-2 items-start gap-5 text-start">
              <p className="text-secondary text-[18px] font-semibold">
                {name} - 5.0 Points
              </p>
              <div className="flex px-16 flex-row justify-between w-full">
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Mean
                  </p>
                  <p className="font-bold text-[28px] text-defa">2.0</p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">SD</p>
                  <p className="font-bold text-[28px] text-defa">2.15</p>
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

            <SearchInput
              onSearch={() => "test"}
              placeholder="Student ID / Name"
            />

            {/* Table */}
            <div
              className="overflow-y-auto overflow-x-auto w-full h-fit max-h-full border flex flex-col rounded-lg border-secondary"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
                height: "fit-content",
              }}
            >
              <Table stickyHeader>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="w-[15%]">Student ID</Table.Th>
                    <Table.Th className="w-[25%]">Name</Table.Th>
                    <Table.Th className=" text-end pr-28">Score</Table.Th>
                    <Table.Th className="w-[40%]"></Table.Th>
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody className="text-default text-[13px] ">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <Table.Tr className="">
                      <Table.Td className="!py-[19px]">
                        {640610653 + index}
                      </Table.Td>
                      <Table.Td className="w-[25%]">ลาลิซ่า มโนบาล</Table.Td>
                      <Table.Td className="flex gap-4 items-center justify-end pr-28">
                        <p className="mt-0.5">2.0</p>
                        <Icon
                          IconComponent={IconEdit}
                          onClick={() => setOpenEditScore(true)}
                          className="size-4 cursor-pointer text-default"
                        />
                      </Table.Td>
                      <Table.Td className="text-[#D8751A] font-medium">
                        Score is edited
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
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
