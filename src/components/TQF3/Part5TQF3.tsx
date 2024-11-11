import { Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IModelTQF3Part5 } from "@/models/ModelTQF3";
import { isEqual } from "lodash";
import { useEffect } from "react";
import unplug from "@/assets/image/unplug.png";
import { useAppDispatch, useAppSelector } from "@/store";
import { updatePartTQF3 } from "@/store/tqf3";
import { useSearchParams } from "react-router-dom";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function Part5TQF3({ setForm }: Props) {
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [params, setParams] = useSearchParams({});
  const disabled =
    parseInt(params.get("year") || "") !== academicYear.year &&
    parseInt(params.get("semester") || "") !== academicYear.semester;
  const tqf3 = useAppSelector((state) => state.tqf3);
  const dispatch = useAppDispatch();
  const form = useForm({
    mode: "controlled",
    initialValues: {
      mainRef: "",
      recDoc: "",
    } as IModelTQF3Part5,
    onValuesChange(values, previous) {
      if (!isEqual(values, previous)) {
        dispatch(updatePartTQF3({ part: "part5", data: form.getValues() }));
        setForm(form);
      }
    },
  });

  useEffect(() => {
    if (tqf3.part5) {
      form.setValues(tqf3.part5);
    } else {
      dispatch(updatePartTQF3({ part: "part5", data: form.getValues() }));
      setForm(form);
    }
  }, []);

  return tqf3?.part4?.updatedAt ? (
    <>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 pb-5  ">
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
            className="w-[500px]"
            classNames={{
              input: `h-[150px] p-3 ${disabled && "!cursor-default"}`,
              label: "text-default",
            }}
            disabled={disabled}
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
            className="w-[500px]"
            classNames={{
              input: `h-[150px] p-3 ${disabled && "!cursor-default"}`,
              label: "text-default",
            }}
            disabled={disabled}
            {...form.getInputProps("recDoc")}
          ></Textarea>
        </div>
      </div>
    </>
  ) : (
    <div className="flex px-16  w-full ipad11:px-8 sm:px-2  gap-5  items-center justify-between h-full">
      <div className="flex justify-center  h-full items-start gap-2 flex-col">
        <p className="   text-secondary font-semibold text-[22px] sm:max-ipad11:text-[20px]">
          Complete TQF3 Part 4 First
        </p>
        <p className=" text-[#333333] leading-6 font-medium text-[14px] sm:max-ipad11:text-[13px]">
          To start TQF3 Part 5, please complete and save TQF3 Part 4. <br />{" "}
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
