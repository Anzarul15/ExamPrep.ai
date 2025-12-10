import React, { useState } from 'react';
import Home from './pages/Home';
import Config from './pages/Config';
import TestScreen from './pages/TestScreen';
import Results from './pages/Results';
import { ExamType, TestConfig, Question } from './types';

type Screen = 'home' | 'config' | 'test' | 'results';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedExam, setSelectedExam] = useState<ExamType | null>(null);
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  const handleSelectExam = (exam: ExamType) => {
    setSelectedExam(exam);
    setScreen('config');
  };

  const handleStartTest = (config: TestConfig, generatedQuestions: Question[]) => {
    setTestConfig(config);
    setQuestions(generatedQuestions);
    setUserAnswers({});
    setScreen('test');
  };

  const handleFinishTest = (answers: Record<number, number>) => {
    setUserAnswers(answers);
    setScreen('results');
  };

  const handleRetake = () => {
    setUserAnswers({});
    setScreen('test');
  };

  const handleNewTest = () => {
    // Keep exam type, go back to config
    setScreen('config');
    setQuestions([]);
    setUserAnswers({});
  };

  const handleBackToHome = () => {
    setScreen('home');
    setSelectedExam(null);
    setTestConfig(null);
    setQuestions([]);
  };

  return (
    <>
      {screen === 'home' && <Home onSelectExam={handleSelectExam} />}
      
      {screen === 'config' && selectedExam && (
        <Config 
          examType={selectedExam} 
          onBack={handleBackToHome}
          onStart={handleStartTest}
        />
      )}
      
      {screen === 'test' && questions.length > 0 && (
        <TestScreen 
          questions={questions} 
          onFinish={handleFinishTest} 
        />
      )}

      {screen === 'results' && testConfig && (
        <Results 
          questions={questions}
          userAnswers={userAnswers}
          config={testConfig}
          onRetake={handleRetake}
          onNewTest={handleNewTest}
          onBackToHome={handleBackToHome}
        />
      )}
    </>
  );
};

export default App;