import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { getPLOs } from "@/services/plo/plo.service";
import { IModelPLO, IModelPLOCollection } from "@/models/ModelPLO";
import ModalAddPLOCollection from "@/components/Modal/ModalAddPLOCollection";
import {
  Alert,
  Button,
  Group,
  Modal,
  Radio,
  RadioCard,
  Table,
  Tabs,
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
import { isEmpty } from "lodash";
import { setShowSidebar } from "@/store/showSidebar";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function ModalPLOManagement({ opened, onClose }: Props) {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [ploActive, setPloActive] = useState<IModelPLO[]>([]);
  const [selectPlo, setSelectPlo] = useState<string | null>("Dashboard");
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
    const fetchPLOTab = async () => {
      const res = await getPLOs({
        manage: true,
        role: user.role,
        departmentCode: user.departmentCode,
      });
      if (res) {
        setPloActive([{ name: "Dashboard" }, ...res]);
      }
    };
    if (opened) {
      fetchPLOTab();
    }
  }, [opened]);

  useEffect(() => {
    dispatch(setShowSidebar(true));
    if (user.id) {
      setLoading(true);
      fetchPLO();
      setLoading(false);
    }
  }, [user]);

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
        title={`${collection.name}`}
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
          <div className="flex flex-col rounded-lg border overflow-y-auto h-full border-secondary">
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
        closeOnClickOutside={false}
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
              body: " flex justify-center gap-1",
            }}
            title={
              <div className="flex items-center  gap-2">
                <IconInfoCircle />
                <p>Duplicate PLO Collection </p>
              </div>
            }
          >
            <p className="font-medium text-[#333333] mx-8 ">
              We’ve found {totalPLOs} similar PLO Collections. <br /> Select one
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
            <Group className="flex overflow-y-auto max-h-[260px]">
              <div className="flex p-1 w-full h-full flex-col overflow-y-auto gap-3">
                {ploCollectDupli.map((plo, index) => (
                  <RadioCard
                    key={index}
                    value={plo.name}
                    style={{
                      boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                    }}
                    className="p-3 px-3 flex border-none h-fit rounded-md w-full"
                    // label={plo.name}
                  >
                    <Group>
                      <Radio.Indicator />
                      <div className="text-b2 font-medium text-[#333333]">
                        {plo.name}
                      </div>
                    </Group>
                  </RadioCard>
                ))}
              </div>
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
            >
              Duplicate and Edit
            </Button>
          </div>
        </div>
      </Modal>
      <ModalAddPLOCollection
        opened={modalAddPLO}
        onOpen={openModalAddPLO}
        onClose={closeModalAddPLO}
        collection={selectPloDupli}
        fetchPLO={fetchPLO}
      />
      <Modal.Root
        opened={opened}
        onClose={onClose}
        autoFocus={false}
        fullScreen={true}
        zIndex={50}
        classNames={{ content: "!pt-0" }}
      >
        <Modal.Overlay />
        <Modal.Content className="overflow-hidden !rounded-none">
          <Modal.Header className="!py-0 flex w-full border-b border-[#e0e0e0] rounded-none justify-between">
            <div className="inline-flex gap-2 items-center w-fit justify-start">
              <Modal.CloseButton />
              <div className="font-semibold text-h2 text-secondary">
                PLO Management
              </div>
            </div>
          </Modal.Header>

          <Modal.Body className="px-0 pt-1 flex flex-col h-full w-full gap-2 overflow-hidden">
            <Tabs
              variant="pills"
              value={selectPlo}
              onChange={setSelectPlo}
              className="px-6 mt-2"
              classNames={{
                list: " !gap-2 !bg-none !bg-transparent",
              }}
            >
              <Tabs.List>
                {ploActive.map((collection) => (
                  <Tabs.Tab
                    className={`!rounded-xl !border-none ${
                      selectPlo !== collection.name &&
                      "!bg-transparent hover:!bg-hover"
                    }`}
                    value={collection.name}
                  >
                    {collection.name}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
              {ploActive.map((collection, index) => (
                <Tabs.Panel
                  value={collection.name}
                  className="flex flex-row mt-6 items-center justify-between"
                >
                  <div className="flex flex-col items-start">
                    <p className="text-secondary text-[16px] font-bold">
                      {collection.name}
                    </p>
                    {index == 0 && (
                      <p className="text-tertiary text-[14px] font-medium">
                        {ploCollection.length} Department
                        {ploCollection.length > 1 ? "s " : " "}
                      </p>
                    )}
                  </div>
                  {index == 0 && (
                    <Button
                      leftSection={
                        <IconPlus className="h-5 w-5 -mr-1" stroke={1.5} />
                      }
                      className="rounded-[8px] text-[12px] h-[32px] w-fit "
                      onClick={openModalDuplicatePLO}
                    >
                      Add Collection
                    </Button>
                  )}
                </Tabs.Panel>
              ))}
            </Tabs>
            <Tabs className="px-6 mt-4" defaultValue="plodescription">
              <Tabs.List className="!gap-6  !bg-transparent">
                <Tabs.Tab
                  className="px-0 !bg-transparent hover:!text-[#3e3e3e]"
                  value="plodescription"
                >
                  PLO Description
                </Tabs.Tab>
                <Tabs.Tab
                  className="px-0 !bg-transparent hover:!text-[#3e3e3e]"
                  value="plomapping"
                >
                  PLO Mapping
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
            {/* <div className="flex items-center justify-between px-6">
              <div className="flex flex-col  items-start ">
                <p className="text-secondary text-[16px] font-bold">
                  Dashboard
                </p>
                <p className="text-tertiary text-[14px] font-medium">
                  {ploCollection.length} Department
                  {ploCollection.length > 1 ? "s " : " "}
                </p>
              </div>
            </div> */}
            {/* Course Detail */}
            {loading ? (
              <Loading />
            ) : (
              <div className="flex flex-col  overflow-y-auto gap-4 px-6 pb-14 pt-2">
                {ploCollection?.map((department, indexPLO) => (
                  <div
                    className="bg-[#ffffff] rounded-md flex  flex-col py-4 px-5"
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
                          className="bg-[#f5f6ff] cursor-pointer first:rounded-t-md last:rounded-b-md last:border-none hover:bg-[#E4E4FF] grid grid-cols-5 items-center  justify-between  py-3 border-b-[1px] border-[#eeeeee] px-7"
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

                          <div className="flex w-full justify-end items-center   text-[#858585]   size-8 ">
                            <IconChevronRight className="size-4" stroke={3} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}{" "}
              </div>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
