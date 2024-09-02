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
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import dupTQF from "@/assets/icons/dupTQF.svg?react";
import Icon from "@/components/Icon";
import { setShowSidebar } from "@/store/showSidebar";
import { useParams } from "react-router-dom";
import { COURSE_TYPE, TEACHING_METHOD } from "@/helpers/constants/enum";
import Part1TQF3 from "@/components/TQF3/Part1TQF3";

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
              {/* <div className="flex w-full justify-start  max-h-full">
                <div className="flex  w-full flex-col">
                  <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
                    <div className="flex text-secondary pl-6  flex-col">
                      <p className="font-medium">ประเภทกระบวนวิชา <span className=" text-red-500">*</span></p>
                      <p className="font-semibold">Course Type</p>{" "}
                    </div>

                    <div className="flex text-[#333333] gap-3  flex-col">
                      {Object.keys(COURSE_TYPE).map((key) => (
                        <Radio
                          classNames={{ label: "font-medium text-[13px]" }}
                          label={key}
                        />
                      ))}
                    </div>
                  </div>
                  <div className=" border-b-[1px] border-[#e6e6e6] justify-between h-fit w-full  items-top  grid grid-cols-3 py-5   ">
                    <div className="flex text-secondary pl-6 flex-col ">
                      <p className="font-medium">ลักษณะของกระบวนวิชา <span className=" text-red-500">*</span></p>
                      <p className="font-semibold">Teachig Method</p>
                    </div>
                    <div className="flex text-[#333333] gap-4  flex-col">
                      {Object.keys(TEACHING_METHOD).map((key) => (
                        <Checkbox
                          classNames={{ label: "font-medium text-[13px]" }}
                          label={key}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
                    <div className="flex text-secondary pl-6 pt-2 flex-col">
                      <p className="font-medium">ชั้นปีที่เรียน <span className=" text-red-500">*</span></p>
                      <p className="font-semibold">Student Year</p>
                    </div>

                    <div className="flex gap-8 text-[#333333]">
                      <div className="flex flex-col gap-5">
                        <Checkbox
                          classNames={{ label: "font-medium text-[13px]" }}
                          label="ชั้นปีที่ 1 (1st year)"
                        />
                        <Checkbox
                          classNames={{ label: "font-medium text-[13px]" }}
                          label="ชั้นปีที่ 2 (2nd year)"
                        />{" "}
                        <Checkbox
                          classNames={{ label: "font-medium text-[13px]" }}
                          label="ชั้นปีที่ 3 (3rd year)"
                        />
                      </div>
                      <div className="flex flex-col gap-5">
                        <Checkbox
                          classNames={{ label: "font-medium text-[13px]" }}
                          label="ชั้นปีที่ 4 (4th year)"
                        />
                        <Checkbox
                          classNames={{ label: "font-medium text-[13px]" }}
                          label="ชั้นปีที่ 5 (5th year)"
                        />{" "}
                        <Checkbox
                          classNames={{ label: "font-medium text-[13px]" }}
                          label="ชั้นปีที่ 6 (6th year)"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-center  grid grid-cols-3 py-5  ">
                    <div className="flex text-secondary pl-6 flex-col">
                      <p className="font-medium">การวัดและประเมินผล <span className=" text-red-500">*</span></p>
                      <p className="font-semibold">Evaluation</p>
                    </div>

                    <div className="flex gap-8 text-[#333333]">
                      <Radio
                        classNames={{ label: "font-medium text-[13px]" }}
                        label="A-F"
                      />
                      <Radio
                        classNames={{ label: "font-medium text-[13px]" }}
                        label="S/U"
                      />{" "}
                      <Radio
                        classNames={{ label: "font-medium text-[13px]" }}
                        label="P"
                      />
                    </div>
                  </div>
                  <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
                    <div className="flex text-secondary pl-6 flex-col">
                      <p className="font-medium">อาจารย์ผู้สอนทั้งหมด<span className=" text-red-500">*</span></p>
                      <p className="font-semibold">Lecturers</p>
                    </div>

                    <div className="flex flex-col gap-3 text-[#333333]">
                      <TextInput
                        withAsterisk
                        size="xs"
                        label="Instructor 1"
                        classNames={{ label: "text-[#333333]" }}
                        className="w-[440px]"
                        placeholder="(required)"
                      />
                      <TextInput
                        label="Instructor 2"
                        size="xs"
                        classNames={{ label: "text-[#333333]" }}
                        className="w-[440px]"
                        placeholder="(optional)"
                      />
                      <TextInput
                        label="Instructor 3"
                        size="xs"
                        classNames={{ label: "text-[#333333]" }}
                        className="w-[440px]"
                        placeholder="(optional)"
                      />
                      <TextInput
                        label="Instructor 4"
                        size="xs"
                        classNames={{ label: "text-[#333333]" }}
                        className="w-[440px]"
                        placeholder="(optional)"
                      />
                      <TextInput
                        label="Instructor 5"
                        size="xs"
                        classNames={{ label: "text-[#333333]" }}
                        className="w-[440px]"
                        placeholder="(optional)"
                      />
                      <TextInput
                        label="Instructor 6"
                        size="xs"
                        classNames={{ label: "text-[#333333]" }}
                        className="w-[440px]"
                        placeholder="(optional)"
                      />
                      <TextInput
                        label="Instructor 7"
                        size="xs"
                        classNames={{ label: "text-[#333333]" }}
                        className="w-[440px]"
                        placeholder="(optional)"
                      />
                      <TextInput
                        label="Instructor 8"
                        size="xs"
                        classNames={{ label: "text-[#333333]" }}
                        className="w-[440px]"
                        placeholder="(optional)"
                      />
                    </div>
                  </div>
                  <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
                    <div className="flex text-secondary pl-6 flex-col">
                      <p className="font-medium">สถานที่สอนคาบบรรยาย</p>
                      <p className="font-semibold">Lectures Venue</p>
                    </div>

                    <div className="flex flex-col gap-3 text-[#333333]">
                      <Textarea label='Description' size="xs" placeholder="(optional)" className="w-[440px]" classNames={{ input: "h-[180px] p-3"}}></Textarea>
                    </div>
                  </div>
                  <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
                    <div className="flex text-secondary pl-6 flex-col">
                      <p className="font-medium">สถานที่สอนคาบแลป</p>
                      <p className="font-semibold">Laboratory Venue</p>
                    </div>

                    <div className="flex flex-col gap-3 text-[#333333]">
                      <Textarea label='Description' size="xs" placeholder="(optional)" className="w-[440px]" classNames={{ input: "h-[180px] p-3", label: "text-[#333333]"}}></Textarea>
                    </div>
                  </div>
                  <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
                    <div className="flex text-secondary pl-6 flex-col">
                      <p className="font-medium">ตำราและเอกสาร</p>
                      <p className="font-semibold">Main Reference</p>
                    </div>

                    <div className="flex flex-col gap-3 text-[#333333]">
                      <Textarea label='Description' size="xs" placeholder="(optional)" className="w-[440px]" classNames={{ input: "h-[180px] p-3", label: "text-[#333333]"}}></Textarea>
                    </div>
                  </div>
                  <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
                    <div className="flex text-secondary pl-6 flex-col">
                      <p className="font-medium">เอกสารแนะนำ</p>
                      <p className="font-semibold">Recommended Documents, e.g. Lecture notes, E-documents, etc.</p>
                    </div>

                    <div className="flex flex-col gap-3 text-[#333333]">
                      <Textarea label='Description' size="xs" placeholder="(optional)" className="w-[440px]" classNames={{ input: "h-[180px] p-3", label: "text-[#333333]"}}></Textarea>
                    </div>
                  </div>
                </div>
              </div> */}
              <Part1TQF3 />
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
