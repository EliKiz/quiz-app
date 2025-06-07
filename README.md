# Open Trivia Quiz App

![Start Screen](./docs/start-screen.png)

## Description

This is a quiz application built with Next.js, TypeScript, Ant Design, and the Open Trivia Database API. Users can enter their name, select the number of rounds, questions per round, difficulty level, and category, then take a quiz with real-time scoring of correct and incorrect answers.

---

## Task Description

**Goal:** Build a quiz application using Next.js, TypeScript, Ant Design, and the Open Trivia Database API to fetch questions and conduct quizzes.

### Requirements

#### User Interface
- Create a main page that displays a list of quiz categories.
- Each category should be shown as a list item with the category name.
- When a category is selected, the user should be redirected to the questions screen.

#### Questions Screen
- Create a page that displays quiz questions.
- For each question, show the question text and several answer options as buttons.
- The user should be able to select one answer.
- After selecting an answer, show the result (correct/incorrect) and move to the next question.

#### API Integration
- Use the Open Trivia Database API to fetch quiz categories and questions.
- Implement methods to fetch the list of categories and questions for the selected category.
- Handle request parameters such as the number of questions, difficulty level, and question type (multiple choice or true/false).
- You may use fetch or axios for HTTP requests.

#### State Management & Results
- Track the number of correct and incorrect answers.
- After the quiz is finished, show a results screen with the option to start a new quiz or return to the category list.

#### Notes
- Use Ant Design components for the UI. Example components: Button, Input, Card, Checkbox, List, Modal, etc.
- The app should be responsive and display correctly on both mobile and desktop devices.
- For better UX, use Ant Design's Spin or other loading indicators (e.g., when adding or removing tasks).
- Use fetch/axios for HTTP requests.
- Store state in a store (Redux/Zustand).
- Test data: https://opentdb.com/api_config.php

---

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Start Screen

![Start Screen](./docs/start-screen.png)

---

## Technologies Used
- Next.js
- TypeScript
- Ant Design
- Zustand
- Open Trivia Database API
