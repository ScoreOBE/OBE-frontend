import { Alert, Button, Group, Modal, Table, Tabs } from "@mantine/core";
import { useState } from "react";
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
import { logOut, termsOfService } from "@/services/user/user.service";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/user";
import IconTh from "@/assets/icons/thai.svg?react";
import IconEng from "@/assets/icons/eng.svg?react";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function ModalTermsOfService({ opened, onClose }: Props) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [isEN, setIsEN] = useState<string | null>("EN");

  const submitTermsOfService = async (isAgree: boolean) => {
    setLoading(true);
    const res = await termsOfService({ agree: isAgree });
    if (res) {
      if (res.token) {
        localStorage.setItem("token", res.token);
        dispatch(setUser(res.user));
      } else {
        logOut();
      }
      onClose();
    }
    setLoading(false);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      closeOnClickOutside={false}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 10,
      }}
      title={
        <div className="mt-1 text-[22px] flex item-center  justify-between">
          <div className="flex flex-col gap-3">
            {isEN === "EN" ? (
              <p className="font-bold">
                Score OBE<span className=" text-[#FFCD1B]">+</span>
                <span className=" text-default"> Terms of Service</span>
              </p>
            ) : (
              <p className="font-bold">
                <span className=" font-semibold text-default">
                  ข้อกำหนดและเงื่อนไขในการให้บริการ
                </span>{" "}
                Score OBE<span className=" text-[#FFCD1B]">+</span>
              </p>
            )}
            <p className=" text-default text-[14px]">
              {isEN === "EN"
                ? "Last updated: October 29, 2024"
                : "อัปเดตล่าสุด: 29 ตุลาคม 2567"}
            </p>
          </div>
          <div>
            <Tabs
              value={isEN}
              onChange={setIsEN}
              variant="pills"
              className="min-w-fit"
            >
              <Tabs.List>
                <Tabs.Tab value="TH">
                  <div className="flex flex-row items-center gap-2 ">
                    <Icon IconComponent={IconTh} />
                    ไทย
                  </div>
                </Tabs.Tab>
                <Tabs.Tab value="EN">
                  <div className="flex flex-row items-center gap-2 ">
                    <Icon IconComponent={IconEng} />
                    Eng
                  </div>
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </div>
        </div>
      }
      centered
      size="65vw"
      transitionProps={{ transition: "pop" }}
      classNames={{
        title: "!w-full ",
        content: "flex flex-col overflow-hidden pb-2 max-h-full h-fit",
        body: "flex flex-col overflow-hidden max-h-full h-fit",
      }}
    >
      <div className=" pt-1 h-[500px] overflow-y-auto text-slate-700 font-medium">
        {isEN === "EN" ? (
          <p className=" text-[18px] font-bold text-default mb-[10px]">
            Welcome to <span className=" text-secondary">Score OBE</span>
            <span className=" text-[#FFCD1B]">+</span>
          </p>
        ) : (
          <p className=" text-[18px] font-bold text-default mb-[10px]">
            <span className="font-semibold">ยินดีต้อนรับสู่ </span>
            <span className=" text-secondary">Score OBE</span>
            <span className=" text-[#FFCD1B]">+</span>
          </p>
        )}

        <Alert
          radius="md"
          icon={<Icon className=" size-8" IconComponent={IconUserScan} />}
          variant="light"
          color="indigo"
          className="mb-3"
          classNames={{
            icon: "size-6",
            body: " flex ml-1 justify-center",
            title: "-mb-1 text-[16px]",
          }}
          title={
            isEN === "EN" ? (
              <p>Data Linked to You</p>
            ) : (
              <p className=" font-semibold">ข้อมูลที่เชื่อมโยงกับคุณ</p>
            )
          }
        >
          <div className=" justify-start text-start items-start">
            <p className="mb-2">
              {isEN === "EN"
                ? "The following data from CMU OAuth and Score OBE+ may be collected and linked to your identity:"
                : "ข้อมูลต่อไปนี้ที่มาจาก CMU OAuth และ Score OBE+ อาจะถูกเก็บและเชื่อมโยงกับตัวตนของคุณ:"}
            </p>{" "}
            <br />
            <div className="flex gap-8 -mt-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-start">
                  <Icon className="size-5" IconComponent={IconAddressBook} />
                  <span className="ml-2">
                    {isEN === "EN" ? "Name and Surname" : "ชื่อและสกุล"}
                  </span>
                </div>
                <div className="flex items-center justify-start">
                  <Icon className="size-5" IconComponent={IconListNumber} />
                  <span className="ml-2">
                    {isEN === "EN" ? "Academic record" : "บันทึกผลการเรียน"}
                  </span>
                </div>
                <div className="flex items-center justify-start">
                  <Icon className="size-5" IconComponent={IconBook} />
                  <span className="ml-2">
                    {isEN === "EN" ? "Course information" : "ข้อมูลกระบวนวิชา"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-start">
                  <Icon className="size-5" IconComponent={IconMail} />
                  <span className="ml-2">
                    {isEN === "EN" ? "CMU email" : "อีเมล CMU"}
                  </span>
                </div>
                <div className="flex items-center justify-start">
                  <Icon className="size-5" IconComponent={IconClipboardText} />
                  <span className="ml-2">
                    {isEN === "EN" ? "TQF document" : "เอกสาร TQF"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-start">
                  <Icon className="size-5" IconComponent={IconSchool} />
                  <span className="ml-2">
                    {isEN === "EN" ? "Faculty and Department" : "คณะและสาขา"}
                  </span>
                </div>
                <div className="flex items-center justify-start">
                  <Icon className="size-5" IconComponent={IconBooks} />
                  <span className="ml-2">
                    {isEN === "EN"
                      ? "Enrolled course"
                      : "กระบวนวิชาที่ลงทะเบียนเรียน"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Alert>
        <Alert
          radius="md"
          icon={<Icon className="size-8" IconComponent={IconExclamamtion} />}
          variant="light"
          color="orange"
          className="mb-3"
          classNames={{
            icon: "size-6",
            body: " flex ml-1 justify-center",
            title: "-mb-1 text-[16px]",
          }}
          title={
            isEN === "EN" ? (
              <p>IMPORTANT</p>
            ) : (
              <p className=" font-semibold">สำคัญ</p>
            )
          }
        >
          {isEN === "EN" ? (
            <p className=" leading-6">
              Please read these Terms and Conditions of Service carefully before
              using Score OBE+.
            </p>
          ) : (
            <p className=" leading-6">
              โปรดอ่านข้อกำหนดและเงื่อนไขในการให้บริการอย่างละเอียดก่อนใช้งาน
            </p>
          )}
        </Alert>

        {isEN === "EN" ? (
          <div className="mb-3">
            <p className=" text-[14px] mb-3 leading-6">
              <span className="font-bold">Score OBE+</span> is a web application
              (“System”) developed as a tool to facilitate lecturers, students,
              and staff in the Faculty of Engineering, Chiang Mai University ,
              in managing the documents of the Thai Qualifications Framework for
              Higher Education (TQF:HEd) of the course related to Outcome-Based
              Education (OBE) and announcing scores via this system.
            </p>
            <p className=" text-[14px] font-bold mb-3 leading-6">
              1. Definition{" "}
            </p>

            <Table>
              <Table.Tbody className="text-default">
                {/* Entire Table Row as Control */}
                <Table.Tr className="text-[13px] border-t-[1px] font-normal py-[14px] w-full ">
                  <Table.Td className="text-start  w-[20%] ">"You"</Table.Td>
                  <Table.Td className="text-start pr-[70px] w-[80%]">
                    Refers to Score OBE+ web application users
                  </Table.Td>
                </Table.Tr>
                <Table.Tr className="text-[13px] border-t-[1px] font-normal py-[14px] w-full ">
                  <Table.Td className="text-start  w-[20%] ">"We"</Table.Td>
                  <Table.Td className="text-start pr-[70px] w-[80%]">
                    Refers to the Department of Computer Engineering, Faculty of
                    Engineering, Chiang Mai University.
                  </Table.Td>
                </Table.Tr>
                <Table.Tr className="text-[13px] font-normal py-[14px] w-full ">
                  <Table.Td className="text-start  w-[25%] ">"System"</Table.Td>
                  <Table.Td className="text-start pr-[70px] w-[75%]">
                    Refers to the Score OBE+ web application which is provided
                    by the Department of Computer Engineering, Faculty of
                    Engineering, Chiang Mai University, including any part that
                    has been changed, improved, updated or added by the
                    Department of Computer Engineering, Faculty of Engineering,
                    Chiang Mai University.
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
        ) : (
          <div className="mb-5">
            <p className=" text-[14px] mb-3 leading-6">
              <span className="font-bold">Score OBE+ </span> เป็นเว็บแอปพลิเคชัน
              ที่พัฒนาขึ้นเป็นเครื่องมืออำนวยความสะดวกแก่อาจารย์ นักศึกษา
              และบุคลากร คณะวิศวกรรมศาสตร์ มหาวิทยาลัยเชียงใหม่
              ในการจัดการเอกสารกรอบมาตรฐานคุณวุฒิระดับอุดมศึกษาแห่งชาติ (มคอ.)
              ของรายวิชาที่เกี่ยวข้องกับการศึกษาตามผลลัพธ์ (OBE)
              และการประกาศผลคะแนนผ่านระบบนี้
            </p>
            <p className=" text-[14px] font-bold mb-3 leading-6">1. นิยาม </p>

            <Table>
              <Table.Tbody className="text-default">
                {/* Entire Table Row as Control */}
                <Table.Tr className="text-[13px] border-t-[1px] font-normal py-[14px] w-full ">
                  <Table.Td className="text-start  w-[20%] ">"ท่าน"</Table.Td>
                  <Table.Td className="text-start pr-[70px] w-[80%]">
                    หมายถึง ผู้ใช้บริการเว็บแอปพลิเคชั่น Score OBE+
                  </Table.Td>
                </Table.Tr>
                <Table.Tr className="text-[13px] border-t-[1px] font-normal py-[14px] w-full ">
                  <Table.Td className="text-start  w-[20%] ">"เรา"</Table.Td>
                  <Table.Td className="text-start pr-[70px] w-[80%]">
                    หมายถึง ภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์
                    มหาวิทยาลัยเชียงใหม่
                  </Table.Td>
                </Table.Tr>
                <Table.Tr className="text-[13px] font-normal py-[14px] w-full ">
                  <Table.Td className="text-start  w-[25%] ">"ระบบ"</Table.Td>
                  <Table.Td className="text-start pr-[70px] w-[75%]">
                    หมายถึง เว็บแอปพลิเคชั่น Score OBE+
                    ซึ่งให้บริการโดยภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์
                    มหาวิทยาลัยเชียงใหม่ โดยรวมถึงในส่วนที่ได้มีการเปลี่ยนแปลง
                    ปรับปรุง อัปเดต หรือเพิ่มเติมโดยภาควิชาวิศวกรรมคอมพิวเตอร์
                    คณะวิศวกรรมศาสตร์
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>

            {/* <p className=" text-[14px] font-bold mb-3 leading-6">
              2. รายละเอียดทั่วไป{" "}
            </p>
            <p className=" text-[14px]  mb-3 leading-6">
             
            </p> */}
          </div>
        )}

        {isEN === "EN" ? (
          <p className=" text-[14px]  mb-6 leading-6">
            <p className="font-bold ">2. System Objectives</p>
            <p className="ml-3">
              <li className="mb-1">
                Score Announcements: The Score OBE+ system facilitates quick and
                efficient announcement of exam and homework scores, allowing
                students to access their scores in each subject promptly.
              </li>
              <li className="mb-1">
                {" "}
                Support for Learning Assessment: The system supports evaluation
                of students' abilities according to specific learning criteria
                for each course, assisting teachers in adjusting the difficulty
                of exams and assignments to align with targeted learning
                outcomes.{" "}
              </li>
              <li className="mb-1">
                {" "}
                Teaching Process Management and Improvement: The system offers
                insights into student performance in each subject, enabling
                teachers to adapt teaching plans, assessments, and guidance to
                align with course objectives.{" "}
              </li>
            </p>
          </p>
        ) : (
          <p className=" text-[14px]  mb-6 leading-6">
            <p className="font-bold"> 2. วัตถุประสงค์ของระบบ</p>
            <p className="ml-3">
              <li className="mb-1">
                ประกาศคะแนนข้อสอบและการบ้าน:
                ระบบช่วยให้อาจารย์สามารถประกาศคะแนนของนักศึกษาได้อย่างรวดเร็วและมีประสิทธิภาพ
                นักศึกษาสามารถตรวจสอบคะแนนของตนเองในแต่ละรายวิชาผ่าน Score OBE+
                ได้ทันที
              </li>
              <li className="mb-1">
                สนับสนุนการประเมินผลการเรียนรู้:
                ระบบช่วยในการประเมินความสามารถของนักศึกษาตามเกณฑ์การเรียนรู้ในแต่ละหลักสูตร
                ช่วยให้อาจารย์สามารถปรับปรุงความยากง่ายของข้อสอบและการบ้านเพื่อให้สอดคล้องกับผลลัพธ์การเรียนรู้ที่ต้องการ
              </li>
              <li className="mb-1">
                การจัดการและปรับปรุงกระบวนการสอน:
                ระบบแสดงข้อมูลเชิงลึกเกี่ยวกับผลการเรียนรู้ของนักศึกษาในแต่ละรายวิชา
                เพื่อช่วยให้อาจารย์สามารถปรับเปลี่ยนแผนการสอน การวัดผล
                และการให้คำปรึกษาให้สอดคล้องกับวัตถุประสงค์ของหลักสูตร
              </li>
            </p>
          </p>
        )}
        {isEN === "EN" ? (
          <p className=" text-[14px]  mb-6 leading-6">
            <p className="font-bold"> 3. Acceptance of Terms and Conditions</p>
            By using this system, you acknowledge that you have read and
            understood the Terms and Conditions of Service thoroughly. Your use
            of the system constitutes your agreement and acceptance of all terms
            and conditions in an irrevocable manner. If you do not agree to
            these Terms and Conditions, please refrain from using the system.
          </p>
        ) : (
          <p className=" text-[14px]  mb-6 leading-6">
            <p className="font-bold"> 3. การยอมรับข้อกำหนดและเงื่อนไข</p>
            <p>
              {" "}
              เมื่อท่านได้ใช้ระบบ
              ถือว่าท่านได้อ่านและเข้าใจข้อกำหนดและเงื่อนไขการให้บริการของระบบเป็นอย่างดีแล้ว
              การใช้บริการถือเป็นการแสดงเจตนาตกลง
              และยอมรับข้อกำหนดและเงื่อนไขการให้บริการระบบทุกประการในลักษณะที่ไม่สามารถเพิกถอนได้
              หากท่านไม่ยอมรับข้อกำหนดและเงื่อนไขในการให้บริการนี้
              โปรดอย่าใช้ระบบของเรา
            </p>
          </p>
        )}
        {isEN === "EN" ? (
          <p className=" text-[14px]  mb-6 leading-6">
            <p className="font-bold">
              {" "}
              4. Amendment and Acceptance of Terms and Conditions
            </p>
            <p>
              {" "}
              We reserve the right to modify, amend, add, or remove any Terms
              and Conditions of Service within the system without prior notice.
              Users are responsible for regularly reviewing any updates to these
              Terms and Conditions. Continued use of the system after any
              modifications implies that you have read, understood, and
              unconditionally accepted the updated Terms and Conditions. Users
              may not claim lack of awareness of any changes to the Terms and
              Conditions as a reason for non-compliance.
            </p>
          </p>
        ) : (
          <p className=" text-[14px]  mb-6 leading-6">
            <p className="font-bold">
              {" "}
              4. การแก้ไขและการยอมรับข้อกำหนดและเงื่อนไข
            </p>
            <p>
              {" "}
              เราขอสงวนสิทธิในการแก้ไข เปลี่ยนแปลง เพิ่มเติม ตัดทอน
              บรรดาข้อกำหนดและเงื่อนไขการให้บริการใด ๆ ที่กำหนดไว้ในระบบ
              โดยไม่ต้องแจ้งให้ท่านทราบล่วงหน้า อย่างไรก็ดี
              ท่านมีหน้าที่ติดตามการแก้ไขเปลี่ยนแปลงต่าง ๆ อยู่เสมอ
              และหากภายหลังการแก้ไขเปลี่ยนแปลง ท่านยังคงใช้งานระบบอยู่
              ถือว่าท่านได้อ่านและเข้าใจ
              จึงได้ยอมรับตามข้อกำหนดและเงื่อนไขการใช้บริการที่ได้มีการเปลี่ยนแปลงนี้
              อย่างไม่มีเงื่อนไข
              ท่านไม่อาจอ้างเหตุในการไม่ทราบถึงการเปลี่ยนแปลงข้อกำหนดและเงื่อนการใช้บริการมาเป็นเหตุในการฝ่าฝืนข้อกำหนดและเงื่อนไขนี้ได้
            </p>
          </p>
        )}
        {isEN === "EN" ? (
          <p className=" text-[14px]  mb-6 leading-6">
            <p className="font-bold"> 5. Privacy</p>
            <p>
              {" "}
              We prioritize the importance of your data and respect your right
              to privacy. Therefore, we wish to inform you of our data
              collection, use, disclosure, and protection practices according to
              the Chiang Mai University (CMU) Privacy Policy. This policy
              provides details on how we manage your personal information.
              Please note that we may update or revise this Privacy Policy, as
              well as any specific terms within this system, to align with
              service standards and applicable legal requirements. You can
              review the current version of the CMU Privacy Policy at any time
              at
              <a
                className=" text-secondary hover:underline"
                href="https://www.cmu.ac.th/th/privacy"
              >
                {" "}
                https://www.cmu.ac.th/th/privacy{" "}
              </a>
              This Privacy Policy applies to your use of this system, including
              access to and use of its content, features, technologies, or
              functions, as well as any services related to the system, whether
              existing now or introduced in the future.
            </p>
          </p>
        ) : (
          <p className=" text-[14px]  mb-6 leading-6">
            <p className="font-bold"> 5. ความเป็นส่วนตัว</p>
            <p>
              {" "}
              เราคำนึงถึงความสำคัญของข้อมูลและเคารพสิทธิความเป็นส่วนตัวของข้อมูลของท่าน
              ดังนั้น เราจึงขอแจ้งให้ทราบถึงนโยบายในการจัดเก็บข้อมูล
              รวบรวมข้อมูล การใช้ข้อมูล การเปิดเผยข้อมูล
              และการรักษาข้อมูลของท่าน ตามนโยบายคุ้มครองข้อมูลส่วนบุคคล
              มหาวิทยาลัยเชียงใหม่ (CMU Privacy Policy)
              นโยบายคุ้มครองข้อมูลส่วนบุคคลมีขึ้นเพื่อการชี้แจงรายละเอียดและวิธีการจัดการเกี่ยวกับข้อมูลส่วนบุคคลของท่าน
              โดยท่านรับทราบว่า
              เราอาจดำเนินการปรับปรุงหรือแก้ไขนโยบายคุ้มครองข้อมูลส่วนบุคคล
              ที่กำหนดดังต่อไปนี้
              รวมทั้งที่ได้กำหนดไว้โดยเฉพาะเจาะจงอยู่ในส่วนใดส่วนหนึ่งของระบบนี้ไม่ว่าบางส่วนหรือทั้งหมดเป็นครั้งคราว
              เพื่อให้สอดคล้องกับแนวทางการให้บริการและหลักเกณฑ์ของกฎหมายที่มี
              การเปลี่ยนแปลงไป
              โดยท่านสามารถตรวจสอบนโยบายคุ้มครองข้อมูลส่วนบุคคลที่กำหนดไว้นี้ได้อยู่เสมอที่{" "}
              <a
                className=" text-secondary hover:underline"
                href="https://www.cmu.ac.th/th/privacy"
              >
                https://www.cmu.ac.th/th/privacy{" "}
              </a>
              นโยบายคุ้มครองข้อมูลส่วนบุคคลนี้มีขึ้นเพื่อบังคับใช้กับการใช้ระบบ
              การเข้าถึงและใช้เนื้อหา ฟีเจอร์ เทคโนโลยี
              หรือฟังก์ชันที่ปรากฏในระบบนี้
              ตลอดจนบริการที่เกี่ยวข้องกับการให้บริการของเราในระบบนี้ทั้งที่มีอยู่ในปัจจุบันและที่เราจะได้พัฒนาหรือจัดให้มีขึ้นในอนาคต
            </p>
          </p>
        )}
      </div>
      <div className="flex justify-end mt-3 sticky w-full">
        <Group className="flex w-full  gap-2 h-fit items-end justify-end">
          <Button
            loading={loading}
            onClick={() => submitTermsOfService(false)}
            classNames={{ label: "font-bold " }}
            variant="subtle"
          >
            Log out
          </Button>
          <Button
            loading={loading}
            classNames={{ label: "font-bold" }}
            onClick={() => submitTermsOfService(true)}
          >
            I agree with terms
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
