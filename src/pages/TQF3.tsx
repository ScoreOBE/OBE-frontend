import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { getPLOs } from "@/services/plo/plo.service";
import { IModelPLO, IModelPLOCollection } from "@/models/ModelPLO";
import ModalAddPLOCollection from "@/components/Modal/ModalAddPLOCollection";
import {
  Alert,
  Button,
  Checkbox,
  Group,
  Menu,
  Modal,
  Radio,
  RadioCard,
  ScrollArea,
  Table,
  Tabs,
  TextInput,
  Tooltip,
} from "@mantine/core";
import dupTQF from "@/assets/icons/dupTQF.svg?react";
import Icon from "@/components/Icon";
import { setShowSidebar } from "@/store/showSidebar";
import { useParams } from "react-router-dom";
import { COURSE_TYPE, TEACHING_METHOD } from "@/helpers/constants/enum";

export default function TQF3() {
  const { courseNo } = useParams();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [totalPLOs, setTotalPLOs] = useState<number>(0);
  const [tqf3Part, setTqf3Part] = useState<string | null>("tqf3p1");

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
      <div className=" flex flex-col h-full gap-3 w-full pt-3  overflow-hidden">
        <Tabs
          value={tqf3Part}
          onChange={setTqf3Part}
          defaultValue="tqf3p1"
          variant="pills"
          className="px-6"
        >
          <div className="flex items-center justify-between">
            <div className=" text-secondary font-semibold  whitespace-break-spaces">
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
          <div>
            <Tabs.Panel value="tqf3p1">
              <div className="flex  w-full  justify-between    pt-6  flex-1">
                <div className="flex gap-4 flex-col">
                  <div
                    style={{
                      boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                      overflowY: "auto",
                    }}
                    className="w-full h-fit items-center rounded-md gap-6  grid grid-cols-2 p-5 "
                  >
                    <div className="flex text-secondary pl-10  flex-col">
                      <p className="font-semibold">ประเภทกระบวนวิชา</p>
                      <p className="font-bold">Course Type</p>{" "}
                    </div>

                    <div className="flex text-[#333333] gap-3  flex-col">
                      {Object.keys(COURSE_TYPE).map((key) => (
                        <Radio
                          classNames={{ label: "font-medium" }}
                          label={key}
                        />
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                      overflowY: "auto",
                    }}
                    className="w-full h-fit items-center rounded-md gap-6  grid grid-cols-2 p-5 "
                  >
                    <div className="flex text-secondary pl-10 flex-col">
                      <p className="font-medium">ลักษณะของกระบวนวิชา</p>
                      <p className="font-semibold">Teachig Method</p>
                    </div>
                    <div className="flex text-[#333333] gap-4  flex-col">
                      {Object.keys(TEACHING_METHOD).map((key) => (
                        <Checkbox
                          classNames={{ label: "font-medium" }}
                          label={key}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div
                    style={{
                      boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                      overflowY: "auto",
                    }}
                    className="w-full h-fit items-center rounded-md gap-12 justify-start flex p-6"
                  >
                    <div className="flex text-secondary gap-2  flex-row">
                      <p className="font-semibold">ประเภทกระบวนวิชา</p>
                      <p className="font-bold">(Course Type)</p>
                    </div>
                    <div className="flex text-[#333333] gap-4  flex-col">
                      <Radio
                        classNames={{ label: "font-medium" }}
                        label="วิชาศึกษาทั่วไป (General Education)"
                      />
                      <Radio
                        classNames={{ label: "font-medium" }}
                        label="วิชาเฉพาะ (Field of specialization)"
                      />
                      <Radio
                        classNames={{ label: "font-medium" }}
                        label="วิชาเลือกเสรี (Free elective)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="tqf3p2">
              <div className="flex flex-col  flex-1 bg-slate-200 ">2</div>
            </Tabs.Panel>{" "}
            <Tabs.Panel value="tqf3p3">
              <div className="flex flex-col  flex-1 bg-slate-200 ">3</div>
            </Tabs.Panel>{" "}
            <Tabs.Panel value="tqf3p4">
              <div className="flex flex-col  flex-1 bg-slate-200 ">4</div>
            </Tabs.Panel>{" "}
            <Tabs.Panel value="tqf3p5">
              <div className="flex flex-col  flex-1 bg-slate-200 ">5</div>
            </Tabs.Panel>
            <Tabs.Panel value="tqf3p6">
              <div className="flex flex-col  flex-1 bg-slate-200 ">6</div>
            </Tabs.Panel>
          </div>
        </Tabs>
      </div>
    </>
  );
}
