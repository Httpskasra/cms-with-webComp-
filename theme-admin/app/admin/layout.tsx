import Link from "next/link";
import "../globals.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main style={{ padding: 24 }}>
      <header style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <h1 style={{ marginRight: "auto" }}>Theme Admin</h1>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link href="/admin">Theme</Link>
          <Link href="/admin/components">Components</Link>
        </nav>
      </header>
      {children}
    </main>
  );
}
