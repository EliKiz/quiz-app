"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Typography, Spin, Button, Space, Result } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useQuizStore } from "../../../app/store/quizStore";
import { useSettingsStore } from "../../../app/store/settingsStore";
import styles from "../../styles/QuizPage.module.css";
import QuizAnswerButton from "./QuizAnswerButton";
import QuizResult from "./QuizResult";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = Number(params?.categoryId);
  const {
    questions,
    current,
    loading,
    error,
    fetchQuestions,
    answer,
    correct,
    resetQuiz,
  } = useQuizStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const player = useSettingsStore((s) => s.settings.player);

  useEffect(() => {
    const settings = useSettingsStore.getState().settings;
    fetchQuestions({
      category: categoryId,
      amount: settings.amount,
      difficulty: settings.level,
      type: settings.type,
    });
    setSelected(null);
    setShowResult(false);
  }, [categoryId, fetchQuestions]);

  if (loading) {
    return (
      <div className={styles.container}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Result
          status="error"
          title="Error"
          subTitle={error}
          extra={
            <Button onClick={() => fetchQuestions({ category: categoryId })}>
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className={styles.container}>
        <Result
          status="info"
          title="No questions"
          subTitle="There are no available questions in this category."
          extra={
            <Button onClick={() => router.push("/")}>
              Back to main screen
            </Button>
          }
        />
      </div>
    );
  }

  if (current >= questions.length) {
    return (
      <div className={styles.container}>
        <QuizResult
          player={player}
          correct={correct}
          total={questions.length}
          onBack={() => {
            resetQuiz();
            router.push("/");
          }}
        />
      </div>
    );
  }

  const q = questions[current];

  const handleAnswer = (ans: string) => {
    setSelected(ans);
    setShowResult(true);
  };

  const handleNext = () => {
    if (selected) {
      answer(selected);
      setSelected(null);
      setShowResult(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Typography.Title level={4}>
          Question {current + 1} of {questions.length}
        </Typography.Title>
        <Typography.Paragraph className={styles.question}>
          <span dangerouslySetInnerHTML={{ __html: q.question }} />
        </Typography.Paragraph>
        <Space direction="vertical" style={{ width: "100%" }}>
          {q.all_answers.map((ans) => (
            <QuizAnswerButton
              key={ans}
              ans={ans}
              selected={selected}
              correctAnswer={q.correct_answer}
              onClick={handleAnswer}
            />
          ))}
        </Space>
        {showResult && selected && (
          <>
            <Typography.Text
              type={selected === q.correct_answer ? "success" : "danger"}
              style={{ display: "block", marginTop: 16 }}
            >
              {selected === q.correct_answer
                ? "Correct!"
                : `Incorrect! The correct answer is: ${q.correct_answer}`}
            </Typography.Text>
            <div className={styles.buttonRow}>
              <Button
                type="primary"
                className={styles.nextButton}
                onClick={handleNext}
                block
              >
                Next question
              </Button>
            </div>
          </>
        )}
        <div className={styles.buttonRow}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              resetQuiz();
              router.push("/");
            }}
            className={styles.button}
            block
          >
            Back to main screen
          </Button>
        </div>
      </Card>
    </div>
  );
}
