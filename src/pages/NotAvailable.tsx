"use client"

import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useMantineTheme, Button } from "@mantine/core"

import { ROLE } from "@/helpers/constants/enum"
import { ROUTE_PATH } from "@/helpers/constants/route"
import { useAppDispatch } from "@/store"
import { setShowSidebar, setShowNavbar, setDashboard } from "@/store/config"

export default function NotAvailablePage() {
  const dispatch = useAppDispatch()
  const location = useLocation().pathname
  const theme = useMantineTheme()

  useEffect(() => {
    dispatch(setShowSidebar(true))
    dispatch(setShowNavbar(true))
    const isStudent = location.includes(ROUTE_PATH.STD_DASHBOARD)
    const isAdmin = location.includes(ROUTE_PATH.ADMIN_DASHBOARD)
    localStorage.setItem("dashboard", isStudent ? ROLE.STUDENT : isAdmin ? ROLE.CURRICULUM_ADMIN : ROLE.INSTRUCTOR)
    dispatch(setDashboard(isStudent ? ROLE.STUDENT : isAdmin ? ROLE.CURRICULUM_ADMIN : ROLE.INSTRUCTOR))
  }, [dispatch, location])

  const getViewType = () => {
    if (location.includes(ROUTE_PATH.STD_DASHBOARD)) {
      return location.includes(ROUTE_PATH.HISTOGRAM) ? "Chart" : "PLO"
    } else if (location.includes(ROUTE_PATH.INS_DASHBOARD) || location.includes(ROUTE_PATH.COURSE)) {
      if (location.includes(ROUTE_PATH.HISTOGRAM)) return "Chart"
      if (location.includes(`/${ROUTE_PATH.TQF3}`)) return "TQF3"
      if (location.includes(`/${ROUTE_PATH.TQF5}`)) return "TQF5"
      return "Instructor Dashboard"
    }
    return "Admin"
  }

  const viewType = getViewType()



  return (
    <div className="  h-full" style={{ display: "flex", minHeight: "80vh", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center" }}>
      <div style={{ maxWidth: "450px", width: "100%" }}>
        <h3 className=" text-secondary text-[18px] font-semibold">Desktop Required</h3>
        <p className="text-[13px] mt-4" style={{ color: "#666" }}>
          The <strong style={{ color: theme.primaryColor }}>{viewType} view</strong> isn't optimized for mobile devices.
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "24px" }}>
          <div style={{ fontSize: "42px", color: "#999" }}>📱 ❌</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: theme.primaryColor }}>→</div>
          <div style={{ fontSize: "42px", color: theme.primaryColor }}>💻 ✅</div>
        </div>
        <p className="text-[13px] mt-4" style={{ color: "#666", marginTop: "16px" }}>Please switch to a desktop or tablet for the best experience.</p>
       
     
      </div>
    </div>
  )
}