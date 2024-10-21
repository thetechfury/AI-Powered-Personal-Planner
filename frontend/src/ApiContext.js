import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {fetchUsers} from "./components/api/CustomUserApi";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const session_id = Cookies.get('session_id');

    useEffect(() => {
        const loadUser = async () => {
            try {
                const data = await fetchUsers(session_id);
                setUser(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, [session_id]);

    return (
        <ApiContext.Provider value={{ user, loading, error }}>
            {children}
        </ApiContext.Provider>
    );
};
export const useUserApi = () => {
    return useContext(ApiContext);
};
