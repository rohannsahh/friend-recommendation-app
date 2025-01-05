/* eslint-disable @typescript-eslint/no-explicit-any */




import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, UserCheck, UserX } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface FriendRequest {
  _id: string
  username: string
}

export function FriendRequests() {
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = async () => {
    const token = localStorage.getItem('authToken')
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/api/friends/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setRequests(response.data)
      setError(null)
    } catch (error: any) {
      setError('Error fetching friend requests: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleRespond = async (senderId: string, action: 'accept' | 'reject') => {
    const token = localStorage.getItem('authToken')
    try {
      await axios.post(
        `${API_BASE_URL}/api/friends/respond`,
        { senderId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchRequests()
    } catch {
      alert('Failed to respond to friend request.')
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Friend Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : requests.length === 0 ? (
          <p>No pending friend requests.</p>
        ) : (
          <ul className="space-y-2">
            {requests.map((req) => (
              <li key={req._id} className="flex items-center justify-between bg-muted p-2 rounded">
                <span>{req.username}</span>
                <div className="space-x-2">
                  <Button size="sm" onClick={() => handleRespond(req._id, 'accept')}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleRespond(req._id, 'reject')}>
                    <UserX className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

