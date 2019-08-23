export default function colors(ctrl) {
  const { ctx } = ctrl;
  const { unit, width, height } = ctrl.data.game;

  const vignetteGradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    height);

  vignetteGradient.addColorStop(0, 'hsla(0, 0%, 20%, 0.5)');
  vignetteGradient.addColorStop(1, 'hsla(0, 0%, 0%, 0.5)');


  const heroGradientSize = unit;
  const heroGradient = ctx.createRadialGradient(
    heroGradientSize / 2,
    heroGradientSize / 2,
    0,
    heroGradientSize / 2,
    heroGradientSize / 2,
    heroGradientSize / 2);
  heroGradient.addColorStop(0, 'hsla(0, 0%, 100%, 0.4)');
  heroGradient.addColorStop(1, 'hsla(0, 0%, 100%, 0)');
  
  return {
    vignetteGradient,
    heroGradient,
    heroGradientSize
  };
}
