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
  
  export default function PLOYearView({ opened, onClose }: Props) {
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
      <Modal
        opened={opened}
        onClose={onClose}
        closeOnClickOutside={true}
        title={
          <div className="flex flex-col gap-3">
            <p>Add skill </p>
  
            <p className="text-[12px] inline-flex items-center text-noData -mt-[4px]">
              {courseNo} - {course?.courseName}
            </p>
          </div>
        }
        centered
        size="66vw"
        transitionProps={{ transition: "pop" }}
        classNames={{
          header: "bg-red-400",
          close: "-mt-8",
          content: "flex flex-col overflow-hidden pb-2 max-h-full h-fit",
          body: "flex flex-col gap-2 overflow-hidden max-h-full h-fit",
        }}
      >
        <div className="text-b4 font-medium flex justify-between items-center mt-2">
          
          {/* <MultiSelect /> */}
          <div className="flex flex-row ">
            <div className="flex items-center gap-1">
              Skills per page:
              <Select
                size="sm"
                allowDeselect={false}
                classNames={{
                  input: "border-none !h-[32px]",
                  wrapper: "!h-[32px]",
                }}
                className=" w-[74px] h-[32px]"
                data={["10", "20", "30"]}
                value={payload.perPage.toString()}
                onChange={(event) => {
                  setPayload((prev: any) => {
                    return { ...prev, perPage: parseInt(event!) };
                  });
                  onChangePage(1, parseInt(event!));
                }}
              />
            </div>
            <div className="flex items-center">
              <div
                aria-disabled={payload.page == 1}
                onClick={() => {
                  payload.page != 1 && onChangePage(payload.page - 1);
                }}
                className={`cursor-pointer aria-disabled:cursor-default aria-disabled:text-[#dcdcdc] p-1 ${
                  payload.page !== 1 && "hover:bg-[#eeeeee]"
                } rounded-full`}
              >
                <Icon IconComponent={IconChevronLeft} />
              </div>
              <div>
                {payload.page} of {payload.totalPage}
              </div>
              <div
                aria-disabled={payload.page == payload.totalPage}
                onClick={() => onChangePage(payload.page + 1)}
                className={` cursor-pointer aria-disabled:cursor-default aria-disabled:text-[#dcdcdc] p-1 ${
                  payload.page !== payload.totalPage && "hover:bg-[#eeeeee]"
                } rounded-full`}
              >
                <Icon IconComponent={IconChevronRight} />
              </div>
            </div>
          </div>
        </div>
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
                      selectedSkills.includes(skill.name)
                        ? "border-secondary"
                        : ""
                    }`}
                  >
                    <Group>
                      <Checkbox.Indicator />
  
                      <div className="flex flex-col ml-1">
                        <p className="font-semibold text-[15px] text-secondary mb-1">
                          {skill.name}
                        </p>
                        <PillGroup className="w-[55vw]">
                          {skill.tags.map((tag, index) => (
                            <Pill key={index}>{tag}</Pill>
                          ))}
                        </PillGroup>
                      </div>
                    </Group>
                  </Checkbox.Card>
                ))}
              </div>
            </Group>
          </Checkbox.Group>
  
          <div className="flex gap-2 items-end  justify-end h-fit">
            <Group className="flex w-full gap-2 h-fit items-end justify-end">
              <Button onClick={onClose} variant="subtle">
                Cancel
              </Button>
              <Button loading={loading}>Add</Button>
            </Group>
          </div>
        </div>
      </Modal>
    );
  }
  