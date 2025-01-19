// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import scoreobe from "@/assets/image/scoreOBElogowhite.png";
// import { FaArrowLeftLong } from "react-icons/fa6";
// import { Button, Checkbox } from "@mantine/core";
// import {
//   getUserName,
//   goToDashboard,
//   sortData,
// } from "@/helpers/functions/function";
// import { useAppDispatch, useAppSelector } from "@/store";
// import { updateUser } from "@/services/user/user.service";
// import { setUser } from "@/store/user";
// import { motion } from "framer-motion";
// import { getDepartment } from "@/services/faculty/faculty.service";
// import { isEqual } from "lodash";
// import { setShowSidebar, setShowNavbar } from "@/store/config";
// import { IModelFaculty } from "@/models/ModelFaculty";
// import { ROLE } from "@/helpers/constants/enum";

// export default function SelectDepartment() {
//   const navigate = useNavigate();
//   const user = useAppSelector((state) => state.user);
//   const dispatch = useAppDispatch();
//   const [faculty, setFaculty] = useState<Partial<IModelFaculty>>({});
//   const [checkedItems, setCheckedItems] = useState<string[]>([]);
//   const [notChange, setNotChange] = useState(true);

//   useEffect(() => {
//     dispatch(setShowSidebar(false));
//     dispatch(setShowNavbar(false));
//     const fetchDep = async () => {
//       const res = await getDepartment(user.facultyCode);
//       if (res) {
//         sortData(res.department, "departmentEN", "string");
//         setFaculty(res);
//       }
//     };
//     fetchDep();
//   }, []);

//   useEffect(() => {
//     if (user.departmentCode?.length) {
//       setCheckedItems([...user.departmentCode]);
//       setNotChange(true);
//     }
//   }, [user]);

//   const handleCheckboxChange = (key: string, checked: boolean) => {
//     const selected = [...checkedItems];
//     if (checked) selected.push(key);
//     else selected.splice(selected.indexOf(key), 1);
//     setNotChange(isEqual(user.departmentCode, selected));
//     setCheckedItems([...selected]);
//   };

//   const getStart = async () => {
//     const res = await updateUser({ departmentCode: checkedItems });
//     if (res) {
//       dispatch(setUser(res));
//       goToDashboard(user.role);
//     }
//   };

