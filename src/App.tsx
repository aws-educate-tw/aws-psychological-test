import React, { useState } from "react";

const App: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const questions = [
    {
      question: "你看到陌生人進電梯時，你會怎麼做？",
      options: ["猛按關門鍵，最好不要對到眼！", "按住開門鍵，一起搭電梯"],
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

  const handleNext = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[step] = answer;
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      alert("測驗完成！");
      console.log(newAnswers);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">心理測驗</h1>
        <div className="mb-6">
          <p className="text-xl mb-4">{questions[step].question}</p>
          {questions[step].options.map((option, index) => (
            <button
              key={index}
              className="block w-full bg-blue-500 text-white p-2 rounded mb-2"
              onClick={() => handleNext(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white p-2 rounded"
            disabled={step === 0}
          >
            回上一題
          </button>
          <button
            onClick={() => handleNext(answers[step] || "")}
            className="bg-blue-500 text-white p-2 rounded"
          >
            {step < questions.length - 1 ? "下一題" : "完成"}
          </button>
        </div>
        {step === questions.length && (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">測驗結果</h2>
            <ul>
              {answers.map((answer, index) => (
                <li key={index} className="mb-2">
                  <strong>問題 {index + 1}:</strong> {answer}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
