/* eslint-disable @typescript-eslint/no-unused-vars */




import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, UserMinus } from 'lucide-react'

interface Friend {
  _id: string
  username: string
  email: string
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export function FriendsList() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem("authToken")
        const response = await axios.get(`${API_BASE_URL}/api/friends/list`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setFriends(response.data.friends)
      } catch (err) {
        setError("Failed to load friends. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchFriends()
  }, [])

  const removeFriend = async (friendId: string) => {
    try {
      const token = localStorage.getItem("authToken")

      await axios.delete(`http://localhost:5000/api/friends/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setFriends((prevFriends) => prevFriends.filter((friend) => friend._id !== friendId))
    } catch (err) {
      alert("Failed to remove friend. Please try again.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Friends List</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : friends.length === 0 ? (
          <p>You have no friends yet.</p>
        ) : (
          <ul className="space-y-2">
            {friends.map((friend) => (
              <li key={friend._id} className="flex items-center justify-between bg-muted p-2 rounded">
                <span>{friend.username}</span>
                <Button variant="destructive" size="sm" onClick={() => removeFriend(friend._id)}>
                  <UserMinus className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

