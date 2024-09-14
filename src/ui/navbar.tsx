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
    <div className="flex items-center bg-[#FAF5E7] p-1 border-black border-b-2 z-10">
      {/* <p className="font-cubic ml-2 font-black text-sm">AWS</p> */}

      <a href="https://aws.amazon.com/tw/education/awseducate">
        <img src="/AWSEducate.png" alt="heart" className="h-6 ml-1 mr-1" />
      </a>
      <span
        className="flex flex-grow justify-center
       items-center text-sm font-cubic opacity-70"
      >
        Made by AWS Educate 6th Ambassadors
      </span>
      <p className="font-cubic text-xs font-black pr-2 text-center">
        {currentTime}
      </p>
    </div>
  );
}
