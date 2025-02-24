import { Checkbox, Modal, Select, Group, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store";
import { SearchInput } from "../../../components/SearchInput";
import { useSearchParams, useLocation } from "react-router-dom";
import { getSkills } from "@/services/skill/skill.service";
import { SkillRequestDTO } from "@/services/skill/dto/skill.dto";
import { IModelSkill } from "@/models/ModelSkill";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function PLOSelectCourseView({ opened, onClose }: Props) {
  const [params, setParams] = useSearchParams();
  const academicYear = useAppSelector((state) => state.academicYear);
  const curriculum = useAppSelector((state) => state.faculty.curriculum);
  const termOption = academicYear.map((e) => {
    return `${e.semester}/${e.year}`;
  });
  const [skills, setSkills] = useState<IModelSkill[]>([]);
  const [payload, setPayload] = useState<
    SkillRequestDTO & { totalPage: number }
  >({
    page: 1,
    perPage: 10,
    totalPage: 1,
  });

  const location = useLocation().pathname;
  const [selectedCurriculum, setSelectedCurriculum] = useState<string | null>();
  const [selectedCourse, setSelectedCourse] = useState<string[]>([]);
  const checkAcademic = (term: string, data?: IModelAcademicYear) => {
    return (
      term.split("/")[0] ==
        (data ? data.semester.toString() : params.get("semester")) &&
      term.split("/")[1] == (data ? data.year.toString() : params.get("year"))
    );
  };
  const [selectedTerm, setSelectedTerm] = useState<any>(
    termOption.find((term) => checkAcademic(term))
  );

  const searchCourse = async (searchValue: string, reset?: boolean) => {
    const path = "/" + location.split("/")[1];
    let res;
    let payloadCourse: any = {};
    if (reset) payloadCourse.search = "";
    else payloadCourse.search = searchValue;

    localStorage.setItem("search", "true");
  };

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
    classNames={{ content: "!p-0 !bg-[#fafafa]" }}
    >
      <Modal.Content >
        {/* Header */}

        <Modal.Header className="flex w-full h-[64px] !bg-white px-6 !py-4 border-b">
          <div className="flex items-center gap-3">
            <Modal.CloseButton className="ml-0" />
            <p className="font-semibold text-h2  text-secondary">
              Curriculum View
            </p>
          </div>
        </Modal.Header>

        {/* Body */}
        <Modal.Body className="flex h-full max-h-[92vh] m p-6 px-10   gap-4 overflow-hidden">
          {/* Left Section - Course List */}
          <div className="w-1/3 bg-white shadow-lg flex flex-col rounded-lg p-5 border justify-between overflow-y-clip border-gray-200">
            <div className="flex flex-col w-full">
              <div className="flex flex-col w-full ">
                <div className="mb-2 text-secondary">
                  <p className="text-[14px] font-semibold">
                    Step 1: Select Curriculum
                  </p>
                  <p className="text-[12px] text-gray-500">
                    Courses below will be available once you make a selection.
                  </p>
                </div>

                <div className="flex gap-3 mb-4 pb-4 border-b ">
                  <Select
                    rightSectionPointerEvents="all"
                    label={`Select Curriculum`}
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
                    size="xs"
                    nothingFoundMessage="No result"
                    className="w-full border-none "
                    classNames={{
                      input: `rounded-md`,
                      option: `py-1`,
                      label: `!text-[12px]`,
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col border-b w-full  mb-4">
                <div className="mb-3 text-secondary">
                  <p className="text-[14px] font-semibold">
                    Step 2: Select Courses
                  </p>
                  {(!selectedCurriculum || !selectedTerm) && (
                    <p className="text-[12px] text-gray-500">
                      Please select a curriculum first.
                    </p>
                  )}
                </div>
                <div className=" ">
                  <SearchInput
                    onSearch={searchCourse}
                    placeholder="Course No / Course Name"
                    isCurriculumView={true}
                  />
                  <Checkbox.Group
                    classNames={{
                      label:
                        "mb-1 font-semibold text-default acerSwift:max-macair133:!text-b4",
                    }}
                    value={selectedCourse}
                    onChange={setSelectedCourse}
                    className="!h-full   my-3 "
                  >
                    <div className="flex flex-col gap-4 overflow-y-auto h-[40vh]">
                      {Array.from({ length: 20 }).map((_, index) => (
                        <Checkbox.Card
                          key={index}
                          className={`p-3 items-center px-4 flex h-fit rounded-md w-full ${
                            selectedCourse.includes(`course-${index}`) &&
                            "!border-[1px] !border-secondary"
                          }`}
                          style={{
                            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.15)",
                          }}
                        >
                          <Group
                            wrap="nowrap"
                            className="items-center flex"
                            align="flex-start"
                          >
                            <Checkbox.Indicator className="mt-1" />
                            {/* <div className="text-default whitespace-break-spaces font-medium text-b3 acerSwift:max-macair133:!text-b4">
                        Computer Programming for Engineers {index + 1}
                      </div> */}
                            <div className="flex flex-col w-fit !text-b4">
                              <p className="font-bold text-secondary">259201</p>
                              <p className="font-medium text-[#4E5150] flex-wrap ">
                                Computer Programming for Engineers
                              </p>
                            </div>
                          </Group>
                        </Checkbox.Card>
                      ))}
                    </div>
                  </Checkbox.Group>
                </div>
              </div>
            </div>

            <Button className="!w-full bg-delete hover:bg-[#ed4141] !text-[13px] !font-semibold !h-10">
              Clear Filter
            </Button>
          </div>
          {/* Right Section - Sidebar */}

          <div className="w-2/3 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold text-secondary">CPE Curriculum</p>
              <p className="text-sm text-gray-600">4 Courses</p>
            </div>

            <div className="h-full overflow-y-auto space-y-4">
              {Array.from({ length: 4 }).map((_, courseIndex) => (
                <div
                  key={courseIndex}
                  className="bg-white shadow-md rounded-lg p-5 border"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-sm font-bold text-secondary">259201</p>
                      <p className="text-xs text-gray-600">
                        Computer Programming for Engineers
                      </p>
                    </div>
                  </div>

                  {/* Sections */}
                  {Array.from({ length: 2 }).map((_, sectionIndex) => (
                    <div
                      key={sectionIndex}
                      className="bg-gray-100 rounded-md p-4 mb-2"
                    >
                      <p className="text-sm font-semibold text-default">
                        Section: 001, 002, 801, 802
                      </p>
                      <p className="text-xs text-gray-600">
                        Semester {sectionIndex + 1}
                      </p>

                      {/* PLO Scores */}
                      <div className="mt-3 p-3 bg-bgTableHeader rounded-md">
                        {["PLO 1", "PLO 2", "PLO 3"].map((plo, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between py-1 text-xs"
                          >
                            <p>{plo}</p>
                            <p className="font-medium text-secondary">
                              {(8.9 + idx).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
