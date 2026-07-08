import { CommentsData, Comment, Reply } from '@/types'

const getCommentsData = async (): Promise<CommentsData> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/comments`)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default getCommentsData

export const postComment = async (content: string): Promise<Comment> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  if (!res.ok) {
    throw new Error('Failed to post comment')
  }
  return res.json()
}

export const postReply = async (
  parentId: number,
  content: string,
  replyingTo: string
): Promise<Reply> => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/comments/${parentId}/replies`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, replyingTo }),
    }
  )
  if (!res.ok) {
    throw new Error('Failed to post reply')
  }
  return res.json()
}

export const patchVote = async (
  id: number,
  direction: 'up' | 'down'
): Promise<{ score: number }> => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/comments/${id}/vote`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direction }),
    }
  )
  if (!res.ok) {
    throw new Error('Failed to vote')
  }
  return res.json()
}

export const patchEdit = async (
  id: number,
  content: string
): Promise<{ id: number; content: string }> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/comments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  if (!res.ok) {
    throw new Error('Failed to Edit')
  }
  return res.json()
}

export const deleteComment = async (id: number): Promise<{ id: number }> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/comments/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    throw new Error('Failed to delete')
  }
  return res.json()
}
