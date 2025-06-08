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
import { Calendar, Clock, User, FileText, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Assignment {
  id: string;
  classroom_id: string;
  title: string;
  description: string;
  due_date: string;
  points: number;
  created_by: string;
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
    const attachments = formData.get('attachments') as string;

    if (!studentName || !content) {
      toast.error('Please fill in all required fields');
      setSubmitting(false);
      return;
    }

    try {
      const attachmentArray = attachments 
        ? attachments.split(',').map(item => item.trim()).filter(Boolean)
        : null;

      const dueDate = new Date(assignment.due_date);
      const now = new Date();
      const status = now > dueDate ? 'late' : 'submitted';

      const { error } = await supabase
        .from('submissions')
        .insert({
          assignment_id: assignment.id,
          student_name: studentName,
          content,
          attachments: attachmentArray,
          status
        });

      if (error) throw error;

      toast.success('Submission created successfully!');
      setShowSubmitForm(false);
      fetchSubmissions();
    } catch (error) {
      console.error('Error creating submission:', error);
      toast.error('Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const isOverdue = new Date() > new Date(assignment.due_date);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900/95 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">{assignment.title}</DialogTitle>
          <DialogDescription className="text-gray-300">
            Assignment details and submissions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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
                <form onSubmit={handleSubmit} className="space-y-4">
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
                  <div>
                    <Label htmlFor="attachments" className="text-white">Attachments (Optional)</Label>
                    <Input
                      id="attachments"
                      name="attachments"
                      placeholder="Enter file names/URLs separated by commas"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Separate multiple attachments with commas
                    </p>
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

          {/* Submissions */}
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
                      {submission.attachments && submission.attachments.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-300">Attachments:</p>
                          {submission.attachments.map((attachment, index) => (
                            <div key={index} className="bg-slate-700/50 p-2 rounded border border-slate-600">
                              <p className="text-sm text-blue-300">{attachment}</p>
                            </div>
                          ))}
                        </div>
                      )}
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