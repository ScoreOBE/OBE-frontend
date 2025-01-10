import { Button, Checkbox, Chip, Group, Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import { useAppDispatch, useAppSelector } from "@/store";
import { useParams } from "react-router-dom";
import Icon from "../../Icon";
import IconExcel from "@/assets/icons/excel.svg?react";
import IconFileExport from "@/assets/icons/fileExport.svg?react";
import { setLoadingOverlay } from "@/store/loading";
import { getSectionNo } from "@/helpers/functions/function";
import * as XLSX from "xlsx";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function ModalExportScore({ opened, onClose }: Props) {
  const { courseNo } = useParams();
  const [selectedSecToExport, setSelectedSecToExport] = useState<string[]>([]);
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const course = useAppSelector((state) =>
    state.course.courses.find((c) => c.courseNo == courseNo)
  );

  useEffect(() => {
    if (opened) {
      setSelectedSecToExport(
        course?.sections?.map((sec) => sec.sectionNo!.toString()) || []
      );
    }
  }, [opened]);

  const onCloseModal = () => {
    onClose();
    setSelectedSecToExport([]);
  };

  const exportScore = () => {
    if (!course) return;

    const workbook = XLSX.utils.book_new();

    course.sections
      .flatMap(({ assignments }) => assignments)
      .forEach((assignment) => {
        if (workbook.SheetNames.includes(assignment?.name!)) return;
        const rows: any[][] = [];
        const questionHeaders: string[] = [];
        const fullScores: string[] = [];
        const descriptions: string[] = [];
        const headerRow1 = [
          "section",
          "studentId",
          "firstName",
          "lastName",
          "Question",
        ];
        const headerRow2 = ["", "", "", "", "Full Score"];
        const headerRow3 = ["", "", "", "", "Description (Optional)"];

        assignment?.questions.forEach((q) => {
          questionHeaders.push(q.name);
          fullScores.push(q.fullScore.toString() || "");
          descriptions.push(q.desc || "");
        });

        headerRow1.push(...questionHeaders);
        headerRow2.push(...fullScores);
        headerRow3.push(...descriptions);

        rows.push(headerRow1, headerRow2, headerRow3);

        selectedSecToExport.forEach((secNo) => {
          const section = course.sections.find(
            (sec) => sec.sectionNo?.toString() === secNo
          );
          if (section) {
            section.students?.forEach(({ student, scores }) => {
              const scoreGroup = scores?.find(
                (sg) => sg.assignmentName === assignment?.name
              );
              if (!scoreGroup) return;
              const row = [
                secNo,
                student.studentId,
                student.firstNameTH || student.firstNameEN,
                student.lastNameTH || student.lastNameEN,
                "",
              ];
              assignment?.questions.forEach((q) => {
                const questionScore = scoreGroup?.questions.find(
                  (qs) => qs.name === q.name
                );
                row.push(questionScore?.score?.toFixed(2) || "");
              });
              rows.push(row);
            });
          }
        });

        const worksheet = XLSX.utils.aoa_to_sheet(rows);
        const merges = [
          { s: { r: 0, c: 0 }, e: { r: 2, c: 0 } }, // Merge "Section"
          { s: { r: 0, c: 1 }, e: { r: 2, c: 1 } }, // Merge "Student ID"
          { s: { r: 0, c: 2 }, e: { r: 2, c: 2 } }, // Merge "First Name"
          { s: { r: 0, c: 3 }, e: { r: 2, c: 3 } }, // Merge "Last Name"
        ];
        questionHeaders.forEach((_, index) => {
          merges.push({
            s: { r: 0, c: 4 + index },
            e: { r: 0, c: 4 + index },
          });
        });
        worksheet["!merges"] = merges;
        XLSX.utils.book_append_sheet(workbook, worksheet, assignment?.name);
      });

    XLSX.writeFile(
      workbook,
      `scores_${courseNo}_${course.semester}${course.year
        .toString()
        .slice(-2)}.xlsx`
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={onCloseModal}
      closeOnClickOutside={true}
      title={
        <div className="flex flex-col gap-2 acerSwift:max-macair133:!text-b1">
          <p>Export score {courseNo}</p>
          <p className="text-b4 acerSwift:max-macair133:!text-b5 inline-flex items-center text-[#20884f] ">
            File format:{" "}
            <Icon IconComponent={IconExcel} className="ml-1 size-4" />
          </p>
        </div>
      }
      centered
      size="30vw"
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: "flex flex-col overflow-hidden pb-2 max-h-full h-fit",
        body: "flex flex-col overflow-hidden max-h-full h-fit",
      }}
    >
      <p className="text-b2 acerSwift:max-macair133:text-b3 mb-1 font-semibold">
        Select section to export
      </p>
      <div className="flex flex-col gap-4">
        {!!course?.sections.length && (
          <Chip
            classNames={{
              label:
                "text-b3 acerSwift:max-macair133:text-b4 text-default font-semibold translate-y-[3px]",
            }}
            size="md"
            checked={selectedSecToExport.length === course?.sections.length}
            onChange={() => {
              if (selectedSecToExport.length === course?.sections.length) {
                setSelectedSecToExport([]);
              } else {
                setSelectedSecToExport(
                  course?.sections?.map((sec) => sec.sectionNo!.toString()) ||
                    []
                );
              }
            }}
          >
            All Sections
          </Chip>
        )}
        <Chip.Group
          multiple
          value={selectedSecToExport}
          onChange={(event) => setSelectedSecToExport(event)}
        >
          <Group className="flex gap-3">
            {course?.sections.map((sec, index) => (
              <Chip
                key={index}
                classNames={{
                  root: "h-8 !rounded-[10px] text-center justify-center items-center",
                  label:
                    "text-b3 acerSwift:max-macair133:text-b4 text-default font-semibold  ",
                }}
                size="md"
                value={sec.sectionNo?.toString()}
              >
                {getSectionNo(sec.sectionNo)}
              </Chip>
            ))}
          </Group>
        </Chip.Group>
        {/* <Checkbox.Group
          label={`Select section to export`}
          classNames={{
            label:
              "mb-1 font-semibold text-default acerSwift:max-macair133:!text-b4",
          }}
          value={selectedSecToExport}
          onChange={setSelectedSecToExport}
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
                  value={sec.sectionNo?.toString()}
                >
                  <Group
                    wrap="nowrap"
                    className="items-center flex"
                    align="flex-start"
                  >
                    <Checkbox.Indicator />
                    <div className="text-default whitespace-break-spaces font-medium text-b3 acerSwift:max-macair133:!text-b4">
                      Section {getSectionNo(sec.sectionNo)}
                    </div>
                  </Group>
                </Checkbox.Card>
              </div>
            );
          })}
        </Checkbox.Group> */}
      </div>
      <div className="flex justify-end mt-2 acerSwift:max-macair133:mt-4 sticky w-full">
        <Group className="flex w-full gap-2 h-fit items-end justify-end">
          <Button
            onClick={onClose}
            variant="subtle"
            className=" acerSwift:max-macair133:!text-b5"
          >
            Cancel
          </Button>
          <Button
            loading={loading}
            rightSection={
              <Icon
                IconComponent={IconFileExport}
                className={`${
                  selectedSecToExport.length === 0
                    ? "text-[#adb5bd]"
                    : "text-[#ffffff]"
                } size-5 items-center stroke-[2px]`}
              />
            }
            className="acerSwift:max-macair133:!text-b5"
            onClick={exportScore}
            disabled={selectedSecToExport.length === 0}
          >
            Export Score
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
