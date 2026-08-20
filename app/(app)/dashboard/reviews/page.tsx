'use client';

import { useState, useEffect } from 'react';
import { Star, MessageCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      const data = await api.reviews.getMyReviews();
      setReviews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading reviews...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
        <p className="text-gray-500">Manage reviews you've written for lessons.</p>
      </div>

      <div className="grid gap-6">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
            You haven't written any reviews yet.
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative group hover:shadow-md transition-shadow">
              <Link href={`/lessons/${review.lesson?.slug}`} className="absolute top-6 right-6 text-gray-400 hover:text-blue-600 transition-colors">
                <ExternalLink className="w-5 h-5" />
              </Link>
              <div className="mb-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{review.lesson?.title}</h3>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${review.rating >= star ? 'text-amber-400 fill-current' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{review.content}</p>

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
          ))
        )}
      </div>
    </div>
  );
}
