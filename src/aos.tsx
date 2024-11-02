import { useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export const AOSInit = () => {
  const scrollRef = useRef(0);

  useEffect(() => {
    AOS.init();

    const handleScroll = () => {
      if (scrollRef.current <= 1000) {
        scrollRef.current += 10;
        console.log("ScrollRef:", scrollRef.current); // Log scrollRef value on scroll
      } else {
        AOS.refresh();
      }
    };

    window.addEventListener("scroll", handleScroll, true);

   
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []); 
  return null;
};
