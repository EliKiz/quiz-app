"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Typography, Spin, Button, Space, Result } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useQuizStore } from "../../store";

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
    // eslint-disable-next-line
  }, [categoryId]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f8fa",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Ошибка"
        subTitle={error}
        extra={
          <Button onClick={() => fetchQuestions({ category: categoryId })}>
            Попробовать снова
          </Button>
        }
      />
    );
  }

  if (questions.length === 0) {
    return (
      <Result
        status="info"
        title="Нет вопросов"
        subTitle="В этой категории нет доступных вопросов."
        extra={
          <Button onClick={() => router.push("/")}>Назад к категориям</Button>
        }
      />
    );
  }

  if (current >= questions.length) {
    return (
      <Result
        status="success"
        title="Викторина завершена!"
        subTitle={`Правильных: ${correct}, Неправильных: ${incorrect}`}
        extra={[
          <Button
            type="primary"
            key="again"
            onClick={() => {
              resetQuiz();
              fetchQuestions({ category: categoryId });
            }}
          >
            Пройти ещё раз
          </Button>,
          <Button
            key="back"
            onClick={() => {
              resetQuiz();
              router.push("/");
            }}
          >
            К категориям
          </Button>,
        ]}
      />
    );
  }

  const q = questions[current];

  function handleAnswer(ans: string) {
    setSelected(ans);
    setShowResult(true);
    setTimeout(() => {
      answer(ans);
      setSelected(null);
      setShowResult(false);
    }, 1000);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f8fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card style={{ width: 600, padding: 32, boxShadow: "0 2px 16px #0001" }}>
        <Typography.Title level={4}>
          Вопрос {current + 1} из {questions.length}
        </Typography.Title>
        <Typography.Paragraph style={{ fontSize: 18 }}>
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
          <Typography.Text
            type={selected === q.correct_answer ? "success" : "danger"}
            style={{ display: "block", marginTop: 16 }}
          >
            {selected === q.correct_answer
              ? "Верно!"
              : `Неверно! Правильный ответ: ${q.correct_answer}`}
          </Typography.Text>
        )}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            resetQuiz();
            router.push("/");
          }}
          style={{ marginBottom: 16, marginTop: 16 }}
        >
          На главный экран
        </Button>
      </Card>
    </div>
  );
}
