import { Circle, X } from "lucide-react";

export default function ResultCard({
  answerService,
  imageUrl,
}: {
  answerService: string;
  imageUrl: string;
}) {
  return (
    <div className="flex flex-col bg-[#FAF5E7] rounded-lg border-4 border-black shadow-[5px_5px_0_#000]">
      <div className="flex items-center border-b-4 border-black p-2">
        <div className="flex gap-2 w-full">
          <Circle size={20} strokeWidth={4} />
          <Circle size={20} strokeWidth={4} />
        </div>
        <X strokeWidth={4} />
      </div>
      <div className="flex justify-between items-center px-4 py-4">
        <div className="flex flex-col flex-grow">
          <p className="text-lg text-start font-cubic text-black ">
            你天生就是
          </p>
          {(answerService === "EC2" ||
            answerService === "S3" ||
            answerService === "ELB" ||
            answerService === "IAM") && (
            <p className="text-5xl font-cubic font-outline-2 py-3 pl-1">
              {answerService}
            </p>
          )}
          {answerService === "Lambda" && (
            <p className="text-4xl font-cubic font-outline-2 py-3">
              {answerService}
            </p>
          )}

          {answerService === "API gateway" && (
            <p className="text-xl font-cubic font-outline-2 py-3">
              {answerService}
            </p>
          )}

          {(answerService === "Cloudwatch" || answerService === "DynamoDB") && (
            <p className="text-2xl font-cubic font-outline-2 py-3">
              {answerService}
            </p>
          )}
          <p className="font-cubic text-xs"># 需要我隨時都在</p>
          <p className="font-cubic text-xs"># 適應性強</p>
          <p className="font-cubic text-xs"># 你是T嗎</p>
        </div>
        <div className="">
          <img
            src={
              imageUrl ||
              "https://aws-psy-test-image.s3.amazonaws.com/generated_images/2b883c0c-121a-4826-8429-7d31ba3a29fd.png"
            }
            alt="Service"
            className="rounded-lg w-48"
          />
        </div>
      </div>
      <div className="flex justify-center pl-5 pr-3 pb-2 text-wrap">
        <p className="font-cubic text-sm">
          &quot;適應性強且靈活的人，能夠根據環境的變化迅速調整自己的步伐。擁有強大的能力，可以在需要的時候全力以赴，也可以在平靜時輕鬆應對。&quot;
        </p>
      </div>
      <hr className="border-y-2 border-black my-2" />
      <div className="pl-5 pr-3 text-wrap">
        <p className="font-cubic text-md text-[#23303F] py-2">
          在職場上的你...
        </p>
        <p className="font-cubic text-sm text-wrap w-full">
          能迅速掌握新技能，並根據工作需求快速調整自己的步伐。他們在面對高強度的工作壓力時，能夠全力以赴，展現出卓越的表現和效率。無論是處理複雜的項目還是應對緊急情況，他們總是能夠迎刃而解。
        </p>
      </div>
      <hr className="border-y-2 border-black my-2" />
      <div className="pl-5 pr-3 pb-5 text-wrap">
        <p className="font-cubic text-md text-[#23303F] py-2">AWS 服務小教室</p>
        <p className="font-cubic text-sm">
          提供可擴展計算能力的服務。用戶可以在雲中快速啟動虛擬機器，選擇不同的作業系統和配置。這對於處理不同的工作負載，例如應用程式伺服器、資料庫或後端伺服器等都非常有用
        </p>
      </div>
    </div>
  );
}
