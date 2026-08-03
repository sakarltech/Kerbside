'use client';

import ConversationList from '@/components/messages/ConversationList';
import ChatWindow from '@/components/messages/ChatWindow';
import { useState } from 'react';

const MOCK_CONVERSATIONS = [
  {
    id: '1',
    name: 'James Wilson',
    lastMessage: 'See you tomorrow at 10am!',
    timestamp: '2 min ago',
    unread: 1,
    avatar: null,
  },
  {
    id: '2',
    name: 'Sarah Miller',
    lastMessage: 'Thanks for the lesson today.',
    timestamp: '1 hour ago',
    unread: 0,
    avatar: null,
  },
  {
    id: '3',
    name: 'David Lee',
    lastMessage: 'I can do Thursday instead if that works?',
    timestamp: 'Yesterday',
    unread: 0,
    avatar: null,
  },
];

const MOCK_MESSAGES: Record<string, Array<{ id: string; content: string; sent: boolean; timestamp: string }>> = {
  '1': [
    { id: 'm1', content: 'Hi! Just confirming our lesson tomorrow.', sent: false, timestamp: '10:30 AM' },
    { id: 'm2', content: 'Yes, I will be ready at 10am. Same pickup spot?', sent: true, timestamp: '10:32 AM' },
    { id: 'm3', content: 'See you tomorrow at 10am!', sent: false, timestamp: '10:33 AM' },
  ],
  '2': [
    { id: 'm4', content: 'Great lesson today! I feel more confident with roundabouts now.', sent: true, timestamp: '3:00 PM' },
    { id: 'm5', content: 'Thanks for the lesson today.', sent: false, timestamp: '3:05 PM' },
  ],
  '3': [
    { id: 'm6', content: 'I need to reschedule Wednesday. Can we do Thursday?', sent: false, timestamp: 'Yesterday' },
    { id: 'm7', content: 'I can do Thursday instead if that works?', sent: false, timestamp: 'Yesterday' },
  ],
};

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');

  const messages = selectedConversation ? MOCK_MESSAGES[selectedConversation] || [] : [];
  const selectedPerson = MOCK_CONVERSATIONS.find((c) => c.id === selectedConversation);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Messages</h1>

      <div className="flex h-[calc(100vh-200px)] bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Conversation List */}
        <div className="w-80 border-r border-gray-200 overflow-y-auto">
          <ConversationList
            conversations={MOCK_CONVERSATIONS}
            selectedId={selectedConversation}
            onSelect={setSelectedConversation}
          />
        </div>

        {/* Chat Window */}
        <div className="flex-1">
          {selectedPerson ? (
            <ChatWindow
              recipientName={selectedPerson.name}
              messages={messages}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
