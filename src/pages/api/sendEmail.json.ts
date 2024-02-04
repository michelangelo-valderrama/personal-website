import type { APIRoute } from "astro"
import { Resend } from "resend"

const resend = new Resend(import.meta.env.RESEND_API_KEY)

export const GET: APIRoute = async () => {
  const send = await resend.emails.send({
    from: "newsletter@imangelo.dev",
    to: "michelangelovalderrama@gmail.com",
    subject: "Hola",
    html: "<h1>Hola</h1>",
  })

  if (send.error) {
    return new Response(JSON.stringify(send.error), {
      status: 500,
      statusText: "Internal Server Error",
    })
  }

  return new Response(JSON.stringify(send.data), {
    status: 200,
    statusText: "OK",
  })
}
