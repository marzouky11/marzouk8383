
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/auth-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { addComment, getComments, updateComment, deleteComment } from '@/lib/data';
import type { Comment } from '@/lib/types';
import { Loader2, MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { v4 as uuidv4 } from 'uuid';
import { CommentItem } from './comment-item';

const commentSchema = z.object({
  text: z.string().min(1, { message: 'لا يمكن إرسال تعليق فارغ.' }).max(500, { message: 'يجب ألا يتجاوز التعليق 500 حرف.' }),
});

interface CommentsSectionProps {
  adId: string;
}

export function CommentsSection({ adId }: CommentsSectionProps) {
  const { user, userData, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // A unique key for the form component to force re-render on submission
  const [formKey, setFormKey] = useState(() => uuidv4());

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { text: '' },
  });

  useEffect(() => {
    async function fetchComments() {
      setLoadingComments(true);
      const fetchedComments = await getComments(adId);
      setComments(fetchedComments);
      setLoadingComments(false);
    }
    fetchComments();
  }, [adId]);
  
  const onSubmit = async (values: z.infer<typeof commentSchema>) => {
    if (!user || !userData) {
      toast({ variant: 'destructive', title: 'خطأ', description: 'يجب عليك تسجيل الدخول للتعليق.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const newCommentData = {
        adId,
        userId: user.uid,
        userName: userData.name,
        userAvatarColor: userData.avatarColor,
        text: values.text,
      };
      const newComment = await addComment(newCommentData);
      setComments(prev => [...prev, newComment]);
      form.reset();
      setFormKey(uuidv4()); // Reset the form by changing its key
      toast({ title: 'تم نشر تعليقك بنجاح!' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'فشل نشر التعليق', description: 'حدث خطأ ما، يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateComment = async (commentId: string, text: string) => {
    await updateComment(commentId, text);
    setComments(prev => 
      prev.map(c => c.id === commentId ? { ...c, text } : c)
    );
    toast({ title: 'تم تحديث التعليق' });
  };
  
  const handleDeleteComment = async (commentId: string) => {
      await deleteComment(commentId);
      // Remove comment and its nested replies
      const removeCommentAndReplies = (comments: Comment[], idToRemove: string): Comment[] => {
          return comments.filter(comment => comment.id !== idToRemove).map(comment => {
              if (comment.replies && comment.replies.length > 0) {
                  comment.replies = removeCommentAndReplies(comment.replies, idToRemove);
              }
              return comment;
          });
      };
      setComments(prev => removeCommentAndReplies(prev, commentId));
      toast({ title: 'تم حذف التعليق' });
  };
  
  const handleAddReply = (newReply: Comment) => {
      setComments(prev => {
          const addReplyToParent = (comments: Comment[]): Comment[] => {
              return comments.map(comment => {
                  if (comment.id === newReply.parentCommentId) {
                      return { ...comment, replies: [...(comment.replies || []), newReply] };
                  }
                  if (comment.replies && comment.replies.length > 0) {
                      return { ...comment, replies: addReplyToParent(comment.replies) };
                  }
                  return comment;
              });
          };
          return addReplyToParent(prev);
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-primary" />
          التعليقات والمناقشات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {loadingComments ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : comments.length > 0 ? (
            comments.map(comment => (
              <CommentItem 
                key={comment.id}
                comment={comment}
                adId={adId}
                onCommentUpdate={handleUpdateComment}
                onCommentDelete={handleDeleteComment}
                onReplyAdded={handleAddReply}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground">لا توجد تعليقات حتى الآن. كن أول من يعلق!</p>
          )}
        </div>

        {user && (
          <Form {...form} key={formKey}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4 pt-4 border-t">
              <div className="flex-grow">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">أضف تعليقًا</FormLabel>
                      <FormControl>
                        <Textarea placeholder="اكتب تعليقك هنا..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isSubmitting} size="icon" className="flex-shrink-0">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="sr-only">إرسال</span>
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
