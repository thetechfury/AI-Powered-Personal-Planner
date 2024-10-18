import {useCallback, useEffect, useState} from 'react';
import {BASE_URL} from "../../BaseUrl";
import {useUserApi} from "../../ApiContext";

const ChatHistoryApi = () => {
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const {user} = useUserApi()

    const getChatHistory = useCallback(async (pageNum = 1) => {
        if (!user?.session_id || loading || !hasMore) return;
        setLoading(true);
        try {
            const session_id = user.session_id;
            const response = await fetch(`${BASE_URL}/api/chat-history?page=${pageNum}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Session-Id': session_id,
                },
            });
            const data = await response.json();
            const formattedMessages = data.results.map(msg => ({
                message: msg.text,
                timestamp: msg.created_at,
                sender: msg.send_by === 'ai' ? 'bot' : 'user',
            }));
            setChatHistory((prev) => [...formattedMessages, ...prev]);
            setHasMore(data.next !== null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, user])
    useEffect(() => {
        if (user && user.session_id) {
            getChatHistory(1);
        }
    }, [user]);
    const loadMoreMessages = () => {
        if (hasMore && !loading) {
            setPage((prevPage) => prevPage + 1);
            getChatHistory(page + 1);
        }
    };

    return {chatHistory, loading, error, loadMoreMessages};
};

export default ChatHistoryApi;
