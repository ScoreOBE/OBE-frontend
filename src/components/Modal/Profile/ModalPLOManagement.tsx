import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { deletePLO, getPLOs } from "@/services/plo/plo.service";
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
  IconExclamationCircle,
  IconInfoCircle,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { isEmpty } from "lodash";
import { setShowSidebar } from "@/store/showSidebar";
import MapPLO from "./MapPLO";
import MainPopup from "@/components/Popup/MainPopup";
import { NOTI_TYPE, POPUP_TYPE } from "@/helpers/constants/enum";
import { showNotifications } from "@/helpers/functions/function";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function ModalPLOManagement({ opened, onClose }: Props) {
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [ploActive, setPloActive] = useState<IModelPLO[]>([]);
  const [selectPlo, setSelectPlo] = useState<string | null>("Dashboard");
  const [ploCollection, setPloCollection] = useState<IModelPLO[]>([]);
  const [departmentPloCollection, setDepartmentPLOCollection] = useState<
    IModelPLOCollection[]
  >([]);
  const [totalPLOs, setTotalPLOs] = useState<number>(0);
  const [openModal, setOpenModal] = useState(false);
  const [isTH, setIsTH] = useState<string | null>("TH");
  const [selectView, setSelectView] = useState<string | null>("ploview");
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
  const [openModalAddPLONo, setOpenModalAddPLONo] = useState(false);
  const [openPopupDeletePLOCollection, setOpenPopupDeletePLOCollection] =
    useState(false);

  const fetchPLO = async (all = false) => {
    const payload = {
      all,
      role: user.role,
      departmentCode: user.departmentCode,
    };
    const [resPLO, resDep] = await Promise.all([
      getPLOs({ ...payload, all: true }),
      getPLOs(payload),
    ]);
    if (resPLO) {
      setPLOCollectionDupli(resPLO.plos);
      setPloCollection(resPLO.plos);
      setTotalPLOs(resPLO.totalCount);
    }
    if (resDep) {
      setTotalPLOs(resDep.totalCount);
      setDepartmentPLOCollection(resDep.plos);
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
        setSelectPlo("Dashboard");
        setPloActive([{ name: "Dashboard" }, ...res.plos]);
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
      setSelectPloDupli({});
      fetchPLO();
    }
  }, [modalAddPLO, modalDuplicatePLO]);

  const onClickDeletePLO = async () => {
    const res = await deletePLO(collection.id!);
    if (res) {
      setPloCollection(ploCollection.filter((plo) => plo.id !== collection.id));
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Delete success",
        `${collection.name} is deleted`
      );
      setOpenPopupDeletePLOCollection(false);
      setCollection({});
    }
  };

  return (
    <>
      {/* Modal PLO Description */}
      <Modal
        title={`${collection.name}`}
        opened={openModal}
        onClose={() => setOpenModal(false)}
        transitionProps={{ transition: "pop" }}
        size="60vw"
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
          <div className="flex flex-col max-h-[520px] h-fit rounded-lg border overflow-y-auto  border-secondary">
            <Table verticalSpacing="sm" stickyHeader className="rounded-md">
              <Table.Thead>
                <Table.Tr className="bg-[#e5e7f6]">
                  <Table.Th>PLO</Table.Th>
                  <Table.Th>Description</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {collection.data?.map((ploNo, index) => (
                  <Table.Tr key={index}>
                    <Table.Td className="py-4 font-bold pl-5">
                      <p className="pl-2">{ploNo.no}</p>
                    </Table.Td>
                    <Table.Td className="py-4 pl-5 flex text-[#575757] gap-2  flex-col items-start">
                      {isTH === "TH" ? ploNo.descTH : ploNo.descEN}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
          {((!ploActive.find((plo) => plo.name == collection.name) &&
            collection?.year! > academicYear?.year) ||
            (collection?.year == academicYear?.year &&
              collection?.semester! > academicYear?.semester)) && (
            <Button
              color="#FF4747"
              leftSection={<IconTrash className="h-5 w-5 -mr-1" stroke={1.5} />}
              onClick={() => {
                setOpenModal(false);
                setOpenPopupDeletePLOCollection(true);
              }}
              className=" rounded-md"
            >
              Delete {`${collection.name}`} Collection{" "}
            </Button>
          )}
        </div>
      </Modal>

      <MainPopup
        opened={openPopupDeletePLOCollection}
        onClose={() => setOpenPopupDeletePLOCollection(false)}
        action={onClickDeletePLO}
        type={POPUP_TYPE.DELETE}
        labelButtonRight="Delete PLO Collection"
        title={`Delete PLO Collection`}
        message={
          <>
            <Alert
              variant="light"
              color="red"
              title="After you delete this PLO Collection, it will affect all courses that use it."
              icon={<IconExclamationCircle />}
              classNames={{ title: "-mt-[2px]", icon: "size-6" }}
            ></Alert>
            <div className="flex flex-col mt-3 ">
              <p className="text-b3  text-[#808080]">PLO Collection name</p>
              <p className=" -translate-y-[2px] text-b1">{`${collection.name}`}</p>
            </div>
          </>
        }
      />

      {/* Modal Add PLO Collection */}
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
              icon: "size-6",
            }}
            title={
              <div className="flex items-center  gap-2">
                <IconInfoCircle />
                <p>Duplicate PLO Collection </p>
              </div>
            }
          >
            <p className="font-medium  mx-8 ">
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
                      <div className="text-b2 font-medium ">{plo.name}</div>
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
      {/* Main Modal PLO */}
      <Modal.Root
        opened={opened}
        onClose={onClose}
        autoFocus={false}
        fullScreen={true}
        zIndex={50}
        classNames={{ content: "!pt-0" }}
      >
        <Modal.Overlay />
        <Modal.Content className="overflow-hidden !rounded-none !px-0">
          <Modal.Header className="!pt-4  flex w-full rounded-none  pb-0 !px-0">
            <div className="flex flex-col gap-2 items-start w-full ">
              <div className="inline-flex px-12 w-full gap-2 font-semibold text-h2 text-secondary">
                <Modal.CloseButton className="!m-0" />
                <p>PLO Management</p>
              </div>
              <Tabs
                value={selectPlo}
                onChange={setSelectPlo}
                classNames={{
                  root: "w-full left-0",
                  tab: "px-1 !bg-transparent hover:!text-tertiary",
                  tabLabel: "!font-semibold",
                }}
              >
                <Tabs.List className="!gap-6 !bg-transparent px-[53px]">
                  {ploActive.map((collection) => (
                    <Tabs.Tab key={collection.name} value={collection.name}>
                      {collection.name}
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
              </Tabs>
            </div>
          </Modal.Header>

          <Modal.Body className=" px-28  flex flex-col h-full w-full pb-24  overflow-hidden">
            {/* Topic */}
            {selectPlo === "Dashboard" && (
              <div className="flex flex-row px-6 py-6 items-center justify-between">
                <div className="flex flex-col items-start">
                  <p className="text-secondary text-[16px] font-bold">
                    {selectPlo}
                  </p>

                  {selectView == "ploview" ? (
                    <p className="text-tertiary text-[14px] font-medium">
                      {ploCollection.length} Collection
                      {departmentPloCollection.length > 1 ? "s " : " "}
                    </p>
                  ) : (
                    <p className="text-tertiary text-[14px] font-medium">
                      {departmentPloCollection.length} Department
                      {departmentPloCollection.length > 1 ? "s " : " "}
                    </p>
                  )}
                </div>
                <div className="flex gap-4">
                  <Button
                    leftSection={
                      <IconPlus className="h-5 w-5 -mr-1" stroke={1.5} />
                    }
                    className="rounded-[8px] text-[12px] h-[32px] w-fit "
                    onClick={openModalDuplicatePLO}
                  >
                    Add Collection
                  </Button>
                </div>
              </div>
            )}
            {selectPlo == "Dashboard" && (
              <Tabs
                value={selectView}
                onChange={setSelectView}
                className="px-6"
                classNames={{
                  root: "mt-2",
                  tab: "px-0 pt-0 !bg-transparent hover:!text-tertiary",
                  tabLabel: "!font-semibold",
                }}
              >
                <Tabs.List className="!gap-6 !bg-transparent">
                  <Tabs.Tab value="ploview">PLO List</Tabs.Tab>
                  <Tabs.Tab value="departmentview">Department</Tabs.Tab>
                </Tabs.List>
              </Tabs>
            )}
            {/* Course Detail */}
            {loading ? (
              <Loading />
            ) : selectPlo === "Dashboard" ? (
              <div className="flex flex-col mt-3 overflow-y-auto gap-4 px-6 pb-1 pt-1">
                {selectView == "ploview"
                  ? ploCollection.map((plo, index) => (
                      <div
                        onClick={() => {
                          setCollection({ ...plo });
                          setOpenModal(true);
                        }}
                        className=" text-[14px] cursor-pointer first:mt-0 rounded-md hover:bg-[#eeeeee] grid grid-cols-5 items-center  justify-between  py-3 px-7"
                        key={index}
                        style={{
                          boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        <p className=" font-medium">{plo.name}</p>
                        <div
                          className={`px-3 py-1 w-fit rounded-[20px]  text-[12px] font-medium ${
                            plo.isActive
                              ? "bg-[#10e5908e] text-[#228762]"
                              : "bg-[#a2a2a2] text-[#ffffff]"
                          } `}
                        >
                          <p className=" font-medium">
                            {plo.isActive ? "Active" : "Inactive"}
                          </p>
                        </div>
                        {/* Main Instructor */}
                        <div className="flex items-center font-medium text-[#4E5150] text-b3"></div>
                        <div className="flex justify-start items-center gap-1 text-[#4E5150] text-b3">
                          <p className="text-wrap font-semibold">
                            Start in: {plo.semester}/{plo.year}
                          </p>
                          <div className="flex gap-1"></div>
                        </div>
                        <div className="flex w-full justify-end items-center   text-[#858585]   size-8 ">
                          <IconChevronRight className="size-4" stroke={3} />
                        </div>
                      </div>
                    ))
                  : departmentPloCollection?.map((department, indexPLO) => (
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
                              {/* Open Semester */}
                              <div className="flex justify-start items-center gap-1 text-[#4E5150] text-b3">
                                <p className="text-wrap font-semibold">
                                  Start in: {collection.semester}/
                                  {collection.year}
                                </p>
                                <div className="flex gap-1"></div>
                              </div>

                              <div className="flex w-full justify-end items-center   text-[#858585]   size-8 ">
                                <IconChevronRight
                                  className="size-4"
                                  stroke={3}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
              </div>
            ) : (
              <MapPLO ploName={selectPlo!} />
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
