import { Button } from "../ui/button";
import { NewsletterModal } from "./modal";
import { Send } from "lucide-react";

export const Newsletter = () => (
  <NewsletterModal>
    <Button size="icon" variant="ghost">
      <Send className="size-4"></Send>
    </Button>
  </NewsletterModal>
)
