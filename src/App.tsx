import React, { useState, useEffect } from "react";

const App: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [startTest, setStartTest] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);

  const multipleChoices = [
    {
      question: "你看到陌生人進電梯時，你會？",
      options: ["最好不要對到眼！", "按住開門鍵，一起搭電梯"],
    },
    {
      question: "你下班後的首選活動是？",
      options: ["直接回家軟爛耍廢", "當然要跟朋友一起HIGH"],
    },
    {
      question: "搭電梯遇到同事走過來，妳會？",
      options: ["猛關電梯", "一起搭電梯"],
    },
  ];

  useEffect(() => {
    if (showResult) {
      console.log(answers);
    }
  }, [answers, showResult]);

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

  return (
    <div className="min-h-screen bg-amber-100 flex flex-col items-center justify-center">
      <div className="bg-amber-300 p-8 rounded-lg shadow-lg w-full max-w-96 h-96">
        {!startTest ? (
          <div className="flex justify-center items-center h-full">
            <button
              onClick={handleStart}
              className="bg-white hover:bg-gray-200 text-red-500 px-4 py-2 border-r-4 border-b-4 border-t-2 border-l-2 border-black font-black rounded-full"
            >
              開始測驗
            </button>
          </div>
        ) : (
          <div className="">
            <div className="mb-6">
              {showResult && <p className="text-2xl">測驗結果</p>}
              {showResult ? (
                answers.map((answer, index) => (
                  <p key={index} className="mb-2">
                    {multipleChoices[index].question}：{answer}
                  </p>
                ))
              ) : (
                <>
                  <p className="text-2xl p-2 text-black font-black ">
                    Q{step + 1}
                  </p>
                  <p className="text-xl mb-8 border-r-4 border-b-4 border-t-2 border-l-2 border-black shadow-lg p-4 px-4 rounded-xl bg-emerald-600 text-white">
                    {multipleChoices[step].question}
                  </p>
                  {multipleChoices[step].options.map((option, index) => (
                    <button
                      key={index}
                      className="block w-full border-r-4 border-b-4 border-t-2 border-l-2 border-black drop-shadow-lg bg-white hover:bg-gray-200 text-black font-bold p-2 rounded-full mb-2"
                      onClick={() => handleNext(option)}
                    >
                      {option}
                    </button>
                  ))}
                  <div className="flex justify-end py-4">
                    <button
                      onClick={handleBack}
                      className="bg-yellow-200 hover:bg-yellow-300 text-black px-2 font-bold rounded-full border-r-4 border-b-4 border-t-2 border-l-2 border-black"
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
  );
};

export default App;
