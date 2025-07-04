import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from '@/components/theme-provider';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://khidmanow.com';
const appName = 'توظيفك';

export const metadata: Metadata = {
  title: {
    default: appName,
    template: `%s | ${appName}`
  },
  description: 'منصتك الأولى لإيجاد فرص العمل والعمالة الماهرة في العالم العربي.',
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: appName,
    description: 'منصتك الأولى لإيجاد فرص العمل والعمالة الماهرة في العالم العربي.',
    url: baseUrl,
    siteName: appName,
    images: [
      {
        url: 'https://i.postimg.cc/zBNdnpC6/people-ar-work-company-12112019-1.jpg',
        width: 1200,
        height: 630,
        alt: appName,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: appName,
    description: 'منصتك الأولى لإيجاد فرص العمل والعمالة الماهرة في العالم العربي.',
    images: ['https://i.postimg.cc/zBNdnpC6/people-ar-work-company-12112019-1.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: appName,
    url: baseUrl,
    logo: 'https://i.postimg.cc/zBNdnpC6/people-ar-work-company-12112019-1.jpg',
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: appName,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/jobs?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
  
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
