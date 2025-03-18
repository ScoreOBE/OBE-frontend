import { Alert, Button, Checkbox, Group, Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import { useAppSelector } from "@/store";
import noData from "@/assets/image/noData.jpg";
import IconExcel from "@/assets/icons/excel.svg?react";
import Icon from "@/components/Icon";
import * as XLSX from "xlsx";
import { CoursePloScore } from "./PLOAdmin/PLOYearView";
import { IModelPLO } from "@/models/ModelPLO";

type Props = {
  opened: boolean;
  onClose: () => void;
  curriculum: string;
  year: string;
  plo: Partial<IModelPLO>;
  data: CoursePloScore[];
};

export default function ModalExportPLO({
  opened,
  onClose,
  curriculum,
  year,
  plo,
  data,
}: Props) {
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  useEffect(() => {
    if (opened) {
      setSelectedCourses([]);
    }
  }, [opened]);

  const exportPloScore = () => {
    const workbook = XLSX.utils.book_new();
    const rows: any[][] = [];
    const headerRow1 = [
      "PLO",
      "Direct Assessment",
      "",
      "Indirect Assessment",
      "",
      "Average Score (6:4)",
    ];
    const headerRow2 = [
      "",
      "Tool",
      "Average Score",
      "Tool",
      "Average Score",
      "",
    ];
    rows.push(headerRow1, headerRow2);
    const merges: any[] = [];
    let currentRow = 2;
    plo.data?.forEach((item) => {
      const filterCourses = data.filter(
        ({ label, ploRequire }) =>
          selectedCourses.includes(label) &&
          ploRequire.find((p) => p.id == item.id && p.avgScore != "N/A")
      );
      filterCourses.forEach(({ courseNo, ploRequire }, index) => {
        const curPlo = ploRequire.find((p) => p.id == item.id);
        if (!curPlo || curPlo?.avgScore == "N/A") return;
        const row = [
          index === 0 ? `PLO-${item.no}` : "",
          courseNo,
          curPlo.avgScore,
        ];
        rows.push(row);
        currentRow++;
      });
      if (filterCourses.length) {
        merges.push({
          s: { r: currentRow - filterCourses.length, c: 0 },
          e: { r: currentRow - 1, c: 0 },
        });
      } else {
        const row = [`PLO-${item.no}`, "-", "-"];
        rows.push(row);
        currentRow++;
      }
    });
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // Merge "PLO"
      { s: { r: 0, c: 1 }, e: { r: 0, c: 2 } }, // Merge "Direct Assessment"
      { s: { r: 0, c: 3 }, e: { r: 0, c: 4 } }, // Merge "Indirect Assessment"
      { s: { r: 0, c: 5 }, e: { r: 1, c: 5 } }, // Merge "Average Score (6:4)"
      ...merges,
    ];
    XLSX.utils.book_append_sheet(workbook, worksheet, "PLO Scores");
    XLSX.writeFile(workbook, `plo_scores_(${curriculum})_${year}.xlsx`);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={true}
      title={
        <div className="flex flex-col gap-3">
          <p>Export PLO</p>
          <div className="text-[12px] inline-flex items-center text-[#20884f] -mt-[6px]">
            File format: <Icon IconComponent={IconExcel} className="ml-1 " />
          </div>
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
        {/* <Alert
          radius="md"
          variant="light"
          color="blue"
          classNames={{
            body: " flex justify-center",
          }}
          title={
            <div className="flex items-center gap-2">
              <Icon IconComponent={IconInfo2} />
              <p>
                The <span>list of courses mapped to each PLO</span> can be
                edited in <span className="underline">Map PLO required. </span>
              </p>
            </div>
          }
        ></Alert> */}
        {!!data?.length ? (
          <Checkbox.Group
            value={selectedCourses}
            label="Select course to export"
            className="sm:max-ipad11:max-h-[420px]  acerSwift:max-macair133:max-h-[305px] macair133:max-samsungA24:max-h-[420px] overflow-y-auto  my-2"
            classNames={{
              label:
                "mb-1 font-semibold text-default acerSwift:max-macair133:!text-b4",
            }}
            onChange={(event) => setSelectedCourses(event)}
          >
            <Group className="gap-0">
              {data?.map((course, index) => (
                <div
                  key={index}
                  className="flex p-1 mb-1  w-full flex-col overflow-y-auto"
                >
                  <Checkbox.Card
                    value={course.label}
                    className={`p-3 items-center py-4 px-4 flex h-fit rounded-md w-full border transition-all ${
                      selectedCourses.includes(course.label)
                        ? "border-secondary"
                        : "border-transparent"
                    }`}
                    style={{
                      boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <Group
                      wrap="nowrap"
                      className="item-center flex"
                      align="flex-start"
                    >
                      <Checkbox.Indicator className="" />
                      <div className="text-default whitespace-break-spaces font-medium text-b3 acerSwift:max-macair133:!text-b4">
                        {course.label}
                      </div>
                    </Group>
                  </Checkbox.Card>
                </div>
              ))}
            </Group>
          </Checkbox.Group>
        ) : (
          <div className="flex justify-center text-b2">
            <p>Course Not Found.</p>
          </div>
        )}
        <div className="flex gap-2  items-end justify-end h-fit">
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
                    !selectedCourses.length
                      ? "text-[#adb5bd]"
                      : "text-[#ffffff]"
                  } stroke-[2px] size-5 items-center`}
                />
              }
              onClick={exportPloScore}
              disabled={selectedCourses.length === 0}
            >
              Export PLO
            </Button>
          </Group>
        </div>
      </div>
    </Modal>
  );
}
