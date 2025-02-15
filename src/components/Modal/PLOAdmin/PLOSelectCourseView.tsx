import {
  Alert,
  Button,
  Checkbox,
  CheckboxCard,
  Group,
  Modal,
  MultiSelect,
  Pill,
  PillGroup,
  Radio,
  Select,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import { useAppDispatch, useAppSelector } from "@/store";
import { useParams } from "react-router-dom";
import Icon from "@/components/Icon";
import IconChevronLeft from "@/assets/icons/chevronLeft.svg?react";
import IconChevronRight from "@/assets/icons/chevronRight.svg?react";
import { setLoadingOverlay } from "@/store/loading";
import { getSkills } from "@/services/skill/skill.service";
import { SkillRequestDTO } from "@/services/skill/dto/skill.dto";
import { IModelSkill } from "@/models/ModelSkill";

type Props = {
  opened: boolean;
  onClose: () => void;
  // dataPLO?: Partial<IModelPLOCollection>;
};

export default function PLOSelectCourseView({ opened, onClose }: Props) {
  const { courseNo } = useParams();
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const dispatch = useAppDispatch();
  const course = useAppSelector((state) =>
    state.allCourse.courses.find((e) => e.courseNo == courseNo)
  );
  const [skills, setSkills] = useState<IModelSkill[]>([]);
  const [payload, setPayload] = useState<
    SkillRequestDTO & { totalPage: number }
  >({
    page: 1,
    perPage: 10,
    totalPage: 1,
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const handleCheckboxChange = (title: string) => {
    setSelectedSkills((prev) =>
      prev.includes(title)
        ? prev.filter((skill) => skill !== title)
        : [...prev, title]
    );
  };

  const searchSkill = () => {};

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const res = await getSkills(payload);
    if (res) {
      setSkills(res.datas);
      setPayload({ ...payload, ...res.meta });
    }
  };

  const onChangePage = async (page: number, selectLimit?: number) => {
    const perPage = selectLimit ?? payload.perPage;
    const res = await getSkills({ ...payload, page, perPage });
    if (res) {
      setSkills(res.datas);
      setPayload({ ...payload, page, perPage, ...res.meta });
    }
  };

  return (
    <Modal.Root
      opened={opened}
      onClose={onClose}
      autoFocus={false}
      fullScreen={true}
      zIndex={50}
      classNames={{ content: "!pt-0 !bg-[#fafafa]" }}
    >
      <Modal.Content className="overflow-hidden !rounded-none !px-0">
        <Modal.Header className="flex w-full !bg-[#fafafa] !pb-0 mb-4 !px-0 !pt-4 rounded-none">
          <div className="flex  flex-col gap-[6px] items-start w-full">
            <div className="inline-flex relative px-12 w-full items-center justify-center gap-2  ">
              <div className="flex absolute left-12 gap-2">
                <Modal.CloseButton className="ml-0" />
                <p className="font-semibold text-h2 text-secondary">
                  Curriculum View
                </p>
              </div>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body className="flex h-full  px-12  overflow-hidden  gap-0  ">
          <div className=" h-full w-[70%] py-8 px-8 ">
          <div className="w-full bg-slate-200">dkdkkd</div>
          </div>
          <div  style={{
                        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                      }} className=" h-full py-8  rounded-[30px] bg-white w-[30%] px-8 ">
            <div className="w-full bg-slate-200">dkdkkd</div>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
