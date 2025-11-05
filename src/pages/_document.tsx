import { Head, Html, Main, NextScript } from 'next/document';
export default function Document() {
  return (
    <Html>
      <Head>
        <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href={
            'https://fonts.googleapis.com/css2' +
            '?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
          }
          rel="stylesheet"
        />
        <link href="https://use.typekit.net/rsa2qdo.css?v=3" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
