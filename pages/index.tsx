import Head from 'next/head'
import Header from '../components/Header'
import Introduction from '../components/Introduction'

export default function Home() {
  return (
    <div>
      <Head>
        <title>ck16dev</title>
        <meta name="description" content="Chandrakant Pal frontend developer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Introduction />
    </div>
  )
}
