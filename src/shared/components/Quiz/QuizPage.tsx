"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Typography, Spin, Button, Space, Result } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useQuizStore, useSettingsStore } from "../../../app/store";
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
    resetQuiz,
  } = useQuizStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const player = useSettingsStore((s) => s.settings.player);
  const didFetch = useRef(false);

  useEffect(() => {
    didFetch.current = false;
  }, [categoryId]);

  useEffect(() => {
    if (!didFetch.current) {
      const settings = useSettingsStore.getState().settings;
      fetchQuestions({
        category: categoryId,
        amount: settings.amount,
        difficulty: settings.level,
        type: settings.type,
      });
      setSelected(null);
      setShowResult(false);
      didFetch.current = true;
    }
    // eslint-disable-next-line
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
            <Button onClick={() => router.push("/")}>Back to main screen</Button>
          }
        />
      </div>
    );
  }


  if (current >= questions.length) {
    return (
      <div className={styles.container}>
        <Result
          status="success"
          title="Quiz completed!"
          subTitle={`Player: ${player}\nCorrect answers: ${correct} of ${questions.length}`}
          extra={[
            <Button
              key="back"
              type="primary"
              onClick={() => {
                resetQuiz();
                router.push("/");
              }}
            >
              Back to main screen
            </Button>,
          ]}
        />
      </div>
    );
  }

  const q = questions[current];

  const handleAnswer = (ans: string) => {
    setSelected(ans);
    setShowResult(true);
  }

  const handleNext = () => {
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
