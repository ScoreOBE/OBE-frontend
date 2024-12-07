import { useEffect, useState } from "react";
import maintenace from "@/assets/image/maintenance.jpg";
import unplug from "@/assets/image/unplug.png";
import { useAppDispatch, useAppSelector } from "@/store";
import { Button, Table, TextInput } from "@mantine/core";
import Icon from "../Icon";
import IconEdit from "@/assets/icons/edit.svg?react";
import IconCheck2 from "@/assets/icons/Check2.svg?react";
import { METHOD_TQF5 } from "@/helpers/constants/enum";
import { useForm } from "@mantine/form";
import { IModelTQF5Part3 } from "@/models/ModelTQF5";
import { updatePartTQF5 } from "@/store/tqf5";
import { isEqual, cloneDeep } from "lodash";
import { initialTqf5Part3 } from "@/helpers/functions/tqf5";
import { IModelTQF3 } from "@/models/ModelTQF3";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
  tqf3: IModelTQF3;
};

export default function Part3TQF5({ setForm, tqf3 }: Props) {
  const tqf5 = useAppSelector((state) => state.tqf5);
  const dispatch = useAppDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const form = useForm({
    mode: "controlled",
    initialValues: { data: [] as IModelTQF5Part3[] },
    validateInputOnBlur: true,
    onValuesChange(values, previous) {
      if (!isEqual(values, previous)) {
        dispatch(
          updatePartTQF5({ part: "part3", data: cloneDeep(form.getValues()) })
        );
        setForm(form);
      }
    },
  });
  useEffect(() => {
    if (tqf5.part3) {
      form.setValues(cloneDeep(tqf5.part3));
    } else if (tqf3.part2) {
      form.setValues(initialTqf5Part3(tqf3.part2.clo));
    }
  }, [tqf5.method]);

  return tqf5.part2?.updatedAt ? (
    tqf5.method == METHOD_TQF5.MANUAL ? (
      <div className="flex w-full flex-col text-[15px] max-h-full gap-2 text-default ">
        <div className="flex flex-col w-full text-secondary gap-4">
          <div className="flex text-secondary items-center justify-between flex-row gap-1 text-[15px]">
            <p className="font-bold">
              Score Range 0 - 4<span className="ml-1 text-red-500">*</span>
            </p>
            <div className="flex gap-2">
              <Button
                leftSection={
                  <Icon
                    IconComponent={isEdit ? IconCheck2 : IconEdit}
                    className="size-4"
                  />
                }
                className="font-bold"
                color={isEdit ? "#0eb092" : "#ee933e"}
                onClick={() => setIsEdit(!isEdit)}
              >
                {isEdit ? "Done" : "Edit"}
              </Button>
            </div>
          </div>
          <div
            className="overflow-x-auto w-full h-fit bg max-h-full border flex flex-col rounded-lg border-secondary"
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
            }}
          >
            <Table stickyHeader striped>
              <Table.Thead>
                <Table.Tr className="bg-[#e5e7f6]">
                  <Table.Th>No.</Table.Th>
                  <Table.Th>CLO Description</Table.Th>
                  <Table.Th className="text-nowrap">Score 0</Table.Th>
                  <Table.Th className="text-nowrap">Score 1</Table.Th>
                  <Table.Th className="text-nowrap">Score 2</Table.Th>
                  <Table.Th className="text-nowrap">Score 3</Table.Th>
                  <Table.Th className="text-nowrap">Score 4</Table.Th>
                  <Table.Th className="w-[10%]">Number of Student</Table.Th>
                  <Table.Th>Average</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {form.getValues().data?.map((item, index) => {
                  const clo = tqf3.part2?.clo.find((e) => e.id == item.clo);
                  const data = Object.values(item)
                    .slice(1)
                    .map((e: any) => parseInt(e));
                  const total = data.reduce((a, b: any) => a + b, 0);
                  const avg =
                    total > 0
                      ? (0 * item.score0 +
                          1 * item.score1 +
                          2 * item.score2 +
                          3 * item.score3 +
                          4 * item.score4) /
                        total
                      : 0;
                  return (
                    <Table.Tr
                      className="font-medium text-default text-[13px]"
                      key={item.clo as string}
                    >
                      <Table.Td>{clo?.no}</Table.Td>
                      <Table.Td>
                        <div>
                          <p>{clo?.descTH}</p>
                          <p>{clo?.descEN}</p>
                        </div>
                      </Table.Td>
                      {Object.keys(item)
                        .slice(1)
                        .map((key) => (
                          <Table.Td key={key} className="text-end">
                            {isEdit ? (
                              <TextInput
                                size="xs"
                                {...form.getInputProps(`data.${index}.${key}`)}
                              />
                            ) : (
                              (item as any)[key] ?? "-"
                            )}
                          </Table.Td>
                        ))}
                      <Table.Td className="text-end">{total}</Table.Td>
                      <Table.Td className="text-end">{avg.toFixed(2)}</Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </div>
        </div>
      </div>
    ) : (
      <div className="flex px-16 sm:max-ipad11:px-8 flex-row items-center justify-between h-full">
        <div className="h-full  justify-center flex flex-col">
          <p className="text-secondary text-[21px] font-semibold">
            TQF 5 is coming soon to{" "}
            <span className="font-[600] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
              ScoreOBE +{" "}
            </span>{" "}
          </p>
          <br />
          <p className=" -mt-3 mb-6 text-b2 break-words font-medium leading-relaxed">
            Instructors, get ready to experience a new and improved way to
            complete TQF 5 <br /> starting February 2025.
          </p>
        </div>
        <img className=" z-50  w-[25vw] " src={maintenace} alt="loginImage" />
      </div>
    )
  ) : (
    <div className="flex px-16  w-full ipad11:px-8 sm:px-2  gap-5  items-center justify-between h-full">
      <div className="flex justify-center  h-full items-start gap-2 flex-col">
        <p className="   text-secondary font-semibold text-[22px] sm:max-ipad11:text-[20px]">
          Complete TQF5 Part 2 First
        </p>
        <p className=" text-[#333333] leading-6 font-medium text-[14px] sm:max-ipad11:text-[13px]">
          To start TQF5 Part 3, please complete and save TQF5 Part 2. <br />{" "}
          Once done, you can continue to do it.
        </p>
      </div>
      <img
        className=" z-50 ipad11:w-[380px] sm:w-[340px] w-[340px]  macair133:w-[580px] macair133:h-[300px] "
        src={unplug}
        alt="loginImage"
      />
    </div>
  );
}
