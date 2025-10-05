import React, { useRef, useState } from "react";

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;
console.log("WEBHOOK_URL en runtime:", WEBHOOK_URL);

export default function ChatWithUpload() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []);
    if (dropped.length) setFiles(prev => [...prev, ...dropped]);
  }
  function onDragOver(e: React.DragEvent<HTMLDivElement>) { e.preventDefault(); }

  function browseFiles(kind: "any" | "image") {
    (kind === "image" ? imageInputRef.current : fileInputRef.current)?.click();
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    setFiles(prev => [...prev, ...Array.from(list)]);
  }

  function removeFile(idx: number) {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  }

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
      type Payload = {
        message: string;
        files?: { name: string; mime: string; data: string }[];
      };
      const payload: Payload = { message };
      if (files.length) {
        payload.files = await Promise.all(
          files.map(async f => ({ name: f.name, mime: f.type || "application/octet-stream", data: await toBase64(f) }))
        );
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
      setFiles([]);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message || "Error enviando el mensaje");
      } else {
        setError("Error enviando el mensaje");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* FAB (botón flotante) para abrir/cerrar el chat */}
      <button
        aria-label="Abrir chat"
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl bg-rose-500 text-white text-2xl flex items-center justify-center"
      >
        {open ? "×" : "💬"}
      </button>

      {/* Panel de chat */}
      {open && (
        <div
          className="fixed bottom-24 right-6 w-[360px] max-w-[95vw] rounded-2xl border p-4 bg-white shadow-2xl"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <div className="font-semibold mb-2 flex items-center justify-between">
            <span>Dany (con imágenes/archivos) 🧠</span>
            <div className="text-xs text-gray-500">Arrastra y suelta aquí</div>
          </div>

          <textarea
            className="w-full border rounded p-2 mb-2"
            rows={3}
            placeholder="Escribe tu pregunta…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* Botones de adjunto */}
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => browseFiles("image")}
              className="px-3 py-2 rounded-lg border hover:bg-gray-50 flex items-center gap-2"
              title="Adjuntar imagen"
            >
              {/* ícono cámara */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M9 2a1 1 0 00-.894.553L7.382 4H5a3 3 0 00-3 3v10a3 3 0 003 3h14a3 3 0 003-3V7a3 3 0 00-3-3h-2.382l-.724-1.447A1 1 0 0014 2H9zm3 6a5 5 0 110 10 5 5 0 010-10z"/></svg>
              Imagen
            </button>
            <button
              type="button"
              onClick={() => browseFiles("any")}
              className="px-3 py-2 rounded-lg border hover:bg-gray-50 flex items-center gap-2"
              title="Adjuntar archivo"
            >
              {/* ícono clip */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M16.5 6.5l-7.778 7.778a3 3 0 104.243 4.243L19 12.485" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
              Archivo
            </button>
          </div>

          {/* Inputs ocultos */}
          <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e)=>addFiles(e.target.files)} />
          <input ref={fileInputRef} type="file" className="hidden" onChange={(e)=>addFiles(e.target.files)} />

          {/* Lista de adjuntos con preview */}
          {files.length > 0 && (
            <div className="mb-2 max-h-28 overflow-auto border rounded p-2 flex flex-col gap-2">
              {files.map((f, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {f.type.startsWith("image/") ? (
                      <img className="h-8 w-8 rounded object-cover" src={URL.createObjectURL(f)} alt={f.name} />
                    ) : (
                      <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center">📄</div>
                    )}
                    <span className="truncate max-w-[200px]" title={f.name}>{f.name}</span>
                  </div>
                  <button className="text-red-600" onClick={()=>removeFile(idx)} title="Quitar">✕</button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={send}
            disabled={loading || (!message && files.length===0)}
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
      )}
    </>
  );
}