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
        className="relative flex w-full flex-col gap-4 rounded-xl bg-white p-4"
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
          <p className="text-preset-2-regular flex w-full gap-2 text-gray-500">
            {!replies && (
              <span className="font-bold text-purple-600">@{replyingTo}</span>
            )}
            {content}
          </p>
        </div>
        <aside
          className="bg-grey-50 flex w-25 items-center justify-center gap-4 rounded-md p-2"
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
          className="absolute right-4 bottom-4 flex items-center gap-4"
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
      <ul className="flex flex-col pl-4">
        {replies?.map((reply) => (
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
  )
}

export default CommentCard
