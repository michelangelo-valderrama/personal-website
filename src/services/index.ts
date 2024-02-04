const apiUrl = import.meta.env.PUBLIC_API_URL

export const subscribeNewsletter = async (data: {
  email: string
  name: string
}) => {
  const resp = await fetch(`${apiUrl}/newsletter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return resp.json
}
