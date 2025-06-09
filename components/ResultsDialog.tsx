'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  User, 
  Target, 
  CheckCircle, 
  AlertCircle,
  Award,
  FileText,
  Calendar,
  Download,
  Brain,
  GraduationCap
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { aiEvaluationAPI, type AIEvaluationResult } from '@/lib/ai-evaluation';

interface Evaluation {
  id: string;
  assignment_id: string;
  submission_id: string;
  student_name: string;
  total_marks: number;
  obtained_marks: number;
  percentage: number;
  grade: string;
  correct_answers: string[] | null;
  incorrect_answers: string[] | null;
  partial_credit_areas: string[] | null;
  strengths: string[] | null;
  areas_for_improvement: string[] | null;
  detailed_feedback: string | null;
  evaluation_type: string;
  batch_id: string | null;
  created_at: string;
}

interface ResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentId: string;
  assignmentTitle: string;
}

export default function ResultsDialog({
  open,
  onOpenChange,
  assignmentId,
  assignmentTitle
}: ResultsDialogProps) {
  const [manualEvaluations, setManualEvaluations] = useState<Evaluation[]>([]);
  const [aiEvaluations, setAiEvaluations] = useState<AIEvaluationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('manual');
  const [stats, setStats] = useState({
    totalEvaluations: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
    gradeDistribution: {} as Record<string, number>
  });

  useEffect(() => {
    if (open) {
      fetchAllEvaluations();
    }
  }, [open, assignmentId]);

  const fetchAllEvaluations = async () => {
    setLoading(true);
    try {
      // Fetch manual evaluations from Supabase
      const { data: manualData, error: manualError } = await supabase
        .from('evaluations')
        .select('*')
        .eq('assignment_id', assignmentId)
        .order('created_at', { ascending: false });

      if (manualError) throw manualError;
      setManualEvaluations(manualData || []);

      // Fetch AI evaluations from FastAPI backend
      try {
        const aiData = await aiEvaluationAPI.getEvaluationsByAssignment(assignmentId);
        setAiEvaluations(aiData || []);
      } catch (aiError) {
        console.warn('AI evaluations not available:', aiError);
        setAiEvaluations([]);
      }

      // Calculate combined stats
      const allEvaluations = [
        ...(manualData || []).map(e => ({ percentage: e.percentage, grade: e.grade })),
        ...(aiData || []).map(e => ({ percentage: e.percentage, grade: e.grade }))
      ];

      calculateStats(allEvaluations);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      toast.error('Failed to load evaluation results');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (evaluations: Array<{ percentage: number; grade: string }>) => {
    if (evaluations.length === 0) {
      setStats({
        totalEvaluations: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        gradeDistribution: {}
      });
      return;
    }

    const scores = evaluations.map(e => e.percentage);
    const grades = evaluations.map(e => e.grade);

    const gradeDistribution = grades.reduce((acc, grade) => {
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setStats({
      totalEvaluations: evaluations.length,
      averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      gradeDistribution
    });
  };

  const getGradeColor = (grade: string) => {
    switch (grade.toUpperCase()) {
      case 'A+':
      case 'A': return 'bg-green-600/20 text-green-300 border-green-500/30';
      case 'A-':
      case 'B+':
      case 'B': return 'bg-blue-600/20 text-blue-300 border-blue-500/30';
      case 'B-':
      case 'C+':
      case 'C': return 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30';
      case 'C-':
      case 'D': return 'bg-orange-600/20 text-orange-300 border-orange-500/30';
      case 'F': return 'bg-red-600/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 80) return 'text-blue-400';
    if (percentage >= 70) return 'text-yellow-400';
    if (percentage >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const exportResults = () => {
    const allEvaluations = [
      ...manualEvaluations.map(e => ({ ...e, source: 'Manual' })),
      ...aiEvaluations.map(e => ({ ...e, source: 'AI', created_at: e.timestamp }))
    ];

    const csvContent = [
      ['Student Name', 'Total Marks', 'Obtained Marks', 'Percentage', 'Grade', 'Source', 'Evaluation Date'],
      ...allEvaluations.map(evaluation => [
        evaluation.student_name,
        evaluation.total_marks.toString(),
        evaluation.obtained_marks.toString(),
        evaluation.percentage.toFixed(2),
        evaluation.grade,
        evaluation.source,
        format(new Date(evaluation.created_at), 'yyyy-MM-dd HH:mm:ss'),
      ])
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${assignmentTitle}_all_results.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderEvaluationCard = (evaluation: any, isAI: boolean = false) => (
    <Card key={evaluation.id} className="glass-effect">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback className="bg-blue-600 text-white">
                {evaluation.student_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-white font-semibold flex items-center">
                {evaluation.student_name}
                {isAI && <Brain className="h-4 w-4 ml-2 text-purple-400" />}
                {!isAI && <GraduationCap className="h-4 w-4 ml-2 text-green-400" />}
              </h3>
              <p className="text-sm text-gray-400">
                {format(new Date(isAI ? evaluation.timestamp : evaluation.created_at), 'MMM d, yyyy at h:mm a')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={`${getGradeColor(evaluation.grade)} border`}>
              {evaluation.grade}
            </Badge>
            <div className="text-right">
              <div className={`text-xl font-bold ${getPerformanceColor(evaluation.percentage)}`}>
                {evaluation.percentage.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">
                {evaluation.obtained_marks}/{evaluation.total_marks}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evaluation.correct_answers && evaluation.correct_answers.length > 0 && (
            <div>
              <h4 className="text-green-400 font-medium flex items-center mb-2">
                <CheckCircle className="h-4 w-4 mr-1" />
                Correct Answers
              </h4>
              <div className="space-y-1">
                {evaluation.correct_answers.slice(0, 2).map((answer: string, index: number) => (
                  <Badge key={index} variant="outline" className="border-green-500/30 text-green-300 mr-1 mb-1 text-xs">
                    {answer}
                  </Badge>
                ))}
                {evaluation.correct_answers.length > 2 && (
                  <span className="text-xs text-gray-400">+{evaluation.correct_answers.length - 2} more</span>
                )}
              </div>
            </div>
          )}

          {evaluation.incorrect_answers && evaluation.incorrect_answers.length > 0 && (
            <div>
              <h4 className="text-red-400 font-medium flex items-center mb-2">
                <AlertCircle className="h-4 w-4 mr-1" />
                Incorrect Answers
              </h4>
              <div className="space-y-1">
                {evaluation.incorrect_answers.slice(0, 2).map((answer: string, index: number) => (
                  <Badge key={index} variant="outline" className="border-red-500/30 text-red-300 mr-1 mb-1 text-xs">
                    {answer}
                  </Badge>
                ))}
                {evaluation.incorrect_answers.length > 2 && (
                  <span className="text-xs text-gray-400">+{evaluation.incorrect_answers.length - 2} more</span>
                )}
              </div>
            </div>
          )}
        </div>

        {evaluation.detailed_feedback && (
          <div>
            <h4 className="text-white font-medium mb-2">Feedback</h4>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-600">
              <p className="text-gray-300 text-sm line-clamp-3">{evaluation.detailed_feedback}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900/95 border-slate-700 max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-white flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                All Evaluation Results - {assignmentTitle}
              </DialogTitle>
              <DialogDescription>
                View and analyze both manual and AI evaluation results
              </DialogDescription>
            </div>
            {(manualEvaluations.length > 0 || aiEvaluations.length > 0) && (
              <Button
                onClick={exportResults}
                variant="outline"
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-300 mt-4">Loading evaluation results...</p>
            </div>
          ) : (manualEvaluations.length === 0 && aiEvaluations.length === 0) ? (
            <Card className="glass-effect">
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Evaluations Yet</h3>
                <p className="text-gray-300">No evaluations have been created for this assignment.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-effect">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-blue-400">{stats.totalEvaluations}</div>
                    <div className="text-sm text-gray-400">Total Evaluations</div>
                  </CardContent>
                </Card>
                <Card className="glass-effect">
                  <CardContent className="p-6 text-center">
                    <div className={`text-2xl font-bold ${getPerformanceColor(stats.averageScore)}`}>
                      {stats.averageScore.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-400">Average Score</div>
                  </CardContent>
                </Card>
                <Card className="glass-effect">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-green-400">{stats.highestScore.toFixed(1)}%</div>
                    <div className="text-sm text-gray-400">Highest Score</div>
                  </CardContent>
                </Card>
                <Card className="glass-effect">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-red-400">{stats.lowestScore.toFixed(1)}%</div>
                    <div className="text-sm text-gray-400">Lowest Score</div>
                  </CardContent>
                </Card>
              </div>

              {/* Grade Distribution */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="text-white">Grade Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {Object.entries(stats.gradeDistribution).map(([grade, count]) => (
                      <div key={grade} className="text-center">
                        <Badge className={`${getGradeColor(grade)} border mb-2`}>
                          {grade}
                        </Badge>
                        <div className="text-xl font-bold text-white">{count}</div>
                        <div className="text-xs text-gray-400">
                          {((count / stats.totalEvaluations) * 100).toFixed(1)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tabbed Results */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                  <TabsTrigger value="manual" className="data-[state=active]:bg-green-600">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Manual ({manualEvaluations.length})
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="data-[state=active]:bg-purple-600">
                    <Brain className="h-4 w-4 mr-2" />
                    AI ({aiEvaluations.length})
                  </TabsTrigger>
                  <TabsTrigger value="combined" className="data-[state=active]:bg-blue-600">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Combined
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="mt-6">
                  <div className="space-y-4">
                    {manualEvaluations.length === 0 ? (
                      <Card className="glass-effect">
                        <CardContent className="text-center py-8">
                          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-300">No manual evaluations yet</p>
                        </CardContent>
                      </Card>
                    ) : (
                      manualEvaluations.map((evaluation) => renderEvaluationCard(evaluation, false))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="mt-6">
                  <div className="space-y-4">
                    {aiEvaluations.length === 0 ? (
                      <Card className="glass-effect">
                        <CardContent className="text-center py-8">
                          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-300">No AI evaluations yet</p>
                        </CardContent>
                      </Card>
                    ) : (
                      aiEvaluations.map((evaluation) => renderEvaluationCard(evaluation, true))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="combined" className="mt-6">
                  <div className="space-y-4">
                    {/* Combine and sort all evaluations by date */}
                    {[
                      ...manualEvaluations.map(e => ({ ...e, isAI: false, sortDate: e.created_at })),
                      ...aiEvaluations.map(e => ({ ...e, isAI: true, sortDate: e.timestamp }))
                    ]
                      .sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime())
                      .map((evaluation) => renderEvaluationCard(evaluation, evaluation.isAI))
                    }
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}