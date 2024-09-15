import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, X } from "lucide-react"
import { useNavigate } from "react-router-dom"

const interests = [
  "Technology", "Sports", "Music", "Art", "Travel", 
  "Food", "Fashion", "Science", "Literature", "Gaming"
]

export function SignUpComponent() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
 const navigate = useNavigate();
  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest))
    } else if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, interest])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log({ username, email, password, interests: selectedInterests })
    navigate('/login');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Interests (select up to 5)</Label>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <Badge
                  key={interest}
                  variant={selectedInterests.includes(interest) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleInterestToggle(interest)}
                >
                  {interest}
                  {selectedInterests.includes(interest) && (
                    <X className="ml-1 h-3 w-3" onClick={(e) => {
                      e.stopPropagation()
                      handleInterestToggle(interest)
                    }} />
                  )}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Selected: {selectedInterests.length}/5
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit}>
          Sign Up
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}