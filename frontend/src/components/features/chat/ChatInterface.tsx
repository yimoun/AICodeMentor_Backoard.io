import React, { useState } from 'react';
import { useChat } from '../../../hooks';
import { Button } from '../../ui/Button';
import { MessageBubble } from './MessageBubble';
import { LLMSelector } from './LLMSelector';

export const ChatInterface: React.FC = () => {
const [input, setInput] = useState('');
const { messages, isLoading, sendMessage, selectedLLM } = useChat();
const handleSubmit = async () => {
if (!input.trim()) return;
await sendMessage(input);
setInput('');
};
return (
<div className="flex flex-col h-full">
{/* Header with LLM Selector */}
<div className="p-4 border-b border-dark-700 flex justify-between">
<h2>Chat Python</h2>
<LLMSelector selected={selectedLLM} />
</div>
{/* Messages */}
<div className="flex-1 overflow-y-auto p-4 space-y-4">
{messages.map(msg => <MessageBubble  key={msg.id} message={{ id: msg.id, role: msg.role, content: msg.content, timestamp: msg.timestamp }}  />)}
</div>
{/* Input */}
<div className="p-4 border-t border-dark-700">
<div className="flex gap-3">
<textarea
value={input}
onChange={e => setInput(e.target.value)}
className="input flex-1"
placeholder="Posez votre question..."
/>
<Button onClick={handleSubmit} disabled={isLoading}>
Envoyer
</Button>
</div>
</div>
</div>
);
};