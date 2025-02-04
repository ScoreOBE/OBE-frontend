import { Alert, Button, Checkbox, Group, Modal, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import { useAppDispatch, useAppSelector } from "@/store";
import noData from "@/assets/image/noData.jpg";
import IconExcel from "@/assets/icons/excel.svg?react";
import Icon from "@/components/Icon";
import { PloScore } from "@/pages/AdminDashboard/AdminDashboardPLO";
import * as XLSX from "xlsx";
import { useSearchParams } from "react-router-dom";

type Props = {
  opened: boolean;
  onClose: () => void;
  data: PloScore[];
};

export default function ModalExportPLO({ opened, onClose, data }: Props) {
  const [params, setParams] = useSearchParams({});
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const curriculum = useAppSelector((state) => state.faculty.curriculum);
  const dispatch = useAppDispatch();
  const [courseList, setCourseList] = useState<
    { courseNo: string; courseName: string; topic?: string; label: string }[]
  >([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState<string | null>();
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  useEffect(() => {
    if (data.length && selectedCurriculum?.length) {
      const list: {
        courseNo: string;
        courseName: string;
        topic?: string;
        label: string;
      }[] = [];
      data.forEach(({ courses }) => {
        courses.forEach(({ courseNo, courseName, topic, curriculum }) => {
          if (
            curriculum == selectedCurriculum &&
            !list.find((c) => c.courseNo == courseNo && c.topic == topic)
          ) {
            list.push({
              courseNo,
              courseName,
              topic,
              label: `${courseNo}${topic ? ` - ${topic}` : ""}`,
            });
          }
        });
      });
      setCourseList(list);
    }
  }, [data, selectedCurriculum]);

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
    data.forEach(({ plo, courses }) => {
      const filterCourses = courses.filter(({ courseNo, topic }) =>
        selectedCourses.includes(`${courseNo}${topic ? ` - ${topic}` : ""}`)
      );
      filterCourses.forEach((course, index) => {
        const row = [
          index === 0 ? `SO-${plo.no}` : "",
          course.courseNo,
          course.avgScore.toFixed(2),
        ];
        rows.push(row);
        currentRow++;
      });
      if (filterCourses.length) {
        merges.push({
          s: { r: currentRow - courses.length, c: 0 },
          e: { r: currentRow - 1, c: 0 },
        });
      } else {
        const row = [`SO-${plo.no}`, "-", "-"];
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
    XLSX.writeFile(
      workbook,
      `plo_scores_(${selectedCurriculum})_${params.get("semester")}${params
        .get("year")
        ?.toString()
        .slice(-2)}.xlsx`
    );
  };

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
          placeholder="Curriculum"
          data={curriculum?.map((cur) => ({
            value: cur.code,
            label: cur.nameEN,
          }))}
          value={selectedCurriculum}
          onChange={(event) => setSelectedCurriculum(event)}
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
            <div className="flex items-center gap-2">
              <Icon IconComponent={IconInfo2} />
              <p>
                The <span>list of courses mapped to each PLO</span> can be
                edited in <span className="underline">Map PLO required. </span>
              </p>
            </div>
          }
        ></Alert>
        {!!selectedCurriculum?.length ? (
          !!courseList.length ? (
            <Checkbox.Group
              value={selectedCourses}
              onChange={(event) => setSelectedCourses(event)}
            >
              <Group className="gap-0">
                {courseList?.map((course, index) => (
                  <Checkbox
                    size="xs"
                    key={index}
                    value={course.label}
                    className="p-3 py-4 w-full last:border-none border-b-[1px]"
                    classNames={{
                      label: "ml-2 text-[13px] font-medium",
                      input: "cursor-pointer",
                    }}
                    label={course.label}
                  />
                ))}
              </Group>
            </Checkbox.Group>
          ) : (
            <div className="flex justify-center text-b2">
              <p>Course Not Found.</p>
            </div>
          )
        ) : (
          <div className="flex justify-center text-b2">
            <p>Please Select Curriculum.</p>
          </div>
        )}
        <div className="flex gap-2 sm:max-macair133:fixed sm:max-macair133:bottom-6 sm:max-macair133:right-8 items-end justify-end h-fit">
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
