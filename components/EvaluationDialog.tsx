'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Brain, Loader2, CheckCircle, AlertCircle, Users, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Submission {
  id: string;
  assignment_id: string;
  student_name: string;
  content: string;
  attachments: string[] | null;
  status: 'submitted' | 'late' | 'missing';
  submitted_at: string;
}

interface AnswerKey {
  id: string;
  assignment_id: string;
  teacher_name: string;
  content: string | null;
  attachments: string[] | null;
  created_at: string;
}

interface EvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentId: string;
  assignmentTitle: string;
}

export default function EvaluationDialog({
  open,
  onOpenChange,
  assignmentId,
  assignmentTitle
}: EvaluationDialogProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [answerKey, setAnswerKey] = useState<AnswerKey | null>(null);
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    if (open) {
      fetchSubmissions();
      fetchAnswerKey();
    }
  }, [open, assignmentId]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('assignment_id', assignmentId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnswerKey = async () => {
    try {
      const { data, error } = await supabase
        .from('answer_keys')
        .select('*')
        .eq('assignment_id', assignmentId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setAnswerKey(data);
    } catch (error) {
      console.error('Error fetching answer key:', error);
    }
  };

  const handleSubmissionSelect = (submissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubmissions([...selectedSubmissions, submissionId]);
    } else {
      setSelectedSubmissions(selectedSubmissions.filter(id => id !== submissionId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSubmissions(submissions.map(s => s.id));
    } else {
      setSelectedSubmissions([]);
    }
  };

  const handleSingleEvaluation = async (submissionId: string) => {
    if (!answerKey) {
      toast.error('No answer key found. Please upload an answer key first.');
      return;
    }

    setEvaluating(true);
    try {
      const submission = submissions.find(s => s.id === submissionId);
      if (!submission) throw new Error('Submission not found');

      // Here you would call your FastAPI backend
      // For now, we'll simulate the API call
      toast.info('Starting AI evaluation...');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock evaluation result
      const mockResult = {
        id: crypto.randomUUID(),
        assignment_id: assignmentId,
        submission_id: submissionId,
        student_name: submission.student_name,
        total_marks: 100,
        obtained_marks: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
        percentage: 0,
        grade: 'B',
        correct_answers: ['Question 1: Correct approach', 'Question 3: Well explained'],
        incorrect_answers: ['Question 2: Missing key concept'],
        partial_credit_areas: ['Question 4: Partially correct'],
        strengths: ['Good understanding of basic concepts', 'Clear presentation'],
        areas_for_improvement: ['Need to work on advanced topics', 'More practice needed'],
        detailed_feedback: 'Overall good performance with room for improvement in specific areas.',
        evaluation_type: 'single'
      };

      mockResult.percentage = (mockResult.obtained_marks / mockResult.total_marks) * 100;

      // Save to database
      const { error } = await supabase
        .from('evaluations')
        .insert(mockResult);

      if (error) throw error;

      toast.success(`Evaluation completed for ${submission.student_name}`);
      
    } catch (error) {
      console.error('Error during evaluation:', error);
      toast.error('Evaluation failed');
    } finally {
      setEvaluating(false);
    }
  };

  const handleMultipleEvaluation = async () => {
    if (!answerKey) {
      toast.error('No answer key found. Please upload an answer key first.');
      return;
    }

    if (selectedSubmissions.length === 0) {
      toast.error('Please select at least one submission to evaluate');
      return;
    }

    setEvaluating(true);
    try {
      toast.info(`Starting AI evaluation for ${selectedSubmissions.length} submissions...`);
      
      // Create batch record
      const { data: batch, error: batchError } = await supabase
        .from('evaluation_batches')
        .insert({
          assignment_id: assignmentId,
          teacher_name: answerKey.teacher_name,
          total_submissions: selectedSubmissions.length,
          status: 'processing'
        })
        .select()
        .single();

      if (batchError) throw batchError;

      // Process each submission
      for (const submissionId of selectedSubmissions) {
        const submission = submissions.find(s => s.id === submissionId);
        if (!submission) continue;

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock evaluation result
        const mockResult = {
          id: crypto.randomUUID(),
          assignment_id: assignmentId,
          submission_id: submissionId,
          student_name: submission.student_name,
          total_marks: 100,
          obtained_marks: Math.floor(Math.random() * 40) + 60,
          percentage: 0,
          grade: 'B',
          correct_answers: ['Question 1: Correct approach'],
          incorrect_answers: ['Question 2: Missing key concept'],
          partial_credit_areas: ['Question 4: Partially correct'],
          strengths: ['Good understanding of basic concepts'],
          areas_for_improvement: ['Need to work on advanced topics'],
          detailed_feedback: 'Overall good performance with room for improvement.',
          evaluation_type: 'multiple',
          batch_id: batch.id
        };

        mockResult.percentage = (mockResult.obtained_marks / mockResult.total_marks) * 100;

        await supabase.from('evaluations').insert(mockResult);
      }

      // Update batch status
      await supabase
        .from('evaluation_batches')
        .update({
          status: 'completed',
          completed_evaluations: selectedSubmissions.length,
          completed_at: new Date().toISOString()
        })
        .eq('id', batch.id);

      toast.success(`Evaluation completed for ${selectedSubmissions.length} submissions`);
      setSelectedSubmissions([]);
      
    } catch (error) {
      console.error('Error during multiple evaluation:', error);
      toast.error('Multiple evaluation failed');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900/95 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            AI Evaluation - {assignmentTitle}
          </DialogTitle>
          <DialogDescription>
            Select submissions to evaluate using AI. Make sure an answer key is uploaded first.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Answer Key Status */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-white text-lg">Answer Key Status</CardTitle>
            </CardHeader>
            <CardContent>
              {answerKey ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-green-300">Answer key uploaded by {answerKey.teacher_name}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <span className="text-red-300">No answer key found. Please upload an answer key first.</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submissions List */}
          <Card className="glass-effect">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">
                  Submissions ({submissions.length})
                </CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all"
                      checked={selectedSubmissions.length === submissions.length && submissions.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <label htmlFor="select-all" className="text-white text-sm">
                      Select All
                    </label>
                  </div>
                  <Button
                    onClick={handleMultipleEvaluation}
                    disabled={selectedSubmissions.length === 0 || evaluating || !answerKey}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {evaluating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        <Users className="h-4 w-4 mr-2" />
                        Evaluate Selected ({selectedSubmissions.length})
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-400" />
                  <p className="text-gray-300">Loading submissions...</p>
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No submissions found for this assignment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={`submission-${submission.id}`}
                            checked={selectedSubmissions.includes(submission.id)}
                            onCheckedChange={(checked) => handleSubmissionSelect(submission.id, checked as boolean)}
                          />
                          <div>
                            <p className="font-medium text-white">{submission.student_name}</p>
                            <p className="text-sm text-gray-400">
                              Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge
                            variant={submission.status === 'submitted' ? 'default' : 'destructive'}
                            className={submission.status === 'submitted' ? 'bg-green-600' : 'bg-orange-600'}
                          >
                            {submission.status}
                          </Badge>
                          <Button
                            onClick={() => handleSingleEvaluation(submission.id)}
                            disabled={evaluating || !answerKey}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {evaluating ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <User className="h-4 w-4 mr-1" />
                                Evaluate
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mt-2 line-clamp-2">{submission.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}