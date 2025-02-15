import { Checkbox, Modal, Select, Group } from "@mantine/core";
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
      fullScreen
      classNames={{ content: "!pt-0 !bg-[#f9fafb]" }}
    >
      <Modal.Content className="overflow-hidden rounded-lg shadow-lg">
        {/* Header */}

        <Modal.Header className="flex w-full h-[64px] bg-white px-6 !py-4 border-b rounded-t-lg">
          <div className="flex items-center gap-3">
            <Modal.CloseButton className="ml-0" />
            <p className="font-semibold text-h2  text-secondary">
              Curriculum View
            </p>
          </div>
        </Modal.Header>

        {/* Body */}
        <Modal.Body className="flex h-full max-h-[90vh] p-6 gap-6 overflow-hidden">
          {/* Left Section - Course List */}
          <div className="w-2/3 flex flex-col gap-6">
            <div className="flex items-center justify-between text-gray-800">
              <div>
                <p className="text-lg font-bold text-secondary">CPE</p>
                <p className="text-sm font-medium text-gray-600">4 Courses</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">PLO Average</p>
                <p className="text-xl font-semibold text-secondary">20.89</p>
              </div>
            </div>

            <div className="h-full overflow-y-auto space-y-4">
              {Array.from({ length: 4 }).map((_, courseIndex) => (
                <div
                  key={courseIndex}
                  className="bg-white shadow rounded-lg p-5 border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-md font-bold text-secondary">259201</p>
                      <p className="text-sm text-gray-600">
                        Computer Programming for Engineers
                      </p>
                    </div>
                    <p className="text-lg font-bold text-secondary">10.50</p>
                  </div>

                  {/* Sections */}
                  {Array.from({ length: 2 }).map((_, sectionIndex) => (
                    <div key={sectionIndex}>
                      <div
                        className={`bg-blue-100 ${
                          sectionIndex === 0 ? "first:rounded-t-md" : ""
                        } ${sectionIndex === 1 ? "last:rounded-b-md" : ""}`}
                      >
                        <div className="grid grid-cols-3 items-center justify-between py-4 px-7">
                          <div className="flex flex-wrap items-center gap-1">
                            <p className="font-medium text-b3 text-black w-[79px]">
                              Semester {sectionIndex + 1}
                            </p>
                          </div>

                          <p className="text-default text-b3 font-medium">
                            Section 000, 001, 009. 003
                          </p>
                          <p className="text-default text-b2 font-semibold text-end ">
                            10.00
                          </p>
                        </div>
                        {sectionIndex < 1 && (
                          <div className="border-b-[1px] mx-5 border-blue-300"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - Sidebar */}
          <div className="w-1/3 bg-white shadow-lg rounded-lg p-6 border overflow-y-clip border-gray-200">
            <div className="mb-4 text-secondary">
              <p className="text-b1 font-semibold">
                Step 1: Select Curriculum & Year
              </p>
              <p className="text-sm text-gray-500">
                Courses will be available once you make a selection.
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
                size="sm"
                nothingFoundMessage="No result"
                className="w-full border-none "
                classNames={{
                  input: `rounded-md`,
                  option: `py-1`,
                }}
              />
            </div>

            <div className="mb-4 text-secondary">
              <p className="text-b1 font-semibold">Step 2: Select Courses</p>
              {(!selectedCurriculum || !selectedTerm) && (
                <p className="text-sm text-gray-500">
                  Please select a curriculum and year first.
                </p>
              )}
            </div>
            <div className="mb-4">
              <SearchInput
                onSearch={searchCourse}
                placeholder="Course No / Course Name"
                isCurriculumView={true}
              />
            </div>
            <Checkbox.Group
              classNames={{
                label:
                  "mb-1 font-semibold text-default acerSwift:max-macair133:!text-b4",
              }}
              value={selectedCourse}
              onChange={setSelectedCourse}
              className="sm:max-ipad11:max-h-[420px] acerSwift:max-macair133:max-h-[305px] macair133:max-samsungA24:max-h-[420px] my-4 h-full"
            >
              <div className="flex flex-col gap-4 overflow-y-auto h-[40vh] max-h-full">
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
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
