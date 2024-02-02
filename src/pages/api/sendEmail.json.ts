import type { APIRoute } from "astro"
import { Resend } from "resend"

const resend = new Resend(import.meta.env.RESEND_API_KEY)

export const GET: APIRoute = async () => {
  const send = await resend.emails.send({
    from: "hola@imangelo.dev",
    to: "michelangelovalderrama@gmail.com",
    subject: "hola",
    html: "<h1>hola</hi>",
  })

  if (send.data) {
    return new Response(JSON.stringify(send.data), {
      status: 200,
      statusText: "OK",
    })
  }

  return new Response(JSON.stringify(send.error), {
    status: 500,
    statusText: "Internal Server Error",
  })
}
