export const configHeader = (): { headers: { 'Content-Type': string; 'x-api-key': string; 'Authorization': string, 'access-token': string } } => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.API_KEY as string,
            'access-token': process.env.ACCESS_TOKEN as string,
            'Authorization': token ? `Bearer ${token}` : ''
        }
    };
};
