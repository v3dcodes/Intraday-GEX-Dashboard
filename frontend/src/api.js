export async function getGex() {
  const res = await fetch('/api/gex')
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json()
}
