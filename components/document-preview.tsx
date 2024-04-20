type Props = {
  number: number;
};

export default function DocumentPreview({ number }: Props) {
  return <div className="size-32 bg-green-500">{number}</div>;
}
