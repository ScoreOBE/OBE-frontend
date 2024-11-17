import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getSectionNo, getUserName } from "@/helpers/functions/function";
import { ROUTE_PATH } from "@/helpers/constants/route";
import needAccess from "@/assets/image/needAccess.jpg";
import { setShowNavbar } from "@/store/showNavbar";
import { setShowSidebar } from "@/store/showSidebar";
import { IModelUser } from "@/models/ModelUser";
import Loading from "@/components/Loading/Loading";
import { Button, Modal, Table, TextInput } from "@mantine/core";
import Icon from "@/components/Icon";
import IconEdit from "@/assets/icons/edit.svg?react";
import { calStat } from "@/helpers/functions/score";
import { TbSearch } from "react-icons/tb";
import { useForm } from "@mantine/form";
import { cloneDeep } from "lodash";

export default function Students() {
  const { name } = useParams();
  const { courseNo, sectionNo } = useParams();
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
  const course = useAppSelector((state) =>
    state.course.courses.find((e) => e.courseNo == courseNo)
  );
  const section = course?.sections.find(
    (sec) => parseInt(sectionNo!) === sec.sectionNo
  );
  const assignment = section?.assignments?.find((item) => item.name == name);
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<string>("");
  const [openEditScore, setOpenEditScore] = useState(false);
  const [items, setItems] = useState<any[]>([
    {
      title: "Your Course",
      path: `${ROUTE_PATH.INS_DASHBOARD}?${params.toString()}`,
    },
    {
      title: "Sections",
      path: `${ROUTE_PATH.COURSE}/${courseNo}/${
        ROUTE_PATH.SECTION
      }?${params.toString()}`,
    },
    {
      title: `Assignment Section ${getSectionNo(sectionNo)}`,
      path: `${ROUTE_PATH.COURSE}/${courseNo}/${
        ROUTE_PATH.SECTION
      }/${sectionNo}/${ROUTE_PATH.ASSIGNMENT}?${params.toString()}`,
    },
    { title: `${name}` },
  ]);

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  }, []);

  const fullScore =
    assignment?.questions.reduce((sum, { fullScore }) => sum + fullScore, 0) ||
    0;
  const scores = section?.students
    ?.map(({ scores }) =>
      scores
        .find(({ assignmentName }) => assignmentName == name)
        ?.questions?.reduce((sum, { score }) => sum + score, 0)
    )
    .filter((item) => item != undefined)
    .sort((a, b) => a - b) || [0];
  const totalStudent =
    section?.students?.filter((item) =>
      item.scores.find(({ assignmentName }) => assignmentName == name)
    ).length || 0;
  const { mean, sd, median, maxScore, minScore, q1, q3 } = calStat(
    scores,
    totalStudent
  );
  const k = Math.log2(totalStudent) + 1;
  const binWidth = (maxScore - minScore) / k;
  const scoresData = Array.from({ length: k }, (_, index) => {
    const start = minScore + index * binWidth;
    const end = start + binWidth;
    return {
      range: `${start.toFixed(2)} - ${end.toFixed(2)}`,
      start,
      end,
      Students: 0,
    };
  });
  scores.forEach((score) => {
    const binIndex = scoresData.findIndex(
      (item) => item.start <= score && item.end >= score
    );
    if (binIndex !== -1) {
      scoresData[binIndex].Students += 1;
    }
  });

  const form = useForm({
    mode: "controlled",
    initialValues: {} as {
      student: IModelUser;
      questions: {
        name: string;
        score: any;
      }[];
    },
    validate: {
      questions: {
        score: (value, values, path) =>
          (!value.length ||
            !parseInt(value) ||
            parseInt(value) >
              (assignment?.questions.find(
                (ques) =>
                  ques.name ==
                  values.questions[parseInt(path.split(".")[1])].name
              )?.fullScore || 0)) &&
          "Please input valid score",
      },
    },
    validateInputOnBlur: true,
  });

  const onSaveEditScore = () => {
    console.log(form.getValues());
  };

  return (
    <>
      <Modal
        opened={openEditScore}
        onClose={() => setOpenEditScore(false)}
        title={`Edit Score ${form.getValues().student?.studentId}`}
        size="22vw"
        centered
        closeOnClickOutside={false}
        transitionProps={{ transition: "pop" }}
        className="flex items-center justify-center"
        classNames={{
          content:
            "flex flex-col justify-center w-full font-medium leading-[24px] text-[14px] item-center  overflow-hidden ",
        }}
      >
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col w-full">
            {!!form.getValues().questions?.length &&
              form.getValues().questions.map((ques, index) => (
                <div key={index} className="flex items-center justify-between">
                  <p>{ques.name}</p>
                  <p>full score: {assignment?.questions[index].fullScore}</p>
                  <TextInput
                    size="xs"
                    withAsterisk={true}
                    label="Score"
                    classNames={{
                      input:
                        "focus:border-primary text-[16px] w-28 h-10 text-center text-default ",
                    }}
                    {...form.getInputProps(`questions.${index}.score`)}
                  />
                </div>
              ))}
          </div>

          <div className="flex gap-2 mt-3 justify-end">
            <Button
              onClick={() => {
                setOpenEditScore(false);
                form.reset();
              }}
              variant="subtle"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpenEditScore(false);
                onSaveEditScore();
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
      <div className="bg-white flex flex-col h-full w-full px-6 py-5 gap-3 overflow-hidden">
        <Breadcrumbs items={items} />
        {/* <Breadcrumbs /> */}
        {loading ? (
          <Loading />
        ) : (section?.instructor as IModelUser)?.id === user.id ||
          (section?.coInstructors as IModelUser[])
            ?.map(({ id }) => id)
            .includes(user.id) ? (
          <>
            <div className="flex flex-col border-b-2 border-nodata pt-2 pb-3  items-start gap-4 text-start">
              <p className="text-secondary text-[18px] font-semibold">
                {name} - {fullScore} Points
              </p>
              <div className="flex px-10 flex-row justify-between w-full">
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Mean
                  </p>
                  <p className="font-bold text-[28px] text-defa">
                    {mean.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">SD</p>
                  <p className="font-bold text-[28px] text-defa">
                    {sd.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Median
                  </p>
                  <p className="font-bold text-[28px] text-default">
                    {median.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Max
                  </p>
                  <p className="font-bold text-[28px] text-default">
                    {maxScore.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Min
                  </p>
                  <p className="font-bold text-[28px] text-default">
                    {minScore.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">Q3</p>
                  <p className="font-bold text-[28px] text-default">
                    {q3.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">Q1</p>
                  <p className="font-bold text-[28px] text-default">
                    {q1.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <TextInput
              leftSection={<TbSearch />}
              placeholder="Section No, Student No, Name"
              size="xs"
              rightSectionPointerEvents="all"
              className="mx-1"
              onChange={(event: any) => setFilter(event.currentTarget.value)}
            ></TextInput>

            {/* Table */}
            <div
              className="overflow-y-auto overflow-x-auto m w-full h-fit max-h-full border flex flex-col rounded-lg border-secondary"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
                height: "fit-content",
              }}
            >
              <Table stickyHeader>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="w-[15%]">Student ID</Table.Th>
                    <Table.Th className="w-[25%]">Name</Table.Th>
                    <Table.Th className=" text-end pr-28">Score</Table.Th>
                    <Table.Th className="w-[40%]"></Table.Th>
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody className="text-default text-[13px] ">
                  {section?.students
                    ?.filter((student) =>
                      parseInt(filter)
                        ? student.student.studentId?.toString().includes(filter)
                        : getUserName(student.student, 3)?.includes(filter)
                    )
                    ?.map((student, index) => {
                      const questions = cloneDeep(
                        student.scores.find(
                          ({ assignmentName }) => assignmentName == name
                        )?.questions
                      );
                      return (
                        <Table.Tr key={index}>
                          <Table.Td className="!py-[19px]">
                            {student.student.studentId}
                          </Table.Td>
                          <Table.Td className="w-[25%]">
                            {getUserName(student.student, 3)}
                          </Table.Td>
                          <Table.Td className="flex gap-4 items-center justify-end pr-28">
                            <p className="mt-0.5">
                              {questions?.reduce(
                                (sum, { score }) => sum + score,
                                0
                              )}
                            </p>
                            <Icon
                              IconComponent={IconEdit}
                              onClick={() => {
                                form.setValues({
                                  student: student.student,
                                  questions,
                                });
                                setOpenEditScore(true);
                              }}
                              className="size-4 cursor-pointer text-default"
                            />
                          </Table.Td>
                          <Table.Td className="text-[#D8751A] font-medium">
                            Score is edited
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                </Table.Tbody>
              </Table>
            </div>
          </>
        ) : (
          <div className="flex px-16  flex-row items-center justify-between h-full">
            <div className="flex justify-center  h-full items-start gap-2 flex-col">
              <p className="   text-secondary font-semibold text-[22px]">
                You need access
              </p>
              <p className=" text-[#333333] leading-6 font-medium text-[14px]">
                You're not listed as a Co-Instructor. <br /> Please contact the
                Owner section for access.
              </p>
            </div>
            <img
              className=" z-50  size-[460px] "
              src={needAccess}
              alt="loginImage"
            />
          </div>
        )}
      </div>
    </>
  );
}
