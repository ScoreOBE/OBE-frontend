import { Modal, Alert, MultiSelect, Group, Button, Table } from "@mantine/core";
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
      size="70vw"
      title="Evaluation Mapping"
      transitionProps={{ transition: "pop" }}
    >
      <div>
        <Alert
          radius="md"
          icon={<Icon IconComponent={IconInfo2} />}
          variant="light"
          color="blue"
          className="mb-3"
          classNames={{
            icon: "size-6",
            body: " flex justify-center",
          }}
          title={
            <p>
            Each Course Evluation must be linked to at least one assignment
            </p>
          }
        ></Alert>
        <div className="flex flex-col max-h-[520px] h-fit rounded-lg border overflow-y-auto border-secondary">
          <Table
            verticalSpacing="sm"
            stickyHeader
            className="bg-white   rounded-lg"
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
            striped
          >
            <Table.Thead>
              <Table.Tr className="bg-[#e5e7f6] border-b-[1px] border-secondary">
                <Table.Th className=" w-[40%] items-center justify-center text-start ">
                  From: Course Evaluation
                </Table.Th>
                <Table.Th className="w-[4%]"></Table.Th>
                <Table.Th className="items-center justify-center w-[56%]  text-start">
                  To: Assignment
                </Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody className="justify-center items-center text-center">
              {tqf3?.part3?.eval.map((eva, index) => (
                <Table.Tr
                  className="font-medium text-default text-[13px]"
                  key={eva.id}
                >
                  <Table.Td className="text-start ">
                    <p className="ml-4">{eva.topicTH}</p>
                    <p className="ml-4">{eva.topicEN}</p>
                  </Table.Td>
                  <Table.Td>
                    {" "}
                    <Icon
                      IconComponent={IconArrowMapping}
                      className="text-secondary size-10"
                    />
                  </Table.Td>
                  <Table.Td>
                    <MultiSelect
                      className="w-full"
                      data={assignments?.map((item) => ({
                        value: item.name,
                        label: item.name,
                        disabled: form
                          .getValues()
                          .assignments.flatMap(
                            (assignment) => assignment.assignment
                          )
                          .includes(item.name),
                      }))}
                      classNames={{
                        pill: "bg-secondary text-white font-medium",
                      }}
                      {...form.getInputProps(`assignments.${index}.assignment`)}
                    />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>

        <div className="flex gap-2 mt-5 sm:max-macair133:fixed sm:max-macair133:bottom-6 sm:max-macair133:right-8  items-end  justify-end h-fit">
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
