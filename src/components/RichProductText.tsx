import { Fragment, ReactNode } from "react";

const renderInline = (text: string): ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*)/g).map((segment, index) =>
    segment.startsWith("**") && segment.endsWith("**")
      ? <strong key={index}>{segment.slice(2, -2)}</strong>
      : <Fragment key={index}>{segment}</Fragment>,
  );

export function RichProductName({ name }: { name: string }) {
  return <>{renderInline(name.replace(/\s+/g, " ").trim())}</>;
}

export default function RichProductText({ text }: { text: string }) {
  const lines = text.replace(/\r/g, "").split("\n").map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return null;

  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={`list-${blocks.length}`}>
        {list.map((item, index) => <li key={index}>{renderInline(item)}</li>)}
      </ul>,
    );
    list = [];
  };

  lines.forEach((line) => {
    if (/^[-•]\s+/.test(line)) {
      list.push(line.replace(/^[-•]\s+/, ""));
      return;
    }
    flushList();
    if (/^#{1,3}\s+/.test(line)) {
      blocks.push(<h3 key={`heading-${blocks.length}`}>{renderInline(line.replace(/^#{1,3}\s+/, ""))}</h3>);
    } else {
      blocks.push(<p key={`paragraph-${blocks.length}`}>{renderInline(line)}</p>);
    }
  });
  flushList();

  return <div className="rich-product-text">{blocks}</div>;
}
