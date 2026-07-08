import { describe, it, expect } from 'vitest'
import { applyVote, applyEdit, applyDelete } from './comments'

const comments = [
  {
    id: 1,
    content:
      "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
    createdAt: '1 month ago',
    score: 12,
    user: {
      image: {
        png: '/images/avatars/image-amyrobson.png',
        webp: '/images/avatars/image-amyrobson.webp',
      },
      username: 'amyrobson',
    },
    replies: [
      {
        id: 3,
        content:
          "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
        createdAt: '1 week ago',
        score: 4,
        replyingTo: 'maxblagun',
        user: {
          image: {
            png: '/images/avatars/image-ramsesmiron.png',
            webp: '/images/avatars/image-ramsesmiron.webp',
          },
          username: 'ramsesmiron',
        },
      },
    ],
  },
]
describe('applyVote', () => {
  it('increase the score when user click the button up', () => {
    // Arrange
    const id = 1
    const direction = 'up'
    // Act
    const result = applyVote(comments, id, direction)
    // Assert
    expect(result[0].score).toBe(13)
  })
  it('decrease the score when user click the button down', () => {
    // Arrange
    const id = 1
    const direction = 'down'
    // Act
    const result = applyVote(comments, id, direction)
    // Assert
    expect(result[0].score).toBe(11)
  })
  it('increase the score in a reply when user click the button up', () => {
    // Arrange
    const id = 3
    const direction = 'up'
    // Act
    const result = applyVote(comments, id, direction)
    // Assert
    expect(result[0].replies[0].score).toBe(5)
  })
})

describe('applyEdit', () => {
  it('change the content of a comment', () => {
    // Arrange
    const id = 1
    const newContent = 'test'
    // Act
    const result = applyEdit(comments, id, newContent)
    // Assert
    expect(result[0].content).toBe('test')
  })
})
describe('applyDelete', () => {
  it('delete a comment', () => {
    // Arrange
    const deletingId = 3
    // Act
    const result = applyDelete(comments, deletingId)
    // Assert
    expect(result[0].replies).toEqual([])
  })
  it('delete a root comment', () => {
    // Act
    const result = applyDelete(comments, 1)
    // Assert
    expect(result).toHaveLength(0)
  })
})
