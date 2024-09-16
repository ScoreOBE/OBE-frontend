import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Group, Text, rem } from "@mantine/core";
import Loading from "@/components/Loading";
import { deletePLO, getPLOs } from "@/services/plo/plo.service";
import { IModelPLO, IModelPLOCollection } from "@/models/ModelPLO";
import ModalAddPLOCollection from "@/components/Modal/ModalAddPLOCollection";
import {
  Alert,
  Button,
  Modal,
  Radio,
  RadioCard,
  Table,
  Tabs,
} from "@mantine/core";
import ThIcon from "@/assets/icons/thai.svg?react";
import EngIcon from "@/assets/icons/eng.svg?react";
import Icon from "@/components/Icon";
import {
  IconArrowRight,
  IconBulb,
  IconChevronRight,
  IconDownload,
  IconExclamationCircle,
  IconFile,
  IconFileExcel,
  IconFileImport,
  IconInfoCircle,
  IconLighter,
  IconPaperBag,
  IconPhoto,
  IconPlus,
  IconTipJar,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { isEmpty } from "lodash";
import { IModelCourse } from "@/models/ModelCourse";
import regcmu from "@/assets/image/regCMULogo.png";
import exStudentList from "@/assets/image/exStudentList.png";

type Props = {
  opened: boolean;
  onClose: () => void;
  data: Partial<IModelCourse>;
  onBack: () => void;
  onNext: () => void;
};

export default function ModalUploadStudentList({
  opened,
  onClose,
  data,
  onBack,
  onNext,
}: Props) {
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [selectPlo, setSelectPlo] = useState<string | null>("Dashboard");
  const [ploCollection, setPloCollection] = useState<IModelPLO[]>([]);
  const [departmentPloCollection, setDepartmentPLOCollection] = useState<
    IModelPLOCollection[]
  >([]);
  const [openModal, setOpenModal] = useState(false);
  const [isTH, setIsTH] = useState<string | null>("TH");
  const [selectView, setSelectView] = useState<string | null>("ploview");
  const [collection, setCollection] = useState<
    Partial<IModelPLO> & Record<string, any>
  >({});
  const [
    modalDuplicatePLO,
    { open: openModalDuplicatePLO, close: closeModalDuplicatePLO },
  ] = useDisclosure(false);

  return (
    <>
      {/* Main Modal */}
      <Modal
        title={
          <div className="flex flex-col gap-2">
            <p>Import Student list from Reg CMU</p>
            <p className=" text-[12px] text-noData">
              {data?.courseNo} {data?.courseName}
            </p>
          </div>
        }
        size="55vw"
        opened={opened}
        onClose={onClose}
        centered
        transitionProps={{ transition: "pop" }}
        closeOnClickOutside={false}
        classNames={{
          content: "flex flex-col overflow-hidden pb-2  max-h-full h-fit",
          body: "flex gap-3 flex-col overflow-hidden max-h-full h-fit",
        }}
      >
        <div className="flex flex-col gap-3">
          <Alert
            radius="md"
            variant="light"
            color="red"
            classNames={{
              body: " flex justify-center",
            }}
            title={
              <div className="flex items-center  gap-2">
                <IconExclamationCircle />
                <p>
                  Important: Import Student Lists for Course {data?.courseNo}
                </p>
              </div>
            }
          >
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <img
                  src={regcmu}
                  alt="CMULogo"
                  className=" h-[38px]   w-[180px] "
                />
                <p className="pl-5 text-default leading-6 font-medium ">
                  Before uploading scores for course {data?.courseNo}{" "}
                  {data?.courseName}, <br /> you must import the student list
                  (.xlsx) in this course for all sections from <br /> the CMU
                  Registration System.
                  <a
                    href="https://www1.reg.cmu.ac.th/registrationoffice/searchcourse.php"
                    target="_blank"
                  >
                    {" "}
                    <span className="text-secondary font-semibold hover:text-[#394cc9] underline">
                      Click here to go to Reg CMU
                    </span>
                  </a>
                </p>
              </div>
              <img className="rounded-md mt-2" src={exStudentList} />
            </div>
          </Alert>
          <Dropzone
            onDrop={(files) => console.log("accepted files", files)}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={5 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
            className="  border-[#8f9ae37f] border-dashed bg-gray-50 cursor-pointer border-[2px] rounded-md"
          >
            <Group
              justify="center"
              gap="xl"
              mih={220}
              style={{ pointerEvents: "none" }}
            >
              <Dropzone.Accept>
                <IconUpload
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: "var(--mantine-color-blue-6)",
                  }}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: "var(--mantine-color-red-6)",
                  }}
                  stroke={1.5}
                />
              </Dropzone.Reject>

              <div className=" flex flex-col gap-3 justify-center items-center">
                <IconUpload
                  color="#5768d5"
                  stroke={1.5}
                  className=" bg-[#DDE0FF] size-16 p-3 rounded-full"
                />
                <p className="font-semibold text-b2 text-default">
                  <span className="text-secondary underline">
                    {" "}
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="-mt-2 font-medium items-center justify-center text-center text-secondary text-b3">
                  XLSX format only (up to 10MB)
                </p>
                <div className="flex flex-col text-b3 font-medium  text-red-500  items-center text-center justify-center">
                  <div className="flex gap-2 items-center justify-center">
                    <IconExclamationCircle color="red" className="size-4" />
                    <p>Supports only Student List ({data?.courseNo} All sections) template</p>
                  </div>
                  <p>from CMU Registration (Reg CMU)</p>
                </div>
              </div>
            </Group>
          </Dropzone>
        </div>
        <div className="flex justify-end w-full">
          <Group className="flex w-full h-fit items-end justify-end">
            <div>
              <Button onClick={onBack} variant="subtle">
                Back
              </Button>
            </div>
            <Button
              onClick={onNext}
              rightSection={
                <IconArrowRight
                  color="#ffffff"
                  className="size-5 items-center"
                  stroke={2}
                  size={20}
                />
              }
            >
              Next
            </Button>
          </Group>
        </div>
      </Modal>
    </>
  );
}
