"use client";

import { useRef, useState, useEffect } from "react";
import { Circle, Upload, X } from "lucide-react";
import { resultData } from "@/lib/resultData";
import { motion } from "framer-motion";
import * as htmlToImage from "html-to-image";
import { Share, ArrowRight, Instagram, Earth, Smile, Cat } from "lucide-react";

interface Result {
  serviceName: string;
  tags: string[];
  soulMate: string;
  soulMateImg: string;
  friends: string;
  friendsImg: string;
  work_describe: string;
  life_describe: string;
  service_describe: string;
  serviceImg: string;
}

export default function SubResultCard({
  isAIpage,
  user_name,
  answerService,
  imageUrl,
  put_url,
  get_url,
  onComplete,
}: {
  isAIpage: boolean;
  user_name: string;
  answerService: string;
  imageUrl: string;
  put_url: string;
  get_url: string;
  onComplete: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageGenerated, setImageGenerated] = useState(false);
  const [resultImageGenerated, setResultImageGenerated] = useState(false);
  const [resultImageUrl, setResultImageUrl] = useState("");

  // useEffect(() => {
  //   if (imageUrl && !isAIpage) {
  //     console.log(imageUrl);
  //     UploadResultImage();
  //   }
  // }, [imageUrl]);

  useEffect(() => {
    if (imageGenerated && !isAIpage) {
      // console.log(imageUrl);
      UploadResultImage();
    }
  }, [imageGenerated]);

  const buildPng = async () => {
    console.log("start building png");
    const element = cardRef.current;
    if (!element) return null;

    let blob = null;
    const minDataLength = 2000000;
    let i = 0;
    const maxAttempts = 10;

    while (!blob || (blob.size < minDataLength && i < maxAttempts)) {
      blob = await htmlToImage.toBlob(element); // Generate Blob (binary)
      i += 1;
    }

    console.log("end building png", blob);
    return blob;
  };

  const UploadResultImage = async () => {
    try {
      console.log("start uploading result image");
      const blob = await buildPng();
      if (!blob) return;
      // console.log(put_url);

      const response = await fetch(put_url, {
        method: "PUT",
        headers: {
          "Content-Type": "", // Content-Type should be empty string to prevent signature mismatch
        },
        body: blob, // Send binary data (the Blob)
      });

      if (response.ok) {
        setResultImageUrl(get_url);
        console.log("result image uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const serviceResult = resultData.find(
    (result: Result) => result.serviceName === answerService
  );

  if (!serviceResult) {
    return <></>;
  }

  const handleShare = async () => {
    if (navigator.share && resultImageUrl) {
      try {
        const response = await fetch(resultImageUrl);
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
    <>
      <motion.div
        className="text-center text-lg font-cubic text-black pb-3"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
      >
        限量圖片已經沒有了，明天再來吧！
      </motion.div>
      {/* bg-[#fbe2e2] bg-[#FAF5E7]*/}
      <motion.div
        className="relative flex flex-col bg-gradient-to-b from-[#ffd2d2] to-[#FAF5E7] rounded-lg border-4 border-black shadow-custom-5px"
        ref={cardRef}
      >
        {resultImageUrl && (
          <img
            src={resultImageUrl}
            alt="resultUrl"
            className="opacity-0 absolute top-0 left-0 w-full h-full object-cover select-none"
            onLoad={() => {
              setTimeout(() => {
                setResultImageGenerated(true);
                onComplete();
              }, 1000);
            }}
          />
        )}

        <div className="flex items-center border-b-4 border-black p-2">
          <div className="flex gap-2">
            <Circle size={20} strokeWidth={4} />
            <Circle size={20} strokeWidth={4} />
          </div>
          <p className="w-full font-cubic text-sm text-center">
            你是哪種 AWS 服務？
          </p>
          <div className="">
            <X strokeWidth={4} />
          </div>
        </div>
        <div className="flex items-center px-4 gap-4 justify-evenly">
          {imageUrl ? (
            <div className="w-1/2 mt-4 rounded-lg">
              <img
                src={imageUrl}
                alt="result_loading_img"
                className="rounded-lg border-r-4 border-b-4 border-t-0 border-l-0 border-black"
                crossOrigin="anonymous"
                onLoad={() => setImageGenerated(true)}
              />
            </div>
          ) : (
            <div className="w-1/2 mt-4 rounded-lg">
              <img
                src="./AI-magic-generating.gif"
                alt="result_img"
                className="rounded-lg border-r-4 border-b-4 border-t-0 border-l-0 border-black"
              />
            </div>
          )}
          <div className="flex flex-col h-full justify-center items-center">
            <div className="flex flex-col items-center">
              <p className="text-xl text-start font-cubic font-outline-1 text-black pb-2">
                {user_name}
              </p>
              <p className="text-md text-center font-cubic text-black pb-2 text-wrap">
                你就是...
              </p>
            </div>
            <div className="flex items-center">
              {(answerService === "EC2" ||
                answerService === "S3" ||
                answerService === "ELB" ||
                answerService === "IAM") && (
                <p className="text-7xl text-center font-cubic font-outline-2 select-none">
                  {answerService}
                </p>
              )}
              {answerService === "Lambda" && (
                <p className="text-5xl text-center font-cubic font-outline-2 select-none">
                  {answerService}
                </p>
              )}

              {(answerService === "Cloudwatch" ||
                answerService === "DynamoDB" ||
                answerService === "API gateway") && (
                <p className="text-3xl text-center font-cubic font-outline-2 select-none">
                  {answerService}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full justify-evenly items-center p-2 mt-2 flex-wrap">
          {serviceResult.tags.map((tag, index) => (
            <p
              key={index}
              className="text-center font-cubic text-sm bg-[#FEA419] border-r-[3px] border-b-[3px] border-t-0 border-l-0 border-black text-black px-1 select-none whitespace-nowrap"
            >
              {tag}
            </p>
          ))}
        </div>
        <hr className="border-y-2 border-black my-2" />
        <div className="flex justify-evenly px-5 gap-5">
          {serviceResult.soulMate && (
            <div className="flex flex-col items-center w-1/2 gap-2">
              <p className="font-cubic text-lg text-[#23303F] select-none flex-wrap">
                靈魂伴侶
              </p>
              <div className="flex justify-evenly items-center gap-2">
                <img
                  src={serviceResult.soulMateImg}
                  alt={serviceResult.soulMate}
                  className="w-2/5 select-none"
                />
                <p className="font-cubic select-none">
                  {serviceResult.soulMate}
                </p>
              </div>
            </div>
          )}
          {serviceResult.friends && (
            <div className="flex flex-col items-center w-1/2 gap-2">
              <p className="font-cubic text-lg text-[#23303F] select-none">
                泛泛之交
              </p>
              <div className="flex justify-evenly items-center gap-2">
                <img
                  src={serviceResult.friendsImg}
                  alt={serviceResult.friends}
                  className="w-2/5 select-none"
                />
                <p className="font-cubic select-none">
                  {serviceResult.friends}
                </p>
              </div>
            </div>
          )}
        </div>
        <hr className="border-y-2 border-black my-2" />
        <div className="flex px-4 gap-2">
          <div className="flex flex-col text-wrap w-1/2 gap-2">
            <p className="font-cubic text-lg text-[#23303F] select-none">
              在職場上的你...
            </p>
            <p className="font-cubic text-sm text-wrap w-full select-none">
              {serviceResult.work_describe}
            </p>
          </div>
          <div className="flex flex-col text-wrap w-1/2 gap-2">
            <p className="font-cubic text-lg text-[#23303F] select-none">
              在生活上的你...
            </p>
            <p className="font-cubic text-sm text-wrap w-full select-none">
              {serviceResult.life_describe}
            </p>
          </div>
        </div>
        <hr className="border-y-2 border-black my-2" />
        <div className="px-4 pb-4 text-wrap">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1 w-4/5">
              <p className="font-cubic text-lg text-[#23303F] select-none">
                AWS 服務小教室
              </p>
              <p className="font-cubic text-sm text-wrap select-none">
                {serviceResult.service_describe}
              </p>
            </div>
            {serviceResult && (
              <div className="w-1/5">
                <img
                  src={serviceResult.serviceImg}
                  alt={serviceResult.serviceName}
                  className="select-none"
                />
              </div>
            )}
          </div>
        </div>
        <footer className="px-4 text-center text-gray-400">
          <small className="mb-2 text-xs block font-cubic">
            &copy;AWS Educate 6th Ambassadors
          </small>
        </footer>
      </motion.div>
      {resultImageGenerated ? (
        <motion.div
          className="p-5 text-sm font-cubic text-[#23303F] flex flex-grow w-full justify-center items-center gap-2 h-16"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
          }}
        >
          <button
            className="text-center text-lg font-cubic text-white"
            onClick={handleShare}
          >
            長按上方儲存
          </button>
          <button onClick={handleShare}>
            <Share size={14} className="" color="white" />
          </button>
        </motion.div>
      ) : (
        <div className="p-5 text-sm font-cubic text-[#23303F] flex flex-grow w-full justify-center items-center">
          <motion.button
            className="text-center text-lg font-cubic text-white"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "linear",
            }}
          >
            圖片快處理好了...
          </motion.button>
        </div>
      )}
      <div className="flex flex-col py-3 px-2 gap-2 bg-[#FAF5E7] rounded-lg border-4 border-b-0 rounded-b-none border-black shadow-custom-5px">
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
      </div>
    </>
  );
}
