/*
  # Updated Submission Dialog with AI Evaluation Features

  1. New Features
    - Answer key upload button (teachers only)
    - AI evaluation buttons for single and multiple submissions
    - Results section with detailed evaluation display
    - File upload component integrated into submission form

  2. Enhanced UI
    - Better organization with tabs for submissions and results
    - Improved evaluation display with structured feedback
    - Teacher-specific features for answer key management
*/

'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, FileText, CheckCircle, Download, Key, Brain, BarChart3 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';
import FileUpload from './FileUpload';
import AnswerKeyDialog from './AnswerKeyDialog';
import EvaluationDialog from './EvaluationDialog';
import EvaluationResults from './EvaluationResults';
import { type UploadedFile } from '@/lib/storage';

interface Assignment {
  id: string;
  classroom_id: string;
  title: string;
  description: string;
  due_date: string;
  points: number;
  created_by: string;
  attachments: string[] | null;
  created_at: string;
}

interface Submission {
  id: string;
  assignment_id: string;
  student_name: string;
  content: string;
  attachments: string[] | null;
  status: 'submitted' | 'late' | 'missing';
  submitted_at: string;
}

interface SubmissionDialogProps {
  assignment: Assignment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SubmissionDialog({
  assignment,
  open,
  onOpenChange
}: SubmissionDialogProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [answerKeyOpen, setAnswerKeyOpen] = useState(false);
  const [evaluationOpen, setEvaluationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('submissions');

  useEffect(() => {
    if (open && assignment) {
      fetchSubmissions();
    }
  }, [open, assignment]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('assignment_id', assignment.id)
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const studentName = formData.get('studentName') as string;
    const content = formData.get('content') as string;

    if (!studentName || !content) {
      toast.error('Please fill in all required fields');
      setSubmitting(false);
      return;
    }

    try {
      const dueDate = new Date(assignment.due_date);
      const now = new Date();
      const status = now > dueDate ? 'late' : 'submitted';

      // First create the submission to get the ID
      const { data: submission, error: submissionError } = await supabase
        .from('submissions')
        .insert({
          assignment_id: assignment.id,
          student_name: studentName,
          content,
          status,
          attachments: null // Will be updated after file processing
        })
        .select()
        .single();

      if (submissionError) throw submissionError;

      // Process uploaded files if any
      let attachments = null;
      if (uploadedFiles.length > 0) {
        attachments = uploadedFiles.map(file => JSON.stringify({
          name: file.name,
          url: file.url,
          size: file.size,
          type: file.type
        }));

        // Update submission with attachments
        const { error: updateError } = await supabase
          .from('submissions')
          .update({ attachments })
          .eq('id', submission.id);

        if (updateError) throw updateError;
      }

      toast.success('Assignment submitted successfully!');
      setShowSubmitForm(false);
      setUploadedFiles([]);
      fetchSubmissions();
    } catch (error) {
      console.error('Error creating submission:', error);
      toast.error('Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const renderAttachments = (attachments: string[] | null) => {
    if (!attachments || attachments.length === 0) return null;

    return (
      <div className="space-y-2 mt-4">
        <p className="text-sm font-medium text-gray-300">Submitted Files:</p>
        {attachments.map((attachment, index) => {
          try {
            const fileData = JSON.parse(attachment);
            return (
              <div key={index} className="bg-slate-800/50 p-3 rounded-lg border border-slate-600 hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">
                      {fileData.type?.startsWith('image/') ? '🖼️' : 
                       fileData.type?.includes('pdf') ? '📄' : 
                       fileData.type?.includes('presentation') ? '📊' : 
                       fileData.type?.includes('document') ? '📝' : '📎'}
                    </span>
                    <div>
                      <p className="text-sm text-blue-300 font-medium">{fileData.name}</p>
                      <p className="text-xs text-gray-400">
                        {fileData.size ? `${Math.round(fileData.size / 1024)} KB` : 'Unknown size'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(fileData.url, '_blank')}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          } catch (e) {
            // Fallback for old format
            return (
              <div key={index} className="bg-slate-800/50 p-3 rounded-lg border border-slate-600 hover:bg-slate-700/50 transition-colors">
                <p className="text-sm text-blue-300">{attachment}</p>
              </div>
            );
          }
        })}
      </div>
    );
  };

  const renderAssignmentAttachments = (attachments: string[] | null) => {
    if (!attachments || attachments.length === 0) return null;

    return (
      <div className="space-y-2 mt-4">
        <p className="text-sm font-medium text-gray-300">Assignment Files:</p>
        {attachments.map((attachment, index) => {
          try {
            const fileData = JSON.parse(attachment);
            return (
              <div key={index} className="bg-slate-800/50 p-3 rounded-lg border border-slate-600 hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">
                      {fileData.type?.startsWith('image/') ? '🖼️' : 
                       fileData.type?.includes('pdf') ? '📄' : 
                       fileData.type?.includes('presentation') ? '📊' : 
                       fileData.type?.includes('document') ? '📝' : '📎'}
                    </span>
                    <div>
                      <p className="text-sm text-blue-300 font-medium">{fileData.name}</p>
                      <p className="text-xs text-gray-400">
                        {fileData.size ? `${Math.round(fileData.size / 1024)} KB` : 'Unknown size'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(fileData.url, '_blank')}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          } catch (e) {
            // Fallback for old format
            return (
              <div key={index} className="bg-slate-800/50 p-3 rounded-lg border border-slate-600 hover:bg-slate-700/50 transition-colors">
                <p className="text-sm text-blue-300">{attachment}</p>
              </div>
            );
          }
        })}
      </div>
    );
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowSubmitForm(false);
      setUploadedFiles([]);
      setActiveTab('submissions');
    }
    onOpenChange(open);
  };

  const isOverdue = new Date() > new Date(assignment.due_date);

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="bg-slate-900/95 border-slate-700 max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">{assignment.title}</DialogTitle>
            <DialogDescription className="text-gray-300">
              Assignment details, submissions, and AI evaluation
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800">
              <TabsTrigger value="submissions" className="data-[state=active]:bg-blue-600">
                Submissions
              </TabsTrigger>
              <TabsTrigger value="evaluation" className="data-[state=active]:bg-blue-600">
                AI Evaluation
              </TabsTrigger>
              <TabsTrigger value="results" className="data-[state=active]:bg-blue-600">
                Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="submissions" className="mt-6 space-y-6">
              {/* Assignment Details */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Assignment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">{assignment.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-gray-400">
                      <User className="h-4 w-4 mr-2" />
                      Created by: {assignment.created_by}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      Due: {format(new Date(assignment.due_date), 'MMM d, yyyy at h:mm a')}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Clock className="h-4 w-4 mr-2" />
                      Points: {assignment.points}
                    </div>
                  </div>
                  {isOverdue && (
                    <Badge variant="destructive" className="bg-red-600">
                      Overdue
                    </Badge>
                  )}
                  {renderAssignmentAttachments(assignment.attachments)}
                </CardContent>
              </Card>

              {/* Submit Assignment */}
              {!showSubmitForm ? (
                <div className="text-center">
                  <Button
                    onClick={() => setShowSubmitForm(true)}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isOverdue}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isOverdue ? 'Assignment Overdue' : 'Submit Assignment'}
                  </Button>
                </div>
              ) : (
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="text-white">Submit Your Work</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <Label htmlFor="studentName" className="text-white">Your Name</Label>
                        <Input
                          id="studentName"
                          name="studentName"
                          placeholder="Enter your full name"
                          required
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="content" className="text-white">Submission Content</Label>
                        <Textarea
                          id="content"
                          name="content"
                          placeholder="Enter your submission or answer..."
                          required
                          rows={4}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                      
                      {/* File Upload Section */}
                      <div>
                        <Label className="text-white mb-3 block">Submission Files</Label>
                        <FileUpload
                          onFilesChange={setUploadedFiles}
                          initialFiles={uploadedFiles}
                          maxFiles={10}
                          folder={`submissions/${assignment.id}`}
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowSubmitForm(false)}
                          className="flex-1 border-slate-600 text-gray-300"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {submitting ? 'Submitting...' : 'Submit Assignment'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Submissions List */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>Submissions ({submissions.length})</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchSubmissions}
                      disabled={loading}
                      className="border-slate-600 text-gray-300"
                    >
                      {loading ? 'Loading...' : 'Refresh'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {submissions.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No submissions yet</p>
                  ) : (
                    <div className="space-y-4">
                      {submissions.map((submission) => (
                        <div key={submission.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback className="bg-green-600 text-white">
                                  {submission.student_name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-white">{submission.student_name}</p>
                                <p className="text-sm text-gray-400">
                                  {format(new Date(submission.submitted_at), 'MMM d, yyyy at h:mm a')}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={submission.status === 'submitted' ? 'default' : 'destructive'}
                              className={submission.status === 'submitted' ? 'bg-green-600' : 'bg-orange-600'}
                            >
                              {submission.status}
                            </Badge>
                          </div>
                          <p className="text-gray-300 mb-3">{submission.content}</p>
                          {renderAttachments(submission.attachments)}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evaluation" className="mt-6 space-y-6">
              {/* Teacher Actions */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    AI Evaluation Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={() => setAnswerKeyOpen(true)}
                      className="bg-green-600 hover:bg-green-700 h-20 flex flex-col items-center justify-center"
                    >
                      <Key className="h-6 w-6 mb-2" />
                      Upload Answer Key
                      <span className="text-xs opacity-80">Teachers only</span>
                    </Button>
                    
                    <Button
                      onClick={() => setEvaluationOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 h-20 flex flex-col items-center justify-center"
                      disabled={submissions.length === 0}
                    >
                      <Brain className="h-6 w-6 mb-2" />
                      AI Evaluation
                      <span className="text-xs opacity-80">Single & Multiple</span>
                    </Button>
                    
                    <Button
                      onClick={() => setActiveTab('results')}
                      variant="outline"
                      className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 h-20 flex flex-col items-center justify-center"
                    >
                      <BarChart3 className="h-6 w-6 mb-2" />
                      View Results
                      <span className="text-xs opacity-80">Analytics & Reports</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="text-white">How AI Evaluation Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h4 className="text-white font-medium">Upload Answer Key</h4>
                        <p className="text-gray-400 text-sm">Teachers upload the correct answers as text or files (PDF, images, etc.)</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h4 className="text-white font-medium">Select Submissions</h4>
                        <p className="text-gray-400 text-sm">Choose individual submissions or multiple submissions for batch evaluation</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h4 className="text-white font-medium">AI Analysis</h4>
                        <p className="text-gray-400 text-sm">Gemini AI compares student work with answer key and provides detailed feedback</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                      <div>
                        <h4 className="text-white font-medium">View Results</h4>
                        <p className="text-gray-400 text-sm">Get structured feedback with grades, strengths, and improvement areas</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="mt-6">
              <EvaluationResults 
                assignmentId={assignment.id} 
                assignmentTitle={assignment.title}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Answer Key Dialog */}
      <AnswerKeyDialog
        open={answerKeyOpen}
        onOpenChange={setAnswerKeyOpen}
        assignmentId={assignment.id}
        onAnswerKeyUploaded={() => {
          setAnswerKeyOpen(false);
          toast.success('Answer key uploaded successfully!');
        }}
      />

      {/* Evaluation Dialog */}
      <EvaluationDialog
        open={evaluationOpen}
        onOpenChange={setEvaluationOpen}
        assignmentId={assignment.id}
        assignmentTitle={assignment.title}
      />
    </>
  );
}