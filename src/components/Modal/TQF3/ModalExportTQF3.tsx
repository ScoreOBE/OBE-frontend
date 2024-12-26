import { Button, Checkbox, Group, Modal, Radio } from "@mantine/core";
import { useEffect, useState } from "react";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import {
  getKeyPartTopicTQF3,
  PartTopicTQF3,
} from "@/helpers/constants/TQF3.enum";
import { genPdfTQF3 } from "@/services/tqf3/tqf3.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { useParams } from "react-router-dom";
import { IModelTQF3 } from "@/models/ModelTQF3";
import noData from "@/assets/image/noData.jpg";
import IconPDF from "@/assets/icons/pdf.svg?react";
import IconFileExport from "@/assets/icons/fileExport.svg?react";
import Icon from "@/components/Icon";
import { setLoadingOverlay } from "@/store/loading";

type Props = {
  opened: boolean;
  onClose: () => void;
  dataTQF?: Partial<IModelTQF3> & { courseNo?: string };
};

export default function ModalExportTQF3({ opened, onClose, dataTQF }: Props) {
  const { courseNo } = useParams();
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const tqf3 = useAppSelector((state) => state.tqf3);
  const [selectedMerge, setSelectedMerge] = useState("unzipfile");
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const dispatch = useAppDispatch();
  const [dataExport, setDataExport] = useState<Partial<IModelTQF3>>({});

  useEffect(() => {
    if (opened) {
      const select: string[] = [];
      setDataExport(dataTQF ?? tqf3);
      Object.keys(dataTQF ?? tqf3).forEach((part) => {
        if (
          part !== "part7" &&
          part.includes("part") &&
          ((dataTQF ?? tqf3)[part as keyof IModelTQF3] as any)?.updatedAt
        ) {
          select.push(part);
        }
      });
      setSelectedParts(select);
    }
  }, [opened, dataTQF]);

  const onCloseModal = () => {
    onClose();
    setSelectedParts([]);
  };

  const generatePDF = async () => {
    if (selectedParts.length === 0) {
      showNotifications(
        NOTI_TYPE.ERROR,
        "Select Part Required",
        "Please select at least one part to export before proceeding"
      );
      return;
    }
    dispatch(setLoadingOverlay(true));

    const payload: any = {
      courseNo: dataTQF?.courseNo ?? courseNo,
      academicYear: academicYear.year,
      academicTerm: academicYear.semester,
      tqf3: dataExport.id,
      oneFile: selectedMerge.includes("unzipfile"),
    };
    selectedParts.forEach((part) => (payload[part] = ""));

    const res = await genPdfTQF3(payload);
    if (res) {
      const contentType = res.headers["content-type"];
      const disposition = res.headers["content-disposition"];
      const filename = disposition
        ? disposition.split("filename=")[1]
        : `TQF3_Parts_${dataTQF?.courseNo ?? courseNo}_${academicYear.year}_${
            academicYear.semester
          }.zip`;
      const blob = new Blob([res.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename.replace(/"/g, "");
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "TQF 3 Exported Successfully",
        `TQF 3 has been exported successfully as ${filename}.`
      );
    }
    dispatch(setLoadingOverlay(false));
    onCloseModal();
  };

  return (
    <Modal
      opened={opened}
      onClose={onCloseModal}
      closeOnClickOutside={true}
      title={
        <div className="flex flex-col gap-2">
          <p>Export TQF3</p>
          <p className="text-b4 acerSwift:max-macair133:!text-b5 inline-flex items-center text-[#e13b3b] -mt-[6px]">
            File format:{" "}
            <Icon IconComponent={IconPDF} className="ml-1 stroke-[#e13b3b]" />
          </p>
        </div>
      }
      centered
      size="45vw"
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: "flex flex-col overflow-hidden pb-2 max-h-full h-fit",
        body: "flex flex-col overflow-hidden max-h-full h-fit",
        title: "acerSwift:max-macair133:!text-b1",
      }}
    >
      <div className="flex sm:max-ipad11:h-[400px] acerSwift:max-macair133:h-[400px] acerSwift:max-macair133:mb-4 sm:max-ipad11:overflow-y-auto flex-col ">
        {!dataExport.part1?.updatedAt ? (
          <div className="flex flex-col mt-3  items-center  ">
            <p className=" text-b2 acerSwift:max-macair133:!text-b3 font-semibold">
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
                    classNames={{
                      label: "font-medium acerSwift:max-macair133:!text-b4",
                    }}
                    value="unzipfile"
                    label="Single file"
                  />
                  <Radio
                    classNames={{
                      label: "font-medium acerSwift:max-macair133:!text-b4",
                    }}
                    value="zipfile"
                    label="Multiple file (Zip)"
                  />
                </Group>
              </Radio.Group>
            </div>
            <Checkbox.Group
              label="Select part to export"
              classNames={{
                label:
                  "mb-1 font-semibold text-default acerSwift:max-macair133:!text-b4",
              }}
              value={selectedParts}
              onChange={setSelectedParts}
              className="h-[400px] acerSwift:max-macair133:max-h-[330px] overflow-y-auto my-4"
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
                        <div className="text-default whitespace-break-spaces font-medium text-b3 acerSwift:max-macair133:!text-b4">
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
        <div className="flex gap-2  items-end justify-end h-fit">
          <Group className="flex w-full gap-2 h-fit items-end justify-end">
            <Button
              onClick={onClose}
              variant="subtle"
              className="acerSwift:max-macair133:!text-b5"
            >
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
                  } stroke-[2px] size-5 items-center acerSwift:max-macair133:!size-4`}
                />
              }
              className="acerSwift:max-macair133:!text-b5"
              onClick={generatePDF}
              disabled={
                !dataExport.part1?.updatedAt || selectedParts.length === 0
              }
            >
              Export TQF3
            </Button>
          </Group>
        </div>
      )}
    </Modal>
  );
}
