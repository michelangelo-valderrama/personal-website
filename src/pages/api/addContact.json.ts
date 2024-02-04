import type { APIRoute } from "astro"
import { Resend } from "resend"

const resend = new Resend(import.meta.env.RESEND_API_KEY)

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { email, firstName } = body
    if (!email) throw { message: "Email is required" }
    if (!firstName) throw { message: "FirstName is required" }

    const send = await resend.contacts.create({
      email,
      firstName,
      unsubscribed: false,
      audienceId: import.meta.env.RESEND_AUDIENCE_ID,
    })

    if (send.error) throw send.error

    return new Response(JSON.stringify(send.data), {
      status: 200,
      statusText: "OK",
    })
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      statusText: "Internal Server Error",
    })
  }
}
