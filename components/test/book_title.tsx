import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function BookTitle({ children }: Props) {
  return (
    // TODO: Make text fit the width of the preview and hid away the rest
    <p className="overflow-hidden text-ellipsis">{children}</p>
  )
}
