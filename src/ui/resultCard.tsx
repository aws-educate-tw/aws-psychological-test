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
    <>
      <motion.div
        className="flex flex-col bg-[#FAF5E7] rounded-lg border-4 border-black shadow-[5px_5px_0_#000]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 5 }}
      >
        <div className="flex items-center border-b-4 border-black p-2">
          <div className="flex gap-2">
            <Circle size={20} strokeWidth={4} />
            <Circle size={20} strokeWidth={4} />
          </div>
          <p className="w-full font-cubic text-sm text-center">
            AWS COMMUNITY DAY ON 9/28
          </p>
          <X strokeWidth={4} />
        </div>
        <div className="flex items-center px-4 gap-4 h-56">
          {imageUrl ? (
            <div className="">
              <img
                src={imageUrl}
                alt="result_loading_img"
                className="rounded-lg w-48"
              />
            </div>
          ) : (
            <div className="">
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
          <div className="flex flex-col h-full justify-center items-center">
            <div className="pb-2">
              <p className="text-xl text-start py-2 font-cubic font-outline-1 text-black">
                harry chung
              </p>
              <p className="text-md text-center font-cubic text-black">
                你就是...
              </p>
            </div>
            <div className="">
              {answerService === "API gateway" && (
                <p className="text-3xl text-center font-cubic font-outline-2">
                  {answerService}
                </p>
              )}
              {(answerService === "EC2" ||
                answerService === "S3" ||
                answerService === "ELB" ||
                answerService === "IAM") && (
                <p className="text-5xl font-cubic font-outline-2 py-3 -translate-y-4">
                  {answerService}
                </p>
              )}
              {answerService === "Lambda" && (
                <p className="text-4xl font-cubic font-outline-2 py-3 -translate-y-4">
                  {answerService}
                </p>
              )}

              {(answerService === "Cloudwatch" ||
                answerService === "DynamoDB") && (
                <p className="text-2xl font-cubic font-outline-2 py-3 -translate-y-4">
                  {answerService}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full justify-center items-center gap-2 p-2">
          {serviceResult.tags.map((tag, index) => (
            <p
              key={index}
              className="font-cubic text-sm bg-[#FEA419] rounded-full bg-opacity-80 px-2"
            >
              {tag}
            </p>
          ))}
        </div>
        <hr className="border-y-2 border-black mt-2 -mb-6" />
        <div className="flex justify-evenly -translate-x-2">
          {serviceResult.soulMate && (
            <div className="flex flex-col items-center">
              <p className="font-cubic text-lg text-[#23303F] py-2 translate-y-8">
                靈魂伴侶
              </p>
              <div className="flex items-center">
                <img
                  src={serviceResult.soulMateImg}
                  alt={serviceResult.soulMate}
                  className="w-36 h-36"
                />
                <p className="font-cubic -translate-x-4">
                  {serviceResult.soulMate}
                </p>
              </div>
            </div>
          )}
          {serviceResult.friends && (
            <div className="flex flex-col items-center">
              <p className="font-cubic text-lg text-[#23303F] py-2 translate-y-8">
                偶爾一起玩
              </p>
              <div className="flex items-center">
                <img
                  src={serviceResult.friendsImg}
                  alt={serviceResult.friends}
                  className="w-36 h-36"
                />
                <p className="font-cubic -translate-x-4">
                  {serviceResult.friends}
                </p>
              </div>
            </div>
          )}
        </div>
        <hr className="border-y-2 border-black mb-2 -mt-4" />
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
        {/* <hr className="border-y-2 border-black my-2" />
      <div className="pl-5 pr-3 pb-5 text-wrap">
        <div className="flex items-center gap-2">
          <div>
            <p className="font-cubic text-lg text-[#23303F] py-2">
              AWS 服務小教室
            </p>
            <p className="font-cubic text-sm">
              {serviceResult.service_describe}
            </p>
          </div>
          {serviceResult && (
            <img
              src={serviceResult.serviceImg}
              alt={serviceResult.serviceName}
              className="w-32 h-32"
            />
          )}
        </div>
      </div> */}
      </motion.div>
      <div className="h-6"></div>
      <motion.div
        className="flex flex-col bg-[#FAF5E7] rounded-lg border-4 border-black shadow-[5px_5px_0_#000]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 5 }}
      >
        <div className="flex items-center border-b-4 border-black p-2">
          <div className="flex gap-2">
            <Circle size={20} strokeWidth={4} />
            <Circle size={20} strokeWidth={4} />
          </div>
          <p className="w-full font-cubic text-sm text-center">
            AWS 服務小教室
          </p>
          <X strokeWidth={4} />
        </div>
        <div className="pl-5 pr-3 py-5 text-wrap">
          <div className="flex items-center gap-2">
            <div>
              <p className="font-cubic text-sm">
                {serviceResult.service_describe}
              </p>
            </div>
            {serviceResult && (
              <img
                src={serviceResult.serviceImg}
                alt={serviceResult.serviceName}
                className="w-32 h-32"
              />
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
