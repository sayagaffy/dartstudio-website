// Server Component — metadata must be exported from a server context.
// The actual Studio UI is rendered in [[...tool]]/page.tsx as "use client".
//
// This layout acts as the root layout for /admin (Multiple Root Layouts pattern).
// Next.js requires <html> and <body> in every root layout that is not nested
// inside another layout that already provides them.
export { metadata, viewport } from "next-sanity/studio";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
