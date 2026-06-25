import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import CommentInput from './CommentInput'

const currentUser = {
  image: {
    png: '/images/avatars/image-juliusomo.png',
    webp: '/images/avatars/image-juliusomo.webp',
  },
  username: 'juliusomo',
}
const handleSubmit = vi.fn()

describe('Comment Input', () => {
  it('renders the send button', () => {
    render(
      <CommentInput
        currentUser={currentUser}
        onSubmit={() => null}
        mode="send"
      />
    )

    expect(screen.getByRole('button', { name: 'SEND' })).toBeInTheDocument()
  })
  it('renders the reply  button', () => {
    render(
      <CommentInput
        currentUser={currentUser}
        onSubmit={() => null}
        mode="reply"
      />
    )

    expect(screen.getByRole('button', { name: 'REPLY' })).toBeInTheDocument()
  })
  it('calls onSubmit with the good text', async () => {
    render(
      <CommentInput
        currentUser={currentUser}
        onSubmit={handleSubmit}
        mode="send"
      />
    )
    await userEvent.type(screen.getByRole('textbox'), 'testing text')
    await userEvent.click(screen.getByRole('button', { name: 'SEND' }))

    expect(handleSubmit).toHaveBeenCalledWith('testing text')
  })
  it('clean the text area after button send is click', async () => {
    render(
      <CommentInput
        currentUser={currentUser}
        onSubmit={handleSubmit}
        mode="send"
      />
    )
    await userEvent.type(screen.getByRole('textbox'), 'testing text')
    await userEvent.click(screen.getByRole('button', { name: 'SEND' }))

    expect(screen.getByRole('textbox')).toHaveValue('')
  })
  it('does not call onSubmit if text area is empy', async () => {
    render(
      <CommentInput
        currentUser={currentUser}
        onSubmit={handleSubmit}
        mode="send"
      />
    )
    await userEvent.click(screen.getByRole('button', { name: 'SEND' }))

    expect(handleSubmit).not.toHaveBeenCalled()
  })
})
