import { useState } from 'react'
import { Fragment } from 'react'
import CommentInput from './CommentInput'
import { User, Reply } from '@/types'

interface CommentCardProps {
  id: number
  content: string
  createdAt: string
  score: number
  user: User
  replies?: Reply[]
  replyingTo?: string
  activeReplyId?: number | null
  currentUser: User
  onReply: (id: number) => void
  onVote: (id: number, direction: 'up' | 'down') => void
  onAddReply: (id: number, userName: string, content: string) => void
  onOpening: (id: number) => void
  onEdit: (id: number, content: string) => void
}

const CommentCard = ({
  id,
  content,
  createdAt,
  score,
  user,
  replies,
  replyingTo,
  activeReplyId,
  currentUser,
  onReply,
  onVote,
  onAddReply,
  onOpening,
  onEdit,
}: CommentCardProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editContent, setEditContent] = useState<string>(content)
  const isCurrentUser = user.username === currentUser.username

  return (
    <div className="flex flex-col">
      <article
        key={id}
        className="relative flex w-full flex-col gap-4 rounded-xl bg-white p-4 md:flex-row-reverse md:p-6"
      >
        <div className="flex w-full flex-col gap-4">
          <header className="flex items-center gap-4">
            <img
              className="h8 aspect-square w-8 rounded-full"
              src={user.image.png}
              alt={`image of ${user.username}`}
            />
            <h2 className="text-preset-2-medium text-gray-800">
              {user.username}
            </h2>
            {isCurrentUser ? (
              <span className="text-preset-3 rounded-sm bg-purple-600 px-1.5 py-0.5 text-white">
                you
              </span>
            ) : (
              ''
            )}
            <h3 className="text-preset-2-regular text-gray-500">{createdAt}</h3>
          </header>
          {isEditing ? (
            <Fragment>
              <textarea
                className="border-grey-100 text-preset-2-regular text-grey-500 flex min-h-24 w-full justify-start rounded-xl border-2 border-solid px-4 py-2"
                placeholder="Add a Comment"
                name="comment"
                id="comment"
                onChange={(e) => setEditContent(e.target.value)}
                value={editContent}
              />
              <button
                onClick={() => {
                  onEdit(id, editContent)
                  setIsEditing(false)
                }}
                className="text-preset-2-medium ml-auto h-12 w-26 rounded-xl bg-purple-600 py-3 text-white"
              >
                UPDATE
              </button>
            </Fragment>
          ) : (
            <p className="text-preset-2-regular text-gray-500">
              {replyingTo && (
                <span className="mr-1 font-bold text-purple-600">
                  @{replyingTo}
                </span>
              )}
              {content}
            </p>
          )}
        </div>
        <aside
          className="bg-grey-50 flex max-h-25 w-25 items-center justify-center gap-4 rounded-md p-2 md:w-10 md:flex-col md:py-4"
          role="group"
          aria-label="vote controls"
        >
          <button
            disabled={isCurrentUser}
            onClick={() => onVote(id, 'up')}
            type="button"
            aria-label="Upvote"
            className="hover:cursor-pointer hover:brightness-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <img
              className="aspect-square h-2.5 w-2.5"
              src="/images/icon-plus.svg"
              alt="button plus"
            />
          </button>
          <span
            className="text-preset-2-medium text-purple-600"
            aria-live="polite"
            aria-label="Current score"
            role="status"
          >
            {score}
          </span>
          <button
            disabled={isCurrentUser}
            onClick={() => onVote(id, 'down')}
            type="button"
            aria-label="Downvote"
            className="hover:cursor-pointer hover:brightness-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <img
              className="w-2.5"
              src="/images/icon-minus.svg"
              alt="button minus"
            />
          </button>
        </aside>
        {isCurrentUser ? (
          <div
            className="md:bottom-aut absolute right-4 bottom-4 flex items-center gap-6 md:top-6 md:right-6 md:bottom-auto"
            aria-label="Buttons"
          >
            <button
              onClick={() => onOpening(id)}
              className="flex items-center gap-2"
            >
              <img src="/images/icon-delete.svg" alt="icon delete" />
              <span className="text-preset-2-medium text-pink-400">Delete</span>
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <img src="/images/icon-edit.svg" alt="icon edit" />
              <span className="text-preset-2-medium text-purple-600">Edit</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="absolute right-4 bottom-4 flex items-center gap-2 md:top-6 md:right-6 md:bottom-auto"
            aria-label="Button for reply to the comment"
            onClick={() => onReply(id)}
          >
            <img
              className="h-3 w-3"
              src="/images/icon-reply.svg"
              alt="icon reply"
            />
            <span className="text-preset-2-medium text-purple-600">Reply</span>
          </button>
        )}
      </article>
      {replies && (
        <div className="flex h-full flex-row">
          <div className="border-grey-100 hidden w-11 border-r-2 border-solid pl-11 md:block"></div>
          <ul className="flex w-full flex-col gap-4 pl-4 md:pl-11">
            {replies.map((reply) => (
              <Fragment key={reply.id}>
                <li className="first-of-type:mt-4">
                  <CommentCard
                    id={reply.id}
                    content={reply.content}
                    createdAt={reply.createdAt}
                    score={reply.score}
                    user={reply.user}
                    replyingTo={reply.replyingTo}
                    onReply={onReply}
                    currentUser={currentUser}
                    onVote={onVote}
                    onAddReply={onAddReply}
                    onOpening={onOpening}
                    onEdit={onEdit}
                  />
                </li>
                {activeReplyId === reply.id && (
                  <li className="" key={`input-${reply.id}`}>
                    <CommentInput
                      replyingTo={reply.user.username}
                      mode={'reply'}
                      currentUser={currentUser}
                      onSubmit={(content) =>
                        onAddReply(id, reply.user.username, content)
                      }
                    />
                  </li>
                )}
              </Fragment>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CommentCard
