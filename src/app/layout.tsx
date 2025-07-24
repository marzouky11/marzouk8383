
import type { Metadata } from 'next';
import { PT_Sans } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

const baseUrl = 'https://www.tawzifak.com';
const appName = 'توظيفك';

export const metadata: Metadata = {
  title: "توظيفك - منصة التوظيف العربية للباحثين عن عمل وأصحاب العمل",
  description: "توظيفك - منصتك الأولى للعثور على فرص عمل موثوقة في العالم العربي. وظائف يومية في السعودية، المغرب، مصر، الإمارات، الجزائر، تونس وغيرها. سجل مجانًا وابدأ العمل الآن.",
  metadataBase: new URL(baseUrl),
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome-192x192.png",
        url: "/android-chrome-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        rel: "android-chrome-512x512.png",
        url: "/android-chrome-512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: {
      default: "توظيفك - منصة التوظيف العربية للباحثين عن عمل وأصحاب العمل",
      template: `%s | ${appName}`
    },
    description: "توظيفك - منصتك الأولى للعثور على فرص عمل موثوقة في العالم العربي. وظائف يومية في السعودية، المغرب، مصر، الإمارات، الجزائر، تونس وغيرها. سجل مجانًا وابدأ العمل الآن.",
    url: baseUrl,
    siteName: appName,
    images: [
      {
        url: 'https://i.postimg.cc/YCz0LvMj/Screenshot-20250704-173231.jpg',
        width: 1200,
        height: 630,
        alt: appName,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: "توظيفك - منصة التوظيف العربية للباحثين عن عمل وأصحاب العمل",
      template: `%s | ${appName}`
    },
    description: "توظيفك - منصتك الأولى للعثور على فرص عمل موثوقة في العالم العربي. وظائف يومية في السعودية، المغرب، مصر، الإمارات، الجزائر، تونس وغيرها. سجل مجانًا وابدأ العمل الآن.",
    images: ['https://i.postimg.cc/YCz0LvMj/Screenshot-20250704-173231.jpg'],
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
    logo: 'https://i.postimg.cc/YCz0LvMj/Screenshot-20250704-173231.jpg',
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
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7860245146219810" crossOrigin="anonymous"></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body className={cn("font-body antialiased", ptSans.variable)}>
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
