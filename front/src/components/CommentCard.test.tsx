import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import CommentCard from './CommentCard'

const currentUser = {
  image: {
    png: '/images/avatars/image-juliusomo.png',
    webp: '/images/avatars/image-juliusomo.webp',
  },
  username: 'juliusomo',
}

const otherUser = {
  image: {
    png: '/images/avatars/image-amyrobson.png',
    webp: '/images/avatars/image-amyrobson.webp',
  },
  username: 'amyrobson',
}

const baseProps = {
  id: 1,
  content: 'Hello world',
  createdAt: '1 month ago',
  score: 12,
  currentUser,
  onReply: vi.fn(),
  onVote: vi.fn(),
  onAddReply: vi.fn(),
  onOpening: vi.fn(),
  onEdit: vi.fn(),
}

describe('Comment Card', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('renders the you tag when user is currentUser', () => {
    render(<CommentCard {...baseProps} user={currentUser} />)
    expect(screen.getByTestId('you-badge')).toBeInTheDocument()
  })
  it('does not render the you tag when user is not currentUser', () => {
    render(<CommentCard {...baseProps} user={otherUser} />)
    expect(screen.queryByTestId('you-badge')).not.toBeInTheDocument()
  })
  it('renders the delete button when user is currentUser', () => {
    render(<CommentCard {...baseProps} user={currentUser} />)
    expect(screen.getByRole('button', { name: 'Delete' }))
  })
  it('does not render the delete button when user is not currentUser', () => {
    render(<CommentCard {...baseProps} user={otherUser} />)
    expect(
      screen.queryByRole('button', { name: 'Delete' })
    ).not.toBeInTheDocument()
  })
  it('renders the Edit button when user is currentUser', () => {
    render(<CommentCard {...baseProps} user={currentUser} />)
    expect(screen.getByRole('button', { name: 'Edit' }))
  })
  it('does not render the Edit button when user is not currentUser', () => {
    render(<CommentCard {...baseProps} user={otherUser} />)
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument
  })
  it('renders the Reply button when user is not currentUser', () => {
    render(<CommentCard {...baseProps} user={otherUser} />)
    expect(screen.getByRole('button', { name: 'Reply' }))
  })
  it('does not render the Reply button when user is currentUser', () => {
    render(<CommentCard {...baseProps} user={currentUser} />)
    expect(screen.queryByRole('button', { name: 'Reply' })).not
      .toBeInTheDocument
  })
  it('disactivates the upvote button when user is currentUser', () => {
    render(<CommentCard {...baseProps} user={currentUser} />)
    expect(screen.getByRole('button', { name: 'Upvote' })).toBeDisabled()
  })
  it('activates the upvote button when user is not currentUser', () => {
    render(<CommentCard {...baseProps} user={otherUser} />)
    expect(screen.getByRole('button', { name: 'Upvote' })).not.toBeDisabled()
  })
  it('displays the replyingTo username', () => {
    render(
      <CommentCard {...baseProps} user={currentUser} replyingTo="ramsesmiron" />
    )
    expect(screen.getByText('@ramsesmiron')).toBeInTheDocument()
  })
})
