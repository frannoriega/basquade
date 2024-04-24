type Info = {
  title: string;
  author: string;
}

export default function BookInfo({ title, author }: Info) {
  return (
    <div className="inline-block">
    <p className="font-medium overflow-hidden text-ellipsis text-nowrap">{title}</p>
    <p className="font-light">{author}</p>
    </div>
  )
}
