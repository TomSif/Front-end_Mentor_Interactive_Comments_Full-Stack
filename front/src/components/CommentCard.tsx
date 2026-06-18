import { User, Reply } from '@/types'

interface CommentCardProps {
  id: number
  content: string
  createdAt: string
  score: number
  user: User
  replies?: Reply[]
  replyingTo?: string
}

const CommentCard = ({
  id,
  content,
  createdAt,
  score,
  user,
  replies,
  replyingTo,
}: CommentCardProps) => {
  return (
    <div className="flex flex-col gap-4">
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
            <h3 className="text-preset-2-regular text-gray-500">{createdAt}</h3>
          </header>
          <p className="text-preset-2-regular text-gray-500">
            {replyingTo && (
              <span className="mr-1 font-bold text-purple-600">
                @{replyingTo}
              </span>
            )}
            {content}
          </p>
        </div>
        <aside
          className="bg-grey-50 flex w-25 items-center justify-center gap-4 rounded-md p-2 md:w-10 md:flex-col md:py-4"
          role="group"
          aria-label="vote controls"
        >
          <button type="button" aria-label="Upvote">
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
          <button type="button" aria-label="Downvote">
            <img
              className="w-2.5"
              src="/images/icon-minus.svg"
              alt="button minus"
            />
          </button>
        </aside>
        <button
          type="button"
          className="absolute right-4 bottom-4 flex items-center gap-4 md:top-6 md:right-6 md:bottom-auto md:gap-6"
          aria-label="Button for reply to the comment"
        >
          <img
            className="h-3 w-3"
            src="/images/icon-reply.svg"
            alt="icon reply"
          />
          <span className="text-preset-2-medium text-purple-600">Reply</span>
        </button>
      </article>
      {replies && (
        <div className="flex h-full flex-row">
          <div className="border-grey-100 hidden w-11 border-r-2 border-solid pl-11 md:block"></div>
          <ul className="flex w-full flex-col gap-4 pl-4 md:pl-11">
            {replies.map((reply) => (
              <li key={reply.id}>
                <CommentCard
                  id={reply.id}
                  content={reply.content}
                  createdAt={reply.createdAt}
                  score={reply.score}
                  user={reply.user}
                  replyingTo={reply.replyingTo}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CommentCard
