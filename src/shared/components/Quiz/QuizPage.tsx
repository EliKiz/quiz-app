"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Typography, Spin, Button, Space, Result } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useQuizStore } from "../../../app/store";
import styles from "../../styles/QuizPage.module.css";

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
    incorrect,
    resetQuiz,
  } = useQuizStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    fetchQuestions({ category: categoryId });
    setSelected(null);
    setShowResult(false);
  }, [categoryId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (questions.length === 0) {
    return (
      <Result
        status="info"
        title="No questions"
        subTitle="There are no available questions in this category."
        extra={
          <Button onClick={() => router.push("/")}>Back to main screen</Button>
        }
      />
    );
  }

  if (current >= questions.length) {
    return (
      <Result
        status="success"
        title="Quiz completed!"
        subTitle={`Correct: ${correct}, Incorrect: ${incorrect}`}
        extra={[
          <Button
            type="primary"
            key="again"
            onClick={() => {
              resetQuiz();
              fetchQuestions({ category: categoryId });
            }}
          >
            Try again
          </Button>,
          <Button
            key="back"
            onClick={() => {
              resetQuiz();
              router.push("/");
            }}
          >
            Back to main screen
          </Button>,
        ]}
      />
    );
  }

  const q = questions[current];

  function handleAnswer(ans: string) {
    setSelected(ans);
    setShowResult(true);
  }

  function handleNext() {
    if (selected) {
      answer(selected);
      setSelected(null);
      setShowResult(false);
    }
  }

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
            <Button
              key={ans}
              block
              size="large"
              disabled={!!selected}
              type={
                selected === ans
                  ? ans === q.correct_answer
                    ? "primary"
                    : "default"
                  : "default"
              }
              danger={selected === ans && ans !== q.correct_answer}
              onClick={() => handleAnswer(ans)}
              style={{ textAlign: "left", whiteSpace: "normal" }}
            >
              <span dangerouslySetInnerHTML={{ __html: ans }} />
            </Button>
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
      </Card>
    </div>
  );
}
