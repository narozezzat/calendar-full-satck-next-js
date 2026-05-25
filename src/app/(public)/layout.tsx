import { ReactNode } from "react"

export default function PublicLayout({ children }: { children: ReactNode }) {
    return <main className="container flex-1 flex flex-col my-6">{children}</main>
}