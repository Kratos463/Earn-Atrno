import Cookies from 'js-cookie';

export const configHeader = (): { headers: { 'Content-Type': string; 'x-api-key': string; 'Authorization': string, 'access-token': string } } => {
  const token = Cookies.get('token');

  return {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_KEY as string,
      'access-token': process.env.ACCESS_TOKEN as string,
      'Authorization': token ? `Bearer ${token}` : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZTE0M2NiNWQ5MjUxM2ZhOTUyNGVmMSIsInVzZXJJZCI6IjB4MTM0NjYwOGE1NGJBMDMzZGVlNzY1N2I5QzQ4MDM5NzQ4NTY5MkY5MCIsImlhdCI6MTcyNjAzODk4NywiZXhwIjoxNzI4NjMwOTg3fQ.V7OuMD_f6XS3_1FIwr1VTXllUEpql1r-fzcq2upRt2k'
    }
  };
};
