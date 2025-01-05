/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export const searchUsers = async (query: any, token: any) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/users/search?query=${query}`, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
};
