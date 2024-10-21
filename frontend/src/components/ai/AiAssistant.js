import { Button } from "@mui/material";
import avatar from "../../assets/head-silhouette-png-24.png";
import Input from "../ui/Input";
import { useEffect, useRef, useState, useCallback } from "react";
import CreateChatApi from "../api/CreateChatApi";
import ChatHistoryApi from "../api/ChatHistoryApi";
import { useUserApi } from "../../ApiContext";

const defaultBotMessage = {
    message: "How can I assist you with your schedule today?",
    timestamp: new Date().toISOString(),
    sender: "bot",
};

const AiAssistant = () => {
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const { createChat, response } = CreateChatApi();
    const chatBoxRef = useRef(null);
    const { user } = useUserApi();
    const { chatHistory, loading: historyLoading, loadMoreMessages } = ChatHistoryApi();

    useEffect(() => {
        if (user && chatHistory.length) {
            setMessages(chatHistory);
        }
    }, [user, chatHistory]);

    const handleSubmit = useCallback((e) => {
        e?.preventDefault();
        if (text.trim()) {
            const newMessage = {
                message: text,
                timestamp: new Date().toISOString(),
                sender: "user",
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setText("");
            createChat({ text });
        }
    }, [text, createChat]);

    useEffect(() => {
        if (response) {
            const botMessage = {
                message: response.message,
                timestamp: new Date().toISOString(),
                sender: "bot",
            };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        }
    }, [response]);

    const onKeyDown = useCallback((event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSubmit();
        }
    }, [handleSubmit]);

    const handleScroll = useCallback(() => {
        if (chatBoxRef.current.scrollTop === 0) {
            loadMoreMessages();
        }
    }, [loadMoreMessages]);

    useEffect(() => {
        const chatBox = chatBoxRef.current;
        if (chatBox) {
            chatBox.addEventListener("scroll", handleScroll);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
        return () => {
            chatBox?.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll, messages]);

    return (
        <div className="p-4 space-y-6">
            <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">AI Assistant</h3>
                <div className="space-y-3 mb-3 m-2 overflow-y-auto max-h-[307px]" ref={chatBoxRef}>
                    {chatHistory.length && <div className="text-center text-sm">no more messages</div>}
                    <div className="flex items-start space-x-2">
                        <img src={avatar} width="24" alt="User Avatar" />
                        <div className="w-[fit-content] bg-gray-700 rounded-lg p-2 text-sm w-[calc(100%-100px)] text-wrap break-all">
                            {defaultBotMessage.message}
                        </div>
                    </div>
                    <div className="chat-box mb-4 text-wrap break-all">
                        {historyLoading && <p>Loading chat history...</p>}
                        {messages.map((msg, index) => (
                            <div key={index} className="mb-4 pr-2">
                                {msg.sender === "user" ? (
                                    <div>
                                        <div className="bg-gray-700 p-2 text-sm rounded-t-lg rounded-l-lg mt-0 mr-0 mb-0 ml-auto w-[fit-content]">
                                            {msg.message}
                                        </div>
                                        <div className="w-[fit-content] text-xs mt-0 mr-0 mb-0 ml-auto">
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-start space-x-2">
                                            <img src={avatar} width="24" alt="Bot Avatar" />
                                            <div className="w-[fit-content] bg-gray-700 rounded-lg p-2 text-sm text-wrap break-all">
                                                {msg.message}
                                            </div>
                                        </div>
                                        <div className="w-[fit-content] text-xs mt-0 mr-0 mb-0 ml-8">
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        type="text"
                        onKeyDown={onKeyDown}
                        placeholder="Type your request..."
                        className="border-gray-600 flex h-10 rounded-md border border-input px-3 py-2 bg-transparent text-sm w-full focus-visible:ring-offset-2 focus:ring-0"
                    />
                    <Button
                        size="sm"
                        onClick={handleSubmit}
                        sx={{
                            backgroundColor: "#61dafb",
                            color: "white",
                            "&:hover": {
                                backgroundColor: "#41bbdd",
                            },
                        }}
                    >
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AiAssistant;
