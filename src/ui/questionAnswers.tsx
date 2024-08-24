"use client";

import { motion } from "framer-motion";

interface QuestionAnswersProps {
  step: number;
  totalSteps: number;
  question: string;
  options: string[];
  onNext: (option: string) => void;
  onBack: () => void;
}

export default function QuestionAnswers({
  step,
  totalSteps,
  question,
  options,
  onNext,
  onBack,
}: QuestionAnswersProps) {
  return (
    <div>
      <div className="relative">
        <div className="flex justify-between p-2">
          <p className="text-2xl text-white *:font-semibold font-cubic">
            第 {step + 1} 題
          </p>
          <p className="text-2xl text-white *:font-semibold font-cubic">
            {step + 1}/{totalSteps}
          </p>
        </div>
        <motion.p
          key={step}
          className="text-xl mb-8 px-4 py-6 bg-[#FAF5E7] text-black font-cubic border-black border-4 rounded-lg shadow-[5px_5px_0_#000]"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {question}
        </motion.p>
      </div>
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.175 }}
      >
        {options.map((option, index) => (
          <button
            key={index}
            className="block w-full border border-black bg-neutral-200 active:bg-zinc-100 text-black font-bold font-cubic py-2 rounded-2xl mb-4"
            onClick={() => onNext(option)}
          >
            {option}
          </button>
        ))}
      </motion.div>
      <div className="flex justify-end">
        <button
          onClick={onBack}
          className="bg-yellow-200 active:bg-yellow-300 text-black px-2 font-bold rounded-full border-r-4 border-b-4 border-t-2 border-l-2 border-black font-cubic"
        >
          回上一題
        </button>
      </div>
    </div>
  );
}
