import { LogOutIcon } from "lucide-react"
import { Button } from "@/shared/ui/Button"
import { useLogout } from "../hooks/use-logout"

export const LogoutButton = () => {

  const { mutate } = useLogout()

  return <Button onClick={() => mutate()} intent="ghost">
    <span><LogOutIcon size={16} /></span>
    Logout
  </Button>
}
