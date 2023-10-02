import './globals.css'
import { Inter } from 'next/font/google'
import UiLayoutWrapper from './lib/UiLayoutWrapper'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>

        {/* <link rel="icon" href="/favicons/favicon.ico" sizes="any" /> */}
        {/* <link rel="icon" href="/favicons/icon.ico" type="image/svg+xml" /> */}
        {/* <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" /> */}
        {/* <link rel="manifest" href="/favicons/manifest.json" /> */}

        <title>Advisory | Document emails that convert</title>
        {/* <meta name="description" content="Privy Auth Starter" /> */}
      </head>
      <body className={inter.className}>
        <UiLayoutWrapper>
          {children}
        </UiLayoutWrapper>
      </body>

    </html>
  )
}
