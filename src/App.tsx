"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "./ui/navbar";
import { multipleChoices } from "./lib/multipleChoices";
import ResultCard from "./ui/resultCard";
import QuestionAnswers from "./ui/questionAnswers";
import IntermediatePage from "./ui/intermediatePage";

export default function App() {
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [startTest, setStartTest] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [answerService, setAnswerService] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [showIntermediate, setShowIntermediate] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  useEffect(() => {
    if (showResult) {
      calculateResult();
    }
  }, [showResult]);

  useEffect(() => {
    const promptMap: { [key: string]: string } = {
      EC2: "A cute cat using a computer with a dark background",
      S3: "A cute cat playing with a USB with a dark background",
      Lambda: "A cute cat playing with a robot with a dark background",
      IAM: "A cute cat holding a key with a dark background",
      Cloudwatch: "A cute cat using a camera with a dark background",
      DynamoDB: "A cute cat hiding in a folder with a dark background",
      "API gateway":
        "A cute cat talking between two dogs with a dark background",
      ELB: "A cute cat being a traffic police officer with a dark background",
    };

    const prompt = promptMap[answerService];

    if (prompt) {
      const requestBody = {
        data: {
          model_id: "stability.stable-diffusion-xl-v1",
          prompt: prompt,
        },
      };
      // generateImage(requestBody);
    }
  }, [answerService]);

  const handleStart = () => {
    setStartTest(true);
    setStep(0);
    setAnswers([]);
    setShowResult(false);
  };

  const handleEnd = () => {
    setShowResult(true);
  };

  const handleNext = (option: string) => {
    setSelectedOption(option);
    setShowIntermediate(true);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      setStartTest(false);
    }
  };

  const calculateResult = () => {
    const serviceCounts: Record<string, number> = {
      EC2: 0,
      Lambda: 0,
      DynamoDB: 0,
      S3: 0,
      ELB: 0,
      Cloudwatch: 0,
      "API gateway": 0,
      IAM: 0,
    };

    answers.forEach((answer, index) => {
      const selectedIndex = multipleChoices[index].options.indexOf(answer);
      const selectedService = multipleChoices[index].services[selectedIndex];
      serviceCounts[selectedService]++;
    });

    const maxCount = Math.max(...Object.values(serviceCounts));
    const topServices = Object.keys(serviceCounts).filter(
      (service) => serviceCounts[service] === maxCount
    );

    const resultService =
      topServices[Math.floor(Math.random() * topServices.length)];
    setAnswerService(resultService);
  };

  const generateImage = async (requestBody: {
    data: { model_id: string; prompt: string };
  }) => {
    try {
      const response = await fetch(
        "https://gnn1p9jyed.execute-api.us-east-1.amazonaws.com/dev/generate-image",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      setImageUrl(data.image_url);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-full max-w-md h-screen flex flex-col">
        <Navbar />
        <div
          className={`p-8 flex-grow ${
            !startTest
              ? "bg-container bg-center relative bg-gradient-to-t from-[#BACBCB] to-[#95a3a3]"
              : "bg-cover bg-center relative"
          } ${
            showResult
              ? "bg-container bg-center relative bg-gradient-to-b from-[#BACBCB] to-[#95a3a3]"
              : ""
          }`}
          style={
            !startTest || showResult
              ? { backgroundImage: "" }
              : { backgroundImage: "url('/Office.png')" }
          }
        >
          {!startTest ? (
            <div className="flex flex-col h-full">
              <div className="flex flex-col h-full">
                <div className="whitespace-nowrap">
                  <motion.p
                    className="w-full text-center font-cubic text-xl text-black drop-shadow-[1px_1px_0_#FEFEFE]"
                    animate={{ x: [-30, 0, 30], opacity: [0, 1, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: "linear",
                    }}
                  >
                    ~ Ambassador day in community day ~
                  </motion.p>
                </div>
                <motion.div
                  className="py-6"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                  }}
                >
                  <p className="text-center font-cubic text-3xl text-white drop-shadow-[3px_3px_0_#000] py-2">
                    你是哪種
                  </p>
                  <p className="text-center font-cubic text-6xl text-white drop-shadow-[4px_4px_0_#000]">
                    AWS服務?
                  </p>
                </motion.div>
                <div className="flex flex-col h-full justify-center items-center pb-6 gap-5">
                  <motion.input
                    type="text"
                    placeholder="請輸入名字"
                    className="font-cubic p-2 rounded-full text-center border-r-4 border-b-4 border-t-2 border-l-2 border-black focus:bg-neutral-100 focus:outline-none text-3xl w-64"
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.175 }}
                  />
                  <motion.button
                    onClick={handleStart}
                    className="flex justify-center items-center gap-1 bg-white active:bg-gray-200 text-[#cf9855] px-4 py-2 border-r-4 border-b-4 border-t-2 border-l-2 border-black font-black rounded-full font-cubic h-12 focus:bg-neutral-100 focus:outline-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <img src="/CatPaw.png" alt="CatPaw" className="w-4" />
                    開始測驗
                  </motion.button>
                </div>
              </div>
              <motion.div
                className="flex w-full justify-end"
                initial={{ opacity: 0, scale: 0.8, y: 100, x: 100 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                transition={{ duration: 0.175 }}
              >
                <img src="/CatCEO.png" alt="CatCEO" className="w-64" />
              </motion.div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                {showResult ? (
                  <>
                    <ResultCard
                      answerService={answerService}
                      imageUrl={imageUrl}
                    />
                  </>
                ) : showIntermediate ? (
                  <IntermediatePage
                    question={multipleChoices[step].question}
                    selectedOption={selectedOption}
                    onContinue={() => {
                      setShowIntermediate(false);
                      if (step < multipleChoices.length - 1) {
                        setStep(step + 1);
                      } else {
                        handleEnd();
                      }
                    }}
                  />
                ) : (
                  <QuestionAnswers
                    step={step}
                    totalSteps={multipleChoices.length}
                    question={multipleChoices[step].question}
                    options={multipleChoices[step].options}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
