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
          className="bg-[#FFBD59] p-8 flex-grow bg-cover bg-center relative"
          style={!startTest ? { backgroundImage: "url('/Sunset.png')" } : {}}
        >
          {!startTest ? (
            <div className="flex flex-col h-full">
              <p className="text-center font-cubic text-xl drop-shadow-[1px_1px_0_#FEFEFE]">
                Ambassador day in community day
              </p>
              <p className="text-center font-cubic text-3xl text-black drop-shadow-[2px_2px_0_#FEFEFE] py-20">
                測出你的服務屬性
              </p>
              <div className="flex h-full justify-center items-center pb-24">
                <button
                  onClick={handleStart}
                  className="bg-white hover:bg-gray-200 text-red-500 px-4 py-2 border-r-4 border-b-4 border-t-2 border-l-2 border-black font-black rounded-full font-cubic h-12"
                >
                  開始測驗
                </button>
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
                    <div className="relative shadow-[10px_10px_0_#E15A53]">
                      <p className="text-2xl text-center p-2 text-black border border-black font-semibold font-cubic bg-[#A6DAD5]">
                        第 {step + 1} 關
                      </p>
                      <p className="text-xl mb-8 border border-x-black border-b-black p-4 px-4 bg-[#FAF5E7] text-black font-cubic">
                        {multipleChoices[step].question}
                      </p>
                    </div>
                    {multipleChoices[step].options.map((option, index) => (
                      <button
                        key={index}
                        className="block w-full border border-black bg-[#FAF5E7] hover:bg-[#F3DAB4] text-black font-bold font-cubic py-4 rounded-2xl mb-6"
                        onClick={() => handleNext(option)}
                      >
                        {option}
                      </button>
                    ))}
                    <div className="flex justify-end py-4">
                      <button
                        onClick={handleBack}
                        className="bg-yellow-200 hover:bg-yellow-300 text-black px-2 font-bold rounded-full border-r-4 border-b-4 border-t-2 border-l-2 border-black font-cubic"
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
