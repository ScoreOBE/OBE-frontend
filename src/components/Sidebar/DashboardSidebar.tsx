import { useEffect, useState } from "react";
import { Button, Modal, Select } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/store";
import Icon from "@/components/Icon";
import { IconChevronDown } from "@tabler/icons-react";
import CalendarIcon from "@/assets/icons/calendar.svg?react";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import { AcademicYearRequestDTO } from "@/services/academicYear/dto/academicYear.dto";
import { getAcademicYear } from "@/services/academicYear/academicYear.service";
import { setAcademicYear } from "@/store/academicYear";
import { useSearchParams } from "react-router-dom";
import { getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { setCourseList } from "@/store/course";
import { setLoading } from "@/store/loading";

export default function DashboardSidebar() {
  const user = useAppSelector((state) => state.user);
  const [params, setParams] = useSearchParams();
  const academicYear = useAppSelector((state) => state.academicYear);
  const dispatch = useAppDispatch();
  const termOption = academicYear.map((e) => {
    return { label: `${e.semester}/${e.year}`, value: e.id };
  });
  const [openFilterTerm, setOpenFilterTerm] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<any>(
    termOption.find((term) => term.value == params.get("id"))
  );

  useEffect(() => {
    if (academicYear.length && !params.get("id") && !selectedTerm) {
      setTerm(academicYear[0]);
    } else if (user && !academicYear.length) {
      fetchAcademicYear();
    }
  }, [academicYear]);

  useEffect(() => {
    if (termOption && params.get("id") && !selectedTerm) {
      setSelectedTerm(termOption.find((e) => e.value == params.get("id")));
    }
  }, [termOption, params]);

  useEffect(() => {
    if (!openFilterTerm) {
      setSelectedTerm(termOption.find((e) => e.value == params.get("id")));
    }
  }, [openFilterTerm]);

  const fetchCourse = async (id: string) => {
    dispatch(setLoading(true));
    const payloadCourse = new CourseRequestDTO();
    payloadCourse.academicYear = id;
    const res = await getCourse(payloadCourse);
    if (res) {
      dispatch(setCourseList(res));
    }
    dispatch(setLoading(false));
  };

  const fetchAcademicYear = async () => {
    const res = await getAcademicYear(new AcademicYearRequestDTO());
    if (res) {
      dispatch(setAcademicYear(res));
      if (!params.get("id") && !selectedTerm) {
        setTerm(res[0]);
      }
    }
  };

  const setTerm = (data: IModelAcademicYear) => {
    setParams({
      id: data.id,
      year: data.year.toString(),
      semester: data.semester.toString(),
    });
    setSelectedTerm(termOption.find((term) => term.value == data.id));
  };

  const confirmFilterTerm = async () => {
    setOpenFilterTerm(false);
    const term = academicYear.find((e) => e.id == selectedTerm.value)!;
    setTerm(term);
    fetchCourse(term.id);
  };

  return (
    <>
      <Modal
        opened={openFilterTerm}
        onClose={() => setOpenFilterTerm(false)}
        title="Filter"
        size="400px"
        centered
        transitionProps={{ transition: "pop" }}
      >
        <Select
          label="Semester"
          data={termOption}
          value={selectedTerm?.value}
          onChange={(value, option) => setSelectedTerm(option)}
          allowDeselect={false}
          withCheckIcon={false}
          className="mb-7 w-1/2"
          classNames={{
            label: "font-medium mb-1",
            input: "text-primary font-medium",
            option: "hover:bg-[#DDDDF6] text-primary font-medium",
          }}
        />
        <Button className="!w-full" onClick={() => confirmFilterTerm()}>
          OK
        </Button>
      </Modal>
      <div className="flex text-white flex-col gap-11">
        <div className="text-sm flex flex-col gap-[6px]">
          <p className="font-semibold">Welcome to CMU OBE!</p>
          <div className="font-normal flex flex-col gap-[2px]">
            <p>
              Your courses are waiting
              <br />
              on the right to jump in!
              <br />
              Account? Top right menu
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-b2 font-semibold">Course</p>
          <Button
            className="bg-transparent !w-full !h-[50px] flex justify-start items-center px-3 py-1 border-none text-white transition-colors duration-300 hover:bg-[#F0F0F0] hover:text-tertiary focus:border-none group"
            leftSection={
              <Icon className="-mt-4 mr-1" IconComponent={CalendarIcon} />
            }
            variant="default"
            onClick={() => setOpenFilterTerm(true)}
          >
            <div className="flex flex-col justify-start items-start gap-[7px]">
              <p className="font-medium text-[14px]">Semester</p>
              <p className="font-normal text-[12px]">
                Course (
                {`${params.get("semester") ?? ""}/${
                  params.get("year")?.slice(-2) ?? ""
                }`}
                )
              </p>
            </div>
          </Button>
        </div>
      </div>
    </>
  );
}
