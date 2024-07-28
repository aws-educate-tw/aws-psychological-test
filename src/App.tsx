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
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {!startTest ? (
        <button
          onClick={handleStart}
          className="bg-blue-500 text-white p-2 rounded"
        >
          開始測驗
        </button>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-4">心理測驗</h1>
          <div className="mb-6">
            {showResult ? (
              answers.map((answer, index) => (
                <p key={index} className="mb-2">
                  {multipleChoices[index].question}：{answer}
                </p>
              ))
            ) : (
              <>
                <p className="text-xl mb-4">{multipleChoices[step].question}</p>
                {multipleChoices[step].options.map((option, index) => (
                  <button
                    key={index}
                    className="block w-full bg-blue-500 text-white p-2 rounded mb-2"
                    onClick={() => handleNext(option)}
                  >
                    {option}
                  </button>
                ))}
              </>
            )}
          </div>
          <div className="flex justify-between">
            {!showResult && (
              <button
                onClick={handleBack}
                className="bg-gray-500 text-white p-2 rounded"
                disabled={step === 0}
              >
                回上一題
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
