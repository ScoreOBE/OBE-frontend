import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Alert, Button, Menu, Switch } from "@mantine/core";
import Icon from "@/components/Icon";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconPencilMinus from "@/assets/icons/pencilMinus.svg?react";
import IconStudent from "@/assets/icons/student.svg?react";
import IconUpload from "@/assets/icons/upload.svg?react";
import IconDots from "@/assets/icons/dots.svg?react";
import IconUserGroup from "@/assets/icons/usersGroup.svg?react";
import IconTrash from "@/assets/icons/trash.svg?react";
import IconManageAdmin from "@/assets/icons/addCo.svg?react";
import IconPlus2 from "@/assets/icons/plus2.svg?react";
import IconExcel from "@/assets/icons/excel.svg?react";
import { IModelCourse } from "@/models/ModelCourse";
import { getOneCourse } from "@/services/course/course.service";
import { editCourse, editSection, removeSection } from "@/store/course";
import { getSectionNo, getUserName } from "@/helpers/functions/function";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import PageError from "./PageError";
import MainPopup from "@/components/Popup/MainPopup";
import { COURSE_TYPE, NOTI_TYPE, ROLE } from "@/helpers/constants/enum";
import ModalEditSection from "@/components/Modal/CourseManage/ModalEditSection";
import Loading from "@/components/Loading/Loading";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { IModelSection } from "@/models/ModelCourse";
import {
  deleteSection,
  updateSectionActive,
} from "@/services/section/section.service";
import ModalAddSection from "@/components/Modal/CourseManage/ModalAddSection";
import { IModelUser } from "@/models/ModelUser";
import ModalManageIns from "@/components/Modal/CourseManage/ModalManageIns";
import { setShowNavbar, setShowSidebar } from "@/store/config";
import ModalStudentList from "@/components/Modal/ModalStudentList";
import ModalExportScore from "@/components/Modal/Score/ModalExportScore";
import ModalUploadScore from "@/components/Modal/Score/ModalUploadScore";

export default function Skills() {
  return <>This is Skills Page</>;
}
