type Info = {
  title: string;
  author: string;
};

export default function BookInfo({ title, author }: Info) {
  return (
    <div className="inline-block">
      <p className="overflow-hidden text-ellipsis text-nowrap font-medium">{title}</p>
      <p className="font-light">{author}</p>
    </div>
  );
}
