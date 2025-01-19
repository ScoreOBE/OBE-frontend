import {
  Alert,
  Button,
  Checkbox,
  Group,
  Modal,
  Radio,
  Select,
} from "@mantine/core";
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
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const curriculum = useAppSelector((state) => state.faculty.curriculum);
  const dispatch = useAppDispatch();
  const [selectedMerge, setSelectedMerge] = useState("unzipfile");
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [dataExport, setDataExport] = useState<Partial<IModelTQF3>>({});

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={true}
      title={
        <div className="flex flex-col gap-3">
          <p>Export PLO</p>

          <p className="text-[12px] inline-flex items-center text-[#20884f] -mt-[6px]">
            File format: <Icon IconComponent={IconExcel} className="ml-1 " />
          </p>
        </div>
      }
      centered
      size="43vw"
      transitionProps={{ transition: "pop" }}
      classNames={{
        header: "bg-red-400",
        close: "-mt-8",
        content: "flex flex-col overflow-hidden pb-2 max-h-full h-fit",
        body: "flex flex-col overflow-hidden max-h-full h-fit",
      }}
    >
      <div className="flex flex-col gap-5 ">
        <Select
          rightSectionPointerEvents="all"
          label={`Select Curriculum to Export PLO.`}
          // placeholder={}
          data={curriculum?.map((cur) => ({
            value: cur.code,
            label: cur.nameEN,
          }))}
          allowDeselect
          searchable
          clearable
          size="sm"
          nothingFoundMessage="No result"
          className="w-full border-none "
          classNames={{
            input: `rounded-md`,
            option: `py-1`,
          }}
        />
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
                The <span>list of courses mapped to each PLO</span> can be
                edited in <span className="underline">Map PLO required. </span>
              </p>
            </div>
          }
        ></Alert>

        <div className="flex gap-2 sm:max-macair133:fixed sm:max-macair133:bottom-6 sm:max-macair133:right-8 items-end  justify-end h-fit">
          <Group className="flex w-full gap-2 h-fit items-end justify-end">
            <Button onClick={onClose} variant="subtle">
              Cancel
            </Button>
            <Button
              loading={loading}
              rightSection={
                <Icon
                  IconComponent={IconExcel}
                  className={` ${
                    !dataExport.part1?.updatedAt
                      ? "text-[#adb5bd]"
                      : "text-[#ffffff]"
                  } stroke-[2px] size-5 items-center`}
                />
              }
              // onClick={generatePDF}
              disabled={
                !dataExport.part1?.updatedAt || selectedParts.length === 0
              }
            >
              Export PLO
            </Button>
          </Group>
        </div>
      </div>
    </Modal>
  );
}
