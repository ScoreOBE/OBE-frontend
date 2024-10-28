import { Alert, Button, Group, Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store";
import Icon from "../Icon";
import IconExclamamtion from "@/assets/icons/exclamationCircle.svg?react";
import IconUserScan from "@/assets/icons/userScan.svg?react";
import IconBook from "@/assets/icons/book.svg?react";
import IconBooks from "@/assets/icons/books.svg?react";
import IconSchool from "@/assets/icons/school.svg?react";
import IconAddressBook from "@/assets/icons/addressBook.svg?react";
import IconListNumber from "@/assets/icons/listNumbers.svg?react";
import IconMail from "@/assets/icons/mail.svg?react";
import IconClipboardText from "@/assets/icons/clipboardText.svg?react";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function ModalTermOfService({ opened, onClose }: Props) {
  const tqf3 = useAppSelector((state) => state.tqf3);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (opened) {
      Object.keys(tqf3).forEach((part) => {
        if (part.includes("part")) {
          selectedParts.push(part);
        }
      });
    }
  }, [opened]);

  const onCloseModal = () => {
    onClose();
    setSelectedParts([]);
  };

  return (
    <Modal
      opened={opened}
      onClose={onCloseModal}
      withCloseButton={false}
      closeOnClickOutside={true}
      title={
        <div className="mt-1 text-[22px] flex flex-col gap-3">
          <p className="font-bold">
            Score OBE<span className=" text-[#FFCD1B]"> +</span>
            <span className=" text-default"> Terms of Service</span>
          </p>
          <p className=" text-default text-[14px]">
            Last Updated: October 25, 2024
          </p>
        </div>
      }
      centered
      size="45vw"
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: "flex flex-col overflow-hidden pb-2 max-h-full h-fit",
        body: "flex flex-col overflow-hidden max-h-full h-fit",
      }}
    >
      <div className=" pt-1 h-[450px] overflow-y-auto text-slate-700 font-medium">
        <Alert
          radius="md"
          icon={<Icon className="size-7" IconComponent={IconExclamamtion} />}
          variant="light"
          color="blue"
          className="mb-3"
          classNames={{
            icon: "size-6",
            body: " flex justify-center",
            title: "-mb-1",
          }}
          title={<p>IMPORTANT</p>}
        >
          Please read the following term before using Score OBE+. By using Score
          OBE+, you are agreeing to be bound the Score OBE+ Terms of Service.
        </Alert>
        <Alert
          radius="md"
          icon={<Icon className=" size-7" IconComponent={IconUserScan} />}
          variant="light"
          color="indigo"
          className="mb-3"
          classNames={{
            icon: "size-6",
            body: " flex justify-center",
            title: "-mb-1",
          }}
          title={<p>Data Linked to You</p>}
        >
          <div className=" justify-start text-start items-start">
            <p className="mb-2">
              The following data from CMU OAuth and this system may be collected
              and linked to your identity:
            </p>{" "}
            <br />
            <div className="flex gap-8 -mt-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-start">
                  <Icon IconComponent={IconAddressBook} />
                  <span className="ml-2">Name and Surname</span>
                </div>
                <div className="flex items-center justify-start">
                  <Icon IconComponent={IconListNumber} />
                  <span className="ml-2">Academic record</span>
                </div>
                <div className="flex items-center justify-start">
                  <Icon IconComponent={IconBook} />
                  <span className="ml-2">Course information</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-start">
                  <Icon IconComponent={IconMail} />
                  <span className="ml-2">CMU email</span>
                </div>
                <div className="flex items-center justify-start">
                  <Icon IconComponent={IconClipboardText} />
                  <span className="ml-2">TQF Document</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-start">
                  <Icon IconComponent={IconSchool} />
                  <span className="ml-2">Faculty and Department</span>
                </div>
                <div className="flex items-center justify-start">
                  <Icon IconComponent={IconBooks} />
                  <span className="ml-2">Enrolled Course</span>
                </div>
              </div>
            </div>
          </div>
        </Alert>

        <p className=" text-[18px] font-bold text-default mb-[6px]">
          Welcome to Score OBE+
        </p>
        <p className=" text-b2 leading-6">
          <span className="font-bold">Score OBE+</span> is a web application
          (“System”) developed as a tool to facilitate lecturers, students, and
          staff in the Faculty of Engineering, Chiang Mai University ("Users"),
          in managing the documents of the Thai Qualifications Framework for
          Higher Education (TQF:HEd) of the course related to Outcome-Based
          Education (OBE) and announcing scores via the web apllication.
        </p>

        {/* <p className=" text-b2 leading-6">
          Score OBE+ web application ("System") was developed as a tool for
          managing information related to Outcome-Based Education (OBE)
          specifically for the Faculty of Engineering, Chiang Mai University.
          The purpose of the system is to facilitate the announcement and access
          of grades and other relevant information related to teaching and
          learning, allowing both students and faculty to access information
          conveniently and quickly. This Terms of Service is intended to explain
          the rights and responsibilities of system users, as well as the rules
          for using the system correctly.
        </p> */}
      </div>
      <div className="flex justify-end mt-2 sticky w-full">
        <Group className="flex w-full  gap-2 h-fit items-end justify-end">
          <Button
            onClick={onClose}
            classNames={{ label: "font-bold " }}
            variant="subtle"
          >
            Disagree, Log out
          </Button>
          <Button loading={loading} classNames={{ label: "font-bold" }}>
            I agree with terms
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
