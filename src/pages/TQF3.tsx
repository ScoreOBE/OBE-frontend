import { useAppDispatch } from "@/store";
import { useEffect, useState } from "react";
import { Alert, Button, Modal, Select, Tabs, Tooltip } from "@mantine/core";
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

export default function TQF3() {
  const dispatch = useAppDispatch();
  const [tqf3Part, setTqf3Part] = useState<string | null>("tqf3p1");
  const [openModalReuse, setOpenModalReuse] = useState(false);

  useEffect(() => {
    dispatch(setShowSidebar(true));
  }, []);

  const topicPart = () => {
    switch (tqf3Part) {
      case "tqf3p1":
        return "Part 1 - ข้อมูลกระบวนวิชา\nCourse Information";
      case "tqf3p2":
        return "Part 2 - คำอธิบายลักษณะกระบวนวิชาและแผนการสอน\nDescription and Planning";
      case "tqf3p3":
        return "Part 3 -  การประเมินผลคะแนนกระบวนวิชา\nCourse Evaluation";
      case "tqf3p4":
        return "Part 4 - การเชื่อมโยงหัวข้อประเมิน\nAssessment Mapping";
      case "tqf3p5":
        return "Part 5 - การเชื่อมโยงหัวข้อประเมินวัตถุประสงค์การเรียนรู้\nCurriculum Mapping";
      case "tqf3p6":
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
        <div className="flex flex-col gap-3 ">
          <Alert
            variant="light"
            color="blue"
            title={` lorem ipsum `}
            icon={<IconInfoCircle />}
            classNames={{ title: "-mt-[2px]" }}
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
      <div className=" flex flex-col bg-[#f8f8f8] h-full gap-3 w-full overflow-hidden">
        <Tabs
          value={tqf3Part}
          onChange={setTqf3Part}
          defaultValue="tqf3p1"
          variant="pills"
          className="px-6 pt-4 flex flex-col  h-full "
        >
          <div className="flex items-center w-full h-fit justify-between">
            <div className=" text-secondary  overflow-y-auto font-semibold  whitespace-break-spaces">
              {topicPart()}
            </div>
            <div className="flex gap-2">
              <Tabs.List>
                <Tabs.Tab value="tqf3p1">
                  <div className="flex flex-row items-center gap-2 ">
                    Part 1
                  </div>
                </Tabs.Tab>
                <Tabs.Tab value="tqf3p2">
                  <div className="flex flex-row items-center gap-2 ">
                    Part 2
                  </div>
                </Tabs.Tab>
                <Tabs.Tab value="tqf3p3">
                  <div className="flex flex-row items-center gap-2 ">
                    Part 3
                  </div>
                </Tabs.Tab>
                <Tabs.Tab value="tqf3p4">
                  <div className="flex flex-row items-center gap-2 ">
                    Part 4
                  </div>
                </Tabs.Tab>
                <Tabs.Tab value="tqf3p5">
                  <div className="flex flex-row items-center gap-2 ">
                    Part 5
                  </div>
                </Tabs.Tab>
                <Tabs.Tab value="tqf3p6">
                  <div className="flex flex-row items-center gap-2 ">
                    Part 6
                  </div>
                </Tabs.Tab>
              </Tabs.List>
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
                <div className="bg-[#F39D4E] hover:bg-[#e39246] w-fit px-3 rounded-[8px]">
                  <Icon IconComponent={dupTQF} />
                </div>
              </Tooltip>
            </div>
          </div>
          <div
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              overflowY: "auto",
            }}
            className=" h-full w-full bg-white flex mt-2 mb-4 px-5 py-2 rounded-md text-[14px] "
          >
            <Tabs.Panel className="w-full" value="tqf3p1">
              <Part1TQF3 />
            </Tabs.Panel>
            <Tabs.Panel value="tqf3p2">
              <Part2TQF3 />
            </Tabs.Panel>{" "}
            <Tabs.Panel value="tqf3p3">
              <Part3TQF3 />
            </Tabs.Panel>{" "}
            <Tabs.Panel value="tqf3p4">
              <Part4TQF3 />
            </Tabs.Panel>{" "}
            <Tabs.Panel value="tqf3p5">
              <Part5TQF3 />
            </Tabs.Panel>
            <Tabs.Panel value="tqf3p6">
              <Part6TQF3 />
            </Tabs.Panel>
          </div>
        </Tabs>
      </div>
    </>
  );
}
