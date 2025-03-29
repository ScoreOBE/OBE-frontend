import { Alert, Button, Chip, Group, Modal, Tabs } from "@mantine/core";
import { useParams } from "react-router-dom";
import ChartContainer from "@/components/Chart/ChartContainer";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  IModelAssignment,
  IModelCourse,
  IModelScore,
} from "@/models/ModelCourse";
import { IModelUser } from "@/models/ModelUser";
import { useEffect, useRef, useState } from "react";
import { useForm } from "@mantine/form";
import Icon from "@/components/Icon";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import IconCircleCheck from "@/assets/icons/circleCheck.svg?react";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconEyePublish from "@/assets/icons/eyePublish.svg?react";
import IconArrowRight from "@/assets/icons/arrowRight.svg?react";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import { updateAssignments } from "@/store/course";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { setLoadingOverlay } from "@/store/loading";
import { publishScore } from "@/services/score/score.service";
import { getSectionNo } from "@/helpers/functions/function";
import React from "react";

type Props = {
  opened: boolean;
  onClose: () => void;
  courseData?: Partial<IModelCourse>;
  data?: string[];
  isUploadScore?: boolean;
  isPublishAll?: boolean;
};

export default function ModalPublishScore({
  opened,
  onClose,
  courseData,
  data,
  isUploadScore,
  isPublishAll,
}: Props) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      isPublish: false,
      sections: [] as any[],
      assignments: [] as string[],
    },
  });

  const { courseNo } = useParams();
  const course = useAppSelector((state) =>
    state.course.courses.find(
      (e) => e.courseNo === (courseData ? courseData.courseNo : courseNo)
    )
  );
  const dispatch = useAppDispatch();
  const allAssignments: IModelAssignment[] = [];
  const assignmentsMap: Map<string, IModelAssignment> = new Map();
  course?.sections.forEach((sec) => {
    sec.assignments?.forEach((assign) => {
      if (assign?.name && !assignmentsMap.has(assign.name)) {
        assignmentsMap.set(assign.name, assign);
      }
    });
  });
  allAssignments.push(...assignmentsMap.values());

  const [openPublishScoreModal, setOpenPublishScoreModal] = useState(false);
  const [openSelectSecModal, setOpenSelectSecModal] = useState(false);
  useEffect(() => {
    if (opened && isUploadScore && data) {
      form.setFieldValue("assignments", data);
      setOpenSelectSecModal(true);
    } else if (opened) {
      setOpenPublishScoreModal(true);
    }
  }, [opened]);

  const onClosePublishModal = () => {
    setOpenPublishScoreModal(false);
    onClose();
    setOpenSelectSecModal(false);

    form.reset();
  };

  const onClickPublishScore = () => {
    form.setFieldValue("isPublish", true);
    if (isPublishAll) {
      const allSec = course?.sections?.map((sec) => sec.sectionNo) || [];
      form.setFieldValue("sections", allSec);
    }
    const sectionsToNum = form
      .getValues()
      .sections.map((sec: string) => parseInt(sec));
    form.setFieldValue("sections", sectionsToNum);
    onClickPublish();
  };

  const onClickPublish = async () => {
    dispatch(setLoadingOverlay(true));
    const res = await publishScore({
      course: course?.id,
      ...form.getValues(),
    });
    if (res) {
      dispatch(updateAssignments({ ...res }));
      showNotifications(
        NOTI_TYPE.SUCCESS,
        `Score${
          form.getValues().isPublish ? " Published" : " Unpublished"
        }  Successfully`,
        `Scores ${form.getValues().assignments.join(", ")} in ${form
          .getValues()
          .sections.map((item) => getSectionNo(item))
          .join(", ")} ${
          form.getValues().assignments.length > 1 ? "are" : "is"
        } ${
          form.getValues().isPublish
            ? "has been published"
            : "has been unpublished"
        }`
      );
      onClosePublishModal();
      form.reset();
    }
    dispatch(setLoadingOverlay(false));
  };

  return (
    <>
      {" "}
      {/* Select assignment to publish */}
      {!isUploadScore && (
        <Modal
          opened={openPublishScoreModal}
          closeOnClickOutside={false}
          size="30vw"
          title={
            <div className="flex flex-col gap-2 acerSwift:max-macair133:text-h2">
              <p>Publish Score {isPublishAll ? "All" : "Each"} Sections</p>
              <p className=" text-b4 acerSwift:max-macair133:text-b5 text-noData">
                {courseNo} {course?.courseName}
              </p>
            </div>
          }
          transitionProps={{ transition: "pop" }}
          centered
          onClose={onClosePublishModal}
        >
          {isPublishAll && (
            <Alert
              variant="light"
              color="blue"
              title={
                <p className="acerSwift:max-macair133:text-b4 font-medium">
                  <span className="font-bold underline">All students</span>
                  {` enrolled in this course will be able to see the assignments score you publish.`}
                </p>
              }
              icon={
                <Icon IconComponent={IconInfo2} className="text-blue-500" />
              }
              classNames={{
                icon: "size-6",
                title: "text-blue-800",
                root: "bg-blue-50 border border-blue-100 rounded-xl text-blue-700",
              }}
              className="mb-5"
            ></Alert>
          )}
          <div className="mb-6 acerSwift:max-macair133:p-0 rounded-2xl flex flex-col gap-3 max-h-[200px] overflow-y-auto">
            {course?.sections.length! > 1 && (
              <Chip
                classNames={{
                  label:
                    "text-b3 acerSwift:max-macair133:text-b4 text-default font-semibold ",
                }}
                size="md"
                checked={
                  form.getValues().assignments.length === allAssignments!.length
                }
                onChange={() => {
                  if (
                    form.getValues().assignments.length ===
                    allAssignments!.length
                  ) {
                    form.setFieldValue("assignments", []);
                  } else {
                    form.setFieldValue("assignments", [
                      ...allAssignments.map((as) => as.name),
                    ]);
                  }
                }}
              >
                All Scores
              </Chip>
            )}
            <Chip.Group
              {...form.getInputProps("assignments")}
              multiple
              value={form.getValues().assignments?.map((as) => as)}
              onChange={(event) => form.setFieldValue("assignments", event)}
            >
              <Group>
                <div className="flex gap-3 flex-wrap">
                  {allAssignments.map((as, index) => (
                    <Chip
                      key={index}
                      classNames={{
                        root: "h-8 !rounded-[10px] text-center justify-center items-center",
                        label:
                          "text-b3 acerSwift:max-macair133:text-b4 text-default font-semibold  ",
                      }}
                      size="md"
                      value={as.name}
                    >
                      {as.name}
                    </Chip>
                  ))}
                </div>
              </Group>
            </Chip.Group>
          </div>

          <div className="flex gap-2 justify-end w-full">
            <Button onClick={onClosePublishModal} variant="subtle">
              Cancel
            </Button>
            {!isPublishAll ? (
              <Button
                rightSection={
                  <Icon
                    IconComponent={IconArrowRight}
                    className="size-5 stroke-2"
                  />
                }
                disabled={!form.getValues().assignments.length}
                onClick={() => {
                  setOpenPublishScoreModal(false);
                  setOpenSelectSecModal(true);
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={onClickPublishScore}
                disabled={!form.getValues().assignments.length}
              >
                <div className="flex gap-2 items-center acerSwift:max-macair133:text-b5">
                  <Icon
                    IconComponent={IconEyePublish}
                    className="size-5 acerSwift:max-macair133:size-4 -ml-1"
                  />

                  <span> Publish Scores</span>
                </div>{" "}
              </Button>
            )}
          </div>
        </Modal>
      )}
      {/* Select section to publish */}
      <Modal
        opened={openSelectSecModal}
        closeOnClickOutside={false}
        size="36vw"
        title={
          <div className="flex flex-col gap-2">
            {isUploadScore ? (
              <p>Score Upload Complete</p>
            ) : (
              <p>Publish Score {isPublishAll ? "All" : "Each"} Sections</p>
            )}

            <p className=" text-b4 acerSwift:max-macair133:text-b5 text-noData">
              {courseNo} {course?.courseName}
            </p>
          </div>
        }
        transitionProps={{ transition: "pop" }}
        centered
        onClose={onClosePublishModal}
      >
        {isUploadScore ? (
          <Alert
            variant="light"
            color="green"
            title={
              <div className="flex flex-col">
                <p className="font-bold text-emerald-700">Upload Successful</p>
                <p className="mt-[2px] text-emerald-600 font-medium">
                  Scores for{" "}
                  <span className="font-semibold">
                    {form
                      .getValues()
                      .assignments.join(", ")
                      .replace(/, ([^,]*)$/, " and $1")}
                  </span>{" "}
                  have been uploaded successfully
                </p>
              </div>
            }
            icon={
              <Icon
                IconComponent={IconCircleCheck}
                className="text-emerald-600"
              />
            }
            classNames={{
              icon: "size-6",
              root: "bg-emerald-50 border border-emerald-100 rounded-xl",
            }}
            className="mb-5"
          />
        ) : (
          <Alert
            variant="light"
            color="blue"
            title={
              <p className="mt-[2px] acerSwift:max-macair133:text-b3 text-blue-700">
                You choose{" "}
                <span className="font-semibold">
                  {form
                    .getValues()
                    .assignments.join(", ")
                    .replace(/, ([^,]*)$/, " and $1")}{" "}
                </span>
                to publish.
              </p>
            }
            icon={<Icon IconComponent={IconInfo2} className="text-blue-500" />}
            classNames={{
              icon: "size-6",
              root: "bg-blue-50 border border-blue-100 rounded-xl",
            }}
            className="mb-5"
          ></Alert>
        )}

        {(() => {
          const assignments = form.getValues().assignments;
          const selectedSectionNumbers = form
            .getValues()
            .sections.map((item) => Number(item));

          const missingAssignments = assignments
            .map((assign) => {
              const sectionsNotFound = course?.sections
                ?.filter((sec) =>
                  selectedSectionNumbers.includes(sec.sectionNo!)
                )
                ?.filter(
                  (sec) =>
                    !sec.assignments?.some((item) => item.name === assign)
                )
                ?.map((sec) => sec.sectionNo);

              return sectionsNotFound?.length
                ? { assign, sections: sectionsNotFound }
                : null;
            })
            .filter(Boolean);

          return missingAssignments.length > 0 ? (
            <Alert
              variant="light"
              color="#D0820C"
              title={
                <p className="font-medium">
                  <span className="font-bold text-amber-600 acerSwift:max-macair133:text-b3">
                    The following assignments were not found in the selected
                    sections:
                  </span>
                </p>
              }
              icon={
                <Icon
                  IconComponent={IconExclamationCircle}
                  className="text-amber-500"
                />
              }
              classNames={{
                icon: "size-6",
                root: "bg-amber-50 border border-amber-100 rounded-xl",
              }}
              className="mb-5 -mt-2"
            >
              <ul className="list-disc pl-5 acerSwift:max-macair133:text-b3 font-medium text-gray-700">
                {missingAssignments.map(({ assign, sections }: any) => (
                  <li key={assign}>
                    <span className="text-amber-600 font-semibold">
                      {assign}
                    </span>{" "}
                    not found in Section
                    {sections.length > 1 ? "s" : ""} {sections.join(", ")}
                  </li>
                ))}
              </ul>
            </Alert>
          ) : null;
        })()}

        <div className="-mt-1 gap-2 flex flex-col mb-6 ">
          <p className="text-b2 acerSwift:max-macair133:text-b3 mb-1 font-semibold text-secondary">
            Select section to publish
          </p>
          {/* Chip */}
          <div className="ipad11:max-acerSwift:max-h-[130px] acerSwift:max-h-[150px] h-full overflow-y-auto">
            {course?.sections.length! > 1 && (
              <Chip
                className="mb-3"
                classNames={{
                  label:
                    "text-b3 acerSwift:max-macair133:text-b4 text-default font-semibold translate-y-[3px]",
                }}
                size="md"
                checked={
                  form.getValues().sections.length === course?.sections.length
                }
                onChange={() => {
                  if (
                    form.getValues().sections.length === course?.sections.length
                  ) {
                    form.setFieldValue("sections", []);
                  } else {
                    const allSec =
                      course?.sections?.map((sec) =>
                        sec.sectionNo!.toString()
                      ) || [];
                    form.setFieldValue("sections", allSec);
                  }
                }}
              >
                All Sections
              </Chip>
            )}
            <Chip.Group
              {...form.getInputProps("sections")}
              multiple
              value={form.getValues().sections.map((sec) => sec.toString())}
              onChange={(event) => {
                form.setFieldValue("sections", event);
              }}
            >
              <Group className="flex gap-3">
                {course?.sections.map((sec) => (
                  <Chip
                    key={sec.id}
                    classNames={{
                      root: "h-8 min-w-[114px] text-center justify-center items-center",
                      label:
                        "text-b3 acerSwift:max-macair133:text-b4 text-default font-semibold translate-y-[3px] ",
                    }}
                    size="md"
                    value={sec.sectionNo?.toString()}
                  >
                    Section {getSectionNo(sec.sectionNo)}
                  </Chip>
                ))}
              </Group>
            </Chip.Group>
          </div>
        </div>

        {isUploadScore && (
          <div className="flex flex-col gap-5">
            <Alert
              variant="light"
              color="blue"
              title={
                <p className="mt-[2px] acerSwift:max-macair133:text-b3 text-blue-700">
                  Don't want to publish now?{" "}
                  <span className="text-blue-600 font-medium">
                    No problem! Your scores are saved and you can publish them
                    later from the Scores menu
                  </span>
                </p>
              }
              icon={<Icon IconComponent={IconInfo2} />}
              classNames={{
                icon: "size-6",
                root: "bg-blue-50 border border-blue-100 rounded-xl text-blue-700",
              }}
            ></Alert>
            <Alert
              variant="light"
              color="gray"
              title={
                <p className="mt-[2px] text-gray-600 font-medium">
                  Publishing score will make them visible to students in the
                  selected section.
                </p>
              }
              classNames={{
                root: "bg-gray-50 border border-gray-100 rounded-xl",
              }}
              className="mb-5"
            />
          </div>
        )}
        <div className="flex gap-2 justify-end w-full mt-2">
          {isUploadScore ? (
            <Button
              onClick={() => {
                onClosePublishModal();
              }}
              variant="subtle"
            >
              Publish Later
            </Button>
          ) : (
            <Button
              onClick={() => {
                setOpenSelectSecModal(false);
                setOpenPublishScoreModal(true);
              }}
              variant="subtle"
            >
              Back
            </Button>
          )}
          <Button
            onClick={onClickPublishScore}
            disabled={!form.getValues().sections.length}
          >
            <div className="flex gap-2 items-center acerSwift:max-macair133:text-b5">
              <Icon
                IconComponent={IconEyePublish}
                className="size-5 acerSwift:max-macair133:size-4 -ml-1"
              />

              <span> Publish Scores</span>
            </div>{" "}
          </Button>
        </div>
      </Modal>
    </>
    // for orange
    //  classNames={{
    //             icon: "size-6",
    //             body: " flex justify-center",
    //             root: "border border-amber-200 rounded-xl",
    //           }}
  );
}
