import { useState, useEffect } from 'react'
import { User, Comment } from '@/types'
import getCommentsData from '@/services/comments'
import CommentCard from './components/CommentCard'

function App() {
  const [currentUser, setCurrentUser] = useState<User>()
  const [comments, setComments] = useState<Comment[]>([])
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCommentsData()
        setCurrentUser(data.currentUser)
        setComments(data.comments)
      } catch (err) {
        if (err instanceof Error) setError(err.message)
      }
    }
    loadData()
  }, [])

  return (
    <main className="bg-grey-50 min-h-screen w-full px-4 py-8">
      <h1 className="sr-only">Interactive Comments Section</h1>
      <ul className="flex flex-col">
        {comments.map((comment) => {
          return (
            <li key={comment.id}>
              <CommentCard
                id={comment.id}
                content={comment.content}
                createdAt={comment.createdAt}
                score={comment.score}
                user={comment.user}
                replies={comment.replies}
              />
            </li>
          )
        })}
      </ul>
    </main>
  )
}

export default App
