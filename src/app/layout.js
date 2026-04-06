import './globals.css';

export const metadata = {
  title: 'CRUD App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}