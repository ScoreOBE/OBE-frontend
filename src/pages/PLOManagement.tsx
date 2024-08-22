import { useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { getPLOs } from "@/services/plo/plo.service";
import { IModelPLO, IModelPLOCollection } from "@/models/ModelPLO";
import ModalAddPLOCollection from "@/components/Modal/ModalPLOCollection";
import {
  Alert,
  Button,
  Group,
  Modal,
  Radio,
  RadioCard,
  ScrollArea,
  Table,
  Tabs,
  TextInput,
} from "@mantine/core";
import ThIcon from "@/assets/icons/thai.svg?react";
import EngIcon from "@/assets/icons/eng.svg?react";
import Icon from "@/components/Icon";
import {
  IconChevronRight,
  IconEdit,
  IconInfoCircle,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { COURSE_TYPE } from "@/helpers/constants/enum";
import { isEmpty } from "lodash";
import { useForm } from "@mantine/form";

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
  const [ploCollectDupli, setPLOCollectionDupli] = useState<IModelPLO[]>([]);
  const [selectPloDupli, setSelectPloDupli] = useState<Partial<IModelPLO>>({});
  const [modalAddPLO, { open: openModalAddPLO, close: closeModalAddPLO }] =
    useDisclosure(false);
  const [
    modalDuplicatePLO,
    { open: openModalDuplicatePLO, close: closeModalDuplicatePLO },
  ] = useDisclosure(false);

  const fetchPLO = async (all = false) => {
    const res = await getPLOs({
      all,
      role: user.role,
      departmentCode: user.departmentCode,
    });
    if (res) {
      if (all) {
        setPLOCollectionDupli(res);
      } else {
        setTotalPLOs(res.totalCount);
        setPLOCollection(res.plos);
      }
    }
  };

  useEffect(() => {
    if (user.id) {
      setLoading(true);
      fetchPLO();
      setLoading(false);
    }
  }, [user]);

  // useEffect(() => {
  //   if (ploCollectDupli) console.log(ploCollectDupli);
  // }, [ploCollectDupli]);

  useEffect(() => {
    if (modalDuplicatePLO) {
      fetchPLO(true);
    } else if (!modalAddPLO) {
      setSelectPloDupli({});
    }
  }, [modalAddPLO, modalDuplicatePLO]);

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
            <p>Add PLO Collection</p>
          </div>
        }
        opened={modalDuplicatePLO && !!ploCollectDupli.length}
        onClose={closeModalDuplicatePLO}
        transitionProps={{ transition: "pop" }}
        size="35vw"
        centered
        classNames={{
          content: "flex flex-col overflow-hidden pb-2  max-h-full h-fit",
          body: "flex flex-col overflow-hidden max-h-full h-fit",
        }}
      >
        <div className="flex flex-col gap-5 pt-1 w-full">
          <Alert
            radius="md"
            variant="light"
            color="blue"
            classNames={{
              icon: "size-6",
              body: " flex justify-center",
            }}
            title={
              <div className="flex items-center gap-2">
                <IconInfoCircle />
                <p>Duplicate PLO Collection </p>
              </div>
            }
          >
            <p className="font-medium text-[#333333] mx-8 ">
              We’ve found {totalPLOs} similar SO Collections. <br /> Select one
              to duplicate and edit, or skip duplicate.
            </p>
          </Alert>
          <Radio.Group
            value={selectPloDupli.name}
            onChange={(event) =>
              setSelectPloDupli(
                ploCollectDupli.find((plo) => plo.name === event) ?? {}
              )
            }
          >
            <Group className="flex w-full flex-col gap-3">
              {ploCollectDupli.map((plo, index) => (
                <RadioCard
                  key={index}
                  value={plo.name}
                  style={{
                    boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                  }}
                  className="p-3 px-3 flex border-none h-full rounded-md w-full"
                  // label={plo.name}
                >
                  <Group>
                    <Radio.Indicator color="#5768D5" />
                    <div className="text-b2 font-medium text-[#333333]">
                      {plo.name}
                    </div>
                  </Group>
                </RadioCard>
              ))}
            </Group>
          </Radio.Group>

          <div className="flex gap-2 justify-end w-full">
            <Button
              color="#575757"
              variant="subtle"
              className="rounded-[8px] text-[12px] h-[32px] w-fit "
              onClick={() => {
                setSelectPloDupli({});
                openModalAddPLO();
                closeModalDuplicatePLO();
              }}
            >
              Skip duplicate
            </Button>
            <Button
              onClick={() => {
                openModalAddPLO();
                closeModalDuplicatePLO();
              }}
              className="rounded-[8px] text-[12px] border-none h-[32px] w-fit "
              disabled={isEmpty(selectPloDupli)}
              color="#5768d5"
            >
              Duplicate and Edit
            </Button>
          </div>
        </div>
      </Modal>
      <ModalAddPLOCollection
        opened={modalAddPLO}
        onClose={closeModalAddPLO}
        collection={selectPloDupli}
      />
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
            onClick={openModalDuplicatePLO}
          >
            Add Collection
          </Button>
        </div>
        {/* Course Detail */}
        {loading ? (
          <Loading />
        ) : (
          ploCollection?.map((department, indexPLO) => (
            <div
              className="bg-[#d2d2ff3e] rounded-md flex  flex-col py-4 px-5"
              key={indexPLO}
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div className="flex flex-col mb-4  w-fit">
                <p className=" font-bold text-b2 text-secondary">
                  {department.departmentEN}
                </p>
              </div>
              <div className="flex flex-col">
                {department.collections.map((collection, index) => (
                  <div
                    key={` ${index}`}
                    onClick={() => {
                      setCollection({ index, ...collection });
                      setOpenModal(true);
                    }}
                    className="bg-white   cursor-pointer first:rounded-t-md last:rounded-b-md last:border-none hover:bg-[#eeeeee] grid grid-cols-5 items-center  justify-between  py-3 border-b-[1px] border-[#eeeeee] px-7"
                  >
                    {/* PLO List */}
                    <div className="flex flex-col">
                      <p className="font-semibold text-[13px] text-tertiary">
                        {collection.name}
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
                      <p className="text-wrap font-semibold">
                        Start in: {collection.semester}/{collection.year}
                      </p>
                      <div className="flex gap-1"></div>
                    </div>
                    <div className="flex justify-end gap-4 items-center">
                      <div className="flex justify-center items-center   text-[#333333] size-8 ">
                        <IconChevronRight className="size-4" stroke={3} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
