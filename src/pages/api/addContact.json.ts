import type { APIRoute } from "astro"
import { Resend } from "resend"

const resend = new Resend(import.meta.env.RESEND_API_KEY)

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  const { email, firstName } = body

  const send = await resend.contacts.create({
    email,
    firstName,
    unsubscribed: false,
    audienceId: import.meta.env.RESEND_AUDIENCE_ID,
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
