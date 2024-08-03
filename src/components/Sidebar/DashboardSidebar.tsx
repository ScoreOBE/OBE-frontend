import { useEffect, useState } from "react";
import { Button, Modal, Select } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/store";
import Icon from "@/components/Icon";
import { IconChevronDown } from "@tabler/icons-react";
import CalendarIcon from "@/assets/icons/calendar.svg?react";
import { useDisclosure } from "@mantine/hooks";
import { getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { setCourseList } from "@/store/course";
import { useSearchParams } from "react-router-dom";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import { setLoading } from "@/store/loading";

export default function DashboardSidebar() {
  const [openedFilterTerm, { open: openFilterTerm, close: closeFilterTerm }] =
    useDisclosure(false);
  const [params, setParams] = useSearchParams();
  const payloadCourse = new CourseRequestDTO();
  const academicYear = useAppSelector((state) => state.academicYear);
  const course = useAppSelector((state) => state.course);
  const dispatch = useAppDispatch();
  const termOption = academicYear.map((e) => {
    return { label: `${e.semester}/${e.year}`, value: e.id };
  });
  const [openedDropdown, setOpenedDropdown] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(termOption[0]);

  const fetchCourse = async (id: string) => {
    payloadCourse.academicYear = id;
    const res = await getCourse(payloadCourse);
    if (res) {
      localStorage.setItem("totalCourses", res.totalCount);
      dispatch(setCourseList(res.courses));
    }
    dispatch(setLoading(false))
  };

  useEffect(() => {
  
    if (academicYear.length) {
      setTerm(academicYear[0]);
      setSelectedTerm(termOption[0]);
      if (!course.length) {
        dispatch(setLoading(true))
        fetchCourse(academicYear[0].id);
      }
    }
    
  }, [academicYear]);

  const setTerm = (data: IModelAcademicYear) => {
    params.set("year", data.year.toString());
    params.set("semester", data.semester.toString());
    setParams(params);
  };

  const confirmFilterTerm = async () => {
    closeFilterTerm();
    const term = academicYear.find((e) => e.id == selectedTerm.value)!;
    setTerm(term);
    fetchCourse(selectedTerm.value);
  };

  return (
    <>
      <Modal
        opened={openedFilterTerm}
        withCloseButton ={false}
        onClose={closeFilterTerm}
        title="Filter"
        size="400px"
        centered
        transitionProps={{ transition: "pop" }}
      >
        <Select
          label="Semester"
          data={termOption}
          value={selectedTerm?.value}
          onChange={(_value, option) => setSelectedTerm(option)}
          allowDeselect={false}
          withCheckIcon={false}
          className="rounded-md mb-5 border-none w-1/2"
          classNames={{
            label: "font-medium mb-1",
            input: "text-primary font-medium",
            option: "hover:bg-[#DDDDF6] text-primary font-medium",
          }}
          rightSectionPointerEvents="none"
          rightSection={
            <IconChevronDown
              className={`${
                openedDropdown ? "rotate-180" : ""
              } stroke-primary stroke-2`}
            />
          }
          onDropdownOpen={() => setOpenedDropdown(true)}
          onDropdownClose={() => setOpenedDropdown(false)}
        />
        <Button
          className="w-full"
          color="#6869AD"
          onClick={() => confirmFilterTerm()}
        >
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
          <p className="text-b2 text-white font-semibold">Course</p>
          <Button
            className="bg-transparent w-full h-[50px] flex justify-start items-center  px-3 py-1 border-none rounded-[4px] text-white transition-colors duration-300 hover:bg-[#F0F0F0] hover:text-tertiary focus:border-none group"
            leftSection={
              <Icon className="-mt-4 mr-1" IconComponent={CalendarIcon} />
            }
            variant="default"
            onClick={openFilterTerm}
          >
            <div className="flex flex-col justify-start items-start gap-[7px]">
              <p className="font-medium text-[14px]">Semester</p>
              <p className="font-normal text-[12px]">
                Course (
                {`${params.get("semester")}/${params.get("year")?.slice(-2)}`})
              </p>
            </div>
          </Button>
        </div>
      </div>
    </>
  );
}
