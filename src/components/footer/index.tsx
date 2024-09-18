import Facebook from "@/assets/icons/social/facebook.svg";
import Twitter from "@/assets/icons/social/twitter.svg";
import Instagram from "@/assets/icons/social/instagram.svg";

export default function Footer() {
  return (
    <ul className="pl-4 bg-green-200 dark:bg-slate-900 h-12 flex flex-row items-center gap-4">
      <li>
        <a href='#'>
          <Facebook className="h-6"/>
        </a>
      </li>
      <li>
        <a href='#'>
          <Twitter className="h-6"/>
        </a>
      </li>
      <li>
        <a href='#'>
          <Instagram className="h-6"/>
        </a>
      </li>
    </ul>
  )
}
