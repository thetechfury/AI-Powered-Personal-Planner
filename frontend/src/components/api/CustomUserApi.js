import {BASE_URL} from "../../BaseUrl";
import Cookies from 'js-cookie';

export const fetchUsers = async (session_id) => {
    const Session_id = Cookies.get('session_id', "")
    const response = await fetch(`${BASE_URL}/api/custom-user`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Session-Id': Session_id,
        }
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await response.json();
    if (!session_id) {
        Cookies.set('session_id', result.session_id);
    }
    return result;
};
