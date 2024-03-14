import { useState } from "react"
import { ReloadIcon } from "@radix-ui/react-icons"
import { validateEmail } from "@/utils"
import { subscribeNewsletter } from "@/services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

const validateForm = ({ email }: { [key: string]: string }) => {
  if (validateEmail(email)) return true
  return false
}

export function NewsletterForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const email = useField({ type: "email" })

  const onSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await subscribeNewsletter({ email: email.input.value })
      email.setValue("")
      toast({
        title: 'Operación exitosa',
        description: "¡Gracias por suscribirte! 🎉",
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
    <form onSubmit={onSubmit}>
      <div className="flex gap-2 p-1 bg-muted rounded-lg">
        <div className="flex-1">
          <Input className="truncate border-transparent shadow-none" {...email.input} placeholder="email@example.com" />
        </div>
        <div>
          <Button
            disabled={!validateForm({ email: email.input.value })}
            className="gap-x-2 bg-background text-foreground hover:bg-background/60"
            type="submit"
          >
            {
              loading
                ? (<ReloadIcon className="size-4 animate-spin" />)
                : (<span>Suscribirse</span>)
            }
          </Button>
        </div>
      </div>
    </form>
  )
}
