import { useState, useEffect } from "react";

export default function Navbar() {
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const timeString = `${hours}:${minutes} ${ampm}`;
      setCurrentTime(timeString);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [currentTime, setCurrentTime] = useState<string>("");

  return (
    <div className="flex items-center bg-[#FAF5E7] p-1 border-black border-b-2">
      {/* <p className="font-cubic ml-2 font-black text-sm">AWS</p> */}
      <img src="/AWSEducate.png" alt="heart" className="h-6 ml-1 mr-3" />
      <span
        className="flex flex-grow justify-center
       items-center text-sm font-cubic opacity-70"
      >
        Made by 6th AWS Ambassador
        <img src="/heart.png" alt="heart" className="w-6 h-6 p-1 m-1" />
      </span>
      <p className="font-cubic text-sm font-black pr-2">{currentTime}</p>
    </div>
  );
}
