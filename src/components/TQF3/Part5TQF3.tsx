import { Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IModelTQF3Part5 } from "@/models/ModelTQF3";
import { isEqual } from "lodash";
import { useEffect } from "react";
import unplug from "@/assets/image/unplug.png";
import { useAppDispatch, useAppSelector } from "@/store";
import { updatePartTQF3 } from "@/store/tqf3";
import { useSearchParams } from "react-router-dom";
import { PartTopicTQF3 } from "@/helpers/constants/TQF3.enum";

type Props = {
  setForm?: React.Dispatch<React.SetStateAction<any>>;
};

export default function Part5TQF3({ setForm = () => {} }: Props) {
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [params, setParams] = useSearchParams({});
  const tqf3 = useAppSelector((state) => state.tqf3);
  const disabled =
    tqf3.courseSyllabus ||
    (parseInt(params.get("year") || "") !== academicYear.year &&
      parseInt(params.get("semester") || "") !== academicYear.semester);
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
    if (tqf3.courseSyllabus) return;
    if (tqf3.part5) {
      form.setValues(tqf3.part5);
    } else {
      dispatch(updatePartTQF3({ part: "part5", data: form.getValues() }));
    }
    setForm(form);
  }, []);

  return tqf3?.part4?.updatedAt ? (
    !tqf3.courseSyllabus ? (
      <>
        <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 pb-5  ">
          <div className="flex text-secondary flex-col text-[15px]  acerSwift:max-macair133:!text-b3">
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
                input: `h-[150px] p-3 acerSwift:max-macair133:!text-b4 ${
                  disabled && "!cursor-default"
                }`,
                label: "text-default acerSwift:max-macair133:!text-b4",
              }}
              disabled={disabled}
              {...form.getInputProps("mainRef")}
            ></Textarea>
          </div>
        </div>
        <div className="w-full justify-between h-fit  items-top  grid grid-cols-3 pt-5 pb-6 border-b-[1px] ">
          <div className="flex text-secondary flex-col text-[15px] acerSwift:max-macair133:!text-b3">
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
                input: `h-[150px] p-3 acerSwift:max-macair133:!text-b4 ${
                  disabled && "!cursor-default"
                }`,
                label: "text-default acerSwift:max-macair133:!text-b4",
              }}
              disabled={disabled}
              {...form.getInputProps("recDoc")}
            ></Textarea>
          </div>
        </div>
      </>
    ) : (
      <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mt-6">
      {/* Header */}
      <div className="bg-[#1f69f3] text-white px-8 py-6 iphone:max-sm:px-4 iphone:max-sm:py-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4c8af5] rounded-full opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#0d4ebc] rounded-full opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        <h2 className="text-xl iphone:max-sm:text-lg font-bold relative z-10">{PartTopicTQF3.part5}</h2>
      </div>

      {/* Content */}
      <div className="divide-y divide-gray-100">
        {/* Main Reference */}
        <div className="p-6 iphone:max-sm:p-4 hover:bg-blue-50/30 transition-all duration-300">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-2/5">
              <div className="flex items-start gap-3">
                
                <div>
                <h3 className="font-semibold text-gray-800 flex items-center iphone:max-sm:text-[14px]">
              <span className="inline-block w-1.5 h-5 iphone:max-sm:h-4 bg-[#1f69f3] rounded-sm mr-2"></span>
              ตำราและเอกสาร
            </h3>
            <p className="text-sm iphone:max-sm:text-[12px] text-gray-500 ml-3.5">
             Main Reference
            </p>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-3/5">
              <div className="py-3 px-4 bg-[#1f69f3]/5 rounded-lg border-l-2 border-[#1f69f3]">
                <p className="text-gray-800 font-medium iphone:max-sm:text-[12px]">
                  {tqf3?.part5?.mainRef.length ? tqf3?.part5?.mainRef : "None"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Documents */}
        <div className="p-6 iphone:max-sm:p-4 hover:bg-blue-50/30 transition-all duration-300">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-2/5">
              <div className="flex items-start gap-3">
               
                <div>
                <h3 className="font-semibold text-gray-800 flex items-center iphone:max-sm:text-[14px]">
                <span className="inline-block w-1.5 h-5 iphone:max-sm:h-4 bg-[#1f69f3] rounded-sm mr-2"></span>เอกสารแนะนำ</h3>
                <p className="text-sm iphone:max-sm:text-[12px] text-gray-500 ml-3.5">Recommended Documents</p>
                 
                </div>
              </div>
            </div>
            <div className="w-full sm:w-3/5">
              <div className="py-3 px-4 bg-[#1f69f3]/5 rounded-lg border-l-2 border-[#1f69f3]">
                <p className="text-gray-800 font-medium iphone:max-sm:text-[12px]">
                  {tqf3?.part5?.recDoc.length ? tqf3?.part5?.recDoc : "None"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  ) : (
    <div className="flex px-16  w-full ipad11:px-8 sm:px-2  gap-5  items-center justify-between h-full">
      <div className="flex justify-center  h-full items-start gap-2 flex-col">
        <p className="   text-secondary font-semibold text-[22px] sm:max-ipad11:text-[20px]">
        TQF 3 Part 4 is required to continue
        </p>
        <p className=" text-[#333333] leading-6 font-medium text-[14px] sm:max-ipad11:text-[13px]">
          To start TQF 3 Part 5, please complete and save TQF 3 Part 4. <br />{" "}
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
