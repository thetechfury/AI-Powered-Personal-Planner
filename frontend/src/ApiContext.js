import React, {createContext, useContext, useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {BASE_URL} from "./BaseUrl";

const ApiContext = createContext();

export const ApiProvider = ({children}) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const session_id = Cookies.get('session_id');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch((`${BASE_URL}/api/custom_user`), {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Session-Id': session_id || '',
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                 if (!session_id) {
                    Cookies.set('session_id', data.session_id);
                }
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <ApiContext.Provider value={{users, loading, error}}>
            {children}
        </ApiContext.Provider>
    );
};

// Custom hook to use the ApiContext
export const useApi = () => {
    return useContext(ApiContext);
};
