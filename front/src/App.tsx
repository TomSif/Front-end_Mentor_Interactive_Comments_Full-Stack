import { useState, useEffect, Fragment } from 'react'
import { User, Comment } from '@/types'
import getCommentsData from '@/services/comments'
import CommentCard from './components/CommentCard'
import CommentInput from './components/CommentInput'

function App() {
  const [currentUser, setCurrentUser] = useState<User>()
  const [comments, setComments] = useState<Comment[]>([])
  const [error, setError] = useState<string>('')
  const [activeReplyId, setActiveReplyId] = useState<number | null>()

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
    <main className="bg-grey-50 min-h-screen w-full px-4 py-8 md:px-10.5 md:py-14.5">
      <h1 className="sr-only">Interactive Comments Section</h1>
      {currentUser && (
        <ul className="flex flex-col gap-4">
          {comments.map((comment) => {
            return (
              <Fragment key={comment.id}>
                <li>
                  <CommentCard
                    id={comment.id}
                    content={comment.content}
                    createdAt={comment.createdAt}
                    score={comment.score}
                    user={comment.user}
                    replies={comment.replies}
                    onReply={(id) =>
                      setActiveReplyId((prev) => (prev === id ? null : id))
                    }
                    activeReplyId={activeReplyId}
                    currentUser={currentUser}
                  />
                </li>
                {activeReplyId === comment.id && (
                  <li className="w-full">
                    <CommentInput
                      mode="reply"
                      replyingTo={comment.user.username}
                      currentUser={currentUser}
                      onSubmit={() => {}}
                    />
                  </li>
                )}
              </Fragment>
            )
          })}
        </ul>
      )}
      <section className="mt-4">
        {currentUser && (
          <CommentInput
            currentUser={currentUser}
            onSubmit={() => {}}
            mode="send"
          />
        )}
      </section>
    </main>
  )
}

export default App
