import { useState, useEffect } from "react";

export default function AiPage({
  apiEndpoint,
  promptQAWork,
  promptQALife,
  userName,
  answerService,
}: {
  apiEndpoint: string;
  promptQAWork: string;
  promptQALife: string;
  userName: string;
  answerService: string;
}) {
  const [workResponse, setWorkResponse] = useState("算貓師幫你看看你的工作...");
  const [lifeResponse, setLifeResponse] = useState("算貓師在思考你的生活...");
  const [prevWorkPrompt, setPrevWorkPrompt] = useState(promptQAWork);
  const [prevLifePrompt, setPrevLifePrompt] = useState(promptQALife);

  const llmEndpoint = apiEndpoint;

  const generateDescribe = async (
    prompt: string,
    onUpdate: (newChunk: string) => void,
    onComplete: (finalResponse: string) => void
  ) => {
    try {
      const response = await fetch(llmEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "psy-1",
          system: `
                  你是一隻幽默的小貓咪占卜師，請先根據使用者姓名跟他打招呼，如果沒有使用者姓名，請使用「貓友」來代替。
                  並切根據提供的資訊產生一段溫暖鼓勵的回應，請注意回應要簡短。
  
                  請生成回應：
                `,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1024,
          temperature: 0.5,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch chat: ${response.statusText}`);
      }

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

  const fetchWork = async () => {
    console.log("開始算命啦！(工作)");
    try {
      await generateDescribe(
        promptQAWork,
        (chunk) => {
          setWorkResponse(chunk); // Update the response directly with each chunk
        },
        (finalResponse) => {
          setWorkResponse(finalResponse); // Final response after completion
        }
      );
    } catch (error) {
      console.error("Error fetching chat:", error);
      setWorkResponse("生成失敗，請稍後重試。");
    }
  };

  const fetchLife = async () => {
    console.log("開始算命啦！(生活)");
    try {
      await generateDescribe(
        promptQALife,
        (chunk) => {
          setLifeResponse(chunk); // Update the response directly with each chunk
        },
        (finalResponse) => {
          setLifeResponse(finalResponse); // Final response after completion
        }
      );
    } catch (error) {
      console.error("Error fetching chat:", error);
      setLifeResponse("生成失敗，請稍後重試。");
    }
  };

  // This useEffect handles the work-related response.
  useEffect(() => {
    if (promptQAWork !== prevWorkPrompt) {
      setPrevWorkPrompt(promptQAWork);
      fetchWork();
    }
  }, [promptQAWork, prevWorkPrompt]);

  // This useEffect handles the life-related response.
  useEffect(() => {
    if (promptQALife !== prevLifePrompt) {
      setPrevLifePrompt(promptQALife);
      fetchLife();
    }
  }, [promptQALife, prevLifePrompt]);

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
      </div>
      <div className="flex justify-center gap-4 items-center shadow-md bg-purple-300 bg-opacity-50 rounded-lg py-2">
        <div className="flex flex-col items-center">
          <p className="text-xl text-start font-cubic text-[#FAF5E7]">
            {userName}
          </p>
          <p className="text-md font-cubic text-[#FAF5E7] text-wrap">你就是</p>
        </div>
        <p className="text-4xl font-cubic text-[#FAF5E7]">{answerService}</p>
      </div>
      <div>
        <p className="text-lg text-[#FAF5E7] font-cubic rounded-lg text-wrap p-2">
          職場上的你
        </p>
        <div className="min-h-24 bg-purple-300 bg-opacity-40 rounded-lg p-2">
          <p className="text-md text-[#FAF5E7] font-cubic rounded-lg text-wrap">
            {workResponse}
          </p>
        </div>
      </div>
      <div>
        <p className="text-lg text-[#FAF5E7] font-cubic rounded-lg text-wrap p-2">
          生活上的你
        </p>
        <div className="min-h-24 bg-purple-300 bg-opacity-30 rounded-lg p-2">
          <p className="text-md text-[#FAF5E7] font-cubic rounded-lg text-wrap">
            {lifeResponse}
          </p>
        </div>
      </div>
    </div>
  );
}
