import Slime from './Slime';

class Key
{
  constructor(g, index, controlKey) {
    this.g = g;
    this.highlightFrames = null;
    this.drawKey(index, controlKey)
    this.initSlime();
  }

  /**
   * Abstracts
   *
   * getFill() {}
   * getStroke() {}
   * getKeyX(index) {}
   * getKeyY() {}
   * getLabelX(index) {}
   * getLabelY() {}
   * getTextColor() {}
   * getWidth() {}
   * getHeight() {}
   */

  onCorrectNote(onDone=()=>{}) {
    this.slime.jump(() => {
      this.slime.improveMood();
      onDone()
    });
  }

  onWrongNote() {
    this.slime.shake(() => {
      this.slime.worsenMood();
    });
  }

  getLabelY() {
    return this.sprite.y + this.getHeight() - 20;
  }

  drawKey(index, controlKey)
  {
    this.sprite = this.g.rectangle(
      this.getWidth(),
      this.getHeight(),
      this.getFill(),
      this.getStroke(),
      2
    );
    this.sprite.x = this.getKeyX(index);
    this.sprite.y = this.getKeyY();

    this.text = this.g.text(
      controlKey,
      '16px monospace',
      this.getTextColor(),
      this.getLabelX(),
      this.getLabelY()
    );
  }

  initSlime() {
    this.slime = new Slime(this.g, this.sprite);
  }

  highlight(color, time) {
    this.sprite.fillStyle = color;
    if (time) {
      this.highlightFrames = time * this.g.fps;
    }
  }

  update() {
    if (this.highlightFrames === 0) {
      this.sprite.fillStyle = this.getFill();
      this.highlightFrames = null;
    } else if (this.highlightFrames) {
      this.highlightFrames -= 1;
    }
    this.slime.update();
  }
}

export default Key;
