import './globals.css'

export const metadata = {
  title: 'AI Operations Layer',
  description: 'Operations system powered by AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}