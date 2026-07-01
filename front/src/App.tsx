import { useState, useEffect, Fragment, useRef } from 'react'
import { User, Comment } from '@/types'
import {
  applyDelete,
  applyEdit,
  applyVote,
  buildComment,
  buildReply,
} from './utils/comments'
import getCommentsData from '@/services/comments'
import CommentCard from './components/CommentCard'
import CommentInput from './components/CommentInput'

function App() {
  const [currentUser, setCurrentUser] = useState<User>()
  const [comments, setComments] = useState<Comment[]>([])
  const [error, setError] = useState<string>('')
  const [activeReplyId, setActiveReplyId] = useState<number | null>()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const isInitialized = useRef<boolean>(false)

  const handleVote = (id: number, direction: 'up' | 'down') => {
    setComments((prev) => applyVote(prev, id, direction))
  }

  const handleAddComment = (content: string) => {
    setComments((prev) => [...prev, buildComment(content, currentUser!)])
  }

  const handleAddReply = (id: number, userName: string, content: string) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              replies: [
                ...comment.replies,
                buildReply(userName, content, currentUser!),
              ],
            }
          : comment
      )
    )

    setActiveReplyId(null)
  }

  const handleEdit = (id: number, newContent: string) => {
    setComments((prev) => applyEdit(prev, id, newContent))
  }

  const handleDelete = (deletingId: number) => {
    setComments((prev) => applyDelete(prev, deletingId))
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCommentsData()
        const savedComments = localStorage.getItem('comments')
        if (savedComments !== null) {
          setComments(JSON.parse(savedComments))
        } else {
          setComments(data.comments)
        }
        setCurrentUser(data.currentUser)
        isInitialized.current = true
      } catch (err) {
        if (err instanceof Error) setError(err.message)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (!isInitialized.current) return
    localStorage.setItem('comments', JSON.stringify(comments))
  }, [comments])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [isOpen])

  return (
    <Fragment>
      <main className="bg-grey-50 relative min-h-screen w-full px-4 py-8 md:px-10.5 md:py-14.5">
        <h1 className="sr-only">Interactive Comments Section</h1>
        {error && <p>{error}</p>}
        {currentUser && (
          <ul className="flex flex-col gap-4">
            {[...comments]
              .sort((a, b) => b.score - a.score)
              .map((comment) => {
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
                        onVote={handleVote}
                        onAddReply={handleAddReply}
                        onOpening={(id) => {
                          setIsOpen(true)
                          setDeletingId(id)
                        }}
                        onEdit={handleEdit}
                      />
                    </li>
                    {activeReplyId === comment.id && (
                      <li className="w-full">
                        <CommentInput
                          mode="reply"
                          replyingTo={comment.user.username}
                          currentUser={currentUser}
                          onSubmit={(content) =>
                            handleAddReply(
                              comment.id,
                              comment.user.username,
                              content
                            )
                          }
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
              onSubmit={handleAddComment}
              mode="send"
            />
          )}
        </section>
      </main>
      <dialog className="min-h-screen w-screen bg-black/50" ref={dialogRef}>
        <div className="flex h-dvh w-screen flex-col items-center justify-center">
          <div className="flex max-w-86 flex-col gap-4 rounded-xl bg-white p-6">
            <h2 className="text-preset-1 text-grey-800">Delete Comment</h2>
            <p className="text-preset-2-regular text-grey-500">
              Are you sure you want to delete this comment? This will remove the
              comment and can’t be undone.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-grey-500 w-full rounded-lg py-3 text-center text-white"
              >
                NO, CANCEL
              </button>
              <button
                onClick={() => {
                  handleDelete(deletingId!)
                  setIsOpen(false)
                }}
                className="w-full rounded-lg bg-pink-400 py-3 text-center text-white"
              >
                YES, DELETE
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </Fragment>
  )
}

export default App
