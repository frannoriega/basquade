import { cn } from "@/lib/utils";
import * as Separator from "@radix-ui/react-separator"

type VLineProps = {
  lineClassName?: string,
} & React.ComponentPropsWithoutRef<"div">;

export default function VLine(props: VLineProps) {
  const lcn = cn("w-px", props.lineClassName);
  return (
        <div className={props.className}>
          <Separator.Root orientation='vertical' decorative className={lcn}/>
        </div>
  )
}
