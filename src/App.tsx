import React, { useState, useEffect } from "react";
import Navbar from "./ui/navbar";

const App: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [startTest, setStartTest] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [answerService, setAnswerService] = useState<string>("");

  const multipleChoices = [
    {
      question: "星期五一早，今天要上班的你正在吃早餐，這時的你還會？",
      options: [
        "看個股票算算自己又賺了多少",
        "光速完食立馬出門搭車",
        "突然想發個限動",
        "打開手機記憶體快爆卻死不刪的相簿",
      ],
      services: ["EC2", "Lambda", "DynamoDB", "S3"],
    },
    {
      question: "抵達公司，開會時你正在與團隊討論新的專案，你會有什麼表現？",
      options: [
        "擔任指揮角色協助團隊分配工作",
        "用筆電紀錄代辦事項讓專案順利運行",
        "擔任溝通橋樑向老闆轉達一切資訊",
        "監督成員的進度掌握團隊狀況",
      ],
      services: ["ELB", "Cloudwatch", "API gateway", "DynamoDB"],
    },
    {
      question:
        "開完會老闆突然通知團隊中午要和隔壁部門聚餐，並要大家著手安排，這時的你會？",
      options: [
        "先把手上的工作完成再說",
        "立馬開始和同事們分工聚餐事宜",
        "向隔壁部門同事打探聚餐的即時資訊",
        "心想有什麼好聚餐的各吃各的不好嗎",
      ],
      services: ["ELB", "API gateway", "Lambda", "IAM"],
    },
    {
      question: "到了餐廳，大家圍著大圓桌吃飯，這時的你會？",
      options: [
        "幫大家遞碗筷和夾菜",
        "看著滿桌料理心想這桌大概要5000",
        "錄個限動並標註所有在場的人",
        "偷偷觀察大家的言行舉止",
      ],
      services: ["ELB", "Cloudwatch", "DynamoDB", "EC2"],
    },
    {
      question: "午休還有有10分鐘的空檔，你會做什麼呢？",
      options: [
        "用手機的智能監控，看一下家裡的貓狗",
        "瀏覽各種社群平台和新聞",
        "打開銀行帳戶，看一下存款",
        "回顧最近的照片和回憶",
      ],
      services: ["Cloudwatch", "API gateway", "IAM", "S3"],
    },
    {
      question: "週五的晚上，你想要怎麼慶祝這一周的結束？",
      options: [
        "計劃與朋友聚會，確保每個人都能參加",
        "研究新的投資策略或學習新技能",
        "睡一個美美的覺，為下一週充電",
        "獨自享受 Me time，避開社交活動",
      ],
      services: ["ELB", "EC2", "Lambda", "IAM"],
    },
    {
      question: "周末到了，你會怎麼度過這兩天？",
      options: [
        "參加聚會，交流職缺或投資情報",
        "記錄與分析這周的工作成果",
        "打遊戲打到天亮",
        "整理衣櫃、打掃家裡",
      ],
      services: ["API gateway", "DynamoDB", "EC2", "S3"],
    },
    {
      question: "外出旅遊時，你會怎樣確保一切順利？",
      options: [
        "反覆檢查天氣和交通狀況",
        "規劃一個行程滿滿的旅遊",
        "檢查家裡門窗和保險箱",
        "將民宿和景點地址上傳到 Line 記事本",
      ],
      services: ["Cloudwatch", "Lambda", "IAM", "S3"],
    },
  ];

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
