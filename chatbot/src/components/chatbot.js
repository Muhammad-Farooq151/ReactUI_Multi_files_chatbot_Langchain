import { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const API_KEY = "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";

const systemMessage = {
    role: "assistant",
    content: "Welcome to AI Cover Letter! I'm here to assist you in creating a compelling cover letter. Ask me about writing tips, content suggestions, and more to enhance your cover letter and make a great impression!",
};

function ChatbotUI() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm AI Cover Letter! Ask me anything!",
      sentTime: "just now",
      sender: "CashClub AI",
    },
]);

const [isTyping, setIsTyping] = useState(false);
const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
};

async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiRequestBody),
        }
      );
      const data = await response.json();
      setMessages([
        ...chatMessages,
        {
          message: data.choices[0].message.content,
          sender: "ChatGPT",
        },
      ]);
      setIsTyping(false);
    } catch (error) {
      console.error("Error fetching from ChatGPT API:", error);
      setIsTyping(false);
    }
}

return (
    <div className="App">
      <div
        style={{
          position: "relative",
          height: "500px",
          width: "full",
          margin: 20,
        }}
      >
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="CashClub AI is typing" />
                ) : null
              }
            >
              {messages.map((message, i) => (
                <Message key={i} model={message} />
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default ChatbotUI;
