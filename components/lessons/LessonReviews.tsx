'use client';

import { useState, useEffect } from 'react';
import { Star, MessageCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { getDemoUser } from '@/lib/api';

export function LessonReviews({ lessonId, isCompleted }: { lessonId: string; isCompleted: boolean }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [myReview, setMyReview] = useState<any>(null);
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = getDemoUser();

  useEffect(() => {
    loadReviews();
  }, [lessonId]);

  async function loadReviews() {
    try {
      const data = await api.reviews.getForLesson(lessonId);
      setReviews(data);
      if (currentUser) {
        const mine = data.find((r: any) => r.userId === currentUser.id);
        if (mine) {
          setMyReview(mine);
          setRating(mine.rating);
          setContent(mine.content);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.reviews.addReview(lessonId, rating, content);
      toast.success('Review submitted successfully!');
      loadReviews();
    } catch (e) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-12 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Star className="w-6 h-6 text-amber-400 fill-current" />
        Student Reviews
      </h2>

      {/* Write a Review Section */}
      {currentUser && isCompleted ? (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">{myReview ? 'Update your review' : 'Write a review'}</h3>
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    (hoverRating || rating) >= star ? 'text-amber-400 fill-current' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            className="w-full rounded-xl border border-gray-200 p-4 text-sm resize-y focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all min-h-[100px]"
            placeholder="What did you think of this lesson?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              {isSubmitting ? 'Submitting...' : myReview ? 'Update Review' : 'Submit Review'}
            </Button>
          </div>
        </div>
      ) : currentUser && !isCompleted ? (
        <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 mb-8 flex items-start gap-3 text-blue-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>Complete this lesson to share your thoughts and rate it!</p>
        </div>
      ) : null}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="animate-pulse flex gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-1/4"></div>
              <div className="h-3 bg-gray-100 rounded w-full"></div>
              <div className="h-3 bg-gray-100 rounded w-2/3"></div>
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No reviews yet.
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-bold shrink-0 text-sm">
                  {(review.user?.displayName || review.user?.username || '?').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold text-gray-900 text-sm">
                      {review.user?.displayName || review.user?.username || 'Anonymous'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${review.rating >= star ? 'text-amber-400 fill-current' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{review.content}</p>

                  {/* Admin Reply */}
                  {review.reply && (
                    <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100 flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-blue-900 mb-1">Admin Reply</p>
                        <p className="text-sm text-gray-600">{review.reply}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
