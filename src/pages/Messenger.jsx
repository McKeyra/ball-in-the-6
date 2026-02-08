import { useEffect, useState } from 'react';
import MessengerSidebar from '@/components/messenger/MessengerSidebar';
import ChatWindow from '@/components/messenger/ChatWindow';
import { base44 } from '@/api/base44Client';
import { getUserRole } from '@/components/roles';

export default function Messenger() {
  const [activeCategory, setActiveCategory] = useState('fans'); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('Fan');

  useEffect(() => {
      const initUser = async () => {
          try {
              const authUser = await base44.auth.me();
              if (authUser) {
                  setCurrentUser(authUser);
                  const roleData = await getUserRole(authUser.email);
                  setUserRole(roleData.role);
              }
          } catch (e) {
              console.log("Not logged in");
          }
      };
      initUser();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] h-[calc(100vh-100px)] w-full max-w-7xl mx-auto flex flex-col md:flex-row overflow-hidden pb-24 md:pb-4 p-4 md:p-6 lg:p-8">
       <MessengerSidebar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
          currentUserRole={userRole}
       />
       <ChatWindow
          user={selectedUser}
          category={selectedUser?.type || activeCategory}
          currentUser={currentUser}
       />
    </div>
  );
}