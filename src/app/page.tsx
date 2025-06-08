"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Typography,
  Spin,
} from "antd";
import { useSettingsStore, useCategoryStore } from "./store";
import { SmileOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";

import styles from "../shared/styles/Home.module.css";

export default function Home() {
  const router = useRouter();
  const setSettings = useSettingsStore((s) => s.setSettings);
  const { categories, loading, error, fetchCategories } = useCategoryStore();
  const [form] = Form.useForm();

  useEffect(() => {
    if (categories.length === 0) fetchCategories();
  }, [fetchCategories, categories.length]);

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <SmileOutlined className={styles.icon} />
          <Typography.Title level={2} style={{ margin: 0 }}>
            Open Trivia
          </Typography.Title>
          <Typography.Text type="secondary">
            A multi-round trivia game built by Ilya
          </Typography.Text>
        </div>
        <Form
          layout="vertical"
          initialValues={{
            player: "",
            amount: 10,
            level: "easy",
            type: "multiple",
            category: "",
          }}
          onFinish={(values) => {
            setSettings(values);
            router.push(`/quiz/${values.category}`);
          }}
        >
          <Form.Item
            label="Player"
            name="player"
            rules={[
              {
                required: true,
                min: 4,
                max: 20,
                message: "Must be between 4 and 20 characters",
              },
            ]}
          >
            <Input
              placeholder="Enter player name (4-20 characters)"
              maxLength={20}
            />
          </Form.Item>
          <Form.Item
            label="Number of Questions"
            name="amount"
            rules={[
              {
                required: true,
                type: "number",
                min: 1,
                max: 50,
                message: "Must be between 1 and 50",
              },
            ]}
          >
            <InputNumber min={1} max={50} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Level" name="level">
            <Select allowClear>
              <Select.Option value="">Any Difficulty</Select.Option>
              <Select.Option value="easy">Easy</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="hard">Hard</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Select allowClear>
              <Select.Option value="">Any Type</Select.Option>
              <Select.Option value="multiple">Multiple Choice</Select.Option>
              <Select.Option value="boolean">True / False</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            {loading ? (
              <Spin size="small" />
            ) : error ? (
              <Typography.Text type="danger">{error}</Typography.Text>
            ) : (
              <Select placeholder="Select category" allowClear>
                <Select.Option value="">Any Category</Select.Option>
                {categories.map((cat) => (
                  <Select.Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            <Button
              className={styles.button}
              type="primary"
              htmlType="submit"
              block
              disabled={loading}
            >
              Start Game
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
