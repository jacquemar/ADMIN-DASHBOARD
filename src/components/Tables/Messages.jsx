import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MessagesList = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/messages`);
        setMessages(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Messages reçus</h2>
      <ul className="space-y-4">
        {messages.map((message) => (
          <li key={message._id} className="bg-white shadow rounded-lg p-4">
            <p className="font-bold">{message.nom}</p>
            <p>{message.email}</p>
            <p>{message.phone}</p>
            <p className="mt-2">{message.message}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(message.date).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessagesList;