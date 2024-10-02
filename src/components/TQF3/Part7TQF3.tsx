import { Checkbox, Button, Alert, Table } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheckbox } from "@tabler/icons-react";
import Icon from "../Icon";
import IconPLO from "@/assets/icons/PLOdescription.svg?react";
import DrawerPLOdes from "@/components/DrawerPLO";
import { useEffect, useState } from "react";
import { IModelTQF3Part7 } from "@/models/ModelTQF3";
import { IModelPLO } from "@/models/ModelPLO";
import { getPLOs } from "@/services/plo/plo.service";
import { useAppDispatch, useAppSelector } from "@/store";
import unplug from "@/assets/image/unplug.png";
import { cloneDeep } from "lodash";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function Part7TQF3({ setForm }: Props) {
  const tqf3 = useAppSelector((state) => state.tqf3);
  const dispatch = useAppDispatch();
  const [openDrawerPLOdes, setOpenDrawerPLOdes] = useState(false);
  const [coursePLO, setCoursePLO] = useState<Partial<IModelPLO>>();
  const user = useAppSelector((state) => state.user);

  const form = useForm({
    mode: "controlled",
    initialValues: { data: [] as IModelTQF3Part7[] },
    validate: {},
  });

  const fetchPLO = async () => {
    const res = await getPLOs({
      role: user.role,
      departmentCode: user.departmentCode,
    });

    if (res) {
      //fixed Data
      const ploCol = res.plos
        .find((dep: any) => dep.departmentCode.includes("CPE"))
        .collections.find((col: any) => col.isActive === true);

      setCoursePLO(ploCol);
    }
  };

  useEffect(() => {
    fetchPLO();
    if (tqf3.part7) {
      form.setFieldValue(
        "data",
        cloneDeep(
          tqf3?.part2?.clo?.map((cloItem) => {
            const item = tqf3.part7?.data.find(({ clo }) => clo == cloItem.id);
            return { clo: cloItem.id, plo: cloneDeep(item?.plo)! };
          })
        ) ?? []
      );
    } else if (tqf3.part2) {
      form.setFieldValue(
        "data",
        cloneDeep(tqf3.part2.clo?.map(({ id }) => ({ clo: id, plo: [] }))) ?? []
      );
    }
  }, []);

  return tqf3?.part5?.updatedAt ? (
    <>
      {coursePLO && (
        <DrawerPLOdes
          opened={openDrawerPLOdes}
          onClose={() => setOpenDrawerPLOdes(false)}
          data={coursePLO!}
        />
      )}

      <div className="flex flex-col w-full max-h-full gap-4 -mt-1 pb-4">
        {/* Topic */}
        <div className="flex text-secondary items-center w-full justify-between">
          <span className="text-[15px] font-semibold">
            CLO Mapping
            <span className=" text-red-500">*</span>
          </span>
          <Button
            className="text-center px-4"
            onClick={() => setOpenDrawerPLOdes(true)}
          >
            <div className="flex gap-2">
              <Icon IconComponent={IconPLO} />
              PLO Description
            </div>
          </Button>
        </div>
        <div className="w-full">
          <Alert
            radius="md"
            icon={<IconCheckbox />}
            variant="light"
            color="rgba(6, 158, 110, 1)"
            classNames={{
              icon: "size-6",
              body: " flex justify-center",
            }}
            className="w-full"
            title={
              <p className="font-semibold">
                Each CSO must be linked to at least one PLO.
              </p>
            }
          ></Alert>
        </div>

        {/* Table */}
        <div
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
          className=" overflow-x-auto w-full h-full max-h-full border flex flex-col rounded-lg border-secondary relative"
        >
          <Table stickyHeader striped>
            <Table.Thead className="z-[2]">
              <Table.Tr>
                <Table.Th
                  style={{
                    filter: "drop-shadow(2px 0px 2px rgba(0, 0, 0, 0.1))",
                  }}
                  className="min-w-[500px] sticky left-0 !p-0"
                >
                  <div className="w-full flex items-center px-[25px] h-[58px] border-r-[1px] border-[#DEE2E6]">
                    CLO Description ( {tqf3.part2?.clo.length} CLO
                    {tqf3.part2?.clo.length! > 1 ? "s" : ""} )
                  </div>
                </Table.Th>
                {coursePLO?.data!.map((plo: any) => (
                  <Table.Th key={plo.no} className="min-w-[100px] w-fit">
                    PLO-{plo.no}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {tqf3.part2?.clo.map((clo, indexCLO) => (
                <Table.Tr key={indexCLO} className="text-[13px] text-default">
                  <Table.Td
                    style={{
                      filter: "drop-shadow(2px 0px 2px rgba(0, 0, 0, 0.1))",
                    }}
                    className="!p-0 !py-1 sticky left-0 z-[1]"
                  >
                    <div className="flex gap-5 justify-start  items-center  px-[20px] py-2">
                      <div className="text-secondary min-w-fit font-bold">
                        CLO-{clo?.no}
                      </div>
                      <p className="flex w-fit   font-medium justify-between flex-col ">
                        <span className="mb-2">{clo?.descTH}</span>
                        <span>{clo?.descEN}</span>
                      </p>
                    </div>
                  </Table.Td>
                  {coursePLO?.data!.map((plo: any, index: number) => (
                    <Table.Td key={index}>
                      <div className="flex items-start">
                        <Checkbox
                          size="sm"
                          classNames={{
                            input:
                              "bg-[black] bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                            body: "mr-3 px-0",
                            label: "text-[14px] text-[#615F5F] cursor-pointer",
                          }}
                          onChange={(event) => {
                            if (event.target.checked) {
                              form.insertListItem(`data.${indexCLO}.plo`, plo);
                            } else {
                              form.removeListItem(
                                `data.${indexCLO}.plo`,
                                index
                              );
                            }
                          }}
                        />
                      </div>
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </div>
    </>
  ) : (
    <div className="flex px-16  flex-row items-center justify-between h-full">
      <div className="flex justify-center  h-full items-start gap-2 flex-col">
        <p className="   text-secondary font-semibold text-[18px]">
          Complete TQF3 Part 6 First
        </p>
        <p className=" text-[#333333] leading-6 font-medium text-[14px]">
          To start TQF3 Part 7, please complete and save TQF3 Part 6. <br />{" "}
          Once done, you can continue to do it.
        </p>
      </div>
      <img
        className=" z-50  w-[580px] h-[300px] "
        src={unplug}
        alt="loginImage"
      />
    </div>
  );
}
