import { FooterWidget } from "@/components/Footer";
import { Button } from "../components/Button";
import { Header } from "@/components/Header";
import { Info } from "@/components/Info";
import { DinamicCard } from "@/components/Info copy";

export default function Home() {
  return (
    <>
      <main style={{ padding: 24 }}>
        <h1>Client Site 🎨</h1>
        <p>Theme is loaded and running...</p>
        <Button variant="primary">Primary from CDN</Button>
        <Button variant="secondary" style={{ marginLeft: 8 }}>
          Secondary from CDN
        </Button>
        <Header />
        <Info />
        <DinamicCard />
        <FooterWidget />
      </main>
    </>
  );
}
