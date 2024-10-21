import {useState} from 'react';
import {BASE_URL} from "../../BaseUrl";
import {useUserApi} from "../../ApiContext";

const CreateChatApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
    const {user} = useUserApi()

    const createChat = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const sessionId = user.session_id;
            const res = await fetch(`${BASE_URL}/api/create-chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Session-Id': sessionId,
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error('Failed to create chat');
            }
            const result = await res.json();
            setResponse(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {createChat, response, loading, error};
};

export default CreateChatApi;
