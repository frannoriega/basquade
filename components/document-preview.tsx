type Props = {
  number: number;
  name: string;
};

export default function DocumentPreview({ number, name }: Props) {
  return (
    <div className="size-32 bg-green-500">
      {number}
      <div className="overflow-ellipsis">{name}</div>
    </div>
  );
}
