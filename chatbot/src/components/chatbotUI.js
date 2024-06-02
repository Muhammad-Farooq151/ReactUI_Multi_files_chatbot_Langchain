import React, { useState, useRef, useEffect } from "react";
import { PaperClipIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

function ChatbotUI() {
    const [messages, setMessages] = useState([{ message: "Hello, I'm AI Cover Letter! Ask me anything!", direction: "incoming", sender: "CashClub AI" }]);
    const [isTyping, setIsTyping] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const endOfMessagesRef = useRef(null);

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const sendMessageToBackend = async (userMessage) => {
        try {
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setMessages(prevMessages => [...prevMessages, { message: data.message, direction: 'incoming', sender: 'CashClub AI' }]);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleSend = () => {
        if (!newMessage.trim()) return;

        const userMessage = newMessage.trim();
        setMessages([...messages, { message: userMessage, direction: 'outgoing', sender: 'user' }]);
        setNewMessage("");

        sendMessageToBackend(userMessage);
    };

    return (
        <div className="flex-grow flex flex-col h-full pt-4">
            {/* Chat messages aligned to the sides */}
            <div className="flex-grow overflow-y-auto p-4">
                <div className="space-y-2">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex w-full ${msg.direction === "outgoing" ? "justify-end pr-40" : "justify-start pl-40"}`}>
                            <div className={`inline-block w-auto px-4 py-2 rounded-lg ${msg.direction === "outgoing" ? "bg-blue-100" : "bg-blue-300"}`}>
                                {msg.message}
                            </div>
                        </div>
                    ))}
                </div>
                <div ref={endOfMessagesRef} />
            </div>

            {/* Message input */}
            <div className="border-t-2 border-gray-200 py-2 flex-none mb-4 pt-4">
                <div className="relative flex items-center w-full max-w-lg mx-auto">
                    <input
                        type="text"
                        className="w-full flex-grow border pl-10 pr-10 py-4 px-2 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Type message here"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button
                        className="absolute right-3 bg-blue-500 hover:bg-blue-700 text-white rounded-full p-2"
                        onClick={handleSend}
                    >
                        <ArrowRightIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatbotUI;
