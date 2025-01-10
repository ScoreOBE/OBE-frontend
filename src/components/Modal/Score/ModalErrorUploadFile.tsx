import { Alert, Button, Modal } from "@mantine/core";
import Icon from "../../Icon";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconBan from "@/assets/icons/ban.svg?react";

type Props = {
  type: "students" | "scores" | "grade";
  opened: boolean;
  onClose: () => void;
  errorStudentId?: { name: string; cell: string[] }[] | string[];
  errorSection?: string[];
  errorSectionNoStudents?: string[];
  errorPoint?: { name: string; cell: string[] }[];
  errorStudent?: {
    studentId: string;
    student: string;
    studentIdNotMatch: boolean;
    sectionNotMatch: boolean;
  }[];
};

export default function ModalErrorUploadFile({
  type,
  opened,
  onClose,
  errorStudentId,
  errorSection,
  errorSectionNoStudents,
  errorPoint,
  errorStudent,
}: Props) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={false}
      title={
        <div className="flex gap-2 mb-1 items-center">
          <Icon IconComponent={IconBan} className="size-6 " />
          File was rejected
        </div>
      }
      transitionProps={
        {
          // duration: 1000,
        }
      }
      centered
      size="43vw"
      withCloseButton={false}
    >
      <div className="h-fit max-h-[500px] w-full mb-10 overflow-y-auto">
        {!!errorSectionNoStudents?.length && (
          <div className="flex flex-col gap-2">
            <Alert
              radius="md"
              variant="light"
              color="red"
              className="mb-3"
              classNames={{
                body: " flex justify-center",
              }}
              title={
                <div className="flex items-center  gap-2">
                  <Icon IconComponent={IconExclamationCircle} />
                  <p>The following section is not included in this course.</p>
                </div>
              }
            >
              {" "}
              <p className="ml-8 font-medium ">
                Section: {errorSectionNoStudents.join(", ")}
              </p>
            </Alert>
          </div>
        )}
        {!!errorStudent?.length ? (
          <div className="flex flex-col gap-4">
            {/* Section Not Match */}
            {errorStudent?.filter((item) => item.sectionNotMatch).length >
              0 && (
              <div>
                <Alert
                  radius="md"
                  variant="light"
                  color="red"
                  classNames={{
                    body: " flex justify-center",
                  }}
                  title={
                    <div className="flex items-center  gap-2">
                      <Icon IconComponent={IconExclamationCircle} />
                      <p>
                        The following students do not match section in Course
                        Roster
                      </p>
                    </div>
                  }
                >
                  <div className="gap-2 flex flex-col">
                    {errorStudent
                      ?.filter((item) => item.sectionNotMatch)
                      .map((item) => (
                        <div
                          key={`section-${item.student}`}
                          className="gap-2 ml-8"
                        >
                          <div className="flex gap-1 items-center">
                            <div className="font-medium">
                              {item.studentId} -{" "}
                            </div>
                            <div className="font-medium"> {item.student}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </Alert>
              </div>
            )}

            {/* Student ID Not Match */}
            {errorStudent?.filter((item) => item.studentIdNotMatch).length >
              0 && (
              <div>
                <Alert
                  radius="md"
                  variant="light"
                  color="red"
                  classNames={{
                    body: " flex justify-center",
                  }}
                  title={
                    <div className="flex items-center  gap-2">
                      <Icon IconComponent={IconExclamationCircle} />
                      <p>
                        The following students do not match student IDs in
                        Course Roster
                      </p>
                    </div>
                  }
                >
                  <div className="gap-2 flex flex-col">
                    {errorStudent
                      ?.filter((item) => item.studentIdNotMatch)
                      .map((item) => (
                        <div
                          key={`section-${item.student}`}
                          className="gap-2 ml-8"
                        >
                          <div className="flex gap-1 items-center">
                            <div className="font-medium">
                              {item.studentId} -{" "}
                            </div>
                            <div className="font-medium"> {item.student}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </Alert>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {!!errorSection?.length && (
              <>
                <Alert
                  radius="md"
                  variant="light"
                  color="red"
                  classNames={{
                    body: " flex justify-center",
                  }}
                  title={
                    <div className="flex items-center  gap-2">
                      <Icon IconComponent={IconExclamationCircle} />
                      <p>
                        The following section does not exist in this course{" "}
                        {type == "scores" && "or you cannot access"}
                      </p>
                    </div>
                  }
                >
                  <p className="ml-8 font-semibold">
                    Section: {errorSection.join(", ")}
                  </p>
                </Alert>
              </>
            )}
            {!!errorStudentId?.length &&
              ((errorStudentId[0] as any).name ? (
                <div>
                  <Alert
                    radius="md"
                    variant="light"
                    color="red"
                    classNames={{
                      body: " flex justify-center",
                    }}
                    title={
                      <div className="flex items-center  gap-2">
                        <Icon IconComponent={IconExclamationCircle} />
                        <p>The Student ID do not match the format</p>
                      </div>
                    }
                  >
                    {errorStudentId.map((item: any) => (
                      <div className="leading-6">
                        <p className="ml-8 font-semibold ">
                          Sheet: {item.name}
                        </p>
                        <p className="ml-12 font-medium">
                          Cell: {item.cell.join(", ")}
                        </p>
                        <p className="ml-8 mt-3 text-teal-600 font-semibold ">
                          {" "}
                          Expect Format: The Student ID must consist of only 9
                          digits.
                        </p>
                      </div>
                    ))}
                  </Alert>
                </div>
              ) : (
                <div>
                  <Alert
                    radius="md"
                    variant="light"
                    color="red"
                    classNames={{
                      body: " flex justify-center",
                    }}
                    title={
                      <div className="flex items-center  gap-2">
                        <Icon IconComponent={IconExclamationCircle} />
                        <p>The Student ID do not match the format</p>
                      </div>
                    }
                  >
                    {errorStudentId.map((item: any) => (
                      <div className="leading-6">
                        <p className="ml-12 font-medium">
                          Cell: {errorStudentId.join(", ")}
                        </p>
                        <p className="ml-8 mt-3 text-teal-600 font-semibold ">
                          {" "}
                          Expect Format: The Student ID must consist of only 9
                          digits.
                        </p>
                      </div>
                    ))}
                  </Alert>
                </div>
              ))}
            {!!errorPoint?.length && (
              <div>
                <Alert
                  radius="md"
                  variant="light"
                  color="red"
                  classNames={{
                    body: " flex justify-center",
                  }}
                  title={
                    <div className="flex items-center  gap-2">
                      <Icon IconComponent={IconExclamationCircle} />
                      <p>The Scores do not match the format</p>
                    </div>
                  }
                >
                  {errorPoint.map((item) => (
                    <div>
                      <p className="ml-8 font-semibold ">Sheet: {item.name}</p>
                      <p className="ml-12 font-medium">
                        Cell: {item.cell.join(", ")}
                      </p>
                      <p className="ml-8 mt-3 text-teal-600 font-semibold ">
                        Expect Format: The Scores must be numberic only, and may
                        include decimals
                      </p>
                    </div>
                  ))}
                </Alert>
              </div>
            )}
          </div>
        )}
        <div className="flex fixed flex-1 right-7 bottom-2 text-center  justify-center ">
          <Button
            onClick={() => onClose()}
            className="mt-4 !h-[36px] mb-2 !text-[14px] !w-full "
          >
            OK
          </Button>
        </div>
      </div>
    </Modal>
  );
}
