import { useEffect, useState } from "react";
import { genPdfTQF3 } from "@/services/tqf3/tqf3.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { setLoadingOverlay } from "@/store/loading";
import scoreobe from "@/assets/image/scoreOBElogobold.png";
import { setShowSidebar, setShowNavbar } from "@/store/config";
import LoadingOverlay from "@/components/Loading/LoadingOverlay";

export default function CourseSyllabusPDF() {
  const { tqf3 } = useParams();
  const [searchParams] = useSearchParams();
  const courseNo = searchParams.get("courseNo");
  const year = searchParams.get("year");
  const semester = searchParams.get("semester");
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const [pdfString, setPdfString] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setShowSidebar(false));
    dispatch(setShowNavbar(false));
  }, []);

  useEffect(() => {
    if (tqf3?.length && courseNo && year && semester) {
      getCourseSyllabusPDF();
    }
  }, [tqf3, courseNo, year, semester]);

  const getCourseSyllabusPDF = async () => {
    dispatch(setLoadingOverlay(true));
    const payload: any = {
      courseNo,
      academicYear: year,
      academicTerm: semester,
      tqf3,
      oneFile: true,
      display: true,
      part1: "",
      part2: "",
      part3: "",
      part4: "",
      part5: "",
      part6: "",
    };
    const res = await genPdfTQF3(payload);
    if (res) {
      const contentType = res.headers["content-type"];
      const blob = new Blob([res.data], { type: contentType });
      const url = URL.createObjectURL(blob);
      setPdfString(url);
    }
    dispatch(setLoadingOverlay(false));
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      {loading ? (
        <LoadingOverlay />
      ) : pdfString ? (
        <iframe
          src={pdfString}
          width="100%"
          height="100%"
          style={{ border: "none" }}
        ></iframe>
      ) : (
        <div className="flex items-center justify-center h-full w-full gap-24 bg-sky-50">
          <div className=" flex  gap-8">
            <img src={scoreobe} alt="cpeLogo" className=" size-16 mt-[6px]" />
            <p className="!font-[600] -ml-5 text-center drop-shadow-xl  px-[12px]  sm:font-[600] item-start rounded text-emphasize sm:text-[48px] text-[32px]   ">
              <span className=" !drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                ScoreOBE+{" "}
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-[24px] font-semibold text-gray-800">
              Oops! {courseNo} Course Syllabus Not Available
            </h2>

            <p className="text-gray-600">
              We couldn't find the document for course{" "}
              <span className="font-medium">{courseNo}</span>({semester}/{" "}
              {year?.slice()})
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
