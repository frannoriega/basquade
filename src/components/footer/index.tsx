import FacebookIcon from "@/components/ui/icons/facebook";
import InstagramIcon from "@/components/ui/icons/instagram";
import TwitterIcon from "@/components/ui/icons/twitter";

export default function Footer() {
  return (
    <div className="w-full border-gray-200 dark:border-gray-800 border-t">
      <div className="w-full flex flex-row items-center justify-between px-8">
        <ul className="bg-gray-50 dark:bg-gray-950 h-12 flex flex-row items-center gap-4">
          <li>
            <a href='#' aria-label="Facebook">
              <FacebookIcon className="h-6 dark:fill-gray-50 fill-gray-900"/>
            </a>
          </li>
          <li>
            <a href='#' aria-label="Twitter">
              <TwitterIcon className="h-6 dark:fill-gray-50 fill-gray-900"/>
            </a>
          </li>
          <li>
            <a href='#' aria-label="Instagram">
              <InstagramIcon className="h-6 dark:fill-gray-50 fill-gray-900"/>
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
