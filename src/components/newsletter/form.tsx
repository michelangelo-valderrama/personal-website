import { useEffect, useState } from "react"
import { ReloadIcon } from "@radix-ui/react-icons"
import { randomName, validateEmail } from "@/utils"
import { cn } from "@/lib/utils"
import { subscribeNewsletter } from "@/services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface UseFieldProps {
  type: React.HTMLInputTypeAttribute
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

export function NewsletterForm({ className }: React.ComponentProps<"form">) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [placeholderName, setPlaceholderName] = useState("")

  const email = useField({ type: "email" })
  const name = useField({ type: "text" })

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
      toast({
        description: "Suscripción realizada con éxito",
      })
    } catch (error) {
      let description: string;
      if ((error as any).message) {
        description = (error as any).message
      } else {
        console.log(error)
        description = "Vuelva a intentarlo más tarde"
      }
      toast({
        variant: "destructive",
        title: "Error inesperado",
        description,
      })
    } finally {
      setLoading(false)
    }
  }

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
