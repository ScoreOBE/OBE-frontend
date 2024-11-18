import { Alert, Button, Checkbox, Group, Modal, Radio } from "@mantine/core";
import { useEffect, useState } from "react";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import {
  getKeyPartTopicTQF3,
  PartTopicTQF3,
} from "@/helpers/constants/TQF3.enum";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import { genPdfTQF3 } from "@/services/tqf3/tqf3.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { useParams } from "react-router-dom";
import { IModelTQF3 } from "@/models/ModelTQF3";
import noData from "@/assets/image/noData.jpg";
import IconExcel from "@/assets/icons/excel.svg?react";
import Icon from "@/components/Icon";
import { setLoadingOverlay } from "@/store/loading";
import { IModelPLOCollection } from "@/models/ModelPLO";

type Props = {
  opened: boolean;
  onClose: () => void;
  // dataPLO?: Partial<IModelPLOCollection>;
};

export default function ModalExportPLO({ opened, onClose }: Props) {
  const { courseNo } = useParams();
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const tqf3 = useAppSelector((state) => state.tqf3);
  const [selectedMerge, setSelectedMerge] = useState("unzipfile");
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const dispatch = useAppDispatch();
  const [dataExport, setDataExport] = useState<Partial<IModelTQF3>>({});

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={true}
      title={
        <div className="flex flex-col gap-3">
          <p>Export PLO</p>
          <p className="text-[#909090] text-[13px] font-medium -mt-[6px]">
            Computer Engineering Department (CPE)
          </p>
          <p className="text-[12px] inline-flex items-center text-[#20884f] -mt-[6px]">
            File format: <Icon IconComponent={IconExcel} className="ml-1 " />
          </p>
        </div>
      }
      centered
      size="45vw"
      transitionProps={{ transition: "pop" }}
      classNames={{
        header: "bg-red-400",
        close: "-mt-8",
        content: "flex flex-col overflow-hidden pb-2 max-h-full h-fit",
        body: "flex flex-col overflow-hidden max-h-full h-fit",
      }}
    >
      <Alert
        radius="md"
        variant="light"
        color="blue"
        classNames={{
          body: " flex justify-center",
        }}
        title={
          <div className="flex items-center  gap-2">
            <Icon IconComponent={IconInfo2} />
            <p>
              The <span>list of courses mapped to each PLO</span> can be edited
              in <span className="underline">Map PLO required. </span>
            </p>
          </div>
        }
      ></Alert>
      {/* <div className="flex sm:max-ipad11:h-[400px] sm:max-ipad11:overflow-y-auto flex-col">
        {!dataExport.part1?.updatedAt ? (
          <div className="flex flex-col mt-3  items-center  ">
            <p className=" text-[14px] font-semibold">
              No parts of TQF3 are available for export.
            </p>
            <img
              className=" z-50  w-[320px] h-[220px] "
              src={noData}
              alt="loginImage"
            />
          </div>
        ) : (
          <div>
            <div
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
              className="p-3 m-[4px] rounded-md"
            >
              <Radio.Group
                classNames={{ label: "font-semibold" }}
                value={selectedMerge}
                onChange={setSelectedMerge}
              >
                <Group mb={2}>
                  <Radio
                    classNames={{ label: "font-medium" }}
                    value="unzipfile"
                    label="Combine into one file (Unzip)"
                  />
                  <Radio
                    classNames={{ label: "font-medium" }}
                    value="zipfile"
                    label="Split into parts (Zip)"
                  />
                </Group>
              </Radio.Group>
            </div>
            <Checkbox.Group
              label="Select part to export"
              classNames={{ label: "mb-1 font-semibold text-default" }}
              value={selectedParts}
              onChange={setSelectedParts}
              className=" h-[400px] overflow-y-auto my-4 "
            >
              {Object.values(PartTopicTQF3)
                .slice(0, 6)
                .filter(
                  (item) =>
                    dataExport &&
                    dataExport[getKeyPartTopicTQF3(item)!]?.updatedAt
                )
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex p-1 mb-1 w-full  flex-col overflow-y-auto"
                  >
                    <Checkbox.Card
                      className={`p-3 items-center px-4 flex  h-fit rounded-md w-full ${
                        selectedParts.includes(getKeyPartTopicTQF3(item)!) &&
                        "!border-[1px] !border-secondary "
                      }`}
                      style={{
                        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.15)",
                      }}
                      value={getKeyPartTopicTQF3(item)}
                    >
                      <Group
                        wrap="nowrap"
                        className="item-center flex"
                        align="flex-start"
                      >
                        <Checkbox.Indicator className="mt-1" />
                        <div className="text-default whitespace-break-spaces font-medium text-[13px]">
                          {item}
                        </div>
                      </Group>
                    </Checkbox.Card>
                  </div>
                ))}
            </Checkbox.Group>
          </div>
        )}
      </div>
      {dataExport.part1?.updatedAt && (
        <div className="flex gap-2 sm:max-macair133:fixed sm:max-macair133:bottom-6 sm:max-macair133:right-8 items-end  justify-end h-fit">
          <Group className="flex w-full gap-2 h-fit items-end justify-end">
            <Button onClick={onClose} variant="subtle">
              Cancel
            </Button>
            <Button
              loading={loading}
              rightSection={
                <Icon
                  IconComponent={IconFileExport}
                  className={` ${
                    !dataExport.part1?.updatedAt
                      ? "text-[#adb5bd]"
                      : "text-[#ffffff]"
                  } stroke-[2px] size-5 items-center`}
                />
              }
              disabled={
                !dataExport.part1?.updatedAt || selectedParts.length === 0
              }
            >
              Export TQF3
            </Button>
          </Group>
        </div>
      )} */}
    </Modal>
  );
}
