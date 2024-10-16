import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Group, rem } from "@mantine/core";
import { Alert, Button, Modal } from "@mantine/core";
import { IModelCourse } from "@/models/ModelCourse";
import regcmu from "@/assets/image/regCMULogo.png";
import exStudentList from "@/assets/image/exStudentList.png";
import Icon from "../Icon";
import IconArrowRight from "@/assets/icons/arrowRight.svg?react";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconUpload from "@/assets/icons/upload.svg?react";
import IconX from "@/assets/icons/x.svg?react";
import IconExternalLink from "@/assets/icons/externalLink.svg?react";

type Props = {
  selectCourse?: boolean;
  opened: boolean;
  onClose: () => void;
  data: Partial<IModelCourse>;
  onBack: () => void;
  onNext: () => void;
};

export default function ModalUploadStudentList({
  selectCourse = true,
  opened,
  onClose,
  data,
  onBack,
  onNext,
}: Props) {
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
        <div className=" flex-col overflow-y-auto h-full gap-3">
          <Alert
            radius="md"
            variant="light"
            color="red"
            className="mb-3"
            classNames={{
              body: " flex justify-center",
            }}
            title={
              <div className="flex items-center  gap-2">
                <Icon IconComponent={IconExclamationCircle} />
                <p>
                  Important: Import Student List for Course {data?.courseNo}
                </p>
              </div>
            }
          >
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <img
                  src={regcmu}
                  alt="CMULogo"
                  className=" h-[38px] w-[185px] "
                />
                <p className="pl-5 text-default leading-6 font-medium ">
                  <span className="font-bold">
                    Before uploading scores for course {data?.courseNo}{" "}
                    {data?.courseName}
                  </span>
                  , <br /> you must import the student list (.xlsx) in this
                  course for all sections from <br /> the CMU Registration
                  System.
                  <a
                    href="https://www1.reg.cmu.ac.th/registrationoffice/searchcourse.php"
                    target="_blank"
                  >
                    <span className="text-secondary font-semibold hover:text-[#394cc9] hover:underline inline-flex items-center">
                      Reg CMU
                      <span className="ml-1">
                        <Icon IconComponent={IconExternalLink} className="size-4" />
                      </span>
                    </span>
                  </a>
                </p>
              </div>
              <img
                style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" }}
                className="rounded-md mx-2 mb-1 mt-2"
                src={exStudentList}
              />
            </div>
          </Alert>
          <Dropzone
            onDrop={(files) => console.log("accepted files", files)}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={5 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
            className="  border-[#8f9ae37f] hover:bg-gray-100 border-dashed bg-gray-50 cursor-pointer border-[2px] rounded-md"
          >
            <Group
              justify="center"
              gap="xl"
              mih={220}
              style={{ pointerEvents: "none" }}
            >
              <Dropzone.Accept>
                <Icon
                  IconComponent={IconUpload}
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: "var(--mantine-color-blue-6)",
                  }}
                  className=" stroke-[2px]"
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <Icon
                  IconComponent={IconX}
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: "var(--mantine-color-red-6)",
                  }}
                  className=" stroke-[2px]"
                />
              </Dropzone.Reject>

              <div className=" flex flex-col gap-3 justify-center items-center">
                <Icon
                  IconComponent={IconUpload}
                  className=" bg-[#DDE0FF] stroke-[2px] stroke-[#5768d5] hover:bg-[#cfd2f8] size-16 p-3 rounded-full"
                />
                <p className="font-semibold text-b2 text-default">
                  <span className="text-secondary underline">
                    {" "}
                    Click to import
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="-mt-2 font-medium items-center justify-center text-center text-secondary text-b3">
                  XLSX format only (up to 10MB)
                </p>
                <div className="flex flex-col text-b3 font-medium  text-red-500  items-center text-center justify-center">
                  <div className="flex gap-2 items-center justify-center">
                    <Icon
                      IconComponent={IconExclamationCircle}
                      className="size-4 stroke-red-600"
                    />
                    <p>
                      Supports only Student List ({data?.courseNo}) template
                    </p>
                  </div>
                  <p>from CMU Registration (Reg CMU)</p>
                </div>
              </div>
            </Group>
          </Dropzone>
        </div>
        <div className="flex justify-end sticky w-full">
          <Group className="flex w-full gap-2 h-fit items-end justify-end">
            <Button onClick={onBack} variant="subtle">
              {selectCourse ? "Back" : "Cancel"}
            </Button>

            <Button
              onClick={onNext}
              rightSection={
                <Icon
                  IconComponent={IconArrowRight}
                  className="size-5 stroke-[#ffffff] stroke-[2px] items-center"
                />
              }
            >
              Import & Next to Upload
            </Button>
          </Group>
        </div>
      </Modal>
    </>
  );
}
