export async function analyzeMedicalImage(
  base64: string,
  mimeType: string
) {

  const blob = await fetch(`data:${mimeType};base64,${base64}`).then(r => r.blob())

  const file = new File([blob], "scan.jpg", { type: mimeType })

  const formData = new FormData()

  formData.append("file", file)

  const res = await fetch("http://127.0.0.1:8000/upload/image", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("medassist_token")}`
    },
    body: formData
  })

  if (!res.ok) {
    throw new Error("Image analysis failed")
  }

  const data = await res.json()

  return data
}



export async function analyzeMedicalText(text: string) {

  const res = await fetch("http://127.0.0.1:8000/reports/analyze-text", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("medassist_token")}`
    },
    body: JSON.stringify({ text })
  })

  if (!res.ok) {
    throw new Error("Text analysis failed")
  }

  const data = await res.json()

  return data
}
