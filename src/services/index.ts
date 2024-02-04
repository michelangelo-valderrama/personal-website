export const subscribeNewsletter = async (data: {
  email: string
  firstName: string
}) => {
  const { email, firstName } = data
  try {
    const response = await fetch(
      `${import.meta.env.PUBLIC_API_URL}/addContact.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, firstName }),
      }
    )
    const json = await response.json()
    if (response.status !== 200 && response.status !== 201) throw json
    return json
  } catch (e) {
    console.log(e)
    throw e
  }
}
