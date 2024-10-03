"use client";
import { motion } from "framer-motion";
import { Share, ArrowRight, Instagram, Earth, Smile, Cat } from "lucide-react";

export default function PermanentResultCard({
  permanentResultUrl,
  user_name,
}: {
  permanentResultUrl: string;
  user_name: string;
}) {
  const handleShare = async () => {
    if (navigator.share && permanentResultUrl) {
      try {
        const response = await fetch(permanentResultUrl);
        const blob = await response.blob();
        const file = new File([blob], "result-image.png", { type: blob.type });
        await navigator.share({
          title: "",
          files: [file],
        });
      } catch (error) {
        console.error("分享失敗:", error);
      }
    } else {
      alert("您的瀏覽器不支持 Web 分享，請手動下載並上傳圖片到 Instagram。");
    }
  };
  return (
    <motion.div
      animate={{ opacity: [0, 1] }}
      transition={{
        duration: 3,
      }}
    >
      <div>
        <div className="bg-gradient-to-b from-[#ffe0fa] to-[#FAF5E7] rounded-lg border-1 border-black shadow-custom-3px">
          <img
            src={permanentResultUrl}
            alt="permanentResultImage"
            className="top-0 left-0 w-full h-full object-cover select-none rounded-lg border-none"
          />
        </div>
      </div>
      <div className="w-full flex justify-center pt-4 pb-6 gap-1 text-lg font-cubic text-white">
        <button className="flex items-center gap-2" onClick={handleShare}>
          長按上方儲存
          <Share size={16} color="white" />
        </button>
      </div>
      <motion.div
        className="flex flex-col py-3 px-2 gap-2 bg-[#FAF5E7] rounded-lg border-4 border-b-0 rounded-b-none border-black shadow-custom-3px"
        animate={{ opacity: [0, 1] }}
        transition={{
          duration: 3,
          delay: 1.5,
        }}
      >
        <a
          href="https://www.instagram.com/awseducatestdambtw/"
          className="flex justify-start w-full items-center gap-2 bg-gradient-to-bl from-[#d27fe799] to-[#ffffff6b] active:bg-gradient-to-tl rounded-md p-1 border-2 border-black"
        >
          <Instagram size={20} />
          <div className="font-cubic">
            <p>追蹤 AWS Educate Instagram</p>
          </div>
        </a>

        <a
          href="https://awscmd.tw/"
          className="flex justify-start w-full items-center gap-2 bg-gradient-to-bl from-[#d27fe799] to-[#ffffff6b] active:bg-gradient-to-tl rounded-md p-1 border-2 border-black"
        >
          <Smile size={20} />
          <div className="font-cubic">
            <p>9/28 AWS Community Day 報名中！</p>
          </div>
        </a>

        <a
          href="https://aws.amazon.com/tw/education/awseducate/"
          className="flex justify-start w-full items-center gap-2 bg-gradient-to-bl from-[#d27fe799] to-[#ffffff6b] active:bg-gradient-to-tl rounded-md p-1 border-2 border-black"
        >
          <Earth size={20} />
          <div className="font-cubic">
            <p>註冊 AWS Educate</p>
          </div>
        </a>

        <a
          href="https://pages.awscloud.com/TW-CHT-Startup-Activate.html"
          className="flex justify-start w-full items-center gap-2 bg-gradient-to-bl from-[#ffbca2d3] to-[#9cabab6b] active:bg-gradient-to-tl rounded-md p-1 border-2 border-black"
        >
          <ArrowRight size={20} />
          <div className="font-cubic">
            <p>歡迎學生申請 Activate Program</p>
          </div>
        </a>

        <a
          href="https://pages.awscloud.com/tw-event-signup_Registration.html"
          className="flex justify-start w-full items-center gap-2 bg-gradient-to-bl from-[#ffbca2d3] to-[#9cabab6b] active:bg-gradient-to-tl rounded-md p-1 border-2 border-black"
        >
          <ArrowRight size={20} />
          <div className="font-cubic">
            <p>免費註冊 AWS 帳號拿贈品</p>
          </div>
        </a>

        <a
          href="https://pages.awscloud.com/2024-Summit-Claude-Model.html/"
          className="flex justify-start w-full items-center gap-2 bg-gradient-to-bl from-[#ffbca2d3] to-[#9cabab6b] active:bg-gradient-to-tl rounded-md p-1 border-2 border-black"
        >
          <ArrowRight size={20} />
          <div className="font-cubic">
            <p>限時免費體驗 Claude 3.5 模型</p>
          </div>
        </a>
      </motion.div>
    </motion.div>
  );
}
