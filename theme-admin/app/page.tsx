import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Theme Admin</h1>
      <Link href="/admin">رفتن به صفحه‌ی ادیت</Link>
    </main>
  );
}
