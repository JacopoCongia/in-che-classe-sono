import { AutoTextSize } from "auto-text-size";

interface Text {
  line: string;
  color?: string;
  marginTop?: string;
}

function BoxOfText({ texts, boxWidth }: { texts: Text[]; boxWidth: number }) {
  const textElements = texts.map((text, index) => (
    <div
      key={index}
      className="w-full uppercase"
      style={{ color: text.color, marginTop: text.marginTop }}
    >
      <AutoTextSize
        mode="oneline"
        minFontSizePx={10}
        maxFontSizePx={120}
      >
        {text.line}
      </AutoTextSize>
    </div>
  ));

  return (
    <div
      className="leading-none text-center font-bold text-[#3D2B1F]"
      style={{
        width: `${boxWidth}px`,
      }}
    >
      {textElements}
    </div>
  );
}

export default BoxOfText;
