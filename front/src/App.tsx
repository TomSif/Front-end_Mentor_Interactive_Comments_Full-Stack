import { useState, useEffect } from 'react'
import { User, Comment } from '@/types'
import getCommentsData from '@/services/comments'

function App() {
  const [currentUser, setCurrentUser] = useState<User>()
  const [comments, setComments] = useState<Comment[]>([])
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCommentsData()
        setCurrentUser(data.currentUser)
        setComments(data.comments)
      } catch (err) {
        if (err instanceof Error) setError(err.message)
      }
    }
    loadData()
  }, [])

  return (
    <main className="min-h-screen bg-[#F5F6FA]">
      <h1 className="text-center text-xl font-bold text-[#334253]">
        Interactive Comments Section
      </h1>
    </main>
  )
}

export default App
