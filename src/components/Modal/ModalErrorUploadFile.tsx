import { Modal } from "@mantine/core";

type Props = {
  opened: boolean;
  onClose: () => void;
  errorStudentId: string[];
  errorPoint?: string[];
};

export default function ModalErrorUploadFile({
  opened,
  onClose,
  errorStudentId,
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
      <div>
        {!!errorStudentId.length && (
          <p>Student ID: {errorStudentId.join(", ")}</p>
        )}
        {!!errorPoint?.length && <p>Point: {errorPoint.join(", ")}</p>}
      </div>
    </Modal>
  );
}
