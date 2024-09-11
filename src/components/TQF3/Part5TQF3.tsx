import { COURSE_TYPE, TEACHING_METHOD } from "@/helpers/constants/enum";
import {
  Radio,
  Checkbox,
  TextInput,
  Textarea,
  Button,
  Alert,
  Table,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheckbox, IconInfoCircle } from "@tabler/icons-react";
import AddIcon from "@/assets/icons/plus.svg?react";
import Icon from "../Icon";
import IconPLO from "@/assets/icons/PLOdescription.svg?react";
import DrawerPLOdes from "@/components/DrawerPLO";
import { useEffect, useState } from "react";
import { IModelCourse } from "@/models/ModelCourse";
import { IModelCLO, IModelTQF3Part5 } from "@/models/ModelTQF3";
import { IModelPLO, IModelPLOCollection, IModelPLONo } from "@/models/ModelPLO";
import { getPLOs } from "@/services/plo/plo.service";
import { useAppSelector } from "@/store";

type Props = {
  data: IModelCourse;
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function Part5TQF3({ data, setForm }: Props) {
  const [openDrawerPLOdes, setOpenDrawerPLOdes] = useState(false);
  const [coursePLO, setCoursePLO] = useState<Partial<IModelPLO>>();
  const user = useAppSelector((state) => state.user);

  // fixed Data
  const courseCLO: IModelCLO[] = [
    {
      id: "kmskx",
      cloNo: 1,
      cloDescTH: "อธิบายหลักการทำงานของระบบปฏิบัติการคอมพิวเตอร์.1",
      cloDescEN:
        "Explain the working principle of computer operating systems the working principle of computer operating systems 1",
    },
    {
      id: "kmskx",
      cloNo: 2,
      cloDescTH: "อธิบายหลักการทำงานของระบบปฏิบัติการคอมพิวเตอร์.2",
      cloDescEN:
        "Explain the working principle of computer operating systems the working principle of computer operating systems 2",
    },
    {
      id: "kmskx",
      cloNo: 3,
      cloDescTH: "อธิบายหลักการทำงานของระบบปฏิบัติการคอมพิวเตอร์.3",
      cloDescEN:
        "Explain the working principle of computer operating systems the working principle of computer operating systems 3",
    },
    {
      id: "kmskx",
      cloNo: 4,
      cloDescTH: "อธิบายหลักการทำงานของระบบปฏิบัติการคอมพิวเตอร์.4",
      cloDescEN:
        "Explain the working principle of computer operating systems the working principle of computer operating systems 4",
    },
    {
      id: "kmskx",
      cloNo: 5,
      cloDescTH: "อธิบายหลักการทำงานของระบบปฏิบัติการคอมพิวเตอร์.5",
      cloDescEN:
        "Explain the working principle of computer operating systems the working principle of computer operating systems 5",
    },
  ];

  const form = useForm({
    mode: "controlled",
    initialValues: {
      data: courseCLO.map((clo) => ({
        clo: clo,
        plo: [],
      })) as IModelTQF3Part5[],
    },
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
    if (data) {
      fetchPLO();
    }
  }, [data]);

  return (
    <>
      {coursePLO && (
        <DrawerPLOdes
          opened={openDrawerPLOdes}
          onClose={() => setOpenDrawerPLOdes(false)}
          data={coursePLO!}
        />
      )}

      <div className="flex flex-col  w-full max-h-full gap-4 pb-6">
        {/* Topic */}
        <div className="flex text-secondary   items-center w-full justify-between">
          <span className="text-[15px] font-bold">
            {"CLO Mapping "}
            <span className=" text-red-500">*</span>
          </span>
          <Button
            className="text-center rounded-[8px] text-[12px] w-fit font-semibold h-8 px-4"
            onClick={() => setOpenDrawerPLOdes(true)}
            color="#5768d5"
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
                <Table.Th className="min-w-[550px] sticky left-0 !p-0">
                  <div className="w-full flex items-center px-[25px] h-[58px] border-r-[1px] border-[#DEE2E6]">
                    CLO Description ( {courseCLO.length} CLO
                    {courseCLO.length > 1 ? "s" : ""} )
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
              {courseCLO.map((clo, indexCLO) => (
                <Table.Tr key={indexCLO} className="text-[13px] text-default">
                  <Table.Td className="!p-0 sticky left-0 z-[1]">
                    <div className="flex flex-col gap-0.5 px-[25px] py-4 border-r-[1px] border-[#DEE2E6]">
                      <p>{clo.cloDescTH}</p>
                      <p>{clo.cloDescEN}</p>
                    </div>
                  </Table.Td>
                  {coursePLO?.data!.map((plo: any, index: number) => (
                    <Table.Td key={index}>
                      <div className="flex items-start">
                        <Checkbox
                          size="xs"
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
  );
}
