import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'SkillPath AI — Learn anything. One clear step at a time.',
  description:
    'AI-powered personalized learning roadmaps for students and self-learners. Understand your skill level, get a custom path, and track visible progress.',
  keywords: ['learning', 'AI', 'roadmap', 'skills', 'education', 'personalized'],
  openGraph: {
    title: 'SkillPath AI',
    description: 'Your next step is always clear.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-cream font-sans antialiased text-navy-800">
        {children}
      </body>
    </html>
  );
}
