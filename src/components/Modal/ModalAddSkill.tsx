import {
  Alert,
  Button,
  Checkbox,
  CheckboxCard,
  Group,
  Modal,
  Radio,
  Select,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import {
  getKeyPartTopicTQF3,
  PartTopicTQF3,
} from "@/helpers/constants/TQF3.enum";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import { genPdfTQF3 } from "@/services/tqf3/tqf3.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { useParams } from "react-router-dom";
import { IModelTQF3 } from "@/models/ModelTQF3";
import noData from "@/assets/image/noData.jpg";
import IconExcel from "@/assets/icons/excel.svg?react";
import Icon from "@/components/Icon";
import { setLoadingOverlay } from "@/store/loading";
import { IModelPLOCollection } from "@/models/ModelPLO";

type Props = {
  opened: boolean;
  onClose: () => void;
  // dataPLO?: Partial<IModelPLOCollection>;
};

export default function ModalAddSkill({ opened, onClose }: Props) {
  const { courseNo } = useParams();
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const tqf3 = useAppSelector((state) => state.tqf3);
  const [selectedMerge, setSelectedMerge] = useState("unzipfile");
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const dispatch = useAppDispatch();
  const [dataExport, setDataExport] = useState<Partial<IModelTQF3>>({});
  const department = useAppSelector((state) =>
    state.faculty.department.slice(1)
  );

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleCheckboxChange = (title: string) => {
    setSelectedSkills((prev) =>
      prev.includes(title)
        ? prev.filter((skill) => skill !== title)
        : [...prev, title]
    );
  };

  const skills = [
    {
      title: "Adaptability",
      descriptionTH:
        "ความสามารถในการปรับตัวและเจริญเติบโตในสภาพแวดล้อมและสถานการณ์ที่เปลี่ยนแปลง",
      descriptionEN:
        "The ability to adjust and thrive in changing environments and circumstances.",
    },
    {
      title: "Attention to Detail",
      descriptionTH:
        "ทักษะในการทำงานอย่างละเอียดและแม่นยำ รับประกันความถูกต้องและลดข้อผิดพลาดให้น้อยที่สุด",
      descriptionEN:
        "The skill of being thorough and precise in tasks, ensuring accuracy and minimizing errors.",
    },
    {
      title: "Problem-Solving",
      descriptionTH:
        "ทักษะในการระบุและการแก้ไขปัญหาหรืออุปสรรคอย่างมีประสิทธิผลและมีประสิทธิภาพ",
      descriptionEN:
        "The skill of identifying and resolving issues or obstacles in an efficient and effective manner.",
    },
    {
      title: "CAD",
      descriptionTH:
        "การใช้ซอฟต์แวร์ออกแบบด้วยคอมพิวเตอร์สำหรับการออกแบบและร่างในอุตสาหกรรมต่างๆ เช่น วิศวกรรมและสถาปัตยกรรม",
      descriptionEN:
        "Using specialized software for designing and drafting in various industries, such as engineering and architecture.",
    },
    {
      title: "Collaboration",
      descriptionTH:
        "การทำงานร่วมกับผู้อื่นอย่างมีประสิทธิผลเพื่อบรรลุเป้าหมายร่วมกัน แบ่งปันความคิด และแก้ปัญหาร่วมกัน",
      descriptionEN:
        "Working effectively with others to achieve common goals, share ideas, and solve problems together.",
    },
    {
      title: "Communication",
      descriptionTH:
        "ความสามารถในการสื่อสารข้อมูลและความคิดอย่างชัดเจนและมีประสิทธิผลผ่านสื่อต่างๆ",
      descriptionEN:
        "The ability to convey information and ideas clearly and effectively through various mediums.",
    },
    {
      title: "Continuous Learning",
      descriptionTH:
        "ความมุ่งมั่นที่จะเรียนรู้ความรู้ใหม่ๆ และทักษะตลอดอาชีพเพื่อคงความเกี่ยวข้องและความสามารถในการปรับตัว",
      descriptionEN:
        "The commitment to acquiring new knowledge and skills throughout one's career to stay relevant and adaptable.",
    },
    {
      title: "Programming & Coding",
      descriptionTH:
        "ความชำนาญในการเขียนและการพัฒนาโค้ดในภาษาโปรแกรมมิ่งต่างๆสำหรับซอฟต์แวร์และแอปพลิเคชัน",
      descriptionEN:
        "Proficiency in writing and developing code in various programming languages for software and applications.",
    },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={true}
      title={
        <div className="flex flex-col gap-3">
          <p>Add skill </p>

          <p className="text-[12px] inline-flex items-center text-noData -mt-[4px]">
            {courseNo}
          </p>
        </div>
      }
      centered
      size="65vw"
      transitionProps={{ transition: "pop" }}
      classNames={{
        header: "bg-red-400",
        close: "-mt-8",
        content: "flex flex-col overflow-hidden pb-2 max-h-full h-fit",
        body: "flex flex-col overflow-hidden max-h-full h-fit",
      }}
    >
      <div className="flex flex-col mt-1 gap-5 ">
        <Checkbox.Group
          value={selectedSkills}
          onChange={(values: string[]) => setSelectedSkills(values)}
        >
          <Group className="flex overflow-y-auto max-h-[50vh]">
            <div className="flex w-full h-full flex-col gap-3 overflow-y-auto">
              {skills.map((skill, index) => (
                <Checkbox.Card
                  key={index}
                  className={`p-3 pl-5 border-[2px] bg-white flex h-fit rounded-md w-full ${
                    selectedSkills.includes(skill.title)
                      ? "border-secondary"
                      : ""
                  }`}
                >
                  <Group>
                    <Checkbox.Indicator  />{" "}
                    {/* Just use value, no onChange needed */}
                    <div className="flex flex-col ml-1">
                      <p className="font-bold text-[15px] text-secondary">
                        {skill.title}
                      </p>
                      <p className="font-medium mt-[2px] text-default text-[13px]">
                        {skill.descriptionTH}
                      </p>
                      <p className="font-semibold text-default text-[13px]">
                        {skill.descriptionEN}
                      </p>
                    </div>
                  </Group>
                </Checkbox.Card>
              ))}
            </div>
          </Group>
        </Checkbox.Group>

        <div className="flex gap-2 sm:max-macair133:fixed sm:max-macair133:bottom-6 sm:max-macair133:right-8 items-end  justify-end h-fit">
          <Group className="flex w-full gap-2 h-fit items-end justify-end">
            <Button onClick={onClose} variant="subtle">
              Cancel
            </Button>
            <Button
              loading={loading}
              // onClick={generatePDF}
              disabled={
                !dataExport.part1?.updatedAt || selectedParts.length === 0
              }
            >
              Add
            </Button>
          </Group>
        </div>
      </div>
    </Modal>
  );
}
