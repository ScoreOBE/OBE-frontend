import { Modal } from "@mantine/core";

type Props = {
  type: "students" | "scores";
  opened: boolean;
  onClose: () => void;
  errorStudentId: { name: string; cell: string[] }[] | string[];
  errorSection?: string[];
  errorPoint?: { name: string; cell: string[] }[];
};

export default function ModalErrorUploadFile({
  type,
  opened,
  onClose,
  errorStudentId,
  errorSection,
  errorPoint,
}: Props) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={true}
      title="Error upload score"
      transitionProps={{ transition: "pop" }}
      centered
    >
      <div className="flex flex-col gap-5">
        {!!errorSection?.length && (
          <>
            <p>
              following section does not exist in this course{" "}
              {type == "scores" && "or your cannot access"}
            </p>
            <p>Section: {errorSection.join(", ")}</p>
          </>
        )}
        {!!errorStudentId.length &&
          ((errorStudentId[0] as any).name ? (
            <div>
              <p className="font-semibold">Student ID</p>
              {errorStudentId.map((item: any) => (
                <div>
                  <p className="font-medium">Sheet: {item.name}</p>
                  <p>Cell: {item.cell.join(", ")}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Student ID: {errorStudentId.join(", ")}</p>
          ))}
        {!!errorPoint?.length && (
          <div>
            <p className="font-semibold">Scores</p>
            {errorPoint.map((item) => (
              <div>
                <p className="font-medium">Sheet: {item.name}</p>
                <p>Point: {item.cell.join(", ")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
