import { useState, useEffect } from "react";

export default function AiPage({
  apiEndpoint,
  apiEndpointUntrained,
  promptQAWork,
  promptQALife,
  userName,
  answerService,
}: {
  apiEndpoint: string;
  apiEndpointUntrained: string;
  promptQAWork: string;
  promptQALife: string;
  userName: string;
  answerService: string;
}) {
  const [workResponse, setWorkResponse] = useState("算貓師幫你看看你的工作...");
  const [lifeResponse, setLifeResponse] = useState("算貓師在思考你的生活...");
  const [workResponseUntrained, setWorkResponseUntrained] =
    useState("你們的算貓師幫你看看你工作...");
  const [lifeResponseUntrained, setLifeResponseUntrained] =
    useState("你們的算貓師在思考你的生活...");
  const [prevWorkPrompt, setPrevWorkPrompt] = useState(promptQAWork);
  const [prevLifePrompt, setPrevLifePrompt] = useState(promptQALife);
  const [useUntrained, setUseUntrained] = useState(false);

  const fetchResponse = async (
    endpoint: string,
    prompt: string,
    onUpdate: (response: string) => void
  ) => {
    try {
      const model = useUntrained
        ? "anthropic.claude-3-sonnet-20240229-v1:0"
        : "psy-1";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          system: "",
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
          accumulatedResponse += chunk;
          onUpdate(accumulatedResponse); // Update the response directly
        }
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
      onUpdate("生成失敗，請稍後重試。");
    }
  };

  const fetchWorkResponses = async () => {
    console.log("Fetching both work responses...");
    try {
      await fetchResponse(apiEndpoint, promptQAWork, setWorkResponse);
      await fetchResponse(
        apiEndpointUntrained,
        promptQAWork,
        setWorkResponseUntrained
      );
    } catch (error) {
      console.error("Error fetching work responses:", error);
    }
  };

  const fetchLifeResponses = async () => {
    console.log("Fetching both life responses...");
    try {
      await fetchResponse(apiEndpoint, promptQALife, setLifeResponse);
      await fetchResponse(
        apiEndpointUntrained,
        promptQALife,
        setLifeResponseUntrained
      );
    } catch (error) {
      console.error("Error fetching life responses:", error);
    }
  };

  // This useEffect handles both work-related responses.
  useEffect(() => {
    if (promptQAWork !== prevWorkPrompt) {
      setPrevWorkPrompt(promptQAWork);
      fetchWorkResponses(); // Fetch both trained and untrained responses
    }
  }, [promptQAWork, prevWorkPrompt]);

  // This useEffect handles both life-related responses.
  useEffect(() => {
    if (promptQALife !== prevLifePrompt) {
      setPrevLifePrompt(promptQALife);
      fetchLifeResponses(); // Fetch both trained and untrained responses
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

      {/* Toggle for trained/untrained model */}
      <div className="flex justify-center">
        <label className="inline-flex items-center me-5 cursor-pointer">
          <input
            type="checkbox"
            checked={useUntrained}
            onChange={() => setUseUntrained(!useUntrained)}
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-200"></div>
          <span className="ms-3 text-sm font-medium text-[#FAF5E7]">
            {useUntrained ? "你們的訓練模型" : "訓練很多資料的模型"}
          </span>
        </label>
      </div>

      {/* Work Response */}
      <div>
        <p className="text-lg text-[#FAF5E7] font-cubic rounded-lg text-wrap p-2">
          職場上的你
        </p>
        <div className="min-h-24 bg-purple-300 bg-opacity-40 rounded-lg p-2">
          <p className="text-md text-[#FAF5E7] font-cubic rounded-lg text-wrap">
            {useUntrained ? workResponseUntrained : workResponse}
          </p>
        </div>
      </div>

      {/* Life Response */}
      <div>
        <p className="text-lg text-[#FAF5E7] font-cubic rounded-lg text-wrap p-2">
          生活上的你
        </p>
        <div className="min-h-24 bg-purple-300 bg-opacity-30 rounded-lg p-2">
          <p className="text-md text-[#FAF5E7] font-cubic rounded-lg text-wrap">
            {useUntrained ? lifeResponseUntrained : lifeResponse}
          </p>
        </div>
      </div>
    </div>
  );
}
