import { useEffect, useState } from "react";
import { genPdfTQF3 } from "@/services/tqf3/tqf3.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { useParams, useSearchParams } from "react-router-dom";
import { setLoadingOverlay } from "@/store/loading";
import noData from "@/assets/image/noData.jpg";
import { setShowSidebar, setShowNavbar } from "@/store/config";
import LoadingOverlay from "@/components/Loading/LoadingOverlay";

export default function CourseSyllabus() {
  const { tqf3 } = useParams();
  const [searchParams] = useSearchParams();
  const courseNo = searchParams.get("courseNo");
  const year = searchParams.get("year");
  const semester = searchParams.get("semester");
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const [pdfString, setPdfString] = useState<string | null>(null);
  const dispatch = useAppDispatch();

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
        <div>
          Not Found Course Syllabus for Course {courseNo} ({semester}/
          {year?.slice(-2)})
        </div>
      )}
    </div>
  );
}
