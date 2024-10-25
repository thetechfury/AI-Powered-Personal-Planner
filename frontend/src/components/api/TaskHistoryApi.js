import {useCallback, useEffect, useState} from 'react';
import {BASE_URL} from "../../BaseUrl";
import {useUserApi} from "../../ApiContext";

const TaskHistoryApi = () => {
    const [taskHistory, setTaskHistory] = useState([]);
    const [allTaskHistory, setAllTaskHistory] = useState([]);
    const [loading, setLoading] = useState(false); // Start loading as false initially
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const {user} = useUserApi();

    const fetchInitialTaskHistory = useCallback(async () => {
        if (!user?.session_id || loading) return;
        setLoading(true);
        try {
            const session_id = user.session_id;
            const response = await fetch(`${BASE_URL}/api/task-history`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Session-Id': session_id,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setAllTaskHistory(data.results);
                setHasMore(data.next !== null); // Check if there's more data to load
            } else {
                throw new Error(data.message || 'Failed to fetch initial task history');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [loading, user]);

    const fetchTaskHistory = useCallback(async (pageNum = 1) => {
        if (!user?.session_id || loading || !hasMore) return;
        setLoading(true);
        try {
            const session_id = user.session_id;
            const response = await fetch(`${BASE_URL}/api/task-history?page=${pageNum}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Session-Id': session_id,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setTaskHistory(prevTasks => [...prevTasks, ...data.results]); // Append new results
                setHasMore(data.next !== null); // Check if there's more data to load
            } else {
                throw new Error(data.message || 'Failed to fetch task history');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, user]);

    useEffect(() => {
        if (user && user.session_id) {
            fetchInitialTaskHistory()
            fetchTaskHistory()
        }
    }, [user]);

    const loadMoreMessages = () => {
        if (hasMore && !loading) {
            setPage(prevPage => {
                const newPage = prevPage + 1;
                fetchTaskHistory(newPage);
                return newPage;
            });
        }
    };

    return {taskHistory, allTaskHistory, loading, error, loadMoreMessages, fetchTaskHistory, fetchInitialTaskHistory};
};

export default TaskHistoryApi;