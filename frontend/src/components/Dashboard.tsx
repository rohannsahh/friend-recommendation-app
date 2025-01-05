import { Input } from "./ui/input"
import  { useState } from 'react';
import { searchUsers } from '../services/userService';

const UserSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ _id: string; username: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // const handleSearchDebounced = debounce(() => handleSearch(), 10000);
    
    const handleSearch = async () => {
        if (!query.trim()) return; // Avoid searching empty strings
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('authToken'); // Retrieve JWT from localStorage
            const data = await searchUsers(query, token);
            console.log(data)
            setResults(data);
        } catch {
            setError('Error fetching search results.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Search Users</h2>
            <Input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); }}       
                placeholder="Search by username"
            />
            <button onClick={handleSearch}>Search</button>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            <ul>
                {Array.isArray(results) &&  results.map((user: { _id: string; username: string }) => (
                    <li key={user._id}>
                        {user.username}
                        <button onClick={() => console.log(`Send friend request to ${user.username}`)}>
                            Add Friend
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};


const Dashboard = () => {
  return (
    <div className="flex flex-row justify-around   min-h-screen bg-gray-50">
      <div>
          <h2>freindslist</h2>
        </div>
      <div className="flex flex-col">
        <h1>FriendsBook</h1>
        <UserSearch/>
        
        </div>
      
      <aside>
        <h2>Suggestions</h2>
        <div className="flex p-4 ">
          <p>John Doe</p>
          <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ">
          <button >Add Friend</button>
          </div>
   
        </div>
      </aside>
    </div>
  )
}

export default Dashboard
