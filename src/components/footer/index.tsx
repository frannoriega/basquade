import FacebookIcon from "@/components/ui/icons/facebook";
import InstagramIcon from "@/components/ui/icons/instagram";
import TwitterIcon from "@/components/ui/icons/twitter";

export default function Footer() {
  return (
    <ul className="pl-4 bg-slate-50 dark:bg-slate-900 h-12 flex flex-row items-center gap-4 border-slate-200 border-t dark:border-slate-800">
      <li>
        <a href='#' aria-label="Facebook">
          <FacebookIcon className="h-6 dark:fill-slate-50 fill-slate-900"/>
        </a>
      </li>
      <li>
        <a href='#' aria-label="Twitter">
          <TwitterIcon className="h-6 dark:fill-slate-50 fill-slate-900"/>
        </a>
      </li>
      <li>
        <a href='#' aria-label="Instagram">
          <InstagramIcon className="h-6 dark:fill-slate-50 fill-slate-900"/>
        </a>
      </li>
    </ul>
  )
}
