import React, { useState, useEffect } from "react";
import Navbar from "./ui/navbar";
import { multipleChoices } from "./lib/multipleChoices";

const App: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [startTest, setStartTest] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [answerService, setAnswerService] = useState<string>("");

  useEffect(() => {
    if (showResult) {
      calculateResult();
    }
  }, [showResult]);

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

    // Find the maximum count
    const maxCount = Math.max(...Object.values(serviceCounts));

    // Find all services that have the maximum count
    const topServices = Object.keys(serviceCounts).filter(
      (service) => serviceCounts[service] === maxCount
    );

    // Randomly select one of the top services
    const resultService =
      topServices[Math.floor(Math.random() * topServices.length)];

    console.log("Service counts: ", serviceCounts);
    console.log("Top services: ", topServices);
    setAnswerService(resultService);
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
          }`}
          style={
            !startTest
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
                  {/* <p className="text-center font-cubic text-5xl text-white drop-shadow-[3px_3px_0_#000]">
                    你是
                  </p> */}
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
                    // value={value}
                    // onChange={handleChange}
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
                    <p className="text-2xl font-cubic">測驗結果</p>
                    <p className="font-cubic">你最像</p>
                    <p className="text-4xl text-red-500 font-black">
                      {answerService}
                    </p>
                    {/* {answers.map((answer, index) => (
                    <p key={index} className="mb-2">
                      {multipleChoices[index].question}：{answer}
                    </p>
                  ))} */}
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
};

export default App;
