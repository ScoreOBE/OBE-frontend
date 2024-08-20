import { useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { getPLOs } from "@/services/plo/plo.service";
import { IModelPLO, IModelPLOCollection } from "@/models/ModelPLO";
import ModalAddPLOCollection from "@/components/Modal/ModalPLOCollection";
import {
  Button,
  Group,
  Modal,
  Radio,
  ScrollArea,
  Table,
  Tabs,
  TextInput,
} from "@mantine/core";
import ThIcon from "@/assets/icons/thai.svg?react";
import EngIcon from "@/assets/icons/eng.svg?react";
import Icon from "@/components/Icon";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { COURSE_TYPE } from "@/helpers/constants/enum";

export default function CourseManagement() {
  const user = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [ploCollection, setPLOCollection] = useState<IModelPLOCollection[]>([]);
  const [totalPLOs, setTotalPLOs] = useState<number>(0);
  const [openModal, setOpenModal] = useState(false);
  const [isTH, setIsTH] = useState<string | null>("TH");
  const [collection, setCollection] = useState<
    Partial<IModelPLO> & Record<string, any>
  >({});
  const [checked, setChecked] = useState(false);
  const [isDupliPLO, setIsDupliPLO] = useState(false);
  const [ploCollectDupli, setPLOCollectionDupli] = useState<
    IModelPLOCollection[]
  >([]);

  const [modalAddPLO, { open: openModalAddPLO, close: closeModalAddPLO }] =
    useDisclosure(false);
  const [
    modalDupilcatePLO,
    { open: openModalDupilcatePLO, close: closeModalDupilcatePLO },
  ] = useDisclosure(false);

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
        console.log(res);
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
          content: "flex flex-col overflow-hidden pb-2  max-h-full h-fit",
          body: "flex flex-col overflow-hidden max-h-full h-fit",
        }}
      >
        <div className="flex flex-col gap-4 overflow-hidden  h-full">
          <div className="flex justify-between items-center">
            <div>
              {isTH === "TH" ? collection.criteriaTH : collection.criteriaEN}
            </div>
            <Tabs value={isTH} onChange={setIsTH} variant="pills">
              <Tabs.List>
                <Tabs.Tab value="TH">
                  <div className="flex flex-row items-center gap-2 ">
                    <Icon IconComponent={ThIcon} />
                    ไทย
                  </div>
                </Tabs.Tab>
                <Tabs.Tab value="EN">
                  <div className="flex flex-row items-center gap-2 ">
                    <Icon IconComponent={EngIcon} />
                    Eng
                  </div>
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </div>
          <div className="flex flex-col rounded-lg border overflow-y-auto h-full">
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
                      {isTH === "TH" ? ploNo.descTH : ploNo.descEN}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        </div>
      </Modal>

      <Modal
        title={
          <div className="flex flex-col gap-1">
            <p>Add PLO Collection </p>
            {/* <p className="text-[#909090] text-[12px] font-medium">PLO Name</p> */}
          </div>
        }
        opened={modalDupilcatePLO}
        onClose={closeModalDupilcatePLO}
        transitionProps={{ transition: "pop" }}
        size="35vw"
        centered
        classNames={{
          content: "flex flex-col overflow-hidden pb-2  max-h-full h-fit",
          body: "flex flex-col overflow-hidden max-h-full h-fit",
        }}
      >
        <div className="flex flex-col gap-5 pt-1">
          <div className="w-full justify-center  bg-white rounded-md  flex flex-col ">
            <div className="flex flex-col gap-3">
              <div
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
                className="p-3 px-3 rounded-md"
              >
                <Radio
                  value="sv"
                  // checked={checked}
                  // onChange={(event) => setChecked(event.currentTarget.checked)}
                  label="Collection A"
                />
              </div>

              <div
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
                className="p-3 px-3 rounded-md"
              >
                <Radio
                  value="sv"
                  // checked={checked}
                  // onChange={(event) => setChecked(event.currentTarget.checked)}
                  label="Collection B"
                />
              </div>

              <div
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
                className="p-3 px-3 rounded-md"
              >
                <Radio
                  value="sv"
                  // checked={checked}
                  // onChange={(event) => setChecked(event.currentTarget.checked)}
                  label="Collection C"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end w-full">
            <Button
              color="#575757"
              variant="subtle"
              className="rounded-[8px] text-[12px] h-[32px] w-fit "
              onClick={() => {
                openModalAddPLO();
                setIsDupliPLO(false);
                closeModalDupilcatePLO();
              }}
            >
              Skip
            </Button>
            <Button
              onClick={() => {
                openModalAddPLO();
                setIsDupliPLO(true);
                closeModalDupilcatePLO();
              }}
              className="rounded-[8px] text-[12px] h-[32px] w-fit "
              color="#5768d5"
            >
              Duplicate and Edit
            </Button>
          </div>
        </div>
      </Modal>
      <ModalAddPLOCollection opened={modalAddPLO} onClose={closeModalAddPLO} />
      <div className="bg-[#ffffff] flex flex-col h-full w-full px-6 py-3 gap-[12px] overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex flex-col  items-start ">
            <p className="text-secondary text-[16px] font-bold">Dashboard</p>
            <p className="text-tertiary text-[14px] font-medium">
              {totalPLOs} Collection
              {totalPLOs > 1 ? "s " : " "}
            </p>
          </div>
          <Button
            color="#5768D5"
            leftSection={<IconPlus className="h-5 w-5 -mr-1" stroke={1.5} />}
            className="rounded-[8px] text-[12px] h-[32px] w-fit "
            onClick={openModalDupilcatePLO}
          >
            Add Collection
          </Button>
        </div>
        {/* Course Detail */}
        {loading ? (
          <Loading />
        ) : (
          ploCollection.map((department) => (
            <div className="bg-[#bfbfff3e] rounded-md flex  flex-col py-4 px-5">
              <div className="flex flex-col mb-4  w-fit">
                <p className=" font-bold text-b2 text-secondary">
                  {department.departmentEN}
                </p>
              </div>
              {department.collections.map((collection, index) => (
                <div className="flex flex-col">
                  <div
                    onClick={() => {
                      setCollection({ index, ...collection });
                      setOpenModal(true);
                    }}
                    className="bg-white cursor-pointer hover:bg-[#fafafa] grid grid-cols-5 items-center first:rounded-t-md last:rounded-b-md justify-between  py-3 border-b-[1px] border-[#eeeeee] px-5"
                  >
                    {/* PLO List */}
                    <div className="flex flex-col  ">
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
                    <div className="flex justify-end gap-4 items-center"></div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );
}
