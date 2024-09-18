import FacebookIcon from "./facebook-icon";
import InstagramIcon from "./instagram-icon";
import TwitterIcon from "./twitter-icon";

export default function Footer() {
  return (
    <ul className="pl-4 bg-green-200 dark:bg-slate-900 h-12 flex flex-row items-center gap-4">
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
