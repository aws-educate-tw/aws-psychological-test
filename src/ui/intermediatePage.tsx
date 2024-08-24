import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface IntermediatePageProps {
  question: string;
  selectedOption: string;
  onContinue: () => void;
}

const generateChat = async (
  prompt: string,
  onUpdate: (content: string) => void
) => {
  try {
    // const apiKey = "<<YOUR_API_KEY>>";
    console.log(prompt);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "請用繁體中文簡短回答，你必須吐槽選項" },
          { role: "user", content: prompt },
        ],
        temperature: 0.5,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate chat");
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let accumulatedResponse = ""; // 用來儲存接收到的資料

    while (!done) {
      const { value, done: doneReading } = await reader?.read()!;
      done = doneReading;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((line) => line.trim() !== "");
      for (const line of lines) {
        if (line.startsWith("data:")) {
          const jsonString = line.replace(/^data: /, "");
          if (jsonString === "[DONE]") {
            done = true;
            break;
          }
          try {
            if (
              jsonString &&
              jsonString.startsWith("{") &&
              jsonString.endsWith("}")
            ) {
              const json = JSON.parse(jsonString);
              const content = json.choices[0].delta?.content || "";
              accumulatedResponse += content;
            }
          } catch (e) {
            console.error("Error parsing JSON:", e);
            onUpdate("生成失敗，請稍後重試。");
            return;
          }
        }
      }
    }

    onUpdate(accumulatedResponse);
  } catch (error) {
    console.error(error);
    onUpdate("生成失敗，請稍後重試。");
  }
};

export default function IntermediatePage({
  question,
  selectedOption,
  onContinue,
}: IntermediatePageProps) {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState("");
  const promptQA = `問題：${question}, 選擇：${selectedOption}`;

  useEffect(() => {
    const fetchData = async () => {
      await generateChat(promptQA, (chunk) => {
        setResponse((prev) => prev + chunk);
      });
      setLoading(false);
    };

    fetchData();
  }, [selectedOption]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <motion.p
        className="text-2xl text-white font-cubic mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        你選擇了: {selectedOption}
      </motion.p>
      <motion.p
        className="text-xl text-white mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {response}
      </motion.p>
      <motion.button
        onClick={onContinue}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
        disabled={loading}
      >
        {loading ? "生成中..." : "下一題"}
      </motion.button>
    </div>
  );
}
