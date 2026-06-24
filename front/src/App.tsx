import { useState, useEffect, Fragment, useRef } from 'react'
import { User, Comment } from '@/types'
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
    const vote = direction === 'up' ? 1 : -1
    setComments((prev) =>
      prev.map((comment) =>
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
    )
  }

  const handleAddComment = (content: string) => {
    const newComment = {
      id: Number(Date.now()),
      content: content,
      createdAt: 'Just now',
      score: 0,
      user: currentUser!,
      replies: [],
    }
    setComments((prev) => [...prev, newComment])
  }

  const handleAddReply = (id: number, userName: string, content: string) => {
    const newReply = {
      id: Number(Date.now()),
      content,
      createdAt: 'Just now',
      score: 0,
      replyingTo: userName,
      user: currentUser!,
    }

    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              replies: [...comment.replies, newReply],
            }
          : comment
      )
    )

    setActiveReplyId(null)
  }

  const handleEdit = (id: number, newContent: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id
          ? { ...comment, content: newContent }
          : {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === id ? { ...reply, content: newContent } : reply
              ),
            }
      )
    )
  }

  const handleDelete = (deletingId: number) => {
    setComments((prev) =>
      prev
        .filter((comment) => comment.id !== deletingId)
        .map((comment) => ({
          ...comment,
          replies: comment.replies.filter((reply) => reply.id !== deletingId),
        }))
    )
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
