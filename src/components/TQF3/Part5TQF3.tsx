import { Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IModelCourse } from "@/models/ModelCourse";
import { IModelTQF3Part5 } from "@/models/ModelTQF3";
import { isEqual } from "lodash";
import { useEffect } from "react";

type Props = {
  data: IModelCourse;
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function Part5TQF3({ data, setForm }: Props) {
  const form = useForm({
    mode: "controlled",
    initialValues: {
      mainRef: "",
      recDoc: "",
    } as IModelTQF3Part5,
    onValuesChange(values, previous) {
      if (!isEqual(values, previous)) {
        setForm(form);
      }
    },
  });

  useEffect(() => {
    if (data.TQF3?.part5) {
      form.setValues(data.TQF3.part5);
    }
  }, [data]);

  return (
    <>
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
            Recommended Documents
            <br /> e.g. Lecture notes, E-documents, etc.
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
