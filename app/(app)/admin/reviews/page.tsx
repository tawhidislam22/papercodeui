'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/admin-api';
import { Star, MessageCircle, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      const data = await adminApi.reviews.list();
      setReviews(data);
    } catch (e) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await adminApi.reviews.delete(id);
      toast.success('Review deleted');
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (e) {
      toast.error('Failed to delete review');
    }
  }

  async function handleReply(id: string) {
    if (!replyContent.trim()) return;
    try {
      const updated = await adminApi.reviews.reply(id, replyContent);
      toast.success('Reply added');
      setReviews(reviews.map((r) => (r.id === id ? { ...r, reply: replyContent } : r)));
      setReplyingTo(null);
      setReplyContent('');
    } catch (e) {
      toast.error('Failed to reply');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Reviews</h1>
          <p className="text-gray-500 mt-1">View student reviews and respond to feedback.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Lesson</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Rating & Review</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">Loading reviews...</td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No reviews found</td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/lessons/${review.lesson?.slug}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                        <span className="font-semibold">{review.lesson?.title}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <div className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {(review.user?.displayName || review.user?.username || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{review.user?.displayName || review.user?.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-normal min-w-[300px]">
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-3 h-3 ${review.rating >= star ? 'text-amber-400 fill-current' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      <p className="text-gray-700 text-sm">{review.content}</p>
                      
                      {review.reply && (
                        <div className="mt-3 bg-blue-50/50 rounded-lg p-3 text-sm text-blue-900 border border-blue-100">
                          <span className="font-semibold mr-2">Admin:</span>
                          {review.reply}
                        </div>
                      )}
                      
                      {replyingTo === review.id && (
                        <div className="mt-3 flex flex-col gap-2">
                          <textarea
                            className="w-full text-sm rounded-lg border-gray-200 focus:ring-blue-500 focus:border-blue-500 p-2"
                            rows={2}
                            placeholder="Type your reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                          />
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>Cancel</Button>
                            <Button size="sm" onClick={() => handleReply(review.id)}>Submit Reply</Button>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!review.reply && replyingTo !== review.id && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => {
                              setReplyingTo(review.id);
                              setReplyContent('');
                            }}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" /> Reply
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(review.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
