import TextUtil from '../text-util';
import colors from '../colors';

class Hud
{
  constructor(g) {
    this.g = g;
    this.textUtil = new TextUtil(g);
  }

  setText(text, subText=' ') {
    if (
      this.text && this.text.content === text &&
      this.subText && this.subText.content === subText
    ) {
      // Text is the same. No need to do anything.
      return;
    }

    if (this.text) {
      this.g.remove(this.text);
    }
    this.text = this.textUtil.centeredText(text, 24, colors.black, 0);
    if (this.subText && this.subText.content === subText) {
      return;
    }
    if (this.subText) {
      this.g.remove(this.subText);
    }
    this.subText = this.textUtil.centeredText(subText, 18, colors.black, 42);
  }

  setFooterText(text) {
    if (this.footerText && this.footerText.content === text) {
      return;
    }
    if (this.footerText) {
      this.g.remove(this.footerText);
    }
    this.footerText = this.textUtil.centeredText(text, 18, colors.black, this.g.stage.height - 32);
  }
}

export default Hud;
