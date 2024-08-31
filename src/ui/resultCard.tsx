"use client";

import { useRef, useState, useEffect } from "react";
// import domtoimage from "dom-to-image";
import domtoimage from "dom-to-image";
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
  user_name,
  answerService,
  imageBase64,
}: {
  user_name: string;
  answerService: string;
  imageBase64: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  // const [showdownloadable, setShowDownloadable] = useState(false);

  useEffect(() => {
    if (imageBase64) {
      const img = new Image();
      img.src = `data:image/png;base64,${imageBase64}`;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }
        const imageUrl = canvas.toDataURL("image/png");
        setImageSrc(imageUrl);
      };
    }
  }, [imageBase64]);

  useEffect(() => {
    if (imageLoaded) {
      generateImage();
    }
  }, [imageLoaded]);

  const generateImage = async () => {
    if (cardRef.current && !isImageProcessing) {
      setIsImageProcessing(true);
      try {
        const scale = 2;
        const node = cardRef.current;

        const dataUrl = await domtoimage.toJpeg(node, {
          quality: 0.95,
          width: node.clientWidth * scale,
          height: node.clientHeight * scale,
          style: {
            transform: "scale(" + scale + ")",
            transformOrigin: "top left",
            width: node.clientWidth + "px",
            height: node.clientHeight + "px",
          },
        });

        if (dataUrl) {
          setResultUrl(dataUrl);
        }
      } catch (error) {
        console.error("Failed to capture image:", error);
      } finally {
        setIsImageProcessing(false);
      }
    }
  };

  const downloadImage = () => {
    if (resultUrl) {
      const link = document.createElement("a");
      link.href = resultUrl;
      link.download = "result-image.jpeg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 5 }}
        ref={cardRef}
        onClick={downloadImage} // Added onClick handler
      >
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
          {imageSrc ? (
            <div className="w-1/2 mt-4 shadow-custom-5px rounded-lg">
              <img
                src={imageSrc}
                alt="result_loading_img"
                className="rounded-lg"
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          ) : (
            <div className="w-1/2 mt-4 shadow-custom-5px rounded-lg">
              <img
                src="./AI-magic-generating.gif"
                alt="result_img"
                className="rounded-lg"
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
              className="text-center font-cubic text-sm bg-[#FEA419] shadow-custom-3px text-black px-1 select-none whitespace-nowrap"
            >
              {tag}
            </p>
          ))}
        </div>
        <hr className="border-y-2 border-black my-2" />
        <div className="flex justify-evenly px-5 gap-5">
          {serviceResult.soulMate && (
            <div className="flex flex-col items-center w-1/2 gap-2">
              <p className="font-cubic text-lg text-[#23303F] select-none text-wrap">
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
              <p className="font-cubic text-lg text-[#23303F] select-none text-wrap">
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
      {/* {showdownloadable && (
        <div className="p-5 text-sm font-cubic text-[#23303F] flex flex-grow w-full justify-center items-center">
          <motion.button
            className="text-center text-lg font-cubic text-[#23303F]"
            animate={{ opacity: [0.5, 1, 0.5] }}
            onClick={handleShare}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            }}
          >
            分享到 Instagram
          </motion.button>
        </div>
      )} */}
    </>
  );
}
