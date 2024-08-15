import { useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { getPLOs } from "@/services/plo/plo.service";
import { IModelPLO, IModelPLOCollection } from "@/models/ModelPLO";
import { Modal, ScrollArea, Table } from "@mantine/core";
import InfiniteScroll from "react-infinite-scroll-component";

export default function CourseManagement() {
  const user = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [ploCollection, setPLOCollection] = useState<IModelPLOCollection[]>([]);
  const [totalPLOs, setTotalPLOs] = useState<number>(0);
  const [openModal, setOpenModal] = useState(false);
  const [collection, setCollection] = useState<
    Partial<IModelPLO> & Record<string, any>
  >({});
  useEffect(() => {
    const fetchPLO = async () => {
      setLoading(true);
      const res = await getPLOs({
        role: user.role,
        departmentCode: user.departmentCode,
      });
      if (res) {
        setTotalPLOs(res.totalCount);
        setPLOCollection(res.plos);
      }
      setLoading(false);
    };
    if (user.id) {
      fetchPLO();
    }
  }, [user]);

  return (
    <>
      <Modal
        title={`PLO Collection ${collection.index + 1}`}
        opened={openModal}
        onClose={() => setOpenModal(false)}
        transitionProps={{ transition: "pop" }}
        size="75vw"
        centered
        classNames={{
          content: "flex flex-col overflow-hidden pb-2 max-h-full h-fit",
          body: "flex flex-col overflow-hidden max-h-full h-fit",
        }}
      >
        <div className="flex flex-col overflow-y-auto h-full">
          <Table verticalSpacing="sm" stickyHeader className="rounded-md">
            <Table.Thead>
              <Table.Tr className="bg-[#F4F5FE]">
                <Table.Th>PLO</Table.Th>
                <Table.Th>Description</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {collection.data?.map((ploNo, index) => (
                <Table.Tr key={index}>
                  <Table.Td className="py-4 font-bold pl-5">
                    <p>{ploNo.no}</p>
                  </Table.Td>
                  <Table.Td className="py-4 pl-5 flex text-[#575757] gap-2  flex-col items-start">
                    <p>{ploNo.descTH}</p>
                    <p>{ploNo.descEN}</p>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </Modal>

      <div className="bg-[#ffffff] flex flex-col h-full w-full px-6 py-3 gap-[12px] overflow-hidden">
        <div className="flex flex-col  items-start ">
          <p className="text-secondary text-[16px] font-bold">Dashboard</p>
          <p className="text-tertiary text-[14px] font-medium">
            {totalPLOs} Collection
            {totalPLOs > 1 ? "s " : " "}
          </p>
        </div>
        {/* Course Detail */}
        {loading ? (
          <Loading />
        ) : (
          ploCollection.map((department) => (
            <div className="bg-[#bfbfff3e] rounded-md flex gap-2 flex-col py-4 px-5">
              <div className="flex flex-col  w-fit">
                <p className=" font-bold text-b2 text-secondary">
                  {department.departmentEN}
                </p>
              </div>
              {department.collections.map((collection, index) => (
                <>
                  <div
                    onClick={() => {
                      setCollection({ index, ...collection });
                      setOpenModal(true);
                    }}
                    className="bg-white cursor-pointer hover:bg-[#fafafa] grid grid-cols-5 items-center justify-between first:rounded-t-md last:rounded-b-md rounded-md py-4 border-b-[1px] border-[#eeeeee] px-5"
                  >
                    {/* PLO List */}
                    <div className="flex flex-col ">
                      <p className="font-medium text-[13px] text-tertiary">
                        PLO Collection {index + 1}
                      </p>
                    </div>
                    {/* Status */}
                    <div
                      className={`px-3 py-1 w-fit rounded-[20px]  text-[12px] font-medium ${
                        collection.isActive
                          ? "bg-[#10e5908e] text-[#228762]"
                          : "bg-[#a2a2a2] text-[#ffffff]"
                      } `}
                    >
                      <p className=" font-semibold ">
                        {collection.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                    {/* Main Instructor */}
                    <div className="flex items-center font-medium text-[#4E5150] text-b3"></div>
                    {/* Open Symester */}
                    <div className="flex justify-start items-center gap-1 text-[#4E5150] text-b3">
                      <p className="text-wrap font-medium">
                        Start in: {collection.semester}/{collection.year}
                      </p>
                      <div className="flex gap-1"></div>
                    </div>
                    {/* Button */}
                    <div className="flex justify-end gap-4 items-center">
                      {/* <div
                            className="bg-transparent border-[1px] border-secondary text-secondary size-8 bg-none rounded-full cursor-pointer hover:bg-secondary/10"
                            onClick={() => {
                              setEditCourse({
                                courseNo: course.courseNo,
                                ...sec,
                              });
                              openedModalManageInst();
                            }}
                          >
                            <Icon IconComponent={ManageAdminIcon} />
                          </div> */}

                      {/* <div className="flex justify-center items-center bg-transparent border-[1px] border-[#F39D4E] text-[#F39D4E] size-8 bg-none rounded-full  cursor-pointer hover:bg-[#F39D4E]/10"></div>
                      <div className="flex justify-center items-center bg-transparent border-[1px] border-[#FF4747] text-[#FF4747] size-8 bg-none rounded-full  cursor-pointer hover:bg-[#FF4747]/10"></div> */}
                    </div>
                  </div>
                </>
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );
}
