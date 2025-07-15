import { useState } from 'react'

export default function Home() {
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    setUploading(true)

    const res = await fetch('/api/remove-bg', {
      method: 'POST',
      body: formData,
    })

    setUploading(false)

    if (!res.ok) {
      alert('アップロード失敗')
      return
    }

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    setPreviews((prev) => [...prev, url])
    e.target.value = '' // ← 同じ画像をもう一度選んでも反応するようにリセット
  }

  return (
    <main>
      <h1>背景透過カメラ</h1>

      {/* スマホのカメラを即起動 */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        style={{ marginBottom: '20px' }}
      />

      {uploading && <p>アップロード中...</p>}

      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginTop: '20px',
          overflowX: 'auto',
          maxWidth: '100%',
          paddingBottom: '10px',
        }}
      >
        {previews.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`透過画像 ${i + 1}`}
            style={{
              width: '150px',
              animation: 'float 3s ease-in-out infinite',
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  )
}
