import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useParams, useSearchParams } from "react-router-dom";
import { getSectionNo, getUserName } from "@/helpers/functions/function";
import { ROUTE_PATH } from "@/helpers/constants/route";
import needAccess from "@/assets/image/needAccess.jpg";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import { IModelUser } from "@/models/ModelUser";
import Loading from "@/components/Loading/Loading";
import { Button, Modal, Table, TextInput } from "@mantine/core";
import Icon from "@/components/Icon";
import IconEdit from "@/assets/icons/edit.svg?react";
import { calStat } from "@/helpers/functions/score";
import { TbSearch } from "react-icons/tb";
import { useForm } from "@mantine/form";
import { cloneDeep, isEqual } from "lodash";
import { setLoadingOverlay } from "@/store/loading";
import { updateStudentScore } from "@/services/score/score.service";
import { NOTI_TYPE, ROLE } from "@/helpers/constants/enum";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { updateStudentList } from "@/store/course";

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
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<string>("");
  const [openEditScore, setOpenEditScore] = useState(false);
  const [editScore, setEditScore] = useState<
    {
      name: string;
      score: number;
    }[]
  >();
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
    dispatch(setDashboard(ROLE.INSTRUCTOR));
    localStorage.setItem("dashboard", ROLE.INSTRUCTOR);
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
        score: (value, values, path) => {
          if (typeof value !== "number")
            return (
              !value.length ||
              (!parseInt(value) && value != "0" && "Please enter valid score")
            );
          const fullScore =
            assignment?.questions.find(
              (ques) =>
                ques.name == values.questions[parseInt(path.split(".")[1])].name
            )?.fullScore || 0;
          return value > fullScore
            ? `Please enter score <= ${fullScore}`
            : null;
        },
      },
    },
    validateInputOnBlur: true,
    onValuesChange: (values) => {
      values.questions?.forEach((item) => {
        if (typeof item.score != "number" && !isNaN(parseInt(item.score))) {
          item.score = parseInt(item.score);
        }
      });
    },
  });

  useEffect(() => {
    if (!openEditScore) {
      form.reset();
    }
  }, [openEditScore]);

  const onSaveEditScore = async () => {
    if (!form.validate().hasErrors) {
      dispatch(setLoadingOverlay(true));
      const studentId = form.getValues().student.studentId;
      const res = await updateStudentScore({
        course: course?.id,
        sectionNo: section?.sectionNo,
        student: form.getValues().student.id,
        assignmentName: name,
        questions: [...form.getValues().questions],
      });
      if (res) {
        dispatch(updateStudentList({ id: course?.id, sections: res }));
        showNotifications(
          NOTI_TYPE.SUCCESS,
          "Edit score successfully",
          `score of student ${studentId} is updated`
        );
        setOpenEditScore(false);
      }
      dispatch(setLoadingOverlay(false));
    }
  };

  return (
    <>
      <Modal
        opened={openEditScore}
        onClose={() => setOpenEditScore(false)}
        title={`Edit Score ${form.getValues().student?.studentId}`}
        size="35vw"
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
          <div className="flex flex-col gap-6 w-full max-h-[300px] overflow-y-auto">
            {!!form.getValues().questions?.length &&
              form.getValues().questions.map((ques, index) => (
                <div
                  key={index}
                  className="flex flex-col  gap-1 w-full  text-start justify-start"
                >
                  <p>{ques.name}</p>
                  <div className="flex text-center     items-center gap-3">
                    <TextInput
                      size="xs"
                      withAsterisk={true}
                      classNames={{
                        input:
                          "focus:border-primary text-[16px] w-20  text-center text-default ",
                      }}
                      {...form.getInputProps(`questions.${index}.score`)}
                    />
                    <p className=" text-[18px]">
                      / {assignment?.questions[index].fullScore}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex gap-2 sm:max-macair133:fixed sm:max-macair133:bottom-6 sm:max-macair133:right-8 items-end  justify-end h-fit">
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
              disabled={isEqual(editScore, form.getValues().questions)}
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
                  <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-defa">
                    {mean.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">SD</p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-defa">
                    {sd.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Median
                  </p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
                    {median.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Max
                  </p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
                    {maxScore.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Min
                  </p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
                    {minScore.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">Q3</p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
                    {q3.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">Q1</p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
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
                              {questions
                                ?.reduce((sum, { score }) => sum + score, 0)
                                .toFixed(2)}
                            </p>
                            <Icon
                              IconComponent={IconEdit}
                              onClick={() => {
                                form.setValues({
                                  student: student.student,
                                  questions,
                                });
                                setEditScore(questions);
                                setOpenEditScore(true);
                              }}
                              className="size-4 cursor-pointer text-default"
                            />
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
