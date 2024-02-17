import { Button } from "../ui/button";
import { NewsletterModal } from "./modal";
import { Send } from "lucide-react";

export const Newsletter = () => (
  <NewsletterModal>
    <Button size="icon" variant="outline">
      <Send className="size-4"></Send>
      <span className="sr-only">Newsletter</span>
    </Button>
  </NewsletterModal>
)
