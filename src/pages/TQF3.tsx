import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FocusTrap,
  Modal,
  Select,
  Tabs,
  Tooltip,
} from "@mantine/core";
import dupTQF from "@/assets/icons/dupTQF.svg?react";
import Icon from "@/components/Icon";
import { setShowSidebar } from "@/store/showSidebar";
import { useParams } from "react-router-dom";

import Part1TQF3 from "@/components/TQF3/Part1TQF3";
import Part2TQF3 from "@/components/TQF3/Part2TQF3";
import Part3TQF3 from "@/components/TQF3/Part3TQF3";
import Part4TQF3 from "@/components/TQF3/Part4TQF3";
import Part5TQF3 from "@/components/TQF3/Part5TQF3";
import Part6TQF3 from "@/components/TQF3/Part6TQF3";
import { IconExclamationCircle, IconInfoCircle } from "@tabler/icons-react";
import SaveTQFbar, { partType } from "@/components/SaveTQFBar";

export default function TQF3() {
  const { courseNo } = useParams();
  const course = useAppSelector((state) =>
    state.course.courses.find((c) => c.courseNo == courseNo)
  );
  const dispatch = useAppDispatch();
  const partTab = [
    { tab: "Part 1", compo: <Part1TQF3 data={course!} /> },
    { tab: "Part 2", compo: <Part2TQF3 /> },
    { tab: "Part 3", compo: <Part3TQF3 /> },
    { tab: "Part 4", compo: <Part4TQF3 /> },
    { tab: "Part 5", compo: <Part5TQF3 /> },
    { tab: "Part 6", compo: <Part6TQF3 /> },
  ];
  const [tqf3Part, setTqf3Part] = useState<string | null>("Part 1");
  const [openModalReuse, setOpenModalReuse] = useState(false);

  useEffect(() => {
    dispatch(setShowSidebar(true));
  }, []);

  const topicPart = () => {
    switch (tqf3Part) {
      case "Part 1":
        return "Part 1 - ข้อมูลกระบวนวิชา\nCourse Information";
      case "Part 2":
        return "Part 2 - คำอธิบายลักษณะกระบวนวิชาและแผนการสอน\nDescription and Planning";
      case "Part 3":
        return "Part 3 -  การประเมินผลคะแนนกระบวนวิชา\nCourse Evaluation";
      case "Part 4":
        return "Part 4 - การเชื่อมโยงหัวข้อประเมิน\nAssessment Mapping";
      case "Part 5":
        return "Part 5 - การเชื่อมโยงหัวข้อประเมินวัตถุประสงค์การเรียนรู้\nCurriculum Mapping";
      case "Part 6":
        return "Part 6 - การประเมินกระบวนวิชาและกระบวนการปรับปรุง\nCourse evaluation and improvement processes";
      default:
        return;
    }
  };

  return (
    <>
      {/* Reuse TQF3 */}
      <Modal
        title="Reuse TQF3"
        opened={openModalReuse}
        closeOnClickOutside={false}
        withCloseButton={false}
        onClose={() => setOpenModalReuse(false)}
        transitionProps={{ transition: "pop" }}
        size="35vw"
        centered
        classNames={{
          content: "flex flex-col overflow-hidden pb-2  max-h-full h-fit",
          body: "flex flex-col overflow-hidden max-h-full h-fit",
        }}
      >
        <FocusTrap.InitialFocus />
        <div className="flex flex-col gap-3 ">
          <Alert
            variant="light"
            color="blue"
            title={` lorem ipsum `}
            icon={<IconInfoCircle />}
            classNames={{ title: "-mt-[2px]", icon: "size-6" }}
          ></Alert>
          <Select
            rightSectionPointerEvents="all"
            placeholder="course"
            searchable
            allowDeselect
            size="xs"
            label="Select course to reuse"
            // nothingFoundMessage="No result"
            className="w-full border-none "
            classNames={{
              input: `rounded-md`,
              option: `py-1  `,
            }}
          ></Select>
          <div className="flex gap-2 mt-3 justify-end">
            <Button
              onClick={() => setOpenModalReuse(false)}
              variant="subtle"
              color="#575757"
              className="rounded-[8px] text-[12px] h-[32px] w-fit "
            >
              Cancel
            </Button>
            <Button className="rounded-[8px] text-[12px] h-[32px] w-fit ">
              Reuse TQF3
            </Button>
          </div>
        </div>
      </Modal>
      <div className=" flex flex-col   h-full  w-full overflow-hidden">
        <Tabs
          value={tqf3Part}
          onChange={setTqf3Part}
          defaultValue="Part 1"
          classNames={{
            root: "overflow-hidden w-full flex flex-col h-full",
            tab: "px-0 !bg-transparent hover:!text-tertiary",
            tabLabel: "!font-semibold",
          }}
          className="px-6 pt-2 flex flex-col h-full w-full"
        >
          <div
            className={`flex flex-col w-full h-fit ${
              tqf3Part === "Part 4" ? "pb-1" : "border-b-[2px] pb-4"
            } `}
          >
            <div className="flex gap-2">
              <Tabs.List className="gap-7 w-full">
                {partTab.map((part) => (
                  <Tabs.Tab key={part.tab} value={part.tab}>
                    <div className="flex flex-row items-center gap-2 ">
                      {part.tab}
                    </div>
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </div>
            <div className="flex justify-between pt-4 items-center">
              <div className=" text-secondary  overflow-y-auto font-semibold  whitespace-break-spaces">
                {topicPart()}
              </div>
              <Tooltip
                onClick={() => setOpenModalReuse(true)}
                withArrow
                arrowPosition="side"
                arrowOffset={15}
                arrowSize={7}
                position="bottom-end"
                label={
                  <div className="text-default text-[13px] p-2 flex flex-col gap-2">
                    <p className=" font-medium">
                      <span className="text-secondary font-bold">
                        Reuse TQF 3
                      </span>{" "}
                      <br />
                      Simplify your course TQF3. Choose any course, and we'll
                      automatically fill <br />
                      the TQF documentation for you. Saving your time!
                    </p>
                  </div>
                }
                color="#FCFCFC"
              >
                <Button
                  leftSection={
                    <Icon IconComponent={dupTQF} className="h-5 w-5 -mr-1" />
                  }
                  color="#F39D4E"
                  className="  cursor-pointer pr-4 text-[12px] font-semibold w-fit px-3 h-[32px] rounded-[8px]"
                >
                  Reuse TQF3
                </Button>
              </Tooltip>
            </div>
          </div>
          <div
            style={{
              overflowY: "auto",
            }}
            className={`h-full w-full  flex ${
              tqf3Part !== "Part 4" && "pt-3 px-3 "
            }   rounded-md text-[14px]`}
          >
            {partTab.map((part, index) => (
              <Tabs.Panel key={index} value={part.tab} className="w-full">
                {part.compo}
              </Tabs.Panel>
            ))}
          </div>
        </Tabs>
      </div>
      <SaveTQFbar tqf="3" part={tqf3Part as partType} />
    </>
  );
}
