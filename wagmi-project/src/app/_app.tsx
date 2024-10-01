import { Providers } from './providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }: { Component: React.ComponentType; pageProps: any }) {
  const initialState = {};

  return (
    <Providers initialState={initialState}>
      <Component {...pageProps} />
      <ToastContainer />
    </Providers>
  );
}

export default MyApp;
