import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface IntermediatePageProps {
  question: string;
  selectedOption: string;
  selectedService: string;
  onContinue: () => void;
}

const generateChat = async (
  prompt: string,
  onUpdate: (newChunk: string) => void,
  onComplete: (finalResponse: string) => void
) => {
  try {
    console.log(prompt);

    const response = await fetch(
      "https://3bj6absvecvdtp5ufb32fporgi0licyc.lambda-url.us-east-1.on.aws/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "anthropic.claude-3-sonnet-20240229-v1:0",
          system: `
                你是一隻具備科技知識且幽默的小貓咪 AWS 占卜師，
                會使用溫暖鼓舞的語氣來提供回應，回應需控制在30個中文字數以內。

                1. 你的風格親切可愛，會使用喵語表達，並且會使用顏文字來增添表達的可愛感：
                   (＝^ω^＝), (=①ω①=), (=ＴェＴ=), (=ↀωↀ=), (=ΦωΦ=), (ΦзΦ), (^・ω・^ ), (ฅ^•ﻌ•^ฅ)。

                2. 你會常用AWS雲端技術來比喻日常生活中的情況，
                   並針對事先設計好的問答來分析使用者的選擇，給予正向回應。

                請根據以下問題和使用者的選擇生成回應：
              `,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1024,
          temperature: 0.5,
          stream: true,
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

export default function IntermediatePage({
  question,
  selectedOption,
  selectedService,
  onContinue,
}: IntermediatePageProps) {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState("算命進行中...");
  const promptQA = `問題：${question}, 選擇：${selectedOption}, 相關服務:${selectedService}`;
  const debouncedUpdate = useRef<any>();

  useEffect(() => {
    const fetchData = async () => {
      await generateChat(
        promptQA,
        (chunk) => {
          if (debouncedUpdate.current) {
            clearTimeout(debouncedUpdate.current);
          }

          debouncedUpdate.current = setTimeout(() => {
            setResponse(chunk);
          }, 50);
        },
        (finalResponse) => {
          setResponse(finalResponse);
          setLoading(false); // Stop loading when complete
        }
      );
    };

    fetchData();
  }, [selectedOption]);

  return (
    <div className="flex flex-col justify-end px-2 gap-4">
      <div className="">
        <div className="flex flex-col items-center gap-2">
          <img
            src="/cat-wizard.png"
            alt="catWizard"
            className="w-full rounded-md border-8 border-[#FAF5E7]"
          />
          <p className="font-cubic text-2xl text-[#FAF5E7] py-2">
            ~ ~ 貓咪占卜師有話想喵 ~ ~
          </p>
        </div>
        <div className="px-4 py-4 min-h-24 max-h-96 overflow-y-auto bg-purple-300 rounded-lg border-4 border-[#FAF5E7]">
          <p className="text-lg font-cubic rounded-lg text-wrap">
            {response}
            {/* 喵喵~(=^ω^=)作為一隻熱愛雲端科技的小貓咪，我會把這件事比喻成EC2的Auto
            Scaling啦！就像EC2可以根據需求自動調整運算資源一樣，我也會在有限的時間內靈活調配體力資源，光速啃完營養滿分的早餐(ΦωΦ)，為了不錯過準時上班這一重要任務呢！畢竟作為一隻負責任的小貓咪，我可不想給公司增加不必要的成本開銷喵~(^・ω・^
            ) */}
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        <motion.button
          onClick={onContinue}
          className="font-cubic bg-[#071E3D] text-white font-bold py-2 px-4 rounded-lg active:bg-purple-300 active:text-black"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          disabled={loading}
        >
          {loading ? "生成中..." : "下一題"}
        </motion.button>
      </div>
    </div>
  );
}
