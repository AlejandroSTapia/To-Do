import React, { useState } from "react";

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;


export default function ChatWithUpload() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function toBase64(f: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1] || "");
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });
  }

  async function send() {
    setLoading(true);
    setError("");
    try {
      interface Payload {
        message: string;
        files?: {
          name: string;
          mime: string;
          data: string;
        }[];
      }
      const payload: Payload = { message };
      if (file) {
        payload.files = [{
          name: file.name,
          mime: file.type || "application/octet-stream",
          data: await toBase64(file),
        }];
      }

      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setAnswer(json.reply ?? "Sin respuesta del bot");
      setMessage("");
      setFile(null);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Error enviando el mensaje");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[95vw] rounded-2xl border p-4 bg-white shadow-xl">
      <div className="font-semibold mb-2">Dany (con imágenes) 🧠</div>

      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={3}
        placeholder="Escribe tu pregunta…"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mb-2"
      />

      <button
        onClick={send}
        disabled={loading || (!message && !file)}
        className={`w-full rounded-lg py-2 text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {loading ? "Enviando…" : "Enviar"}
      </button>

      {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
      {answer && (
        <div className="mt-3 whitespace-pre-wrap text-sm border-t pt-2 max-h-60 overflow-auto">
          {answer}
        </div>
      )}
    </div>
  );
}