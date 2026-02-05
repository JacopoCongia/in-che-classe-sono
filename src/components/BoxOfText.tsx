import { AutoTextSize } from "auto-text-size";
import type { BoxOfTextProps } from "../types";

function BoxOfText({
  texts,
  boxWidth,
  bold,
}: BoxOfTextProps) {
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
      className="leading-none text-center text-[#3D2B1F]"
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
