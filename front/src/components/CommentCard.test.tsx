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
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })
  it('does not render the delete button when user is not currentUser', () => {
    render(<CommentCard {...baseProps} user={otherUser} />)
    expect(
      screen.queryByRole('button', { name: 'Delete' })
    ).not.toBeInTheDocument()
  })
  it('renders the Edit button when user is currentUser', () => {
    render(<CommentCard {...baseProps} user={currentUser} />)
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
  })
  it('does not render the Edit button when user is not currentUser', () => {
    render(<CommentCard {...baseProps} user={otherUser} />)
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
  })
  it('renders the Reply button when user is not currentUser', () => {
    render(<CommentCard {...baseProps} user={otherUser} />)
    expect(screen.getByRole('button', { name: 'Reply' })).toBeInTheDocument()
  })
  it('does not render the Reply button when user is currentUser', () => {
    render(<CommentCard {...baseProps} user={currentUser} />)
    expect(screen.queryByRole('button', { name: 'Reply' })).not.toBeInTheDocument()
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
  it('calls onVote with "up" when Upvote is clicked', async () => {
    // Arrange
    render(
      <CommentCard {...baseProps} user={otherUser} replyingTo="ramsesmiron" />
    )
    const user = userEvent.setup()
    const upVoteButton = screen.getByRole('button', { name: 'Upvote' })
    // Act
    await user.click(upVoteButton)
    // Assert
    expect(baseProps.onVote).toHaveBeenCalledWith(1, 'up')
  })
  it('calls onVote with "down" when Upvote is clicked', async () => {
    // Arrange
    render(
      <CommentCard {...baseProps} user={otherUser} replyingTo="ramsesmiron" />
    )
    const user = userEvent.setup()
    const upVoteButton = screen.getByRole('button', { name: 'Downvote' })
    // Act
    await user.click(upVoteButton)
    // Assert
    expect(baseProps.onVote).toHaveBeenCalledWith(1, 'down')
  })
  it('calls onOpening when Delete is clicked', async () => {
    // Arrange
    render(
      <CommentCard {...baseProps} user={currentUser} replyingTo="ramsesmiron" />
    )
    const user = userEvent.setup()
    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    // Act
    await user.click(deleteButton)
    // Assert
    expect(baseProps.onOpening).toHaveBeenCalledWith(1)
  })
  it('calls onEdit when Edit is clicked', async () => {
    // Arrange
    render(
      <CommentCard {...baseProps} user={currentUser} replyingTo="ramsesmiron" />
    )
    const user = userEvent.setup()
    const editButton = screen.getByRole('button', { name: 'Edit' })
    // Act
    await user.click(editButton)
    // Assert
    const textArea = screen.getByRole('textbox')
    // Act
    await user.clear(textArea)
    await user.type(textArea, 'nouveau texte')
    await user.click(screen.getByRole('button', { name: 'UPDATE' }))
    // Assert
    expect(baseProps.onEdit).toHaveBeenCalledWith(1, 'nouveau texte')
  })
})
