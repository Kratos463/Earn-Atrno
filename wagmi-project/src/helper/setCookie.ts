import Cookies from 'js-cookie';

export const setCookie = (name: string, value: string, days: number) => {
  console.log("Token value from set cokkie function", value)
  Cookies.set(name, value, { expires: days, path: '/', sameSite: 'Lax' });
};
