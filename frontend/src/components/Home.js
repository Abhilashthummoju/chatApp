import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

const Home = () => {
  const { username } = useParams(); // Destructure username correctly
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/users/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
        console.log("DATA",data)
        setFilteredUsers(data);
      } else {
        setUsers([]);
        setFilteredUsers([]);
      }
    };

    const fetchRecentChats = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/recent-chats/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        const chats = data.map(chat => ({
          id: chat.id,
          username: chat.user1.username === localStorage.getItem('username') ? chat.user2.username : chat.user1.username,
          connected: true,
        }));
        setRecentChats(chats);
      } else {
        setRecentChats([]);
      }
    };

    fetchUsers();
    fetchRecentChats();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (Array.isArray(users)) {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleChatClick = (userId, username) => {
    navigate(`/chat/${userId}/${username}`);
  };

  const handleInviteClick = async (userId, e) => {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:8000/api/send_interest/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ to_user_id: userId }),
    });
    alert('Invitation sent');

    setUsers(prevUsers =>
      prevUsers.map(user => (user.id === userId ? { ...user, invited: true } : user))
    );
    setFilteredUsers(prevUsers =>
      prevUsers.map(user => (user.id === userId ? { ...user, invited: true } : user))
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/auth');
  };

  console.log("RECENTCHATS", recentChats);

  return (
    <div>
      <div style={{ height: "50px", backgroundColor: "#ff3b0a", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
        <h2 style={{textTransform:"capitalize"}}>{username ? username : "USER"}</h2>
        <div>
          <button style={{ width: "90px", height: "38px", borderRadius: "7px", marginRight: "10px" }} onClick={() => navigate('/invites')}>Invites</button>
          <button style={{ width: "90px", height: "38px", borderRadius: "7px" }} onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <input
          style={{ padding: "10px", fontSize: "20px", display: "flex", justifyContent: "space-between", border: "3px solid", width: "97vw" }}
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <FaSearch size={"45px"} style={{ marginTop: "10px", border: "3px solid" }} onClick={handleSearch} />
      </div>
      <div>
        <h3>{searchQuery ? 'Search Results:' : 'Recent Chats:'}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap',flexDirection:"column" }}>
          {(searchQuery ? filteredUsers : recentChats).map(user => (
            <div key={user.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', width: '400px',borderRadius:"20px", textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{fontSize:"30px",marginLeft:"10px",textTransform:"capitalize"}}>{user.username}</p>
                {!user.connected ? (
                  user.invited ? (
                    <button style={{ width: "90px", height: "38px", borderRadius: "7px", backgroundColor: 'white', color: 'black' }}>
                      Invited
                    </button>
                  ) : (
                    <button
                      style={{ width: "90px", height: "38px", borderRadius: "7px", backgroundColor: '#1877f2', color: 'white' }}
                      onClick={(e) => handleInviteClick(user.id, e)}
                    >
                      Invite
                    </button>
                  )
                ) : (
                  <button style={{ width: "80px", height: "40px", borderRadius: "10px" }} onClick={() => handleChatClick(user.id, user.username)}>Chat</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
