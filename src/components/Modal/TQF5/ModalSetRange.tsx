import { Modal, Group, Button } from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { IModelTQF5Part3 } from "@/models/ModelTQF5";
import { useEffect } from "react";
import { IModelTQF3 } from "@/models/ModelTQF3";
import MultiRangeSlider from "@/components/MultiRangeSlider";
import { cloneDeep } from "lodash";

type Props = {
  opened: boolean;
  onClose: () => void;
  tqf3: IModelTQF3;
  tqf5Form: UseFormReturnType<
    { data: IModelTQF5Part3[] },
    (values: { data: IModelTQF5Part3[] }) => { data: IModelTQF5Part3[] }
  >;
};

export default function ModalSetRange({
  opened,
  onClose,
  tqf3,
  tqf5Form,
}: Props) {
  const form = useForm({
    mode: "controlled",
    initialValues: { data: [] as IModelTQF5Part3[] },
    validate: {},
    validateInputOnBlur: true,
  });

  useEffect(() => {
    if (opened) {
      form.setFieldValue("data", cloneDeep(tqf5Form.getValues().data));
    }
  }, [opened]);

  const closeModal = () => {
    onClose();
    form.reset();
  };

  const saveSetRange = async () => {
    tqf5Form.setFieldValue("data", form.getValues().data);
    closeModal();
  };

  return (
    <Modal
      opened={opened}
      onClose={closeModal}
      closeOnClickOutside={false}
      centered
      size="55vw"
      title="Set Range Assessment tool"
      transitionProps={{ transition: "pop" }}
    >
      <div>
        <div className="flex flex-col gap-2 h-fit rounded-lg overflow-y-auto">
          {form.getValues().data.map((cloItem, cloIndex) => {
            const clo = tqf3.part2?.clo.find((e) => e.id == cloItem.clo);
            return (
              <div key={cloIndex} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex justify-between">
                    <div className="text-default flex items-center  font-medium text-[14px]">
                      <p className="text-[16px] text-secondary mr-2 font-semibold">
                        CLO {clo?.no}
                      </p>
                      <div className="flex flex-col ml-2 gap-[2px]">
                        <p>{clo?.descTH}</p>
                        <p>{clo?.descEN}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {cloItem.assess?.map((assess, asIndex) => {
                  const evaluation = tqf3.part3?.eval.find(
                    (e) => e.id === assess.eval
                  );
                  return (
                    <div
                      key={asIndex}
                      className="rounded-md overflow-clip text-[14px] border ml-1"
                    >
                      <div className="bg-bgTableHeader font-semibold text-secondary px-4 py-3 flex flex-col justify-between items-center">
                        <div className="flex w-full justify-between">
                          <div className="flex flex-col gap-[2px]">
                            <p className="text-[15px]">
                              {evaluation?.topicTH} | {evaluation?.topicEN} (
                              {assess.percent} %)
                            </p>
                            <p>
                              Description:
                              {evaluation?.desc?.length ? evaluation.desc : "-"}
                            </p>
                          </div>
                          <p>{assess.fullScore} pts.</p>
                        </div>
                        <MultiRangeSlider
                          min={0}
                          max={assess.fullScore}
                          step={0.05}
                          defaultValues={[
                            assess.range0,
                            assess.range1,
                            assess.range2,
                            assess.range3,
                          ]}
                          onChange={(event) =>
                            form.setFieldValue(
                              `data.${cloIndex}.assess.${asIndex}`,
                              {
                                ...form.getValues().data[cloIndex].assess[
                                  asIndex
                                ],
                                range0: event[0],
                                range1: event[1],
                                range2: event[2],
                                range3: event[3],
                              }
                            )
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 mt-5  items-end  justify-end h-fit">
          <Group className="flex w-full gap-2 h-fit items-end justify-end">
            <Button onClick={closeModal} variant="subtle">
              Cancel
            </Button>
            <Button onClick={saveSetRange}>Done</Button>
          </Group>
        </div>
      </div>
    </Modal>
  );
}
