import { TokenProvider } from '@/components/Token';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }) {
  return (
    <TokenProvider>
      <Component {...pageProps} />
    </TokenProvider>
  )
}

export default MyApp;