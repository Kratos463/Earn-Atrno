import Cookies from 'js-cookie';

export const configHeader = (): { headers: { 'Content-Type': string; 'x-api-key': string; 'authorization': string, 'access-token': string } } => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_KEY as string,
      'access-token': process.env.ACCESS_TOKEN as string,
      'authorization': token ? `Bearer ${token}` : ''
    }
  };
};
