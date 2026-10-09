import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VYBE — Mobile Video Studio',
  description: 'Shoot, edit and share short-form videos.',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'VYBE' },
};
export const viewport: Viewport = { width:'device-width', initialScale:1, viewportFit:'cover', themeColor:'#07070a' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
