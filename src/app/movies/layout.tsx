import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerSession()    
    if(!session || !session.user) {
        redirect("/")
    }

    return (
        <>{children}</>
    )
}

export default AppLayout