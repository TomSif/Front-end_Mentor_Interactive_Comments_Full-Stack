import { CommentsData } from '@/types'

const getCommentsData = async (): Promise<CommentsData> => {
  const res = await fetch('/data/data.json')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default getCommentsData
