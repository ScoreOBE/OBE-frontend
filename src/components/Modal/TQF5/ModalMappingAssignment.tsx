import { Modal, Alert, MultiSelect, Group, Button } from "@mantine/core";
import Icon from "@/components/Icon";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import IconArrowMapping from "@/assets/icons/arrowMapping.svg?react";
import { IModelTQF3 } from "@/models/ModelTQF3";
import { useAppDispatch, useAppSelector } from "@/store";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { mappingAssignments } from "@/services/tqf5/tqf5.service";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import { setLoadingOverlay } from "@/store/loading";
import { setAssignmentsMap } from "@/store/tqf5";
import { IModelAssignment } from "@/models/ModelCourse";

type Props = {
  opened: boolean;
  onClose: () => void;
  tqf3: IModelTQF3;
  assignments: IModelAssignment[];
};

export default function ModalMappingAssignment({
  opened,
  onClose,
  tqf3,
  assignments,
}: Props) {
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const tqf5 = useAppSelector((state) => state.tqf5);
  const dispatch = useAppDispatch();

  const form = useForm({
    mode: "controlled",
    initialValues: {
      assignments: [] as { eval: string; assignment: string[] }[],
    },
    validate: {
      assignments: {
        assignment: (value) =>
          value.length == 0 &&
          "Evaluation must be linked to at least one Assignment",
      },
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    if (tqf5.assignmentsMap?.length) {
      form.setFieldValue("assignments", tqf5.assignmentsMap);
    } else if (assignments?.length) {
      form.setFieldValue(
        "assignments",
        tqf3?.part3?.eval.map((assign) => ({
          eval: assign.topicEN,
          assignment: [],
        })) || []
      );
    }
  }, [tqf5.assignmentsMap]);

  const saveMapping = async () => {
    if (!form.validate().hasErrors) {
      dispatch(setLoadingOverlay(true));
      const res = await mappingAssignments(tqf5.id, form.getValues());
      if (res) {
        dispatch(setAssignmentsMap(res));
        showNotifications(
          NOTI_TYPE.SUCCESS,
          "Evaluation Mapping successfully",
          ""
        );
        onClose();
      }
      dispatch(setLoadingOverlay(false));
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={false}
      centered
      size="46vw"
      title="Evaluation Mapping"
      transitionProps={{ transition: "pop" }}
    >
      <div>
        <Alert
          radius="md"
          icon={<Icon IconComponent={IconInfo2} />}
          variant="light"
          color="blue"
          className="mb-5"
          classNames={{
            icon: "size-6",
            body: " flex justify-center",
          }}
          title={
            <p>
              Course Evaluation Topics can be mapped to multiple assignment.
            </p>
          }
        ></Alert>
        <div
          className="bg-white px-5 pt-5 pb-2 rounded-lg"
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className=" text-[15px] rounded-lg w-full h-fit px-8 mb-4 flex justify-between font-semibold text-secondary">
            <p className="text-[#575757]">From: Course Evaluation</p>
            <p className="w-[280px]">To: Assignment</p>
          </div>
          {tqf3?.part3?.eval.map((eva, index) => {
            return (
              <div
                key={eva.id}
                className="bg-[#F3F3F3] rounded-lg w-full h-fit px-8 py-4 mb-4 flex justify-between items-center"
              >
                <div className="text-[13px] w-[30%]">
                  <p>{eva.topicTH}</p>
                  <p>{eva.topicEN}</p>
                </div>
                <Icon
                  IconComponent={IconArrowMapping}
                  className="text-[#9C9C9C]"
                />
                <MultiSelect
                  className="w-[280px]"
                  data={assignments?.map((item) => ({
                    value: item.name,
                    label: item.name,
                    disabled: form
                      .getValues()
                      .assignments.flatMap((item) => item.assignment)
                      .includes(item.name),
                  }))}
                  classNames={{ pill: "bg-secondary text-white font-medium" }}
                  {...form.getInputProps(`assignments.${index}.assignment`)}
                />
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 sm:max-macair133:fixed sm:max-macair133:bottom-6 sm:max-macair133:right-8 items-end  justify-end h-fit mt-4">
          <Group className="flex w-full gap-2 h-fit items-end justify-end">
            <Button onClick={onClose} variant="subtle">
              Cancel
            </Button>
            <Button loading={loading} onClick={saveMapping}>
              Done
            </Button>
          </Group>
        </div>
      </div>
    </Modal>
  );
}
