import { Modal } from "@mantine/core";

type Props = {
  opened: boolean;
  onClose: () => void;
  errorStudentId: { name: string; cell: string[] }[] | string[];
  errorSection?: string[];
  errorPoint?: { name: string; cell: string[] }[];
};

export default function ModalErrorUploadFile({
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
      <div className="flex flex-col gap-2">
        {!!errorSection?.length && <p>Section: {errorSection.join(", ")}</p>}
        {!!errorStudentId.length && (errorStudentId[0] as any).name ? (
          <div>
            Student ID
            {errorStudentId.map((item: any) => (
              <div>
                <p className="font-semibold">Sheet: {item.name}</p>
                <p>Cell: {item.cell.join(", ")}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Student ID: {errorStudentId.join(", ")}</p>
        )}
        {!!errorPoint?.length && (
          <div>
            {errorPoint.map((item) => (
              <div>
                <p>Sheet: {item.name}</p>
                <p>Point: {item.cell.join(", ")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
