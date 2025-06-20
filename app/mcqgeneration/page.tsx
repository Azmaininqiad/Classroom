'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Loader2, Home, Clock } from 'lucide-react';
import Link from 'next/link';

const API_BASE_URL = 'http://localhost:8001';

interface Quiz {
  id: string;
  title: string;
  total_questions: number;
  created_at: string;
}

export default function MCQGeneration() {
  const [file, setFile] = useState<File | null>(null);
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [recentQuizzes, setRecentQuizzes] = useState<Quiz[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchRecentQuizzes();
  }, []);

  const fetchRecentQuizzes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes`);
      const data = await response.json();
      setRecentQuizzes(data.quizzes);
    } catch (error) {
      console.error('Error fetching recent quizzes:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setMessage('Please select a file');
      setMessageType('error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('num_questions', numQuestions.toString());

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`MCQs generated successfully! Quiz ID: ${data.quiz_id}`);
        setMessageType('success');
        
        // Redirect to quiz page after 2 seconds
        setTimeout(() => {
          router.push(`/mcqgeneration/quiz/${data.quiz_id}`);
        }, 2000);

        // Refresh recent quizzes
        fetchRecentQuizzes();
      } else {
        throw new Error(data.detail || 'Error uploading file');
      }
      
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error uploading file');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizClick = (quizId: string) => {
    router.push(`/mcqgeneration/quiz/${quizId}`);
  };

  return (
    <div className="min-h-screen">
      <div className="container">
        {/* Header */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MCQ Generator
            </h1>
            <Link href="/">
              <button className="btn btn-secondary flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </button>
            </Link>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload File (PDF, TXT, or Image)
              </label>
              <div className="relative">
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf,.txt,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                {file && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    {file.name}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Number of Questions (1-20)
              </label>
              <input
                type="number"
                className="form-control"
                min="1"
                max="20"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
              disabled={loading || !file}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating MCQs...
                </>
              ) : (
                'Generate MCQs'
              )}
            </button>
          </form>

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p className="text-muted-foreground">AI is analyzing your document and creating questions...</p>
            </div>
          )}

          {message && (
            <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-error'}`}>
              {message}
            </div>
          )}
        </div>

        {/* Recent Quizzes */}
        {recentQuizzes.length > 0 && (
          <div className="card">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Recent Quizzes
            </h2>
            <ul className="quiz-list">
              {recentQuizzes.map((quiz) => (
                <li
                  key={quiz.id}
                  className="quiz-item"
                  onClick={() => handleQuizClick(quiz.id)}
                >
                  <div className="quiz-title">{quiz.title}</div>
                  <div className="quiz-meta">
                    {quiz.total_questions} questions • Created {new Date(quiz.created_at).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}