//   return (
//     <div className="bg-[rgba(96,127,194,0.21)] custom-radial-gradient h-screen w-screen">
//       <div className="absolute top-12 left-12 flex justify-between items-center gap-3">
//         {!!user.departmentCode?.length && (
//           <Button
//             className="!rounded-full !h-fit p-2 bg-white bg-opacity-0 hover:bg-[#d4d4d4] hover:bg-opacity-100 text-white hover:text-primary"
//             onClick={() => navigate(-1)}
//           >
//             <FaArrowLeftLong size={20} />
//           </Button>
//         )}
//         <img src={scoreobe} alt="CMULogo" className="h-[35px] " />
//         <p className="text-white text-[20px] font-semibold">
//           ScoreOBE <span className=" text-[#FFCD1B]"> +</span>
//         </p>
//       </div>
//       <div className=" h-screen w-screen flex justify-between  px-[65px] sm:px-[80px] ipad11:px-[90px] macair133:px-32 items-center font-sf-pro">
//         <div className="text-white">
//           <motion.div
//             initial={{
//               x: -200,
//             }}
//             animate={{ x: 0 }}
//             transition={{ duration: 0.5, type: "spring", stiffness: 80 }}
//           >
//             {/* <div className=" text-[36px] translate-y-[-16px] font-semibold">
//               Welcome to{" "}
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
//                 {" "}
//                 ScoreOBE +{" "}
//               </span>{" "}
//             </div> */}
//             <div className=" font-semibold -mt-1 translate-y-[-4px] text-[22px] ipad11:text-[24px]">
//               {getUserName(user, 1)}
//             </div>
//             <div className=" font-[500] text-[#fec38b] text-h3 ipad11:text-h2">
//               {faculty.facultyEN}
//             </div>
//           </motion.div>
//         </div>
//         <motion.div
//           initial={{
//             x: 200,
//           }}
//           animate={{ x: 0 }}
//           transition={{ duration: 0.5, type: "spring", stiffness: 80 }}
//         >
//           <div className="flex flex-col justify-end">
//             <div
//               className="bg-[rgba(78,78,80,0.30)] rounded-[25px] mb-5 flex-col p-6 h-fit scroll-smooth"
//               style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
//             >
//               <div className="text-white font-semibold text-[18px] mb-[2px] ">
//                 Select department
//               </div>
//               {[ROLE.STUDENT, ROLE.TA].includes(user.role) ? (
//                 <div className="text-[#fcc087] text-b2 font-semibold mb-4">
//                   {/* Select a department */}
//                 </div>
//               ) : (
//                 <div className="text-[#fcc087] text-b2 font-semibold mb-4">
//                   Select up to 4 departments <br /> in which you are responsible
//                   for teaching.
//                 </div>
//               )}
//               <div className="flex flex-1 flex-col overflow-y-scroll gap-4 text-white h-[300px] sm:h-[350px] ipad11:h-[430px]">
//                 {faculty.department?.map((key) => {
//                   const isChecked = checkedItems.includes(key.codeEN);
//                   const disabled =
//                     checkedItems.length ==
//                       ([ROLE.STUDENT, ROLE.TA].includes(user.role) ? 1 : 4) &&
//                     !checkedItems.includes(key.codeEN);
//                   return (
//                     <div
//                       key={key.codeEN}
//                       className={`w-[480px] min-h-[50px] cursor-pointer text-b2 font-semibold rounded-[10px] pl-4 scroll-auto items-center flex hover:bg-[rgba(182,187,221,0.56)] ${
//                         isChecked
//                           ? "bg-[rgba(49,72,113,0.75)]"
//                           : "bg-[rgba(181,181,181,0.40)]"
//                       } ${disabled ? "text-gray-300" : ""}`}
//                       onClick={() => {
//                         disabled
//                           ? ""
//                           : handleCheckboxChange(key.codeEN, !isChecked);
//                       }}
//                     >
//                       <Checkbox
//                         classNames={{
//                           input:
//                             "bg-black bg-opacity-0 border-[1.5px] border-white cursor-pointer disabled:bg-gray-400",
//                           body: "mr-3",
//                         }}
//                         checked={isChecked}
//                         disabled={disabled}
//                         readOnly
//                       />
//                       {key.departmentEN} ({key.codeEN})
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//             {!!checkedItems.length && !notChange && (
//               <motion.button
//                 whileHover={{
//                   scale: 1.05,
//                   boxShadow: "0px 0px 8px 0px rgb(255,255,255,255)",
//                   textShadow: "0px 0px 8px 0px rgb(255,255,255,255)",
//                 }}
//                 className="rounded-[15px]"
//               >
//                 <Button
//                   className="!rounded-[15px] !w-full text-[#6C67A5] !h-12 !text-[16px] bg-[#ffffff] bg-opacity-75 hover:bg-opacity-90 hover:bg-[#ffffff] hover:text-[#6C67A5]"
//                   onClick={() => getStart()}
//                 >
//                   Get Start
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="15"
//                     height="15"
//                     viewBox="0 0 15 15"
//                     fill="none"
//                     className=" ml-3 "
//                   >
//                     <path
//                       d="M0.9375 8.4373L12.0563 8.4373L8.65312 12.5248C8.49399 12.7163 8.41744 12.9631 8.44029 13.211C8.46315 13.4589 8.58355 13.6875 8.775 13.8467C8.96645 14.0058 9.21328 14.0824 9.46118 14.0595C9.70908 14.0367 9.93775 13.9163 10.0969 13.7248L14.7844 8.0998C14.8159 8.05506 14.8441 8.00806 14.8688 7.95918C14.8688 7.9123 14.8687 7.88418 14.9344 7.8373C14.9769 7.72981 14.9991 7.61539 15 7.4998C14.9991 7.38422 14.9769 7.2698 14.9344 7.1623C14.9344 7.11543 14.9344 7.0873 14.8688 7.04043C14.8441 6.99155 14.8159 6.94454 14.7844 6.8998L10.0969 1.2748C10.0087 1.16898 9.89835 1.08387 9.77358 1.02554C9.64882 0.967205 9.51273 0.937079 9.375 0.937304C9.15595 0.936875 8.94367 1.01316 8.775 1.15293C8.68007 1.23163 8.6016 1.32829 8.54408 1.43736C8.48656 1.54644 8.45113 1.66579 8.43981 1.78858C8.42849 1.91137 8.4415 2.03519 8.47811 2.15294C8.51471 2.27069 8.57419 2.38007 8.65312 2.4748L12.0563 6.5623L0.9375 6.5623C0.68886 6.5623 0.450402 6.66108 0.274587 6.83689C0.0987711 7.01271 0 7.25116 0 7.4998C0 7.74844 0.0987711 7.9869 0.274587 8.16272C0.450402 8.33853 0.68886 8.4373 0.9375 8.4373Z"
//                       fill="#6C67A5"
//                     />
//                   </svg>
//                 </Button>
//               </motion.button>
//             )}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
