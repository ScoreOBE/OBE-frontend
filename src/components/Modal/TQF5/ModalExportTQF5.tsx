import { Button, Checkbox, Group, Modal, Radio } from "@mantine/core";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import IconPDF from "@/assets/icons/pdf.svg?react";
import { useParams } from "react-router-dom";
import { IModelTQF3 } from "@/models/ModelTQF3";
import { IModelTQF5 } from "@/models/ModelTQF5";
import Icon from "@/components/Icon";

type Props = {
  opened: boolean;
  onClose: () => void;
  //   dataTQF?: Partial<IModelTQF5> & { courseNo?: string };
};

export default function ModalExportTQF3({ opened, onClose }: Props) {
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
        <div className="flex flex-col gap-2">
          <p>Export TQF5</p>
          <p className="text-b4 acerSwift:max-macair133:!text-b5 inline-flex items-center text-[#e13b3b] -mt-[6px]">
            File format:{" "}
            <Icon IconComponent={IconPDF} className="ml-1 stroke-[#e13b3b]" />
          </p>
        </div>
      }
      centered
      size="30vw"
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: "flex flex-col overflow-hidden pb-2 max-h-full h-fit",
        body: "flex flex-col overflow-hidden max-h-full h-fit",
        title: "acerSwift:max-macair133:!text-b1",
      }}
    >
      <div className="h-full items-start justify-center flex flex-col">
        <p className=" mb-7 mt-1 text-b2 break-words text-[#777777] font-medium leading-relaxed">
          Available in February 2025
        </p>
      </div>
      {/* <img className=" z-50  w-[25vw]  " src={maintenace} alt="loginImage" /> */}
      <Button onClick={onClose} className="!w-full">
        OK
      </Button>
    </Modal>
  );
}
