import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer"
import * as React from "react"
import { useMediaQuery } from "@react-hook/media-query"
import { Button } from "../ui/button"
import { NewsletterForm } from "./form"

const text = {
  title: "Newletter",
  description: "¿Quieres estar atento a mis futuros artículos?"
}

interface Props {
  children: React.ReactChild
}

export function NewsletterModal({ children }: Props) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="mb-2">
            <DialogTitle>{text.title}</DialogTitle>
            <DialogDescription>
              {text.description}
            </DialogDescription>
          </DialogHeader>
          <NewsletterForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left mb-2">
          <DrawerTitle>{text.title}</DrawerTitle>
          <DrawerDescription>
            {text.description}
          </DrawerDescription>
        </DrawerHeader>
        <NewsletterForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
