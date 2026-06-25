import { Comment, User, Reply } from '@/types'

export const applyVote = (
  comments: Comment[],
  id: number,
  direction: 'up' | 'down'
) => {
  const vote = direction === 'up' ? 1 : -1
  return comments.map((comment) =>
    comment.id === id
      ? { ...comment, score: comment.score + vote }
      : {
          ...comment,
          replies: comment.replies.map((replie) =>
            replie.id === id
              ? { ...replie, score: replie.score + vote }
              : replie
          ),
        }
  )
}

export const buildComment = (content: string, currentUser: User): Comment => {
  return {
    id: Number(Date.now()),
    content: content,
    createdAt: 'Just now',
    score: 0,
    user: currentUser!,
    replies: [],
  }
}

export const buildReply = (
  userName: string,
  content: string,
  currentUser: User
): Reply => {
  return {
    id: Number(Date.now()),
    content,
    createdAt: 'Just now',
    score: 0,
    replyingTo: userName,
    user: currentUser!,
  }
}

export const applyEdit = (
  comments: Comment[],
  id: number,
  newContent: string
) => {
  return comments.map((comment) =>
    comment.id === id
      ? { ...comment, content: newContent }
      : {
          ...comment,
          replies: comment.replies.map((reply) =>
            reply.id === id ? { ...reply, content: newContent } : reply
          ),
        }
  )
}

export const applyDelete = (comments: Comment[], deletingId: number) => {
  return comments
    .filter((comment) => comment.id !== deletingId)
    .map((comment) => ({
      ...comment,
      replies: comment.replies.filter((reply) => reply.id !== deletingId),
    }))
}
