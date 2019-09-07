class TextUtil {
  constructor(g) {
    this.g = g;
  }

  centeredTexts(strings, size, color, y, spacing) {
    const g = this.g;
    const letterSpacing = size * 0.2;
    let xAdjustment = strings.length === 1
      ? strings[0].length
      : strings.reduce((text, acc) => text.length > acc.length ? text.length : acc.length);

    const texts = strings.map(
      (text, index) => g.text(
        text,
        `${size}px monospace`,
        color,
        g.stage.halfWidth - ((xAdjustment / 2) * ((size + letterSpacing) / 2)),
        y + (spacing * index)
      )
    );

    return texts;
  }

  centeredText(string, size, color, y) {
    const letterSpacing = size * 0.2;
    const g = this.g
    const text = g.text(
      string,
      `${size}px monospace`,
      color,
      g.stage.halfWidth - ((string.length / 2) * ((size + letterSpacing) / 2)),
      y
    );

    return text;
  }
}

export default TextUtil;
