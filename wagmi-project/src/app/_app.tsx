// _app.tsx or index.tsx (depending on your setup)
import { Providers } from './providers'; // Adjust the path as needed


function MyApp({ Component, pageProps }: { Component: React.ComponentType; pageProps: any }) {
  return (
      <Providers>
        <Component {...pageProps} />
      </Providers>
  );
}

export default MyApp;
