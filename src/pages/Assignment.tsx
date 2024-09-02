import { useAppDispatch } from "@/store";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { setShowSidebar } from "@/store/showSidebar";
import { IModelSection } from "@/models/ModelSection";
import { Button, Menu, Table } from "@mantine/core";
import eyePublish from "@/assets/icons/eyePublish.svg?react";
import publish from "@/assets/icons/publish.svg?react";
import unPublish from "@/assets/icons/unPublish.svg?react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getSectionNo } from "@/helpers/functions/function";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { IconDots, IconPencilMinus, IconTrash } from "@tabler/icons-react";

export default function Assignment() {
  const { courseNo, sectionNo } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState<IModelSection>();
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
    { title: getSectionNo(sectionNo) },
  ]);

  useEffect(() => {
    dispatch(setShowSidebar(true));
  }, []);

  return (
    <>
      <div className="bg-white flex flex-col h-full w-full p-6 py-3 gap-3 overflow-hidden">
        <Breadcrumbs items={items} />
        {/* <Breadcrumbs /> */}
        <div className="flex flex-row  py-2  items-center justify-between">
          <p className="text-secondary text-[16px] font-semibold">
            {section?.assignments.length} Assignment
            {section?.assignments.length! > 1 && "s"}
          </p>

          <Button
            color="#178F51"
            leftSection={
              <Icon IconComponent={eyePublish} className="h-5 w-5" />
            }
            className="rounded-[8px] font-semibold text-[12px] w-fit  h-8 px-3 "
          >
            Publish
          </Button>
        </div>
        {/* Table */}
        <div
          className="overflow-y-auto overflow-x-auto w-full h-fit max-h-full border flex flex-col rounded-lg border-secondary"
          style={{ height: "fit-content" }}
        >
          <Table stickyHeader striped>
            <Table.Thead>
              <Table.Tr className="bg-[#F4F5FE]">
                <Table.Th className="w-60">Name</Table.Th>
                <Table.Th>Points</Table.Th>
                <Table.Th>Mean</Table.Th>
                <Table.Th>Created</Table.Th>
                <Table.Th className="w-40">People</Table.Th>
                <Table.Th className="w-40 !px-4 text-center">
                  Published
                </Table.Th>
                <Table.Th className="w-50"></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody className="text-default text-b3">
              <Table.Tr className=" hover:bg-hover">
                <Table.Td>Quiz 1</Table.Td>
                <Table.Td>5.0</Table.Td>
                <Table.Td>2.0</Table.Td>
                <Table.Td>8 Dec 2023</Table.Td>
                <Table.Td>25</Table.Td>
                <Table.Td className="text-center">
                  <Icon IconComponent={publish} className="text-default" />
                  {/* <Icon IconComponent={unPublish} className="text-default" /> */}
                </Table.Td>
                <Table.Td className="text-center flex  items-center justify-center">
                  <div className="rounded-full hover:bg-gray-300 p-1 w-fit cursor-pointer">
                    <Menu trigger="click" position="bottom-end" offset={2}>
                      <Menu.Target>
                        <IconDots className=" rounded-full w-fit hover:bg-gray-300" />
                      </Menu.Target>
                      <Menu.Dropdown
                        className="rounded-md backdrop-blur-xl bg-white/70 "
                        style={{
                          boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        <Menu.Item className="text-[#3E3E3E] font-semibold text-[12px] h-7 w-[180px]">
                          <div className="flex items-center gap-2">
                            <IconPencilMinus stroke={1.5} className="h-4 w-4" />
                            <span>Edit Assignment Name</span>
                          </div>
                        </Menu.Item>
                        <Menu.Item className="text-[#FF4747] disabled:text-[#adb5bd] hover:bg-[#d55757]/10 font-semibold text-[12px] h-7 w-[180px]">
                          <div className="flex items-center gap-2">
                            <IconTrash className="h-4 w-4" stroke={1.5} />
                            <span>Delete Assignment</span>
                          </div>
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </div>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
      </div>
      <div className=" text-secondary font-semibold  whitespace-break-spaces">
        u need access na
      </div>
    </>
  );
}
