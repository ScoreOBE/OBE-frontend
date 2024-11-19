import { Alert, Button, Group, Modal, Table, Tabs } from "@mantine/core";
import { useState } from "react";
import Icon from "../Icon";
import IconExclamamtion from "@/assets/icons/exclamationCircle.svg?react";
import IconUserScan from "@/assets/icons/userScan.svg?react";
import IconBook from "@/assets/icons/book.svg?react";
import IconBooks from "@/assets/icons/books.svg?react";
import IconCPE from "@/assets/icons/userCircle.svg?react";
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
  const [isEN, setIsEN] = useState<string | null>("TH");

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
              <p>
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                  ScoreOBE +
                </span>
                <span className=" text-default"> Terms of Service</span>
              </p>
            ) : (
              <p className="font-bold">
                <span className=" font-semibold text-default">
                  ข้อกำหนดและเงื่อนไขในการให้บริการ
                </span>{" "}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                  ScoreOBE +
                </span>
              </p>
            )}
            <p className=" text-default text-b2">
              {isEN === "EN"
                ? "Last updated: September 9, 2024"
                : "อัปเดตล่าสุด: 9 กันยายน 2567"}
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
      size="68vw"
      transitionProps={{ transition: "pop" }}
      classNames={{
        title: "!w-full ",
        content: "flex flex-col overflow-hidden pb-2 max-h-full h-fit",
        body: "flex flex-col overflow-hidden max-h-full h-fit",
      }}
    >
      <div className=" mt-2 h-[70vh] overflow-y-auto text-slate-700 font-medium">
        {isEN === "EN" ? (
          <p className=" text-[18px] font-bold text-default mb-[10px]">
            Welcome to{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
              ScoreOBE +
            </span>
          </p>
        ) : (
          <p className=" text-[18px] font-bold text-default mb-[10px]">
            <span className="font-semibold">ยินดีต้อนรับสู่ </span>
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
              ScoreOBE +
            </span>
          </p>
        )}

        <Alert
          radius="md"
          icon={<Icon className="size-8" IconComponent={IconExclamamtion} />}
          variant="light"
          color="orange"
          className="mb-3"
          classNames={{
            icon: "size-6",
            body: " flex ml-1 justify-center",
            title: "-mb-1 text-[15px]",
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
            <p className=" leading-6 text-default text-b2">
              Please read, review and understand these Terms of Service
              carefully before using ScoreOBE +.
            </p>
          ) : (
            <p className=" leading-6 text-default text-b2">
              โปรดอ่าน ตรวจสอบ
              และทำความเข้าใจข้อกำหนดและเงื่อนไขในการให้บริการนี้อย่างละเอียดก่อนใช้งาน
              ScoreOBE +
            </p>
          )}
        </Alert>
        <Alert
          radius="md"
          icon={<Icon className=" size-8" IconComponent={IconUserScan} />}
          variant="light"
          color="indigo"
          className="mb-3"
          classNames={{
            icon: "size-6",
            body: " flex ml-1 justify-center",
            title: "-mb-1 text-[15px]",
          }}
          title={
            isEN === "EN" ? (
              <p>Data Linked to You</p>
            ) : (
              <p className=" font-semibold">ข้อมูลที่เชื่อมโยงกับคุณ</p>
            )
          }
        >
          <div className=" justify-start leading-6 text-b2 text-default text-start items-start">
            <p className="mb-2">
              {isEN === "EN"
                ? "The following data from CMU OAuth and ScoreOBE + will be collected after you agree these Terms of Service and linked to your identity to enhance the functionality of web application:"
                : "ข้อมูลต่อไปนี้ที่มาจากการลงชื่อเข้าสู่ระบบผ่าน CMU OAuth และ ScoreOBE + จะถูกเก็บหลังจากคุณยอมรับข้อตกลงและเงื่อนไขในการให้บริการนี้ และเชื่อมโยงกับตัวตนของคุณ เพื่อปรับปรุงการทำงานของเว็บแอปพลิเคชั่น:"}
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
            {isEN === "EN" ? (
              <p className="mt-3 leading-6">
                The developer,{" "}
                <span className="font-bold">
                  {" "}
                  Department of Computer Engineering, Faculty of Engineering,
                  Chiang Mai University
                </span>
                , indicated that the web application's privacy practices may
                include handling of data as described above. For more
                information, see the{" "}
                <a
                  className=" text-blue-500  hover:underline"
                  href="https://www.cmu.ac.th/th/privacy"
                >
                  CMU Privacy Policy{" "}
                </a>
              </p>
            ) : (
              <p className="mt-3 font-normal leading-6">
                นักพัฒนาเว็บแอปพลิเคชั่น{" "}
                <span className="font-bold">
                  {" "}
                  ภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์
                  มหาวิทยาลัยเชียงใหม่
                </span>{" "}
                ได้ระบุว่าแนวปฏิบัติด้านความเป็นส่วนตัวของเว็บแอปพลิเคชั่นอาจรวมถึงการจัดการข้อมูลตามที่อธิบายไว้ด้านบน
                สำหรับข้อมูลเพิ่มเติม ให้ดูที่{" "}
                <a
                  className=" text-blue-500 hover:underline"
                  href="https://www.cmu.ac.th/th/privacy"
                >
                  นโยบายคุ้มครองข้อมูลส่วนบุคคล มหาวิทยาลัยเชียงใหม่{" "}
                </a>{" "}
              </p>
            )}
          </div>
        </Alert>
        <Alert
          radius="md"
          icon={<Icon className=" size-8 stroke-2" IconComponent={IconCPE} />}
          variant="light"
          color="blue"
          className="mb-3"
          classNames={{
            icon: "size-6",
            body: " flex ml-1 justify-center",
            title: "-mb-1 text-[15px]",
          }}
          title={
            isEN === "EN" ? (
              <p>CPE API</p>
            ) : (
              <p className=" font-bold">CPE API</p>
            )
          }
        >
          <div className=" justify-start text-b2 leading-6 text-default text-start items-start">
            <p className="mb-2">
              {isEN === "EN" ? (
                <p>
                  The CPE API is a service designed for Computer Engineering
                  department and Information System and Network Engineering
                  department students at Chiang Mai University. It provides API
                  routes that offer essential information exclusively about
                  instructors and courses within these departments, including
                  course data and instructor information. <br /> The following
                  data from the CPE API has been collected and integrated into
                  ScoreOBE +, linked to your identity to enhance the
                  functionality of the web application:
                </p>
              ) : (
                <p>
                  CPE API
                  เป็นบริการที่ออกแบบมาสำหรับนักศึกษาสาขาวิศวกรรมคอมพิวเตอร์
                  และวิศวกรรมระบบสารสนเทศและเครือข่ายของมหาวิทยาลัยเชียงใหม่
                  บริการนี้ให้บริการ API routes
                  ที่ให้ข้อมูลที่จำเป็นโดยเฉพาะเกี่ยวกับผู้สอนและหลักสูตรภายในสาขาดังกล่าวเท่านั้น
                  รวมถึงข้อมูลหลักสูตรและข้อมูลของผู้สอน <br /> ข้อมูลต่อไปนี้
                  จาก CPE API ได้ถูกเก็บและนำไปใช้ใน ScoreOBE +
                  เป็นที่เรียบร้อยแล้ว และเชื่อมโยงกับตัวตนของคุณ
                  เพื่อปรับปรุงการทำงานของเว็บแอปพลิเคชัน:
                </p>
              )}
            </p>{" "}
            <br />
            <div className="flex gap-8 -mt-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-start">
                  <Icon className="size-5" IconComponent={IconAddressBook} />
                  <span className="ml-2">
                    {isEN === "EN"
                      ? "Name and Surname Instrcutor"
                      : "ชื่อและสกุลของอาจารย์"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-start">
                  <Icon className="size-5" IconComponent={IconBook} />
                  <span className="ml-2">
                    {isEN === "EN" ? "Course information" : "ข้อมูลกระบวนวิชา"}
                  </span>
                </div>
              </div>
            </div>
            {isEN === "EN" ? (
              <p className="mt-3 leading-6">
                The developer,{" "}
                <span className="font-bold">
                  {" "}
                  Department of Computer Engineering, Faculty of Engineering,
                  Chiang Mai University
                </span>
                , have been granted proper authorization and access CPE API data
                by Assistant Professor Dome Potikanond, an instructor in the
                Department of Computer Engineering at Chiang Mai University. For
                more information, see the{" "}
                <a
                  className=" text-blue-500 font-semibold hover:underline"
                  href="https://api.cpe.eng.cmu.ac.th/"
                >
                  CPE API{" "}
                </a>{" "}
              </p>
            ) : (
              <p className="mt-3 font-normal leading-6">
                นักพัฒนาเว็บแอปพลิเคชั่น{" "}
                <span className="font-bold">
                  {" "}
                  ภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์
                  มหาวิทยาลัยเชียงใหม่
                </span>{" "}
                ได้รับการอนุญาตและการเข้าถึงข้อมูล CPE API อย่างถูกต้องจาก
                ผศ.โดม โพธิการนนท์ อาจารย์ประจำภาควิชาวิศวกรรมคอมพิวเตอร์
                มหาวิทยาลัยเชียงใหม่ สำหรับข้อมูลเพิ่มเติม ให้ดูที่{" "}
                <a
                  className=" text-blue-500 font-semibold hover:underline"
                  href="https://api.cpe.eng.cmu.ac.th/"
                >
                  CPE API{" "}
                </a>{" "}
              </p>
            )}
          </div>
        </Alert>

        {isEN === "EN" ? (
          <p className=" text-b2 mb-6 leading-6">
            <p className="font-bold mb-1"> Agreement</p>
            By accessing and using ScoreOBE +, you acknowledge that you have
            read, understood, and agree to be bound by all Terms of Service.
            Your use of this system constitutes irrevocable acceptance of these
            terms. If you do not agree with all these Terms of Service you are
            expressly prohibited from further use of the ScoreOBE + and must
            discontinue immediately by selecting the "Log out" option located in
            the bottom-left corner. Upon logging out, ScoreOBE + will cease any
            data collection through CMU OAuth.
          </p>
        ) : (
          <p className=" text-b2 mb-6 leading-6">
            <p className="font-bold mb-1">ข้อตกลง</p>
            <p className="font-normal">
              การเข้าถึงและใช้งาน ScoreOBE+ แสดงว่าผู้ใช้ยืนยันว่าได้อ่าน
              ทำความเข้าใจ และตกลงที่จะปฏิบัติตามข้อกำหนดในการให้บริการทั้งหมด
              การใช้ ScoreOBE +
              นี้ถือเป็นการยอมรับข้อกำหนดและเงื่อนไขทั้งหมดอย่างไม่อาจเพิกถอนได้
              หากผู้ใช้ไม่ยอมรับข้อกำหนดในการให้บริการ ผู้ใช้จะถูกห้ามใช้
              ScoreOBE + โดยเด็ดขาดและต้องยุติการใช้งานทันที โดยเลือก
              "ออกจากระบบ" ที่มุมล่างซ้าย เมื่อออกจากระบบแล้ว ScoreOBE +
              จะหยุดการเก็บข้อมูลใด ๆ ผ่าน CMU OAuth
            </p>
          </p>
        )}

        {isEN === "EN" ? (
          <div className="mb-4">
            <p className=" text-b2 mb-3 leading-6">
              <span className="font-bold">ScoreOBE +</span> is a web application
              developed as a tool to facilitate lecturers, students, and staff
              in the Faculty of Engineering, Chiang Mai University , in managing
              the documents of the Thai Qualifications Framework for Higher
              Education (TQF:HEd) of the course related to Outcome-Based
              Education (OBE) and announcing scores via this system.
            </p>
            <p className=" text-b2 font-bold mb-3 leading-6">1. Definition </p>

            <Table>
              <Table.Tbody className="text-default">
                {/* Entire Table Row as Control */}
                <Table.Tr className="text-b2 border-t-[1px] font-normal py-b2 w-full ">
                  <Table.Td className="text-start  w-[20%] ">"You"</Table.Td>
                  <Table.Td className="text-start pr-[70px] w-[80%]">
                    Refers to ScoreOBE + web application users
                  </Table.Td>
                </Table.Tr>
                <Table.Tr className="text-b2 border-t-[1px] font-normal py-b2 w-full ">
                  <Table.Td className="text-start  w-[20%] ">"We"</Table.Td>
                  <Table.Td className="text-start pr-[70px] w-[80%]">
                    Refers to the Department of Computer Engineering, Faculty of
                    Engineering, Chiang Mai University.
                  </Table.Td>
                </Table.Tr>
                <Table.Tr className="text-b2 font-normal py-b2 w-full ">
                  <Table.Td className="text-start  w-[25%] ">"System"</Table.Td>
                  <Table.Td className="text-start pr-[70px] w-[75%]">
                    Refers to the ScoreOBE + web application which is provided
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
          <div className=" mb-4">
            <p className=" text-b2 mb-3 font-normal leading-6">
              <span className="font-bold">ScoreOBE + </span> เป็นเว็บแอปพลิเคชัน
              ที่พัฒนาขึ้นเป็นเครื่องมืออำนวยความสะดวกแก่อาจารย์ นักศึกษา
              และบุคลากร คณะวิศวกรรมศาสตร์ มหาวิทยาลัยเชียงใหม่
              ในการจัดการเอกสารกรอบมาตรฐานคุณวุฒิระดับอุดมศึกษาแห่งชาติ (มคอ.)
              ของรายวิชาที่เกี่ยวข้องกับการศึกษาตามผลลัพธ์ (OBE)
              และการประกาศผลคะแนนผ่านระบบนี้
            </p>
            <p className=" text-b2 font-bold mb-3 leading-6">1. นิยาม </p>

            <Table>
              <Table.Tbody className="text-default">
                {/* Entire Table Row as Control */}
                <Table.Tr className="text-b2 border-t-[1px] font-normal py-b2 w-full ">
                  <Table.Td className="text-start  w-[20%] ">"ท่าน"</Table.Td>
                  <Table.Td className="text-start pr-[70px] w-[80%]">
                    หมายถึง ผู้ใช้บริการเว็บแอปพลิเคชั่น ScoreOBE +
                  </Table.Td>
                </Table.Tr>
                <Table.Tr className="text-b2 border-t-[1px] font-normal py-b2 w-full ">
                  <Table.Td className="text-start  w-[20%] ">"เรา"</Table.Td>
                  <Table.Td className="text-start pr-[70px] w-[80%]">
                    หมายถึง ภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์
                    มหาวิทยาลัยเชียงใหม่
                  </Table.Td>
                </Table.Tr>
                <Table.Tr className="text-b2 font-normal py-b2 w-full ">
                  <Table.Td className="text-start  w-[25%] ">"ระบบ"</Table.Td>
                  <Table.Td className="text-start pr-[70px] w-[75%]">
                    หมายถึง เว็บแอปพลิเคชั่น ScoreOBE +
                    ซึ่งให้บริการโดยภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์
                    มหาวิทยาลัยเชียงใหม่ โดยรวมถึงในส่วนที่ได้มีการเปลี่ยนแปลง
                    ปรับปรุง อัปเดต หรือเพิ่มเติมโดยภาควิชาวิศวกรรมคอมพิวเตอร์
                    คณะวิศวกรรมศาสตร์
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
        )}

        {isEN === "EN" ? (
          <p className=" text-b2 mb-6 leading-6">
            <p className="font-bold mb-1 ">2. System Objectives</p>
            <p className="ml-3">
              <li className="mb-1">
                Score Announcements: The system facilitates quick and efficient
                announcement of exam and homework scores, allowing students to
                access their scores in each subject promptly.
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
          <p className=" text-b2 mb-6 leading-6">
            <p className="font-bold mb-1"> 2. วัตถุประสงค์ของระบบ</p>
            <p className="ml-3 font-normal">
              <li className="mb-1">
                ประกาศคะแนนข้อสอบและการบ้าน:
                ระบบช่วยให้อาจารย์สามารถประกาศคะแนนของนักศึกษาได้อย่างรวดเร็วและมีประสิทธิภาพ
                นักศึกษาสามารถตรวจสอบคะแนนของตนเองในแต่ละรายวิชาผ่าน ScoreOBE +
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
          <p className=" text-b2 mb-6 leading-6">
            <p className="font-bold mb-1">3. Amendment</p>
            <p>
              We reserve the right to modify, amend, add, or remove any Terms
              and of Service within the system without prior notice. You are
              responsible for regularly reviewing any updates to these Terms.
              Continued use of the system after any modifications implies that
              you have read, understood, and unconditionally accepted the
              updated Terms. You may not claim lack of awareness of any changes
              to the Terms as a reason for non-compliance.
            </p>
          </p>
        ) : (
          <p className=" text-b2 mb-6 leading-6">
            <p className="font-bold mb-1"> 3. การแก้ไขเพิ่มเติม</p>
            <p className="font-normal">
              เราขอสงวนสิทธิในการแก้ไข เปลี่ยนแปลง เพิ่มเติม ตัดทอน
              บรรดาข้อกำหนดและเงื่อนไขการให้บริการใด ๆ ที่กำหนดไว้ในระบบ
              โดยไม่ต้องแจ้งให้ท่านทราบล่วงหน้า อย่างไรก็ดี
              ท่านมีหน้าที่ติดตามการแก้ไขเปลี่ยนแปลงต่าง ๆ อยู่เสมอ
              และหากภายหลังการแก้ไขเปลี่ยนแปลง ท่านยังคงใช้งานระบบอยู่
              ถือว่าท่านได้อ่านและเข้าใจ
              จึงได้ยอมรับตามข้อกำหนดและเงื่อนไขการใช้บริการที่ได้มีการเปลี่ยนแปลงนี้
              อย่างไม่มีเงื่อนไข
              ท่านไม่อาจอ้างเหตุในการไม่ทราบถึงการเปลี่ยนแปลงข้อกำหนดและเงื่อนไขการใช้บริการมาเป็นเหตุในการฝ่าฝืนข้อกำหนดและเงื่อนไขนี้ได้
            </p>
          </p>
        )}
        {isEN === "EN" ? (
          <p className=" text-b2 mb-6 leading-6">
            <p className="font-bold mb-1">4. Personal Data Protection</p>
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
                className=" text-blue-500  hover:underline"
                href="https://www.cmu.ac.th/th/privacy"
              >
                {" "}
                CMU Privacy Policy.{" "}
              </a>
              This Privacy Policy applies to your use of this system, including
              access to and use of its content, features, technologies, or
              functions, as well as any services related to the system, whether
              existing now or introduced in the future.
            </p>
          </p>
        ) : (
          <p className=" text-b2 mb-6 leading-6">
            <p className="font-bold mb-1">4. การคุ้มครองข้อมูลส่วนบุคคล</p>
            <p className="font-normal">
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
              เพื่อให้สอดคล้องกับแนวทางการให้บริการและหลักเกณฑ์ที่มี
              การเปลี่ยนแปลงไป
              โดยท่านสามารถตรวจสอบนโยบายคุ้มครองข้อมูลส่วนบุคคลที่กำหนดไว้นี้ได้อยู่เสมอที่{" "}
              <a
                className=" text-blue-500  hover:underline"
                href="https://www.cmu.ac.th/th/privacy"
              >
                นโยบายคุ้มครองข้อมูลส่วนบุคคล มหาวิทยาลัยเชียงใหม่{" "}
              </a>
              นโยบายคุ้มครองข้อมูลส่วนบุคคลนี้มีขึ้นเพื่อบังคับใช้กับการใช้ระบบ
              การเข้าถึงและใช้เนื้อหา ฟีเจอร์ เทคโนโลยี
              หรือฟังก์ชันที่ปรากฏในระบบนี้
              ตลอดจนบริการที่เกี่ยวข้องกับการให้บริการของเราในระบบนี้ทั้งที่มีอยู่ในปัจจุบันและที่เราจะได้พัฒนาหรือจัดให้มีขึ้นในอนาคต
            </p>
          </p>
        )}
        {isEN === "EN" ? (
          <p className=" text-b2 mb-6 leading-6">
            <p className="font-bold mb-1">5. Use of System Services</p>
            <p>
              {" "}
              By using this website, you agree to adhere strictly to purposes
              outlined in these terms. Specifically, you agree not to <br /> (1)
              Modify, adapt, translate, or reverse engineer any part of the
              system, system framework, or any of its services, nor allow any
              third party to do so without our explicit authorization. <br />{" "}
              (2) Upload or share any information that is obscene, pornographic,
              defamatory, threatening, or intended to blackmail other members or
              third parties. <br /> (3) Upload any content or information that
              implies our endorsement or approval without prior permission or
              legitimate association with us. <br /> (4) Introduce any viruses,
              malware, or disruptive system, or take any action that could
              interfere with, disrupt, or degrade the functionality of our
              computer systems or the systems of third parties. <br /> (5)
              Utilize software, Trojan Horse programs, time bombs, or similar
              methods that can disrupt or interfere with our system, other
              users, or third-party computer systems, including loading large
              amounts of data or engaging in activities that threaten the
              performance of the service. <br /> (6) Violate any additional
              policies, rules, or announcements that we may introduce as part of
              these terms or in subsequent amendments. <br /> If you breach any
              of these conditions, we reserve the right to suspend your access
              to our services without prior notice.
            </p>
          </p>
        ) : (
          <p className=" text-b2  mb-6 leading-6">
            <p className="font-bold mb-1">5. การใช้บริการระบบ</p>
            <p className="font-normal">
              {" "}
              ท่านตกลงและยอมรับว่า
              ท่านจะใช้เว็บไซต์นี้ตามวัตถุประสงค์ที่ถูกต้องตามภายใต้ข้อกำหนดและเงื่อนไขฉบับนี้ที่ระบุไว้นี้เท่านั้น
              อย่างไรก็ดี ท่านจะไม่กระทำการอย่างใดอย่างหนึ่งดังต่อไปนี้
              <br /> (1) ดำเนินการหรืออนุญาตให้บุคคลที่สามดำเนินการแก้ไขดัดแปลง
              แปล หรือย้อนกระบวนการผลิต (reverse engineer) ส่วนของระบบ
              กรอบของระบบ หรือลอกเลียนแบบส่วนของบริการใด ๆ จากระบบ
              เพื่อวัตถุประสงค์ใด ๆ ก็ตาม เว้นแต่จะได้รับอนุญาตจากทางเราเท่านั้น
              <br /> (2) อัปโหลดข้อมูลที่หยาบคาย ลามก อนาจาร หมิ่นประมาท
              ส่อเสียด คุกคาม ว่ากล่าวให้ร้าย
              ขู่กรรโชกแก่สมาชิกผู้ใช้บริการอื่นหรือบุคคลที่สาม
              <br /> (3) อัปโหลดข้อมูลใด ๆ ลงในระบบ
              ที่แสดงออกหรือมีนัยว่าข้อความดังกล่าวได้รับการสนับสนุนหรือรับรองจากเรา
              โดยไม่เป็นความจริง หรือไม่ได้รับอนุญาตก่อน
              <br /> (4) อัปโหลด ติดประกาศ ส่งไปรษณีย์อิเล็กทรอนิกส์ (E-mail)
              หรือ
              ดำเนินการอื่นใดอันมีผลทำให้เป็นการรบกวนหรือแทรกแซงการทำงานของระบบ
              โดยการส่งไวรัส (Virus) หรือโปรแกรมคอมพิวเตอร์ในรูปแบบต่าง ๆ
              ที่ออกแบบมาเพื่อขัดขวาง ทำลาย จำกัดการทำงานของระบบ
              หรือคอมพิวเตอร์ฮาร์ดแวร์ หรือโปรแกรมซอฟท์แวร์ในการดูแลระบบของเรา
              หรือผู้ใช้บริการอินเตอร์เน็ต หรือบุคคลภายนอก
              <br /> (5) ใช้โปรแกรมคอมพิวเตอร์ซอฟท์แวร์ ขัดขวาง แทรกแซง
              รบกวนการทำงานหรือให้บริการของระบบ
              หรือเครื่องคอมพิวเตอร์และ/หรือระบบคอมพิวเตอร์ของบุคคลภายนอก
              อาทิเช่น ใช้โปรแกรมซอฟท์แวร์ประเภทม้าโทรจัน (Trojan Horse)
              ไวรัสในรูปแบบของไทม์บอมส์ (Time Bombs) ฯลฯ
              ไม่ตั้งใจใช้เว็บไซต์หนักหรือโหลดข้อมูลขนาดใหญ่ใส่ระบบโดยไม่มีเหตุผลอันสมควรหรือจงใจ
              ทำให้เป็นภัยต่อการให้บริการระบบ
              <br /> (6) กระทำการใด ๆ
              อันขัดต่อประกาศหรือนโยบายของเราที่ระบุไว้ในข้อกำหนดและเงื่อนไขฉบับนี้
              และ/หรือการแก้ไขเพิ่มเติมข้อกำหนดและเงื่อนไขที่เราประกาศหรือกำหนดขึ้นภายหลัง
              <br />
              หากเราทราบว่าท่านดำเนินการอย่างหนึ่งอย่างใดอันขัดต่อข้อกำหนดและเงื่อนไขนี้
              เรามีสิทธิระงับการให้บริการแก่ท่านโดยไม่จำเป็นต้องบอกกล่าวล่วงหน้า
            </p>
          </p>
        )}
        {isEN === "EN" ? (
          <p className=" text-b2  mb-6 leading-6">
            <p className="font-bold mb-1">
              {" "}
              6. Right to Collect Data Linked to You
            </p>
            <p>
              You agree and acknowledge that by using our Service, you grant us
              the right to collect and process data associated with you, as
              outlined in these Terms. This data collection is intended for
              purposes of service enhancement, including user experience
              improvement, system functionality optimization, and the
              safeguarding of your personal data. <br /> By continuing to use
              our Service, you consent to and authorize our processing of this
              data as specified. You also understand that, under our Privacy
              Policy, you retain the right to access, correct, or delete your
              data.
            </p>
          </p>
        ) : (
          <p className=" text-b2  mb-6 leading-6">
            <p className="font-bold mb-1">
              6. สิทธิในการนำข้อมูลที่เชื่อมโยงกับคุณเข้าระบบ
            </p>
            <p className="font-normal">
              ท่านตกลงและยอมรับว่า
              ให้สิทธิ์แก่เราในการเก็บรวบรวมและประมวลผลข้อมูลที่เชื่อมโยงกับคุณตามเงื่อนไขที่กำหนดไว้ในนโยบายนี้
              ข้อมูลที่เก็บรวบรวมจะใช้เพื่อประโยชน์ในการพัฒนาบริการของเรา
              รวมถึงการปรับปรุงประสบการณ์ผู้ใช้ ปรับปรุงฟังก์ชั่นการทำงานของระบบ
              และรักษาความปลอดภัยของข้อมูลส่วนบุคคลของท่าน
              <br />
              โดยการใช้บริการนี้ต่อไป
              ท่านยินยอมและอนุญาตให้เราประมวลผลข้อมูลตามวัตถุประสงค์ที่ระบุ
              และเข้าใจว่าท่านมีสิทธิในการเข้าถึง แก้ไข
              หรือลบข้อมูลของท่านได้ตามข้อกำหนดในนโยบายคุ้มครองข้อมูลส่วนบุคคล
            </p>
          </p>
        )}
        {isEN === "EN" ? (
          <p className=" text-b2 mb-6 leading-6">
            <p className="font-bold mb-1">7. Limitation of Our Liability</p>
            <p>
              We disclaim any liability for damages arising from any content
              imported, created, published, or otherwise acted upon by users. By
              using our Service, users waive their right to claim any liability
              from us for such damages. We do not warrant the accuracy of
              information, whether provided by us or by other users. If we are
              notified by any relevant party that information on the system may
              directly or indirectly cause harm to others, we reserve the right
              to assess the matter and may choose to suspend or permanently
              remove such information as deemed appropriate. However, the
              responsibility for any resulting damages remains with the user who
              provided the information. This limitation includes any errors in
              our service provision, data transmission, or actions performed by
              us or other users.
            </p>
          </p>
        ) : (
          <p className=" text-b2 mb-6 leading-6">
            <p className="font-bold mb-1">7. การจำกัดความรับผิดของเรา</p>
            <p className="font-normal">
              {" "}
              เราขอปฏิเสธการรับผิดในความเสียหายที่เกิดขึ้นจากการนำเข้า
              สร้างสรรค์ เผยแพร่ หรือการกระทำอื่นใดของผู้ใช้ทั้งปวง
              โดยผู้ใช้ขอสละสิทธิในการเรียกร้องให้เรารับผิดใด ๆ
              จากความเสียหายดังกล่าว เราไม่รับประกันความถูกต้องของข้อมูลใด ๆ
              ไม่ว่าข้อมูลเหล่านั้นจะเป็นของเราหรือเป็นข้อมูลที่สร้างจากผู้ใช้งานท่านอื่น
              แต่อย่างไรก็ดี
              กรณีที่เราได้รับแจ้งจากผู้ที่เกี่ยวข้องหรือบุคคลที่สามว่าข้อมูลที่ปรากฎบนระบบนั้นอาจก่อให้เกิดความเสียหายกับบุคคลอื่นไม่ว่าโดยตรงหรือโดยอ้อม
              เราขอสงวนสิทธิที่จะพิจารณาเรื่องดังกล่าวตามสมควรเป็นกรณี ๆ
              ซึ่งอาจนำไปสู่การระงับการเผยแพร่ข้อมูลดังกล่าวไม่ว่าจะเป็นการชั่วคราวหรือถาวรตามสมควรแก่กรณี
              ทั้งนี้
              ผู้นำเข้าข้อมูลดังกล่าวนั้นยังคงต้องรับผิดชอบในความเสียหายเช่นเดิม{" "}
              <br />
              ข้อจำกัดความรับผิดของเราดังกล่าวนี้
              ให้รวมไปถึงความผิดพลาดจากการให้บริการ รับส่งข้อมูล
              หรือการกระทำการใด ๆ ของเรา หรือผู้ใช้ท่านอื่น ๆ ด้วย
            </p>
          </p>
        )}

        {isEN === "EN" ? (
          <p className=" text-b2 mb-6 leading-6">
            <p className="font-bold mb-1">
              {" "}
              8. Improvement or Discontinuation of the System
            </p>
            <p>
              {" "}
              We reserve the right to improve, modify, update, or discontinue
              any part of the System or Service without prior notice, to ensure
              optimal functionality and effectiveness. You grant us the right to
              implement these enhancements, modifications, or adjustments to the
              System as needed for these purposes.
            </p>
          </p>
        ) : (
          <p className=" text-b2 mb-6 leading-6">
            <p className="font-bold mb-1">
              {" "}
              8. การปรับปรุงหรือหยุดให้บริการระบบ
            </p>
            <p className="font-normal">
              {" "}
              เราอาจปรับปรุง แก้ไข และเปลี่ยนแปลงใดๆ หรือหยุดให้บริการ
              ได้โดยไม่ต้องแจ้งให้ท่านทราบล่วงหน้า
              เพื่อให้ท่านสามารถใช้งานระบบของเราได้อย่างมีประสิทธิภาพ
              ซึ่งเราอาจปรับปรุง แก้ไข
              และเปลี่ยนแปลงระบบอย่างเล็กน้อยเพื่อวัตถุประสงค์ดังกล่าว
              โดยท่านได้ให้สิทธิ์แก่เรา ดำเนินการและกระทำการปรับปรุง แก้ไข
              และเปลี่ยนแปลงดังกล่าว
            </p>
          </p>
        )}
      </div>
      <div className="flex justify-end mt-6 sticky w-full">
        <Group className="flex w-full gap-2 h-fit items-end justify-between">
          <Button
            loading={loading}
            onClick={() => submitTermsOfService(false)}
            classNames={{ label: "font-bold text-b2" }}
            variant="subtle"
          >
            {isEN === "EN" ? (
              "Log out"
            ) : (
              <p className="font-semibold">ออกจากระบบ</p>
            )}
          </Button>

          <Button
            loading={loading}
            classNames={{ label: "font-bold text-b2" }}
            onClick={() => submitTermsOfService(true)}
          >
            {isEN === "EN" ? (
              "I agree with terms"
            ) : (
              <p className="font-semibold">ฉันยอมรับข้อกำหนด</p>
            )}
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
