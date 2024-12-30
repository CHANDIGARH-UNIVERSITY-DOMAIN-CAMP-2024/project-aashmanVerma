import { ClerkProvider } from '@clerk/nextjs'
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Include the weights you need
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signUpFallbackRedirectUrl='/dashboard'
      signInFallbackRedirectUrl='/dashboard'
    >
      <html lang="en">
        <body className={poppins.className}>
          <main>
            {children}
            <Toaster />  
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}