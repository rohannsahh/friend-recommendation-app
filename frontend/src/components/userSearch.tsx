/* eslint-disable @typescript-eslint/no-explicit-any */




import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import { Loader2, UserPlus } from 'lucide-react'

interface User {
  _id: string
  username: string
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function UserSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('authToken')
      const data = await searchUsers(query, token)
      setResults(data)
      
    } catch {
      setError('Failed to fetch search results.')
    } finally {
      setLoading(false)
    }
  }
   const searchUsers = async (query: any, token: any) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/users/search?query=${query}`, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
};

  const handleSendRequest = async (recipientId: string) => {
    const token = localStorage.getItem('authToken')
    try {
      await axios.post(
        `${API_BASE_URL}/api/friends/request`,
        { recipientId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Friend request sent!')
    } catch {
      alert('Failed to send friend request.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by username"
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Search'}
          </Button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <ul className="mt-4 space-y-2">
          {results.map((user) => (
            <li key={user._id} className="flex items-center justify-between bg-muted p-2 rounded">
              <span>{user.username}</span>
              <Button size="sm" onClick={() => handleSendRequest(user._id)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Friend
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

