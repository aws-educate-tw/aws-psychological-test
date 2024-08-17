import { useState, useEffect } from "react";
import Navbar from "./ui/navbar";
import { multipleChoices } from "./lib/multipleChoices";
import { Circle, X } from "lucide-react";

export default function App() {
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [startTest, setStartTest] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [answerService, setAnswerService] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

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
                  <p className="w-full text-center font-cubic text-xl text-black drop-shadow-[1px_1px_0_#FEFEFE] animate-pulse">
                    ~ Ambassador day in community day ~
                  </p>
                </div>
                <div className="py-6">
                  <p className="text-center font-cubic text-3xl text-white drop-shadow-[3px_3px_0_#000] py-2">
                    你是哪種
                  </p>
                  <p className="text-center font-cubic text-6xl text-white drop-shadow-[4px_4px_0_#000]">
                    AWS服務?
                  </p>
                </div>
                <div className="flex flex-col h-full justify-center items-center pb-6 gap-5">
                  <input
                    type="text"
                    placeholder="請輸入名字"
                    className="font-cubic p-2 rounded-full text-center border-r-4 border-b-4 border-t-2 border-l-2 border-black focus:bg-neutral-100 focus:outline-none text-3xl w-64"
                  />
                  <button
                    onClick={handleStart}
                    className="flex justify-center items-center gap-1 bg-white active:bg-gray-200 text-[#cf9855] px-4 py-2 border-r-4 border-b-4 border-t-2 border-l-2 border-black font-black rounded-full font-cubic h-12 focus:bg-neutral-100 focus:outline-none"
                  >
                    <img src="/CatPaw.png" alt="CatPaw" className="w-4" />
                    開始測驗
                  </button>
                </div>
              </div>
              <div className="flex w-full justify-end">
                <img src="/CatCEO.png" alt="CatCEO" className="w-64" />
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                {showResult ? (
                  <>
                    <div className="flex flex-col bg-[#FAF5E7] rounded-lg border-4 border-black shadow-[5px_5px_0_#000]">
                      <div className="flex items-center border-b-4 border-black p-2">
                        <div className="flex gap-2 w-full">
                          <Circle size={20} strokeWidth={4} />
                          <Circle size={20} strokeWidth={4} />
                        </div>
                        <X strokeWidth={4} />
                      </div>
                      <div className="flex justify-between items-center px-4 py-4">
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
                            <p className="text-xl font-cubic font-outline-2 py-3">
                              {answerService}
                            </p>
                          )}

                          {(answerService === "Cloudwatch" ||
                            answerService === "DynamoDB") && (
                            <p className="text-2xl font-cubic font-outline-2 py-3">
                              {answerService}
                            </p>
                          )}
                          <p className="font-cubic text-xs"># 需要我隨時都在</p>
                          <p className="font-cubic text-xs"># 適應性強</p>
                          <p className="font-cubic text-xs"># 你是T嗎</p>
                        </div>
                        <div className="">
                          <img
                            src={
                              imageUrl ||
                              "https://aws-psy-test-image.s3.amazonaws.com/generated_images/2b883c0c-121a-4826-8429-7d31ba3a29fd.png"
                            }
                            alt="Service"
                            className="rounded-lg w-48"
                          />
                        </div>
                      </div>
                      <div className="flex justify-center pl-5 pr-3 pb-2 text-wrap">
                        <p className="font-cubic text-sm">
                          &quot;適應性強且靈活的人，能夠根據環境的變化迅速調整自己的步伐。擁有強大的能力，可以在需要的時候全力以赴，也可以在平靜時輕鬆應對。&quot;
                        </p>
                      </div>
                      <hr className="border-y-2 border-black my-2" />
                      <div className="pl-5 pr-3 text-wrap">
                        <p className="font-cubic text-md text-[#23303F] py-2">
                          在職場上的你...
                        </p>
                        <p className="font-cubic text-sm text-wrap w-full">
                          能迅速掌握新技能，並根據工作需求快速調整自己的步伐。他們在面對高強度的工作壓力時，能夠全力以赴，展現出卓越的表現和效率。無論是處理複雜的項目還是應對緊急情況，他們總是能夠迎刃而解。
                        </p>
                      </div>
                      <hr className="border-y-2 border-black my-2" />
                      <div className="pl-5 pr-3 pb-5 ">
                        <p className="font-cubic text-md text-[#23303F] py-2">
                          AWS 服務小教室
                        </p>
                        <p className="font-cubic text-sm">
                          提供可擴展計算能力的服務。用戶可以在雲中快速啟動虛擬機器，選擇不同的作業系統和配置。這對於處理不同的工作負載，例如應用程式伺服器、資料庫或後端伺服器等都非常有用
                        </p>
                      </div>
                    </div>
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
                      <p className="text-xl mb-8 px-4 py-6 bg-neutral-500 text-white font-cubic border-black border-4 border-dashed rounded-lg shadow-[5px_5px_0_#E5E5E5]">
                        {multipleChoices[step].question}
                      </p>
                    </div>
                    {multipleChoices[step].options.map((option, index) => (
                      <button
                        key={index}
                        className="block w-full border border-black bg-neutral-200 active:bg-zinc-100 text-black font-bold font-cubic py-2 rounded-2xl mb-4"
                        onClick={() => handleNext(option)}
                      >
                        {option}
                      </button>
                    ))}
                    <div className="flex justify-end">
                      <button
                        onClick={handleBack}
                        className="bg-yellow-200 active:bg-yellow-300 text-black px-2 font-bold rounded-full border-r-4 border-b-4 border-t-2 border-l-2 border-black font-cubic"
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
