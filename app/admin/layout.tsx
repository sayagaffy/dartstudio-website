// Server Component — metadata must be exported from a server context.
// The actual Studio UI is rendered in [[...tool]]/page.tsx as "use client".
export { metadata, viewport } from "next-sanity/studio";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
