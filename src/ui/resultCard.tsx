"use client";

import { Circle, X } from "lucide-react";
import { resultData } from "../lib/resultData";
import { motion } from "framer-motion";

interface Result {
  serviceName: string;
  tags: string[];
  soulMate: string;
  soulMateImg: string;
  friends: string;
  friendsImg: string;
  work_describe: string;
  life_describe: string;
}

export default function ResultCard({
  answerService,
  imageUrl,
}: {
  answerService: string;
  imageUrl: string;
}) {
  const serviceResult = resultData.find(
    (result: Result) => result.serviceName === answerService
  );

  if (!serviceResult) {
    console.log(serviceResult);
    return <></>;
  }

  return (
    <motion.div
      className="flex flex-col bg-[#FAF5E7] rounded-lg border-4 border-black shadow-[5px_5px_0_#000]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 5 }}
    >
      <div className="flex items-center border-b-4 border-black p-2">
        <div className="flex gap-2 w-full">
          <Circle size={20} strokeWidth={4} />
          <Circle size={20} strokeWidth={4} />
        </div>
        <X strokeWidth={4} />
      </div>
      <div className="flex justify-between items-center px-4 py-4 gap-4">
        <div className="flex flex-col flex-grow">
          <p className="text-lg text-start font-cubic text-black ">
            你天生就是
          </p>
          {(answerService === "EC2" ||
            answerService === "S3" ||
            answerService === "ELB" ||
            answerService === "IAM") && (
            <p className="text-5xl font-cubic font-outline-2 py-3 pl-1">
              {answerService}
            </p>
          )}
          {answerService === "Lambda" && (
            <p className="text-4xl font-cubic font-outline-2 py-3">
              {answerService}
            </p>
          )}

          {answerService === "API gateway" && (
            <p className="text-lg font-cubic font-outline-2 py-3">
              {answerService}
            </p>
          )}

          {(answerService === "Cloudwatch" || answerService === "DynamoDB") && (
            <p className="text-2xl font-cubic font-outline-2 py-3">
              {answerService}
            </p>
          )}
          {serviceResult.tags.map((tag, index) => (
            <p key={index} className="font-cubic text-xs">
              {tag}
            </p>
          ))}
        </div>
        {imageUrl ? (
          <div className="min-h-56">
            <img
              src={imageUrl}
              alt="result_loading_img"
              className="rounded-lg w-48"
            />
          </div>
        ) : (
          <div className="min-h-56">
            <motion.p
              className="flex justify-center font-cubic"
              animate={{ scale: [1, 0.9, 1], y: [30, 30, 30], x: [0, 0, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "linear",
              }}
            >
              魔法生成中
            </motion.p>
            <img
              src={
                "./cat-loading.webp"
                // "https://aws-psy-test-image.s3.amazonaws.com/generated_images/2b883c0c-121a-4826-8429-7d31ba3a29fd.png"
              }
              alt="result_img"
              className="rounded-lg w-48"
            />
          </div>
        )}
      </div>
      <div className="flex justify-evenly pb-4">
        {serviceResult.soulMate && (
          <div>
            <p className="font-cubic text-lg text-[#23303F] py-2">靈魂伴侶</p>
            <div className="flex items-center gap-2">
              <img
                src={serviceResult.soulMateImg}
                alt={serviceResult.soulMate}
                className="w-12 h-12"
              />
              <p className="font-cubic">{serviceResult.soulMate}</p>
            </div>
          </div>
        )}
        {serviceResult.friends && (
          <div>
            <p className="font-cubic text-lg text-[#23303F] py-2">偶爾一起玩</p>
            <div className="flex items-center gap-2">
              <img
                src={serviceResult.friendsImg}
                alt={serviceResult.friends}
                className="w-12 h-12"
              />
              <p className="font-cubic">{serviceResult.friends}</p>
            </div>
          </div>
        )}
      </div>
      <hr className="border-y-2 border-black my-2" />
      <div className="flex p-4 gap-2">
        <div className="flex flex-col text-wrap w-1/2 gap-2">
          <p className="font-cubic text-lg text-[#23303F]">在職場上的你...</p>
          <p className="font-cubic text-sm text-wrap w-full">
            {serviceResult.work_describe}
          </p>
        </div>
        <div className="flex flex-col text-wrap w-1/2 gap-2">
          <p className="font-cubic text-lg text-[#23303F]">在生活上的你...</p>
          <p className="font-cubic text-sm text-wrap w-full">
            {serviceResult.life_describe}
          </p>
        </div>
      </div>
      <hr className="border-y-2 border-black my-2" />
      <div className="pl-5 pr-3 pb-5 text-wrap">
        <p className="font-cubic text-lg text-[#23303F] py-2">AWS 服務小教室</p>
        <p className="font-cubic text-sm">{serviceResult.service_describe}</p>
      </div>
    </motion.div>
  );
}
