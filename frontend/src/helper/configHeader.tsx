export const configHeader = (): { headers: { 'Content-Type': string; 'x-api-key': string; 'access-token': string } } => {

  return {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_KEY as string,
      'access-token': process.env.ACCESS_TOKEN as string,
    }
  };
};
