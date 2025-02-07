import { Button, Checkbox, Group, Modal, Radio } from "@mantine/core";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import IconPDF from "@/assets/icons/pdf.svg?react";
import { useParams } from "react-router-dom";
import { IModelTQF3 } from "@/models/ModelTQF3";
import { IModelTQF5 } from "@/models/ModelTQF5";
import IconFileExport from "@/assets/icons/fileExport.svg?react";
import Icon from "@/components/Icon";
import noData from "@/assets/image/noData.jpg";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import { setLoadingOverlay } from "@/store/loading";
import { genPdfTQF5 } from "@/services/tqf5/tqf5.service";
import {
  getKeyPartTopicTQF5,
  PartTopicTQF5,
} from "@/helpers/constants/TQF5.enum";

type Props = {
  opened: boolean;
  onClose: () => void;
  dataTQF?: Partial<IModelTQF5> & { courseNo?: string };
  tqf3: string;
};

export default function ModalExportTQF3({
  opened,
  onClose,
  dataTQF,
  tqf3,
}: Props) {
  const { courseNo } = useParams();
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const tqf5 = useAppSelector((state) => state.tqf5);
  const [selectedMerge, setSelectedMerge] = useState("unzipfile");
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const dispatch = useAppDispatch();
  const [dataExport, setDataExport] = useState<Partial<IModelTQF5>>({});

  useEffect(() => {
    if (opened) {
      const select: string[] = ["part1"];
      setDataExport(dataTQF ?? tqf5);
      // Object.keys(dataTQF ?? tqf5).forEach((part) => {
      //   if (
      //     part.includes("part") &&
      //     ((dataTQF ?? tqf5)[part as keyof IModelTQF5] as any)?.updatedAt
      //   ) {
      //     select.push(part);
      //   }
      // });
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
      tqf3: tqf3,
      tqf5: dataExport.id,
      oneFile: selectedMerge.includes("unzipfile"),
    };
    selectedParts.forEach((part) => (payload[part] = ""));

    const res = await genPdfTQF5(payload);
    if (res) {
      const contentType = res.headers["content-type"];
      const disposition = res.headers["content-disposition"];
      const filename = disposition
        ? disposition.split("filename=")[1]
        : `TQF5_Parts_${dataTQF?.courseNo ?? courseNo}_${academicYear.year}_${
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
        "TQF 5 Exported Successfully",
        `TQF 5 has been exported successfully as ${filename}.`
      );
    }
    dispatch(setLoadingOverlay(false));
    onCloseModal();
  };

  let test = 0;

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
      size="45vw"
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: "flex flex-col overflow-hidden pb-2 max-h-full h-fit",
        body: "flex flex-col overflow-hidden max-h-full h-fit",
        title: "acerSwift:max-macair133:!text-b1",
      }}
    >
      {test === 7 ? (
        <>
          <div className="flex sm:max-ipad11:h-[500px] acerSwift:max-macair133:h-[400px] acerSwift:max-macair133:mb-4 sm:max-ipad11:overflow-y-hidden flex-col">
            {!dataExport.part1?.updatedAt ? (
              <div className="flex flex-col mt-3  items-center  ">
                <p className=" text-b2 acerSwift:max-macair133:!text-b3 font-semibold">
                  No parts of TQF5 are available for export.
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
                  className="sm:max-ipad11:max-h-[420px] acerSwift:max-macair133:max-h-[305px] overflow-y-auto my-4"
                >
                  {/* {Object.values(PartTopicTQF5)
                .slice(0, 6)
                .filter(
                  (item) =>
                    dataExport &&
                    dataExport[getKeyPartTopicTQF5(item)!]?.updatedAt
                )
                .map((item, index) => ( */}
                  <div
                    // key={index}
                    className="flex p-1 mb-1 w-full  flex-col overflow-y-auto"
                  >
                    <Checkbox.Card
                      className={`p-3 items-center px-4 flex  h-fit rounded-md w-full ${
                        selectedParts.includes(
                          getKeyPartTopicTQF5(PartTopicTQF5.part1)!
                        ) && "!border-[1px] !border-secondary "
                      }`}
                      style={{
                        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.15)",
                      }}
                      value={getKeyPartTopicTQF5(PartTopicTQF5.part1)}
                    >
                      <Group
                        wrap="nowrap"
                        className="item-center flex"
                        align="flex-start"
                      >
                        <Checkbox.Indicator className="mt-1" />
                        <div className="text-default whitespace-break-spaces font-medium text-b3 acerSwift:max-macair133:!text-b4">
                          {PartTopicTQF5.part1}
                        </div>
                      </Group>
                    </Checkbox.Card>
                  </div>
                  {/* ))} */}
                </Checkbox.Group>
              </div>
            )}
          </div>
          {dataExport.part1?.updatedAt && (
            <div className="flex gap-2 items-end justify-end h-fit">
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
                  Export TQF5
                </Button>
              </Group>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="h-full items-start justify-center flex flex-col">
            <p className=" mb-7 mt-1 text-b2 break-words text-[#777777] font-medium leading-relaxed">
              Available in February 2025
            </p>
          </div>
          <Button onClick={onClose} className="!w-full">
            OK
          </Button>
        </>
      )}
    </Modal>
  );
}
