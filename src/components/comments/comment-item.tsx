
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { addComment } from '@/lib/data';
import type { Comment } from '@/lib/types';
import { Loader2, Edit, Trash2, Reply, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserAvatar } from '../user-avatar';
import { v4 as uuidv4 } from 'uuid';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const commentSchema = z.object({
  text: z.string().min(1, { message: 'لا يمكن إرسال رد فارغ.' }).max(500, { message: 'يجب ألا يتجاوز الرد 500 حرف.' }),
});

interface CommentItemProps {
  comment: Comment;
  adId: string;
  onCommentUpdate: (commentId: string, text: string) => Promise<void>;
  onCommentDelete: (commentId: string) => Promise<void>;
  onReplyAdded: (newReply: Comment) => void;
  isReply?: boolean;
}

export function CommentItem({ comment, adId, onCommentUpdate, onCommentDelete, onReplyAdded, isReply = false }: CommentItemProps) {
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { text: isEditing ? comment.text : '' },
  });
  
  const replyForm = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { text: '' },
  });

  const canManage = user && user.uid === comment.userId;
  
  const handleEditSubmit = async (values: z.infer<typeof commentSchema>) => {
    setIsSubmitting(true);
    await onCommentUpdate(comment.id, values.text);
    setIsEditing(false);
    setIsSubmitting(false);
  };
  
  const handleReplySubmit = async (values: z.infer<typeof commentSchema>) => {
    if (!user || !userData) {
      toast({ variant: 'destructive', title: 'خطأ', description: 'يجب عليك تسجيل الدخول للرد.' });
      return;
    }
    setIsSubmitting(true);
    try {
        const newReplyData = {
            adId,
            userId: user.uid,
            userName: userData.name,
            userAvatarColor: userData.avatarColor,
            text: values.text,
            parentCommentId: comment.id,
        };
        const newReply = await addComment(newReplyData);
        onReplyAdded(newReply);
        replyForm.reset();
        setIsReplying(false);
        toast({ title: 'تم نشر ردك بنجاح!' });
    } catch (error) {
        toast({ variant: 'destructive', title: 'فشل نشر الرد', description: 'حدث خطأ ما.' });
    } finally {
        setIsSubmitting(false);
    }
  };


  return (
    <div className={`flex flex-col gap-2 ${isReply ? 'ml-8 border-r-2 border-muted pr-4' : ''}`}>
      <div className="flex items-start gap-3">
        <UserAvatar name={comment.userName} color={comment.userAvatarColor} className="h-10 w-10 flex-shrink-0" />
        <div className="flex-grow">
            <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{comment.userName}</p>
                <p className="text-xs text-muted-foreground">{comment.postedAt}</p>
            </div>
          {isEditing ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-2 mt-1">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea defaultValue={comment.text} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    حفظ
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>إلغاء</Button>
                </div>
              </form>
            </Form>
          ) : (
            <p className="text-muted-foreground text-sm mt-1">{comment.text}</p>
          )}

          {!isEditing && (
            <div className="flex items-center gap-2 mt-2">
              {user && (
                <Button variant="ghost" size="sm" className="h-auto p-1 text-xs" onClick={() => setIsReplying(!isReplying)}>
                  <Reply className="mr-1 h-3 w-3" />
                  رد
                </Button>
              )}
              {canManage && (
                <>
                  <Button variant="ghost" size="sm" className="h-auto p-1 text-xs" onClick={() => setIsEditing(true)}>
                    <Edit className="mr-1 h-3 w-3" />
                    تعديل
                  </Button>
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-auto p-1 text-xs text-destructive hover:text-destructive">
                              <Trash2 className="mr-1 h-3 w-3" />
                              حذف
                          </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                              <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
                              <AlertDialogDescription>
                                  هذا الإجراء سيقوم بحذف تعليقك بشكل نهائي.
                              </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onCommentDelete(comment.id)} className="bg-destructive hover:bg-destructive/90">
                                  تأكيد الحذف
                              </AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {isReplying && (
        <div className="pl-12">
            <Form {...replyForm}>
                <form onSubmit={replyForm.handleSubmit(handleReplySubmit)} className="flex items-start gap-2 pt-2">
                    <div className="flex-grow">
                        <FormField
                            control={replyForm.control}
                            name="text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="sr-only">أضف ردًا</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="اكتب ردك هنا..." rows={2} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" disabled={isSubmitting} size="icon" className="flex-shrink-0 h-9 w-9 mt-1.5">
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        <span className="sr-only">إرسال</span>
                    </Button>
                </form>
            </Form>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4 pt-2">
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply}
              adId={adId}
              onCommentUpdate={onCommentUpdate}
              onCommentDelete={onCommentDelete}
              onReplyAdded={onReplyAdded}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
