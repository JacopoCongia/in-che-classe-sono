import { AutoTextSize } from "auto-text-size";

interface Text {
  line: string | null;
  color?: string;
  marginTop?: string;
}

function BoxOfText({
  texts,
  boxWidth,
  bold,
}: {
  texts: Text[];
  boxWidth: number;
  bold?: boolean;
}) {
  const textElements = texts.map((text, index) => (
    <div
      key={index}
      className="w-full uppercase"
      style={{ color: text.color, marginTop: text.marginTop }}
    >
      <AutoTextSize mode="oneline" minFontSizePx={10} maxFontSizePx={120}>
        {text.line}
      </AutoTextSize>
    </div>
  ));

  return (
    <div
      className="text-center leading-none text-[#3D2B1F]"
      style={{
        width: `${boxWidth}px`,
        fontWeight: `${bold ? "bold" : ""}`,
      }}
    >
      {textElements}
    </div>
  );
}

export default BoxOfText;
