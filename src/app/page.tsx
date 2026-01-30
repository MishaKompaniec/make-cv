import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";

export default function Home() {
  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>CV Builder</h1>
      <p style={{ marginBottom: "1rem" }}>Welcome to your CV creator</p>

      <div style={{ marginBottom: "1rem" }}>
        <Input inputSize="lg" placeholder="Enter your full name" />
      </div>

      <Button variant="primary" size="lg">
        Get Started
      </Button>
    </main>
  );
}
