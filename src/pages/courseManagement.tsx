import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button, Menu } from "@mantine/core";
import {
  IconDots,
  IconPencilMinus,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { IModelCourse } from "@/models/ModelCourse";
import { getOneCourse } from "@/services/course/course.service";
import { setCourseList } from "@/store/course";

export default function CourseManagement() {
  return (
    <div>
      <p></p>
    </div>
  );
}
