


// import UserSearch from './userSearch';
// import FriendRequests from './friendRequests';
// import FriendsList from './friendList';
// import FriendSuggestions from './friendSuggestions';

// const Dashboard = () => {
//     return (
//         <div className="flex flex-row justify-around min-h-screen bg-gray-50">
//             <div>
//                 <h2>Friends List</h2>
//                 <FriendsList/>
//             </div>
//             <div>
//                 <h1>FriendsBook</h1>
//                 <UserSearch />
//                 <FriendRequests />
//             </div>
//             <aside>
//                  <FriendSuggestions /> 
//             </aside>
//         </div>
//     );
// };

// export default Dashboard;



import { UserSearch } from './userSearch'
import { FriendRequests } from './friendRequests'
import { FriendsList } from './friendList'
import { FriendSuggestions } from './friendSuggestions'

export function Dashboard() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-8">FriendsBook</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <FriendsList />
          
        </div>
        <div className="space-y-6">
          <UserSearch />
          <FriendRequests />
        </div>
        <div>
          <FriendSuggestions />
        </div>
      </div>
    </main>
    </div>
  )
}

