import { useState } from 'react'
import { User } from '@/types'

interface CommentInputProps {
  replyingTo?: string
  currentUser: User
  mode: 'send' | 'reply'
  onSubmit: (content: string) => void
}

const CommentInput = ({
  mode,
  replyingTo,
  currentUser,
  onSubmit,
}: CommentInputProps) => {
  const [content, setContent] = useState<string>(
    replyingTo ? `@${replyingTo} ` : ''
  )
  return (
    <div className="relative rounded-xl bg-white p-4 md:p-6">
      <img
        className="absolute bottom-6 left-4 aspect-square h-8 w-8 rounded-full md:top-6 md:bottom-auto md:left-6 md:h-10 md:w-10"
        src={currentUser.image.png}
        alt={`image of ${currentUser.username}`}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          const cleanContent = replyingTo
            ? content.replace(`@${replyingTo} `, '')
            : content
          if (cleanContent.trim() === '') return
          onSubmit(cleanContent)
          setContent(replyingTo ? `@${replyingTo} ` : '')
        }}
        className="flex flex-col gap-4 md:ml-14 md:flex-row md:items-start"
      >
        <label className="sr-only" htmlFor="comment">
          Add a comment
        </label>
        <textarea
          className="border-grey-100 text-preset-2-regular text-grey-500 flex min-h-24 w-full justify-start rounded-xl border-2 border-solid px-4 py-2"
          placeholder="Add a Comment"
          name="comment"
          id="comment"
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />
        <button
          type="submit"
          className="text-preset-2-medium ml-auto h-12 w-26 rounded-xl bg-purple-600 py-3 text-white"
        >
          {mode === 'send' ? 'SEND' : 'REPLY'}
        </button>
      </form>
    </div>
  )
}

export default CommentInput
