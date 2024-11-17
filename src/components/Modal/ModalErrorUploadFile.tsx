import { Alert, Button, Modal } from "@mantine/core";
import Icon from "../Icon";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconBan from "@/assets/icons/ban.svg?react";

type Props = {
  type: "students" | "scores";
  opened: boolean;
  onClose: () => void;
  errorStudentId?: { name: string; cell: string[] }[] | string[];
  errorSection?: string[];
  errorPoint?: { name: string; cell: string[] }[];
  errorStudent?: {
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
      // classNames={{ title: "text-delete"}}
      transitionProps={{

        // duration: 1000,
  
      }}
      centered
      size="40vw"
      withCloseButton={false}
    >
      {!errorPoint?.length &&
        !errorStudentId?.length &&
        !errorSection?.length &&
        !errorStudent?.length && (
          <div>upload score for Gradescope template is coming soon</div>
        )}
      {!!errorStudent?.length ? (
        <div className="flex flex-col gap-2">
          {errorStudent?.map((item) => (
            <div>
              <span>
                {item.student}:{" "}
                <span className="text-[#d44c4c]">
                  {item.sectionNotMatch && "Section not match"}
                </span>
                {item.sectionNotMatch && item.studentIdNotMatch && ", "}
                <span className="text-[#4c79d4]">
                  {item.studentIdNotMatch && "Student ID not match"}
                </span>
              </span>
            </div>
          ))}
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
                {" "}
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
                      <p className="ml-8 font-semibold ">Sheet: {item.name}</p>
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
      <Button
        onClick={() => onClose()}
        className="mt-4 min-w-fit !h-[36px] !text-[14px] !w-full"
      >
        OK
      </Button>
    </Modal>
  );
}
