import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { MoveRight, StepForward } from "lucide-react";

const generateChat = async (
  userName: string,
  at_work: string,
  in_life: string,
  onUpdate: (newChunk: string) => void,
  onComplete: (finalResponse: string) => void
) => {
  try {
    const response = await fetch(
      "https://api.psy.aws-educate.tw/v1/insight/generate",
      // "https://dhta1m0lbgo3d.cloudfront.net/v1/insight/generate",
      // "https://prstyvksoed4knilqw2cnwf6nm0epkwz.lambda-url.us-east-1.on.aws/v1/insight/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participant_name: userName,
          at_work: at_work,
          in_life: in_life,
        }),
      }
    );

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let accumulatedResponse = "";

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponse += chunk; // Accumulate the chunks
        onUpdate(accumulatedResponse); // Show the latest accumulated response
      }
    }

    onComplete(accumulatedResponse); // Notify when complete
  } catch (error) {
    console.error("Error fetching chat:", error);
    onUpdate("生成失敗，請稍後重試。");
  }
};

export default function AiPage({
  userName,
  at_work,
  in_life,
  showResultPageClick,
}: {
  userName: string;
  at_work: string;
  in_life: string;
  showResultPageClick: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState("算命師掐指一算...");
  const prevPromptQA = useRef({ userName, at_work, in_life });
  const [remainQuota, setRemainQuota] = useState<number>(0);

  const fetchData = async () => {
    console.log("開始算命啦！");
    await generateChat(
      userName,
      at_work,
      in_life,
      (chunk) => {
        setResponse(chunk); // Update the response directly with each chunk
      },
      (finalResponse) => {
        setResponse(finalResponse); // Final response after completion
        setLoading(false); // Stop loading when complete
      }
    );
  };

  useEffect(() => {
    if (
      userName !== prevPromptQA.current.userName ||
      at_work !== prevPromptQA.current.at_work ||
      in_life !== prevPromptQA.current.in_life
    ) {
      prevPromptQA.current = { userName, at_work, in_life };
      fetchData();
    }
  }, [userName, at_work, in_life]);

  const getTestQuota = async () => {
    try {
      const response = await fetch(
        "https://prstyvksoed4knilqw2cnwf6nm0epkwz.lambda-url.us-east-1.on.aws/v1/test-quota"
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Test quota:", data.remaining_test_count);
        setRemainQuota(data.remaining_test_count);
        // if (data.remaining_test_count <= 0) {
        //   console.log("Test quota is used up.");
        // }
      }
    } catch (error) {
      console.error("Error getting test quota:", error);
    }
  };
  useEffect(() => {
    getTestQuota();
  }, []);

  return (
    <div className="flex flex-col justify-end px-2 gap-4">
      <div className="">
        <div className="flex flex-col items-center gap-2">
          <img
            src="/cat-wizard.png"
            alt="catWizard"
            className="w-52 rounded-md border-8 border-[#FAF5E7]"
          />
          <p className="font-cubic text-2xl text-[#FAF5E7] py-2">
            ~ ~ 貓咪占卜師有話想喵 ~ ~
          </p>
        </div>
        <p className="text-lg text-[#FAF5E7] font-cubic rounded-lg text-wrap p-2">
          讓貓咪老師來幫你解答吧！
        </p>
        <div className="px-4 py-4 min-h-24 overflow-y-auto rounded-lg bg-purple-300 bg-opacity-40 shadow-lg">
          <p className="text-lg font-cubic rounded-lg text-wrap text-[#FAF5E7]">
            {response}
            {/* 喵喵~(=^ω^=)作為一隻熱愛雲端科技的小貓咪，我會把這件事比喻成EC2的Auto
            Scaling啦！就像EC2可以根據需求自動調整運算資源一樣，我也會在有限的時間內靈活調配體力資源，光速啃完營養滿分的早餐(ΦωΦ)，為了不錯過準時上班這一重要任務呢！畢竟作為一隻負責任的小貓咪，我可不想給公司增加不必要的成本開銷喵~(^・ω・^
            ) */}
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        {loading ? (
          <motion.button
            className="flex gap-1 items-center font-cubic bg-[#071E3D] text-white font-bold py-2 px-4 rounded-lg active:bg-purple-300 active:text-black"
            animate={{ y: [3, 0, 3] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            }}
            onClick={showResultPageClick}
          >
            <div className="flex flex-col">
              <p>SKIP</p>
              <p className="text-xs">（專屬圖片剩下{remainQuota}張！）</p>
            </div>
            <StepForward size={30} />
          </motion.button>
        ) : (
          <motion.button
            className="flex gap-2 items-center font-cubic bg-[#071E3D] text-white font-bold py-2 px-4 rounded-lg active:bg-purple-300 active:text-black"
            animate={{ y: [3, 0, 3] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            }}
            onClick={showResultPageClick}
          >
            <div className="flex flex-col">
              <p>獲取結果圖</p>
              <p className="text-xs">（專屬圖片剩下{remainQuota}張！）</p>
            </div>
            <MoveRight size={30} />
          </motion.button>
        )}
      </div>
    </div>
  );
}
