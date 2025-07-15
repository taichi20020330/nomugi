import { useState } from 'react'

export default function Home() {
  const [previews, setPreviews] = useState<string[]>([])

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  const form = e.currentTarget // ←ここで先に退避
  const formData = new FormData(form)

  const res = await fetch('/api/remove-bg', {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) {
    alert('アップロード失敗')
    return
  }
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  setPreviews((prev) => [...prev, url])
  form.reset() // ←退避した form を使う！
}

  return (
    <main>
      <h1>背景透過テスト</h1>
      <form onSubmit={handleUpload}>
        <input type="file" name="image" accept="image/*" required />
        <button type="submit">背景透過する</button>
      </form>
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
              width: '200px',
              position: 'relative',
              animation: 'float 3s ease-in-out infinite',
              flexShrink: 0,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </main>
  )
}
