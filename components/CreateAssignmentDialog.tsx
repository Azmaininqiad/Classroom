'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface CreateAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroomId: string;
  onAssignmentCreated: () => void;
}

export default function CreateAssignmentDialog({
  open,
  onOpenChange,
  classroomId,
  onAssignmentCreated
}: CreateAssignmentDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const dueDate = formData.get('dueDate') as string;
    const points = parseInt(formData.get('points') as string) || 100;
    const createdBy = formData.get('createdBy') as string;

    if (!title || !description || !dueDate || !createdBy) {
      toast.error('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('assignments')
        .insert({
          classroom_id: classroomId,
          title,
          description,
          due_date: new Date(dueDate).toISOString(),
          points,
          created_by: createdBy
        });

      if (error) throw error;

      toast.success('Assignment created successfully!');
      onAssignmentCreated();
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error('Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900/95 border-slate-700 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Create Assignment</DialogTitle>
          <DialogDescription>
            Create a new assignment for your students
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="createdBy" className="text-white">Your Name</Label>
            <Input
              id="createdBy"
              name="createdBy"
              placeholder="Enter your name"
              required
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="title" className="text-white">Assignment Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter assignment title"
              required
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the assignment requirements..."
              required
              rows={4}
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dueDate" className="text-white">Due Date</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="datetime-local"
                required
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="points" className="text-white">Points</Label>
              <Input
                id="points"
                name="points"
                type="number"
                placeholder="100"
                min="1"
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-slate-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'Creating...' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}