import { Button } from "antd";
import React from "react";

interface IQuizAnswerButtonProps {
  ans: string;
  selected: string | null;
  correctAnswer: string;
  onClick: (ans: string) => void;
}

const QuizAnswerButton: React.FC<IQuizAnswerButtonProps> = ({ ans, selected, correctAnswer, onClick }) => (
  <Button
    block
    size="large"
    disabled={!!selected}
    type={
      selected === ans
        ? ans === correctAnswer
          ? "primary"
          : "default"
        : "default"
    }
    danger={selected === ans && ans !== correctAnswer}
    onClick={() => onClick(ans)}
    style={{ textAlign: "left", whiteSpace: "normal" }}
  >
    <span dangerouslySetInnerHTML={{ __html: ans }} />
  </Button>
);

export default QuizAnswerButton; 