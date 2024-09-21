"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "@/ui/navbar";
import { multipleChoices } from "@/lib/multipleChoices";
import ResultCard from "@/ui/resultCard";
import AiPage from "@/ui/aiPage";
import { resultData } from "@/lib/resultData";

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

export default function App() {
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [startTest, setStartTest] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [answerService, setAnswerService] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [putUrl, setPutUrl] = useState<string>("");
  const [getUrl, setGetUrl] = useState<string>("");
  // const [imageBase64, setImageBase64] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  // const [ipAddress, setIpAddress] = useState<string>("");

  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [startTimer, setStartTimer] = useState<boolean>(false);

  const [showAIPage, setShowAIPage] = useState<boolean>(false);

  useEffect(() => {
    if (showResult && imageUrl !== "") {
      const relatedServices = answers.map((answer, index) => {
        const selectedIndex = multipleChoices[index].options.indexOf(answer);
        return multipleChoices[index].services[selectedIndex];
      });

      const submitData = {
        chooseService: relatedServices, // The services selected by the user
        finalService: answerService, // Final selected service after calculating the result
        imageUrl: imageUrl, // The generated image URL
        totalSeconds: totalSeconds, // The total time spent on the test
        // userIP: ipAddress, // The IP address of the user
      };
      const saveRDS = async (data: {
        chooseService: string[];
        finalService: string;
        imageUrl: string;
        totalSeconds: number;
        // userIP: string;
      }) => {
        try {
          // console.log(JSON.stringify(data));
          console.log("Time spent:", totalSeconds);
          console.log(data);
          const response = await fetch(
            "https://uy517ntk1a.execute-api.ap-northeast-1.amazonaws.com/Stage/submit-data",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
          if (response.ok) {
            console.log("Data submitted successfully");
          }
        } catch (error) {
          console.error("Error submitting data:", error);
        }
      };
      saveRDS(submitData);
    }
  }, [showResult, imageUrl]);

  useEffect(() => {
    if (showAIPage) {
      calculateResult();
    }
  }, [showAIPage]);

  useEffect(() => {
    const promptMap: { [key: string]: string } = {
      EC2: "A cute cat being a salesperson in suit with a clean background",
      S3: "A cute cat being a librarian with a clean background",
      Lambda: "A cute cat being a scientist with a clean background",
      IAM: "A cute cat being a security guard with a clean background",
      Cloudwatch: "A cute cat being a company manager with a clean background",
      DynamoDB: "A cute cat being a secretary with a clean background",
      "API gateway": "Three cats playing together with a clean background",
      ELB: "A cute cat being a traffic police officer with a clean background",
    };

    const prompt = promptMap[answerService];
    // console.log("prompt", prompt);

    if (prompt) {
      const requestBody = {
        data: {
          model_id: "stability.stable-diffusion-xl-v1",
          prompt: prompt,
        },
      };
      generateImage(requestBody);
    }
  }, [answerService]);

  useEffect(() => {
    let interval: number | undefined = undefined;

    if (startTimer) {
      // If the timer is active, start the interval
      interval = setInterval(() => {
        setTotalSeconds((totalSeconds) => totalSeconds + 1); // Increase seconds by 1
      }, 1000);
    } else if (!startTimer && totalSeconds !== 0) {
      // Clear the interval if timer is not active
      clearInterval(interval);
    }

    return () => clearInterval(interval); // Cleanup on component unmount or when interval is cleared
  }, [startTimer, totalSeconds]);

  const handleStart = () => {
    setStartTest(true);
    setStep(0);
    setAnswers([]);
    setShowResult(false);
    setShowAIPage(false);
    setStartTimer(true);
  };

  const handleEnd = () => {
    setShowAIPage(true);
    // setShowResult(true);
  };

  const handleNext = (option: string) => {
    const newAnswers = [...answers];
    newAnswers[step] = option;
    setAnswers(newAnswers);

    if (step < multipleChoices.length - 1) {
      setStep(step + 1);
    } else {
      handleEnd();
    }
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

  const serviceResult = resultData.find(
    (result: Result) => result.serviceName === answerService
  );
  // const promptQA = `使用者的名字：${userName}。職場上的你：${serviceResult?.work_describe}。生活上的你：${serviceResult?.life_describe}`;

  const generateImage = async (requestBody: {
    data: { model_id: string; prompt: string };
  }) => {
    try {
      console.log("start generating image");
      // console.log("requestBody", requestBody);
      const response = await fetch(
        "https://api.psy.aws-educate.tw/prod/generate-image",
        // "https://dhta1m0lbgo3d.cloudfront.net/prod/generate-image",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      console.log("end generating image");
      // console.log("response", response);
      const data = await response.json();
      setImageUrl(data.image_url);
      setPutUrl(data.put_url);
      setGetUrl(data.get_url);
      // setImageBase64(data.image_base64);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-full max-w-md min-w-[400px] max-h-[1100px] h-screen flex flex-col">
        <Navbar />
        <div
          className={`py-6 px-4 flex-grow ${
            !startTest
              ? "bg-container bg-center relative bg-[#95a3a3]"
              : "bg-cover bg-center relative"
          } ${
            showResult && !showAIPage
              ? "bg-container bg-center relative bg-gradient-to-b from-[#BACBCB] to-[#95a3a3]"
              : ""
          } ${showAIPage ? "bg-gradient-to-b from-[#674588] to-[#95a3a3]" : ""}
          `}
          style={
            !startTest || showResult
              ? { backgroundImage: "" }
              : showAIPage
              ? { backgroundImage: "" }
              : { backgroundImage: "url('/Office.png')" }
          }
        >
          {!startTest ? (
            <>
              <div className="absolute w-full right-0 top-0 h-2/3 bg-gradient-to-b from-[#999999bb] to-[#fff0] z-30"></div>
              <div className="flex flex-col h-full">
                <div className="flex flex-col h-full z-40">
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
                  <motion.div className="py-6 z-50">
                    <p className="text-center font-cubic text-3xl text-white drop-shadow-[3px_3px_0_#000] py-2 z-50">
                      你是哪種
                    </p>
                    <p className="text-center font-cubic text-6xl text-white drop-shadow-[4px_4px_0_#000] z-5nope,0">
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
                      maxLength={15}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                    <motion.button
                      onClick={handleStart}
                      className="flex justify-center items-center gap-1 bg-white active:bg-gray-200 text-[#cf9855] px-4 py-2 border-r-4 border-b-4 border-t-2 border-l-2 border-black font-black rounded-full font-cubic h-12 focus:bg-neutral-100 focus:outline-none"
                      // initial={{ opacity: 0, scale: 0.8 }}
                      // animate={{ opacity: 1, scale: 1 }}
                      // transition={{ delay: 0.2 }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "easeInOut",
                        repeatDelay: 3,
                        delay: 1,
                      }}
                    >
                      <img src="/CatPaw.png" alt="CatPaw" className="w-4" />
                      開始測驗
                    </motion.button>
                  </div>
                </div>
                <motion.div
                  className="flex w-full justify-end z-10"
                  initial={{ opacity: 0, scale: 0.8, y: 100, x: 100 }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                  transition={{ duration: 0.175 }}
                >
                  <img src="/CatCEO.png" alt="CatCEO" className="w-64" />
                </motion.div>
                <img
                  src="/psy-test-background-2.png"
                  alt="background"
                  className="z-0 w-full absolute bottom-0 right-0 h-auto object-cover bg-cover bg-gradient-to-t from-[#ffffff6c] to-[#ffffff00]"
                />
              </div>
            </>
          ) : (
            <div>
              <div className="mb-6">
                {showAIPage ? (
                  <AiPage
                    userName={userName}
                    at_work={serviceResult?.work_describe || "工作描述未提供"}
                    in_life={serviceResult?.life_describe || "生活描述未提供"}
                    showResultPageClick={() => {
                      setShowAIPage(false);
                      setShowResult(true);
                    }}
                  />
                ) : showResult ? (
                  <>
                    <ResultCard
                      isAIpage={showAIPage}
                      user_name={userName}
                      answerService={answerService}
                      imageUrl={imageUrl}
                      put_url={putUrl}
                      get_url={getUrl}
                      onComplete={() => {
                        setStartTimer(false);
                        setTotalSeconds(0);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <div className="flex justify-between p-2">
                        <p className="text-2xl text-white *:font-semibold font-cubic">
                          第 {step + 1} 題
                        </p>
                        <p className="text-2xl text-white *:font-semibold font-cubic">
                          {step + 1}/8
                        </p>
                      </div>
                      <motion.p
                        key={step}
                        className="text-xl mb-8 px-4 py-6 bg-[#FAF5E7] text-black font-cubic border-black border-4 rounded-lg shadow-[5px_5px_0_#000]"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {multipleChoices[step].question}
                      </motion.p>
                    </div>
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.175 }}
                    >
                      {multipleChoices[step].options.map((option, index) => (
                        <button
                          key={index}
                          className="block w-full border border-black bg-neutral-200 active:bg-zinc-100 text-black font-bold font-cubic py-2 rounded-2xl mb-4"
                          onClick={() => handleNext(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </motion.div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleBack}
                        className="bg-[#FAF5E7] active:bg-[#ddd7c8] text-black px-2 font-bold rounded-full border-r-4 border-b-4 border-t-2 border-l-2 border-black font-cubic"
                      >
                        回上一題
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
