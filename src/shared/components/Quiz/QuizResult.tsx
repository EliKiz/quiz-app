import { Result, Button } from "antd";
import React from "react";

interface IQuizResultProps {
  player: string;
  correct: number;
  total: number;
  onBack: () => void;
}

const QuizResult: React.FC<IQuizResultProps> = ({ player, correct, total, onBack }) => (
  <Result
    status="success"
    title="Quiz completed!"
    subTitle={`Player: ${player}\nCorrect answers: ${correct} of ${total}`}
    extra={[
      <Button key="back" type="primary" onClick={onBack}>
        Back to main screen
      </Button>,
    ]}
  />
);

export default QuizResult; 