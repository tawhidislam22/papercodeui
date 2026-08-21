'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Heart, MessageCircle, Bookmark, Clock, Eye, Share2 } from 'lucide-react';
import { api, getDemoUser, type Blog, type Profile } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<(Partial<Blog> & { author?: string; authorInitial?: string; content?: string; authorProfile?: Profile | null }) | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    // Try to load from DB first, fall back to placeholder
    api.blogs.getById(id)
      .then(async (data) => {
        const authorProfile = data.authorId ? await api.users.getById(data.authorId).catch(() => null) : null;
        setBlog({ ...data, authorProfile });
      })
      .catch(() => null)
      .finally(() => setLoading(false));

    api.blogs.getComments(id)
      .then((data) => setComments(data))
      .catch(() => null);

    api.bookmarks.getAll()
      .then((bookmarks) => {
        setBookmarked(bookmarks.some((b: any) => b.blogId === id));
      })
      .catch(() => null);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-8 bg-gray-100 rounded w-48" />
        <div className="h-10 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        {[...Array(8)].map((_, i) => <div key={i} className="h-4 bg-gray-100 rounded" />)}
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Post not found</p>
        <Link href="/blogs" className="mt-4 inline-block">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back to blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/blogs" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-medium mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to blog
      </Link>

      <article>
        {/* Tags */}
        <div className="flex gap-2 mb-4">
          {blog.tags?.map((tag) => (
            <Badge key={tag} className="bg-blue-50 text-blue-700 border-blue-100 text-xs">{tag}</Badge>
          ))}
        </div>

        {/* Cover Image */}
        {blog.coverImageUrl && (
          <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden mb-8 border border-gray-100 shadow-sm">
            <img src={blog.coverImageUrl} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
          {blog.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
              {blog.authorProfile?.displayName?.charAt(0).toUpperCase()
                || blog.authorProfile?.username?.charAt(0).toUpperCase()
                || (blog as { authorInitial?: string }).authorInitial
                || '?'}
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">
                {blog.authorProfile?.displayName
                  || blog.authorProfile?.username
                  || (blog as { author?: string }).author
                  || 'Anonymous'}
              </p>
              <p className="text-xs text-gray-400">
                {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto text-sm text-gray-400">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{blog.readingTime} min</span>
            <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{blog.views}</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-4">
          {blog.content?.split('\n').map((line, i) => {
            if (line.startsWith('## ')) {
              return <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3">{line.slice(3)}</h2>;
            }
            if (line.startsWith('**') && line.endsWith('**')) {
              return <p key={i} className="font-semibold text-gray-900">{line.slice(2, -2)}</p>;
            }
            if (line.startsWith('- ')) {
              return <li key={i} className="ml-4 text-gray-700">{line.slice(2)}</li>;
            }
            if (line.startsWith('```')) return null;
            if (line === '') return <br key={i} />;
            return <p key={i} className="text-gray-700">{line}</p>;
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-10 pt-6 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const demoUser = getDemoUser();
              if (!demoUser) {
                toast.error('Please log in to save posts');
                return;
              }
              try {
                const res = await api.bookmarks.toggleBlog(id);
                setBookmarked(res.bookmarked);
                toast.success(res.bookmarked ? 'Saved to favorites!' : 'Removed from favorites');
              } catch (e) {
                toast.error('Failed to update favorites');
                console.error(e);
              }
            }}
            className={`gap-2 ${bookmarked ? 'border-red-200 bg-red-50 text-red-600' : ''}`}
          >
            <Heart className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            {(blog.likesCount ?? 0) + (bookmarked ? 1 : 0)}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            {comments.length}
          </Button>
          <Button variant="outline" size="sm" className="gap-2 ml-auto" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard');
          }}>
            <Share2 className="w-4 h-4" /> Share
          </Button>
        </div>
      </article>

      {/* Comments Section */}
      <div className="mt-12 pt-8 border-t border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h3>
        
        {getDemoUser() ? (
          <div className="mb-8">
            <textarea
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-y focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all"
              rows={3}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <Button 
                onClick={async () => {
                  if (!newComment.trim()) return;
                  setPostingComment(true);
                  try {
                    const c = await api.blogs.addComment(id, newComment.trim());
                    setComments([c, ...comments]);
                    setNewComment('');
                    toast.success('Comment added');
                  } catch (e) {
                    toast.error('Failed to post comment');
                  } finally {
                    setPostingComment(false);
                  }
                }}
                disabled={postingComment || !newComment.trim()}
                className="text-white"
                style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}
              >
                {postingComment ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-500 mb-8 border border-gray-100">
            Please <Link href="/auth" className="text-blue-600 font-semibold hover:underline">log in</Link> to join the discussion.
          </div>
        )}

        <div className="space-y-6">
          {comments.map((comment: any) => (
            <div key={comment.id} className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-bold shrink-0 text-sm">
                  {(comment.user?.displayName || comment.user?.username || '?').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-900 text-sm">
                      {comment.user?.displayName || comment.user?.username || 'Anonymous'}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-3">
                      {new Date(comment.createdAt).toLocaleDateString()}
                      {getDemoUser() && (
                        <button 
                          className="text-blue-500 hover:text-blue-700 font-medium"
                          onClick={() => {
                            setReplyingTo(replyingTo === comment.id ? null : comment.id);
                            setReplyContent('');
                          }}
                        >
                          Reply
                        </button>
                      )}
                      {getDemoUser()?.id === comment.userId && (
                        <button 
                          className="text-red-500 hover:text-red-700 font-medium"
                          onClick={async () => {
                            if (!confirm('Delete comment?')) return;
                            try {
                              await api.blogs.deleteComment(id, comment.id);
                              setComments(comments.filter((c: any) => c.id !== comment.id));
                              toast.success('Comment deleted');
                            } catch {
                              toast.error('Failed to delete comment');
                            }
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>

              {/* Reply Box */}
              {replyingTo === comment.id && (
                <div className="ml-14 mt-2">
                  <textarea
                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm resize-y focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all"
                    rows={2}
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>Cancel</Button>
                    <Button 
                      size="sm"
                      onClick={async () => {
                        if (!replyContent.trim()) return;
                        setPostingComment(true);
                        try {
                          const reply = await api.blogs.addComment(id, replyContent.trim(), comment.id);
                          setComments(comments.map((c: any) => {
                            if (c.id === comment.id) {
                              return { ...c, replies: [...(c.replies || []), reply] };
                            }
                            return c;
                          }));
                          setReplyingTo(null);
                          setReplyContent('');
                          toast.success('Reply added');
                        } catch (e) {
                          toast.error('Failed to post reply');
                        } finally {
                          setPostingComment(false);
                        }
                      }}
                      disabled={postingComment || !replyContent.trim()}
                      className="text-white bg-blue-600 hover:bg-blue-700"
                    >
                      {postingComment ? 'Posting...' : 'Reply'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-14 space-y-4 mt-4">
                  {comment.replies.map((reply: any) => (
                    <div key={reply.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-bold shrink-0 text-xs">
                        {(reply.user?.displayName || reply.user?.username || '?').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-semibold text-gray-900 text-xs">
                            {reply.user?.displayName || reply.user?.username || 'Anonymous'}
                          </div>
                          <div className="text-[10px] text-gray-400 flex items-center gap-2">
                            {new Date(reply.createdAt).toLocaleDateString()}
                            {getDemoUser()?.id === reply.userId && (
                              <button 
                                className="text-red-500 hover:text-red-700 font-medium"
                                onClick={async () => {
                                  if (!confirm('Delete reply?')) return;
                                  try {
                                    await api.blogs.deleteComment(id, reply.id);
                                    setComments(comments.map((c: any) => {
                                      if (c.id === comment.id) {
                                        return { ...c, replies: c.replies.filter((r: any) => r.id !== reply.id) };
                                      }
                                      return c;
                                    }));
                                    toast.success('Reply deleted');
                                  } catch {
                                    toast.error('Failed to delete reply');
                                  }
                                }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {comments.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
