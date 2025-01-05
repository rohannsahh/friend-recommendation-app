



import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, UserPlus } from 'lucide-react'

interface User {
  _id: string
  username: string
  mutualFriendsCount: number
  commonInterestsCount: number
  interests: string[]
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function FriendSuggestions() {
  const [suggestions, setSuggestions] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem("authToken")
        const response = await axios.get(`${API_BASE_URL}/api/friends/suggestions`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setSuggestions(response.data.recommendations)
      } catch {
        setError("Failed to load friend suggestions.")
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [])

  const sendFriendRequest = async (userId: string) => {
    try {
      const token = localStorage.getItem("authToken")
      await axios.post(
            `${API_BASE_URL}/api/friends/request`,
        { recipientId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Friend request sent!')
      // Remove the user from suggestions
      setSuggestions(suggestions.filter(user => user._id !== userId))
    } catch {
      alert('Failed to send friend request.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Friend Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : suggestions.length === 0 ? (
          <p>No friend suggestions available.</p>
        ) : (
          <ul className="space-y-4">
            {suggestions.map((user) => (
              <li key={user._id} className="bg-muted p-3 rounded">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold">{user.username}</span>
                  <Button size="sm" onClick={() => sendFriendRequest(user._id)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Friend
                  </Button>
                </div>
                {/* <p className="text-sm text-muted-foreground">
                  {user.mutualFriendsCount} mutual friends
                </p>
                <p className="text-sm text-muted-foreground">
                  {user.commonInterestsCount} common interests
                </p>
                <p className="text-sm mt-1">
                  Interests: {user.interests.join(", ")}
                </p> */}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

