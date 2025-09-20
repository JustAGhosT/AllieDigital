import '../styles/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Allie Digital - Personalised Learning for Neurodivergent Minds',
  description: 'Personalised digital learning platform designed for learners with ADHD, autism, dyslexia, and other learning differences. Revolutionising education through adaptive AI technology.',
  keywords: [
    'neurodivergent',
    'learning',
    'accessibility',
    'education',
    'ADHD',
    'autism',
    'dyslexia',
    'apraxia',
    'inclusive',
    'AI',
    'personalised'
  ],
  authors: [{ name: 'JustAGhosT' }],
  viewport: 'width=device-width, initial-scale=1.0',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ],
  openGraph: {
    title: 'Allie Digital - Your Digital Ally',
    description: 'Revolutionising learning support for neurodivergent minds through adaptive technology and inclusive design.',
    type: 'website',
    locale: 'en_GB',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en-GB"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body 
        className="font-sans antialiased min-h-screen"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}