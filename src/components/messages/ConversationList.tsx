import Avatar from '@/components/ui/Avatar';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string | null;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: ConversationListProps) {
  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onSelect(conversation.id)}
          className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
            selectedId === conversation.id ? 'bg-primary-50' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <Avatar name={conversation.name} src={conversation.avatar} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {conversation.name}
                </p>
                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                  {conversation.timestamp}
                </span>
              </div>
              <p className="text-sm text-gray-500 truncate mt-0.5">
                {conversation.lastMessage}
              </p>
            </div>
            {conversation.unread > 0 && (
              <span className="w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                {conversation.unread}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
