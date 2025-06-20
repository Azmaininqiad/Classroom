'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

const API_BASE_URL = 'http://localhost:8001';

interface Quiz {
  id: string;
  title: string;
  total_questions: number;
  created_at: string;
}

interface Question {
  id: string;
  question_number: number;
  question_text: string;
  options: Record<string, string>;
  correct_answer: string;
  explanation?: string;
}

interface Results {
  score: number;
  total_questions: number;
  percentage: number;
}

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [results, setResults] = useState<Results | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/quiz/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setQuiz(data.quiz);
        setQuestions(data.questions);
      } else {
        throw new Error('Failed to fetch quiz');
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      alert('Error loading quiz');
      router.push('/mcqgeneration');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/quiz/${id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResults(data);
        setShowResults(true);
      } else {
        throw new Error('Failed to submit quiz');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setResults(null);
    setShowResults(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p className="text-muted-foreground">Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen">
        <div className="container">
          <div className="card text-center">
            <h2 className="text-2xl font-semibold mb-4">Quiz not found</h2>
            <Link href="/mcqgeneration">
              <button className="btn btn-primary">
                Back to MCQ Generator
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container">
        {/* Header */}
        <div className="card">
          <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {quiz.title}
            </h1>
            <div className="flex gap-2">
              <Link href="/">
                <button className="btn btn-secondary flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Home
                </button>
              </Link>
              <Link href="/mcqgeneration">
                <button className="btn btn-secondary flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              </Link>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-4">
            Total Questions: {quiz.total_questions}
          </p>

          {showResults && results && (
            <div className="score-summary">
              <h2 className="text-2xl font-bold mb-2">Quiz Results</h2>
              <div className="score-number">{results.score}/{results.total_questions}</div>
              <p className="text-lg mb-4">{results.percentage}% Score</p>
              <button 
                className="btn btn-secondary flex items-center gap-2 mx-auto"
                onClick={resetQuiz}
              >
                <RotateCcw className="w-4 h-4" />
                Take Again
              </button>
            </div>
          )}
        </div>

        {/* Questions */}
        {questions.map((question) => (
          <div key={question.id} className="question-card">
            <div className="question-number">
              Question {question.question_number}
            </div>
            
            <div className="question-text">
              {question.question_text}
            </div>

            <div className="options">
              {Object.entries(question.options).map(([optionKey, optionText]) => {
                const isSelected = answers[question.id] === optionKey;
                const isCorrect = showResults && optionKey === question.correct_answer;
                const isIncorrect = showResults && isSelected && optionKey !== question.correct_answer;
                
                let className = 'option';
                if (showResults) {
                  if (isCorrect) className += ' correct';
                  else if (isIncorrect) className += ' incorrect';
                } else if (isSelected) {
                  className += ' selected';
                }

                return (
                  <label key={optionKey} className={className}>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={optionKey}
                      checked={isSelected}
                      onChange={() => handleAnswerChange(question.id, optionKey)}
                      disabled={showResults}
                    />
                    <div className="flex items-center gap-2">
                      <strong>{optionKey}:</strong> {optionText}
                      {showResults && isCorrect && <CheckCircle className="w-4 h-4 text-green-400" />}
                      {showResults && isIncorrect && <XCircle className="w-4 h-4 text-red-400" />}
                    </div>
                  </label>
                );
              })}
            </div>

            {showResults && question.explanation && (
              <div className="explanation">
                <strong>Explanation:</strong> {question.explanation}
              </div>
            )}
          </div>
        ))}

        {/* Submit Button */}
        {!showResults && (
          <div className="card text-center">
            <button
              className="btn btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 mx-auto"
              onClick={handleSubmit}
              disabled={submitting || Object.keys(answers).length < questions.length}
            >
              {submitting ? (
                <>
                  <div className="spinner w-5 h-5"></div>
                  Submitting...
                </>
              ) : (
                'Submit Quiz'
              )}
            </button>
            
            <p className="mt-4 text-muted-foreground">
              Answered: {Object.keys(answers).length} / {questions.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}