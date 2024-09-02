"use client";

import { useRef, useState, useEffect } from "react";
import { Circle, X } from "lucide-react";
import { resultData } from "@/lib/resultData";
import { motion } from "framer-motion";
import * as htmlToImage from "html-to-image";

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

export default function ResultCard({
  user_name,
  answerService,
  imageUrl,
}: {
  user_name: string;
  answerService: string;
  imageUrl: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageGenerated, setImageGenerated] = useState(false);
  const [resultImageGenerated, setResultImageGenerated] = useState(false);
  const [resultImageUrl, setResultImageUrl] = useState("");

  useEffect(() => {
    if (imageGenerated) {
      generateImage();
    }
  }, [imageGenerated]);

  const buildPng = async () => {
    const element = cardRef.current;
    if (!element) return "";

    let dataUrl = "";
    const minDataLength = 2000000;
    let i = 0;
    const maxAttempts = 10;

    while (dataUrl.length < minDataLength && i < maxAttempts) {
      dataUrl = await htmlToImage.toPng(element);
      i += 1;
    }

    return dataUrl;
  };

  const generateImage = async () => {
    try {
      const data = await buildPng();
      const base64data = data.split(",")[1];
      // console.log(base64data);

      const response = await fetch(
        "https://gnn1p9jyed.execute-api.us-east-1.amazonaws.com/dev/result-upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image_data: base64data }),
        }
      );
      const result = await response.json();
      setResultImageUrl(result.image_url);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share && resultImageUrl) {
      try {
        const response = await fetch(resultImageUrl);
        const blob = await response.blob();
        const file = new File([blob], "result-image.png", { type: blob.type });
        await navigator.share({
          title: "分享到Instagram",
          files: [file],
        });
      } catch (error) {
        console.error("分享失敗:", error);
      }
    } else {
      alert("您的瀏覽器不支持 Web 分享，請手動下載並上傳圖片到 Instagram。");
    }
  };

  const serviceResult = resultData.find(
    (result: Result) => result.serviceName === answerService
  );

  if (!serviceResult) {
    return <></>;
  }

  return (
    <>
      <motion.div
        className="relative flex flex-col bg-[#FAF5E7] rounded-lg border-4 border-black shadow-custom-5px"
        animate={
          resultImageGenerated ? { opacity: [1] } : { opacity: [0.3, 1, 0.3] }
        }
        transition={
          resultImageGenerated
            ? {}
            : {
                repeat: Infinity,
                duration: 2.5,
                ease: "linear",
              }
        }
        ref={cardRef}
      >
        {resultImageUrl && (
          <img
            src={resultImageUrl}
            alt="resultUrl"
            className="opacity-0 absolute top-0 left-0 w-full h-full object-cover"
            onLoad={() => {
              console.log("Image loaded successfully");
              setResultImageGenerated(true);
            }}
          />
        )}
        <div className="flex items-center border-b-4 border-black p-2">
          <div className="flex gap-2">
            <Circle size={20} strokeWidth={4} />
            <Circle size={20} strokeWidth={4} />
          </div>
          <p className="w-full font-cubic text-sm text-center">
            AWS COMMUNITY DAY ON 9/28
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
        <div className="px-4 pb-5 text-wrap">
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
      </motion.div>
      {resultImageGenerated ? (
        <div className="p-5 text-sm font-cubic text-[#23303F] flex flex-grow w-full justify-center items-center">
          <motion.button
            className="text-center text-lg font-cubic text-white"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            }}
            onClick={handleShare}
          >
            分享到 Instagram
          </motion.button>
        </div>
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
            圖片處理中...
          </motion.button>
        </div>
      )}
    </>
  );
}
