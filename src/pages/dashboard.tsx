import { useAppSelector } from "@/store";
import { useEffect } from "react";

export default function Dashboard() {
  const user = useAppSelector((state) => state.user);
  return <div className="bg-white h-full w-full">{user.studentId}</div>;
}
