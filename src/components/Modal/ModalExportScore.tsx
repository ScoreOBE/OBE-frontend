import { Button, Checkbox, Group, Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import { showNotifications } from "@/helpers/functions/function";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import ExcelIcon from "@/assets/icons/excel.svg?react";
import { genPdfTQF3 } from "@/services/tqf3/tqf3.service";
import { useAppSelector } from "@/store";
import { useParams } from "react-router-dom";
import Icon from "../Icon";
import fileExport from "@/assets/icons/fileExport.svg?react";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function ModalExportScore({ opened, onClose }: Props) {
  const { courseNo } = useParams();
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const tqf3 = useAppSelector((state) => state.tqf3);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const course = useAppSelector((state) =>
    state.course.courses.find((c) => c.courseNo == courseNo)
  );

  useEffect(() => {
    if (opened) {
      Object.keys(tqf3).forEach((part) => {
        if (part.includes("part")) {
          selectedParts.push(part);
        }
      });
    }
  }, [opened]);

  const onCloseModal = () => {
    onClose();
    setSelectedParts([]);
  };

  const generatePDF = async () => {
    if (selectedParts.length === 0) {
      showNotifications(
        NOTI_TYPE.ERROR,
        "Error",
        "Please select at least one part to export."
      );
      return;
    }
    setLoading(true);

    const payload: any = {
      courseNo,
      academicYear: academicYear.year,
      academicTerm: academicYear.semester,
      tqf3: tqf3.id,
    };
    selectedParts.forEach((part) => (payload[part] = ""));

    const res = await genPdfTQF3(payload);
    if (res) {
      const contentType = res.headers["content-type"];
      const disposition = res.headers["content-disposition"];
      const filename = disposition
        ? disposition.split("filename=")[1]
        : `TQF3_Parts_${courseNo}_${academicYear.year}_${academicYear.semester}.zip`;
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
        "Export Success",
        `TQF3 exported successfully as ${filename}.`
      );
    }
    setLoading(false);
    onCloseModal();
  };

  return (
    <Modal
      opened={opened}
      onClose={onCloseModal}
      closeOnClickOutside={true}
      title={
        <div className="flex flex-col gap-2">
          <p>Export score {courseNo}</p>
          <p className="text-[12px] inline-flex items-center text-[#20884f] ">
            File format:{" "}
            <Icon IconComponent={ExcelIcon} className="ml-1 size-4" />
          </p>
        </div>
      }
      centered
      size="45vw"
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: "flex flex-col overflow-hidden pb-2 max-h-full h-fit",
        body: "flex flex-col overflow-hidden max-h-full h-fit",
      }}
    >
      <div className="flex flex-col">
        <Checkbox.Group
          label={`Select section to export`}
          classNames={{ label: "mb-1 font-semibold text-default" }}
          value={selectedParts}
          onChange={setSelectedParts}
        >
          {course?.sections.map((sec, index) => {
            return (
              <div
                key={index}
                className="flex p-1 mb-1 w-full h-full flex-col overflow-y-auto"
              >
                <Checkbox.Card
                  className="p-3 items-center px-4 flex border-none h-fit rounded-md w-full"
                  style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" }}
                >
                  <Group
                    wrap="nowrap"
                    className="item-center flex"
                    align="flex-start"
                  >
                    <Checkbox.Indicator className="mt-1" />
                    <div className="text-default whitespace-break-spaces font-medium text-[13px]">
                      Section {sec.sectionNo}
                    </div>
                  </Group>
                </Checkbox.Card>
              </div>
            );
          })}
        </Checkbox.Group>
      </div>
      <div className="flex justify-end mt-2 sticky w-full">
        <Group className="flex w-full gap-2 h-fit items-end justify-end">
          <Button onClick={onClose} variant="subtle">
            Cancel
          </Button>
          <Button
            loading={loading}
            rightSection={
              <Icon IconComponent={fileExport}
                className={`${!tqf3.part1?.updatedAt ? "text-[#adb5bd]" : "text-[#ffffff]" } size-5 items-center stroke-[2px]`}
              
              />
            }
            onClick={generatePDF}
            disabled={!tqf3.part1?.updatedAt}
          >
            Export TQF3
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
