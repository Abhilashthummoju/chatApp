import React, { useState, useEffect } from 'react';

const Invites = () => {
  const [invites, setInvites] = useState([]);
  
  useEffect(() => {
    const fetchInvites = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:8000/api/received_interests/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        // Ensure data is an array
        if (Array.isArray(data)) {
          setInvites(data);
        } else {
          console.error('Unexpected response format for invites:', data);
        }
      } catch (error) {
        console.error('Error fetching invites:', error);
      }
    };

    fetchInvites();
  }, []);

  const handleAccept = async (inviteId) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:8000/api/accept_interest/${inviteId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setInvites(invites.filter(invite => invite.id !== inviteId)); // Remove the accepted invite from state
    } catch (error) {
      console.error('Error accepting invite:', error);
    }
  };

  const handleReject = async (inviteId) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:8000/api/reject_interest/${inviteId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setInvites(invites.filter(invite => invite.id !== inviteId)); // Remove the rejected invite from state
    } catch (error) {
      console.error('Error rejecting invite:', error);
    }
  };
  console.log("INVITES",invites)
  return (
    <div>
      <h2>Invitations</h2>
      <div>
        {Array.isArray(invites) && invites.length > 0 ? (
          invites.map(invite => (
            <div key={invite.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p>{invite.from_user.username} has sent you an invite.</p>
              <div>
                <button 
                  style={{ width: "90px", height: "38px", borderRadius: "7px", marginRight: "10px", backgroundColor: '#1877f2', color: 'white' }}
                  onClick={() => handleAccept(invite.id)}
                >
                  Accept
                </button>
                <button 
                  style={{ width: "90px", height: "38px", borderRadius: "7px", backgroundColor: '#ff0000', color: 'white' }}
                  onClick={() => handleReject(invite.id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No invitations</p>
        )}
      </div>
    </div>
  );
};

export default Invites;
