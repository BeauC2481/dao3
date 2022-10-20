import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import Head from 'next/head';
import '../styles/globals.css';
import { Navbar, Footer } from '../components';

const MyApp = ({ Component, pageProps }) => (
    <ThemeProvider attribute="class">
        <Head>
          <title>Crypto DAO</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
      <div className="dark:bg-nft-dark bg-white min-h-screen">
      <Navbar />
        <div className="pt-65">
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>

      <Script src="https://kit.fontawesome.com/0faf8c3dc2.js" crossorigin="anonymous" />
    </ThemeProvider>
);

export default MyApp;
