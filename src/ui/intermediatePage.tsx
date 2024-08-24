import { motion } from "framer-motion";

interface IntermediatePageProps {
  selectedOption: string;
  onContinue: () => void;
}

export default function IntermediatePage({
  selectedOption,
  onContinue,
}: IntermediatePageProps) {
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
      <motion.button
        onClick={onContinue}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        下一題
      </motion.button>
    </div>
  );
}
