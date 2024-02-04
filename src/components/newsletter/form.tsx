import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { randomName, validateEmail } from "@/utils"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { ReloadIcon } from "@radix-ui/react-icons"
import { subscribeNewsletter } from "@/services"

interface UseFieldProps {
  type: React.HTMLInputTypeAttribute
}

interface Send {
  success: boolean | null
  message: string | null
}

const useField = ({ type }: UseFieldProps) => {
  const [value, setValue] = useState('')

  const onChange = (event: React.ChangeEvent) => {
    setValue((event.target as HTMLInputElement).value)
  }

  return {
    input: {
      type,
      value,
      onChange
    },
    setValue
  }
}

const validateForm = ({ email, name }: { [key: string]: string }) => {
  if (validateEmail(email) && (name.length > 3 && name.length < 50)) {
    return true
  }
  return false
}

export const NewsletterForm = ({ className }: React.ComponentProps<"form">) => {
  const [loading, setLoading] = useState(false)
  const [placeholderName, setPlaceholderName] = useState("")
  const [send, setSend] = useState<Send>({ success: null, message: null })

  useEffect(() => {
    setPlaceholderName(randomName())
  }, [])

  const onSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await subscribeNewsletter({ email: email.input.value, firstName: name.input.value })
      email.setValue("")
      name.setValue("")
      setSend({
        success: true,
        message: "Suscripción realizada con éxito"
      })
    } catch (error) {
      if ((error as any).message) {
        return setSend({
          success: false,
          message: (error as any).message
        })
      }
      console.log(error)
      return setSend({
        success: false,
        message: "Error inesperado. Vuelva a intentarlo más tarde"
      })
    } finally {
      setLoading(false)
    }
  }

  const email = useField({ type: "email" })
  const name = useField({ type: "text" })

  return (
    <form className={cn("grid items-start gap-4", className)} onSubmit={onSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input {...email.input} placeholder="email@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="name">Primer nombre</Label>
        <Input {...name.input} placeholder={placeholderName} />
      </div>
      {send.success !== null && (
        <p className={`text-xs ${send.success ? "text-green-400" : "text-red-500"}`}>
          {send.message}
        </p>
      )}
      <Button className="gap-x-2"
        disabled={!validateForm({ email: email.input.value, name: name.input.value })}
        type="submit"
      >
        <span>Suscribirse</span>
        {
          loading
          && (<ReloadIcon className="size-4 animate-spin" />)
        }
      </Button>
    </form>
  )
}
