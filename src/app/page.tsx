"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, InputNumber, Select, Button, Card, Typography, Spin } from "antd";
import { useSettingsStore, useCategoryStore } from "./store";
import "antd/dist/reset.css";
import { SmileOutlined } from '@ant-design/icons';

export default function Home() {
  const router = useRouter();
  const setSettings = useSettingsStore((s) => s.setSettings);
  const { categories, loading, error, fetchCategories } = useCategoryStore();

  useEffect(() => {
    if (categories.length === 0) fetchCategories();
  }, [fetchCategories, categories.length]);

  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Card style={{ width: 500, padding: 32, boxShadow: "0 2px 16px #0001" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <SmileOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 8 }} />
          <Typography.Title level={2} style={{ margin: 0 }}>Open Trivia</Typography.Title>
          <Typography.Text type="secondary">A multi round trivia game built Ilya</Typography.Text>
        </div>
        <Form
          layout="vertical"
          initialValues={{ player: '', rounds: 3, questions: 3, level: 'easy', category: undefined }}
          onFinish={(values) => {
            setSettings(values);
            router.push(`/quiz/${values.category}`);
          }}
        >
          <Form.Item label="Player" name="player" rules={[{ required: true, min: 4, max: 20, message: "Must be between 4 and 20 characters" }]} extra="Must be between 4 and 20 characters">
            <Input placeholder="player name" maxLength={20} />
          </Form.Item>
          <Form.Item label="Number of Rounds" name="rounds" rules={[{ required: true, type: "number", min: 1, max: 5, message: "Must be between 1 and 5" }]} extra="Must be between 1 and 5">
            <InputNumber min={1} max={5} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Questions Per Round" name="questions" rules={[{ required: true, type: "number", min: 1, max: 10, message: "Must be between 1 and 10" }]} extra="Must be between 1 and 10">
            <InputNumber min={1} max={10} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Level" name="level">
            <Select>
              <Select.Option value="easy">Easy</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="hard">Hard</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category" rules={[{ required: true, message: "Please select a category" }]}> 
            {loading ? (
              <Spin size="small" />
            ) : error ? (
              <Typography.Text type="danger">{error}</Typography.Text>
            ) : (
              <Select placeholder="Select category">
                {categories.map((cat) => (
                  <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={loading}>Start Game</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
