// import React, { useState, useRef, useEffect } from "react";
// import { PaperClipIcon, ArrowRightIcon } from "@heroicons/react/24/solid"; 

// function ChatbotUI() {
//   const [messages, setMessages] = useState([
//     {
//       message: "Hello, I'm AI Cover Letter! Ask me anything!",
//       direction: "incoming",
//       sender: "CashClub AI",
//     },
//   ]);
//   const [isTyping, setIsTyping] = useState(false);
//   const [newMessage, setNewMessage] = useState("");
//   const endOfMessagesRef = useRef(null);

//   const scrollToBottom = () => {
//     endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(scrollToBottom, [messages]);

//   const handleSend = () => {
//     if (!newMessage.trim()) return;

//     const messageToAdd = {
//       message: newMessage.trim(),
//       direction: "outgoing",
//       sender: "user",
//     };
//     setMessages([...messages, messageToAdd]);
//     setNewMessage("");

//     setIsTyping(true);
//     setTimeout(() => {
//       setIsTyping(false);
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         {
//           message: "AI response here.",
//           direction: "incoming",
//           sender: "CashClub AI",
//         },
//       ]);
//     }, 1000);
//   };

//   return (
//     <div className="flex-grow flex flex-col h-full pt-4">
//       {/* Chat messages aligned to the sides */}
//       <div className="flex-grow overflow-y-auto p-4">
//         <div className="space-y-2">
//           {messages.map((msg, index) => (
//             <div key={index} className={`flex w-full ${msg.direction === "outgoing" ? "justify-end pr-40" : "justify-start pl-40"}`}>
//               <div className={`inline-block w-auto px-4 py-2 rounded-lg ${msg.direction === "outgoing" ? "bg-blue-100" : "bg-blue-300"}`}>
//                 {msg.message}
//               </div>
//               {msg.direction === "outgoing" && (
//                 <PaperClipIcon className="ml-2 h-6 w-6 text-gray-500" />
//               )}
//             </div>
//           ))}
//           {isTyping && <div className="animate-pulse flex justify-center">AI is typing...</div>}
//         </div>
//         <div ref={endOfMessagesRef} />
//       </div>

//       {/* Message input */}
//       <div className="border-t-2 border-gray-200 py-2 flex-none mb-4 pt-4">
//         <div className="relative flex items-center w-full max-w-lg mx-auto">
//           <input
//             type="text"
//             className="w-full flex-grow border pl-10 pr-10 py-4 px-2 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Type message here"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSend()}
//           />
//           <PaperClipIcon className="absolute left-3 h-5 w-5 text-gray-500" />
//           <button
//             className="absolute right-3 bg-blue-500 hover:bg-blue-700 text-white rounded-full p-2"
//             onClick={handleSend}
//           >
//             <ArrowRightIcon className="h-5 w-5" />
//           </button>
//         </div>
//       </div>

      
//     </div>
//   );
// }

// export default ChatbotUI;


// # Function to process extracted text (common for all file types)
// def process_text(text):
//     text_chunks = get_chunk_text(text)
//     vector_store = get_vector_store(text_chunks)
//     return get_conversation_chain(vector_store)

// # Function to chunk the text
// def get_chunk_text(text):
//     text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200, length_function=len)
//     chunks = text_splitter.split_text(text)
//     return chunks

// # Function to get the vector store
// def get_vector_store(text_chunks):
//     embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
//     vectorstore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
//     return vectorstore