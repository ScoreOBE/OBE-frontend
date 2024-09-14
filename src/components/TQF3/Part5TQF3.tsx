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
      learningMethod: [],
    },
    {
      id: "kmskx",
      cloNo: 2,
      cloDescTH: "อธิบายหลักการทำงานของระบบปฏิบัติการคอมพิวเตอร์.2",
      cloDescEN:
        "Explain the working principle of computer operating systems the working principle of computer operating systems 2",
      learningMethod: [],
    },
    {
      id: "kmskx",
      cloNo: 3,
      cloDescTH: "อธิบายหลักการทำงานของระบบปฏิบัติการคอมพิวเตอร์.3",
      cloDescEN:
        "Explain the working principle of computer operating systems the working principle of computer operating systems 3",
      learningMethod: [],
    },
    {
      id: "kmskx",
      cloNo: 4,
      cloDescTH: "อธิบายหลักการทำงานของระบบปฏิบัติการคอมพิวเตอร์.4",
      cloDescEN:
        "Explain the working principle of computer operating systems the working principle of computer operating systems 4",
      learningMethod: [],
    },
    {
      id: "kmskx",
      cloNo: 5,
      cloDescTH: "อธิบายหลักการทำงานของระบบปฏิบัติการคอมพิวเตอร์.5",
      cloDescEN:
        "Explain the working principle of computer operating systems the working principle of computer operating systems 5",
      learningMethod: [],
    },
  ];

  const form = useForm({
    mode: "controlled",
    initialValues: {
      data: courseCLO.map((clo) => ({
        mainRef: "",
        recDoc: "",
        clo: clo,
        plo: [],
      })) as Partial<IModelTQF3Part5>[],
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
      {/* Part 5 */}
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 pb-5 mt-1 ">
        <div className="flex text-secondary flex-col text-[15px]">
          <p className="font-semibold">ตำราและเอกสาร</p>
          <p className="font-semibold">Main Reference</p>
        </div>

        <div className="flex flex-col gap-3 text-default">
          <Textarea
            key={form.key("mainRef")}
            label="Description"
            size="xs"
            placeholder="(optional)"
            className="w-[440px]"
            classNames={{ input: "h-[150px] p-3", label: "text-default" }}
            {...form.getInputProps("mainRef")}
          ></Textarea>
        </div>
      </div>
      <div className="w-full justify-between h-fit  items-top  grid grid-cols-3 pt-5 pb-6 border-b-[1px] ">
        <div className="flex text-secondary flex-col text-[15px]">
          <p className="font-semibold">เอกสารแนะนำ</p>
          <p className="font-semibold">
            Recommended Documents, e.g. Lecture notes,
            <br />
            E-documents, etc.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-default ">
          <Textarea
            key={form.key("recDoc")}
            label="Description"
            size="xs"
            placeholder="(optional)"
            className="w-[440px]"
            classNames={{ input: "h-[150px] p-3", label: "text-default" }}
            {...form.getInputProps("recDoc")}
          ></Textarea>
        </div>
      </div>
    </>
  );
}
