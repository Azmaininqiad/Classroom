'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import FileUpload from './FileUpload';
import { type UploadedFile } from '@/lib/storage';
import { Key, Upload } from 'lucide-react';

interface AnswerKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentId: string;
  onAnswerKeyUploaded: () => void;
}

export default function AnswerKeyDialog({
  open,
  onOpenChange,
  assignmentId,
  onAnswerKeyUploaded
}: AnswerKeyDialogProps) {
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const teacherName = formData.get('teacherName') as string;
    const content = formData.get('content') as string;

    if (!teacherName) {
      toast.error('Please enter your name');
      setLoading(false);
      return;
    }

    if (!content && uploadedFiles.length === 0) {
      toast.error('Please provide answer key content or upload files');
      setLoading(false);
      return;
    }

    try {
      // Convert uploaded files to attachment format
      const attachments = uploadedFiles.length > 0 
        ? uploadedFiles.map(file => JSON.stringify({
            name: file.name,
            url: file.url,
            size: file.size,
            type: file.type
          }))
        : null;

      const { error } = await supabase
        .from('answer_keys')
        .insert({
          assignment_id: assignmentId,
          teacher_name: teacherName,
          content: content || null,
          attachments
        });

      if (error) throw error;

      toast.success('Answer key uploaded successfully!');
      setUploadedFiles([]);
      onAnswerKeyUploaded();
    } catch (error) {
      console.error('Error uploading answer key:', error);
      toast.error('Failed to upload answer key');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setUploadedFiles([]);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="bg-slate-900/95 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Key className="h-5 w-5 mr-2" />
            Upload Answer Key
          </DialogTitle>
          <DialogDescription>
            Upload the answer key for this assignment. Only teachers can upload answer keys.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="teacherName" className="text-white">Teacher Name</Label>
            <Input
              id="teacherName"
              name="teacherName"
              placeholder="Enter your name"
              required
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="content" className="text-white">Answer Key Content (Optional)</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Enter the answer key content or upload files below..."
              rows={6}
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>

          <div>
            <Label className="text-white mb-3 block">Answer Key Files</Label>
            <FileUpload
              onFilesChange={setUploadedFiles}
              initialFiles={uploadedFiles}
              maxFiles={10}
              folder={`answer-keys/${assignmentId}`}
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogClose(false)}
              className="flex-1 border-slate-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Uploading...' : 'Upload Answer Key'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}