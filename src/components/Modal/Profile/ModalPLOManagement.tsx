import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading/Loading";
import { deletePLO, getPLOs } from "@/services/plo/plo.service";
import { IModelPLO } from "@/models/ModelPLO";
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
import Icon from "@/components/Icon";
import IconTh from "@/assets/icons/thai.svg?react";
import IconEng from "@/assets/icons/eng.svg?react";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import IconPlus2 from "@/assets/icons/plus2.svg?react";
import IconTrash from "@/assets/icons/trash.svg?react";
import IconChevronRight from "@/assets/icons/chevronRight.svg?react";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import { useDisclosure } from "@mantine/hooks";
import { isEmpty } from "lodash";
import MapPLO from "./MapPLO";
import MainPopup from "@/components/Popup/MainPopup";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { setLoading, setLoadingOverlay } from "@/store/loading";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function ModalPLOManagement({ opened, onClose }: Props) {
  const loading = useAppSelector((state) => state.loading);
  const dispatch = useAppDispatch();
  const [plos, setPlos] = useState<IModelPLO[]>([]);
  const [selectPlo, setSelectPlo] = useState<string | null>("Dashboard");
  const [ploCollection, setPloCollection] = useState<IModelPLO[]>([]);
  const [collection, setCollection] = useState<
    Partial<IModelPLO> & Record<string, any>
  >({});
  const [totalPLOs, setTotalPLOs] = useState<number>(0);
  const [openModal, setOpenModal] = useState(false);
  const [isTH, setIsTH] = useState<string | null>("TH");
  const [selectPloDupli, setSelectPloDupli] = useState<Partial<IModelPLO>>({});
  const [openModalAddPLO, setOpenModalAddPLO] = useState(false);
  const [
    modalDuplicatePLO,
    { open: openModalDuplicatePLO, close: closeModalDuplicatePLO },
  ] = useDisclosure(false);
  const [openPopupDeletePLOCollection, setOpenPopupDeletePLOCollection] =
    useState(false);

  const fetchPLO = async () => {
    const res = await getPLOs();
    if (res) {
      setSelectPlo("Dashboard");
      setPlos([{ name: "Dashboard" }, ...res.plos]);
      setPloCollection(res.plos);
      setTotalPLOs(res.totalCount);
    }
  };

  useEffect(() => {
    if (opened) {
      dispatch(setLoading(true));
      fetchPLO();
      dispatch(setLoading(false));
    }
  }, [opened]);

  const onClickDeletePLO = async () => {
    dispatch(setLoadingOverlay(true));
    const res = await deletePLO(collection.id!);
    if (res) {
      fetchPLO();
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "PLO Deleted successfully",
        `${collection.name} has been successfully deleted from the PLO list`
      );
      setOpenPopupDeletePLOCollection(false);
      setCollection({});
    }
    dispatch(setLoadingOverlay(false));
  };

  return (
    <>
      {/* Modal PLO Description */}
      <Modal
        title={`${collection.name}`}
        opened={openModal}
        onClose={() => {
          setOpenModal(false);
          setIsTH("TH");
        }}
        transitionProps={{ transition: "pop" }}
        size="60vw"
        centered
        classNames={{
          content: "flex flex-col overflow-hidden pb-2 max-h-full h-fit",
          body: "flex flex-col max-h-full h-fit",
        }}
      >
        <div className="flex flex-col gap-4 overflow-hidden h-full">
          <div className="flex justify-between items-center">
            <div>
              {isTH === "TH" ? collection.criteriaTH : collection.criteriaEN}
            </div>
            <Tabs value={isTH} onChange={setIsTH} variant="pills">
              <Tabs.List>
                <Tabs.Tab value="TH">
                  <div className="flex flex-row items-center gap-2 ">
                    <Icon IconComponent={IconTh} />
                    ไทย
                  </div>
                </Tabs.Tab>
                <Tabs.Tab value="EN">
                  <div className="flex flex-row items-center gap-2 ">
                    <Icon IconComponent={IconEng} />
                    Eng
                  </div>
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </div>
          <div className="flex flex-col max-h-[490px] h-fit rounded-lg border overflow-y-auto border-secondary">
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
          {collection?.canEdit && (
            <Button
              color="red"
              leftSection={
                <Icon
                  IconComponent={IconTrash}
                  className="size-5 -mr-1 stroke-[2px]"
                />
              }
              onClick={() => {
                setOpenModal(false);
                setOpenPopupDeletePLOCollection(true);
              }}
              className="!w-full !h-9 !items-center !justify-center"
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
        type="delete"
        labelButtonRight="Delete PLO Collection"
        title={`Delete PLO Collection`}
        message={
          <>
            <Alert
              variant="light"
              color="red"
              title={
                <p>
                  This action cannot be undone. After you delete this PLO
                  Collection, <br /> it will affect all courses that use it.
                </p>
              }
              icon={
                <Icon
                  IconComponent={IconExclamationCircle}
                  className="size-6"
                />
              }
            ></Alert>
            <div className="flex flex-col mt-3 ">
              <p className="text-b4  text-[#808080]">PLO Collection name</p>
              <p className=" -translate-y-[2px] text-b1">{`${collection.name}`}</p>
            </div>
          </>
        }
      />

      {/* Modal Add PLO Collection */}
      <Modal
        title="Add PLO Collection"
        closeOnClickOutside={false}
        opened={modalDuplicatePLO && !!ploCollection.length}
        onClose={closeModalDuplicatePLO}
        transitionProps={{ transition: "pop" }}
        size="42vw"
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
              <div className="flex items-center gap-2">
                <Icon IconComponent={IconInfo2} />
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
                ploCollection.find((plo) => plo.name === event) ?? {}
              )
            }
          >
            <Group className="flex overflow-y-auto max-h-[265px]">
              <div className="flex p-1 w-full h-full flex-col overflow-y-auto gap-3">
                {ploCollection.map((plo, index) => (
                  <RadioCard
                    key={index}
                    value={plo.name}
                    style={{
                      boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                    }}
                    className="p-3 px-3 flex border-none h-fit rounded-md w-full"
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
              variant="subtle"
              onClick={() => {
                setSelectPloDupli({});
                setOpenModalAddPLO(true);
                closeModalDuplicatePLO();
              }}
            >
              Skip duplicate
            </Button>
            <Button
              onClick={() => {
                setOpenModalAddPLO(true);
                closeModalDuplicatePLO();
              }}
              disabled={isEmpty(selectPloDupli)}
            >
              Duplicate and Edit
            </Button>
          </div>
        </div>
      </Modal>
      <ModalAddPLOCollection
        opened={openModalAddPLO}
        onClose={() => setOpenModalAddPLO(false)}
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
        classNames={{ content: "!pt-0 !bg-[#fafafa]" }}
      >
        <Modal.Overlay />
        <Modal.Content className="overflow-hidden !rounded-none !px-0">
          <Modal.Header className="!pt-4 !bg-[#fafafa] flex w-full rounded-none  pb-0 !px-0">
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
                  {plos.map((collection) => (
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
                  <p className="text-tertiary text-[14px] font-medium">
                    {ploCollection.length} Collection
                    {ploCollection.length > 1 ? "s " : " "}
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button
                    leftSection={
                      <Icon
                        IconComponent={IconPlus2}
                        className="size-5 -mr-1 stroke-[2px]"
                      />
                    }
                    onClick={openModalDuplicatePLO}
                  >
                    Add Collection
                  </Button>
                </div>
              </div>
            )}
            {/* Course Detail */}
            {selectPlo === "Dashboard" ? (
              loading.loading ? (
                <div className="flex justify-center items-center h-full w-full">
                  <Loading />
                </div>
              ) : (
                <div className="flex flex-col mt-3 overflow-y-auto gap-4 px-6 pb-1 pt-1">
                  {ploCollection.map((plo, index) => (
                    <div
                      onClick={() => {
                        setCollection({ ...plo });
                        setOpenModal(true);
                      }}
                      className=" text-[14px] bg-white cursor-pointer first:mt-0 rounded-md hover:bg-[#f8f8f8] flex items-center justify-between w-full py-3 px-7"
                      key={index}
                      style={{
                        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                      }}
                    >
                      <p className="w-full font-medium">{plo.name}</p>
                      <div className="flex w-full justify-end items-center text-[#858585] size-8 ">
                        <Icon
                          IconComponent={IconChevronRight}
                          className="size-4 stroke-[2px]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <MapPLO ploName={selectPlo!} />
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
