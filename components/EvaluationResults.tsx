'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ThumbsUp,
  Target,
  BarChart3,
  Download,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Evaluation {
  id: string;
  assignment_id: string;
  submission_id: string;
  student_name: string;
  total_marks: number;
  obtained_marks: number;
  percentage: number;
  grade: string;
  correct_answers: string[];
  incorrect_answers: string[];
  partial_credit_areas: string[];
  strengths: string[];
  areas_for_improvement: string[];
  detailed_feedback: string;
  evaluation_type: string;
  batch_id: string | null;
  created_at: string;
}

interface EvaluationResultsProps {
  assignmentId: string;
  assignmentTitle: string;
}

export default function EvaluationResults({ assignmentId, assignmentTitle }: EvaluationResultsProps) {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);

  useEffect(() => {
    fetchEvaluations();
  }, [assignmentId]);

  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .eq('assignment_id', assignmentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvaluations(data || []);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      toast.error('Failed to load evaluation results');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-600';
      case 'B': return 'bg-blue-600';
      case 'C': return 'bg-yellow-600';
      case 'D': return 'bg-orange-600';
      case 'F': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const calculateStats = () => {
    if (evaluations.length === 0) return null;

    const totalStudents = evaluations.length;
    const averageScore = evaluations.reduce((sum, eval) => sum + eval.percentage, 0) / totalStudents;
    const highestScore = Math.max(...evaluations.map(eval => eval.percentage));
    const lowestScore = Math.min(...evaluations.map(eval => eval.percentage));
    
    const gradeDistribution = evaluations.reduce((acc, eval) => {
      acc[eval.grade] = (acc[eval.grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const passRate = (evaluations.filter(eval => eval.percentage >= 60).length / totalStudents) * 100;

    return {
      totalStudents,
      averageScore: Math.round(averageScore * 100) / 100,
      highestScore,
      lowestScore,
      gradeDistribution,
      passRate: Math.round(passRate * 100) / 100
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-300">Loading evaluation results...</p>
      </div>
    );
  }

  if (evaluations.length === 0) {
    return (
      <Card className="glass-effect">
        <CardContent className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Evaluations Yet</h3>
          <p className="text-gray-300 mb-6">
            Start evaluating submissions to see results here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-effect">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.totalStudents}</div>
              <div className="text-sm text-gray-400">Total Evaluated</div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.averageScore}%</div>
              <div className="text-sm text-gray-400">Average Score</div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.highestScore}%</div>
              <div className="text-sm text-gray-400">Highest Score</div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.passRate}%</div>
              <div className="text-sm text-gray-400">Pass Rate</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Results */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
            Overview
          </TabsTrigger>
          <TabsTrigger value="individual" className="data-[state=active]:bg-blue-600">
            Individual Results
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card className="glass-effect">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Evaluation Overview</CardTitle>
                <Button
                  onClick={fetchEvaluations}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-gray-300"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Grade Distribution */}
                <div>
                  <h4 className="text-white font-medium mb-4">Grade Distribution</h4>
                  <div className="space-y-2">
                    {stats && Object.entries(stats.gradeDistribution).map(([grade, count]) => (
                      <div key={grade} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getGradeColor(grade)} text-white`}>
                            {grade}
                          </Badge>
                          <span className="text-gray-300">{count} students</span>
                        </div>
                        <div className="text-gray-400">
                          {Math.round((count / stats.totalStudents) * 100)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Evaluations */}
                <div>
                  <h4 className="text-white font-medium mb-4">Recent Evaluations</h4>
                  <div className="space-y-3">
                    {evaluations.slice(0, 5).map((evaluation) => (
                      <div key={evaluation.id} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-600 text-white text-xs">
                              {evaluation.student_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white text-sm font-medium">{evaluation.student_name}</p>
                            <p className="text-gray-400 text-xs">
                              {format(new Date(evaluation.created_at), 'MMM d, h:mm a')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getGradeColor(evaluation.grade)} text-white`}>
                            {evaluation.grade}
                          </Badge>
                          <span className="text-white font-medium">{evaluation.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student List */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white">Student Results</CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {evaluations.map((evaluation) => (
                    <div
                      key={evaluation.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedEvaluation?.id === evaluation.id
                          ? 'bg-blue-600/20 border-blue-500'
                          : 'bg-slate-800/50 border-slate-600 hover:bg-slate-700/50'
                      }`}
                      onClick={() => setSelectedEvaluation(evaluation)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-purple-600 text-white">
                              {evaluation.student_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-medium">{evaluation.student_name}</p>
                            <p className="text-gray-400 text-sm">
                              {evaluation.obtained_marks}/{evaluation.total_marks} marks
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getGradeColor(evaluation.grade)} text-white mb-1`}>
                            {evaluation.grade}
                          </Badge>
                          <div className="text-white font-bold">{evaluation.percentage}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Result */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white">
                  {selectedEvaluation ? `${selectedEvaluation.student_name}'s Result` : 'Select a Student'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedEvaluation ? (
                  <div className="space-y-6">
                    {/* Score Summary */}
                    <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                      <div className="text-3xl font-bold text-white mb-2">
                        {selectedEvaluation.percentage}%
                      </div>
                      <Badge className={`${getGradeColor(selectedEvaluation.grade)} text-white text-lg px-3 py-1`}>
                        Grade {selectedEvaluation.grade}
                      </Badge>
                      <p className="text-gray-400 mt-2">
                        {selectedEvaluation.obtained_marks} out of {selectedEvaluation.total_marks} marks
                      </p>
                    </div>

                    {/* Correct Answers */}
                    {selectedEvaluation.correct_answers.length > 0 && (
                      <div>
                        <h4 className="text-green-400 font-medium mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Correct Answers
                        </h4>
                        <ul className="space-y-1">
                          {selectedEvaluation.correct_answers.map((answer, index) => (
                            <li key={index} className="text-gray-300 text-sm">• {answer}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Incorrect Answers */}
                    {selectedEvaluation.incorrect_answers.length > 0 && (
                      <div>
                        <h4 className="text-red-400 font-medium mb-2 flex items-center">
                          <XCircle className="h-4 w-4 mr-2" />
                          Areas to Improve
                        </h4>
                        <ul className="space-y-1">
                          {selectedEvaluation.incorrect_answers.map((answer, index) => (
                            <li key={index} className="text-gray-300 text-sm">• {answer}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Strengths */}
                    {selectedEvaluation.strengths.length > 0 && (
                      <div>
                        <h4 className="text-blue-400 font-medium mb-2 flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Strengths
                        </h4>
                        <ul className="space-y-1">
                          {selectedEvaluation.strengths.map((strength, index) => (
                            <li key={index} className="text-gray-300 text-sm">• {strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Detailed Feedback */}
                    <div>
                      <h4 className="text-white font-medium mb-2">Detailed Feedback</h4>
                      <p className="text-gray-300 text-sm bg-slate-800/50 p-3 rounded-lg">
                        {selectedEvaluation.detailed_feedback}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Select a student to view detailed results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-white">Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Performance Distribution */}
                <div>
                  <h4 className="text-white font-medium mb-4">Score Distribution</h4>
                  <div className="space-y-3">
                    {[
                      { range: '90-100%', color: 'bg-green-600', count: evaluations.filter(e => e.percentage >= 90).length },
                      { range: '80-89%', color: 'bg-blue-600', count: evaluations.filter(e => e.percentage >= 80 && e.percentage < 90).length },
                      { range: '70-79%', color: 'bg-yellow-600', count: evaluations.filter(e => e.percentage >= 70 && e.percentage < 80).length },
                      { range: '60-69%', color: 'bg-orange-600', count: evaluations.filter(e => e.percentage >= 60 && e.percentage < 70).length },
                      { range: 'Below 60%', color: 'bg-red-600', count: evaluations.filter(e => e.percentage < 60).length }
                    ].map((item) => (
                      <div key={item.range} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded ${item.color}`}></div>
                          <span className="text-gray-300">{item.range}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{item.count}</span>
                          <span className="text-gray-400 text-sm">
                            ({Math.round((item.count / evaluations.length) * 100)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Issues */}
                <div>
                  <h4 className="text-white font-medium mb-4">Common Areas for Improvement</h4>
                  <div className="space-y-2">
                    {/* This would be calculated from all evaluations */}
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                      <p className="text-gray-300 text-sm">
                        Analysis of common improvement areas across all students would appear here.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}