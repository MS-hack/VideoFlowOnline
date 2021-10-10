import 'tailwindcss/tailwind.css'
import { version } from '../package.json'
function MyApp({ Component, pageProps }) {
  return (
    <>
      <div>
        <h1>VideoFlowOnline {version}</h1>
      </div>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
