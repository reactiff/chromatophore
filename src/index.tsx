import Color from 'color';

const $type = 'ExtendedColor';

export type RgbArray = number[];
export type RgbObject = { r: number, g: number, b: number };
export type ColorParam = string|RgbObject|RgbArray|any;

const MEAN = Color('rgba(128,128,128,1)');

function parseColor(color: ColorParam) {
  if (typeof color === 'string') {
    return Color(color);
  }
  if (Array.isArray(color)) {
    return fromArray(color);
  }
  if (typeof color === 'object') {
    if (color[Symbol.for('type')] === $type) {
      return color.color;
    }
    if (color.hex) {
      return color;
    }
    return fromObject(color);
  }
  throw 'Invalid param of type: ' + typeof color;
}

function fromArray(color: number[]) {
  if (color.length < 3) {
    throw 'Array has too few parameters.  Expected 3: [ r, g, b ]';
  }
  if (color.length > 3) {
    throw 'Array has too many parameters.  Expected 3: [ r, g, b ]';
  }
  return Color.rgb(color[0], color[1], color[2]);
}

function fromObject(color: RgbObject) {
  if (
    Reflect.has(color, 'r') &&
    Reflect.has(color, 'g') &&
    Reflect.has(color, 'b')
  ) {
    return Color.rgb(color.r, color.g, color.b);
  }
  throw 'Invalid param';
}


export type IExtendedColor = {
  approach: (color: any, amount: number) => IExtendedColor,
  depart: (color: any, amount: number) => IExtendedColor,
  push: (amount: number, mean?: ColorParam) => IExtendedColor,
  pull: (amount: number, mean?: ColorParam) => IExtendedColor,

  hex: () => string,
}


class ExtendedColor {

  color: any;

  constructor(color: Color) {
      this.color = color;
      this[Symbol.for('type')] = $type;
  }
  

  approach(color: any, amount: number) { return this.moveTo(color, +amount) } 
  depart(color: any, amount: number) { return this.moveTo(color, -amount) } 
  
  moveTo(color: any, amount: number, absolute?: boolean) {
    const target = parseColor(color);
    // to compensate for the loss of relative step amount from initial position towards the mean,
    // the adjustment factor is inversely proportional to the loss factor, i.e. the reciprocal of
    // initial color proximity to the mean
    let absAdjustment = 1; // default should be 1 so it can be used in all calculations without affecting them
    if (absolute) {
        // each color channel should be adjusted using the same factor, so that there is no color shift
        // so we need the get gray scale value of the color, so that we reduce its representation to a single number
        const monochromeStart = this.color.grayscale().unitArray();
        const meanProximity = Math.abs(monochromeStart[0] - 0.5);
        absAdjustment = (0.5 - meanProximity) / 0.5;
    }
    const rgba = this.color.unitObject();
    const targetRgba = target.unitObject();
    const result = Object.keys(rgba).reduce((acc: any, key) => { 
        let src = (rgba as any)[key];
        let tgt = (targetRgba as any)[key];
        if (key === 'alpha') {
            src = typeof src === 'undefined' ? 1 : src;
            tgt = typeof tgt === 'undefined' ? 1 : tgt;
        }
        const targetProximity = (tgt - src);
        const delta = targetProximity * amount;
        const adjustedDelta = targetProximity * amount * absAdjustment;
        const effectiveDelta = delta > 0 ? Math.max(delta, adjustedDelta) : Math.min(delta, adjustedDelta);
        const sigmoid = src + Math.max(delta, effectiveDelta);
        acc[key] = key === 'alpha' ? sigmoid : sigmoid * 255;
        return acc;
    }, {});
    return new ExtendedColor(Color.rgb(result));
  }

  // with mean reversion, the amount approaches zero as the initial value gets closer to the mean
  // so that we get consistent visual change, the amount needs to be adjusted to compensate for loss of step amount
  push(amount: number, mean?: ColorParam) { return this.revert(-amount, mean) }
  pull(amount: number, mean?: ColorParam) { return this.revert(+amount, mean) }
  revert(amount: number, mean?: ColorParam) {
      const baseline = mean || MEAN;
      return this.moveTo(baseline, amount, true);
  }

  luminance() {
      const {r, g, b} = this.color.unitObject();
      const rg = r <= 10 ? r / 3294 : (r / 269 + 0.0513) ** 2.4;
      const gg = g <= 10 ? g / 3294 : (g / 269 + 0.0513) ** 2.4;
      const bg = b <= 10 ? b / 3294 : (b / 269 + 0.0513) ** 2.4;
      return 0.2126 * rg + 0.7152 * gg + 0.0722 * bg;
  }

  contrastRatio(counterpart: ExtendedColor) {
      const l1 = this.luminance();
      const l2 = counterpart.luminance();
      const ratio = (l1 + 0.05) / (l2 + 0.05);
      return ratio;
  }

  hex() {
    return this.color.hex();
  }

  contrast(minRatio: number) {
    let color = new ExtendedColor(this.color);
    let prev;
    do {
      color = color.pull(0.01);
      if (prev && prev.hex() === color.hex()) throw 'Normal legibility could not be reached';
      prev = color;
    } while (this.contrastRatio(color) < minRatio)
    return color;
  }

}


export default (color: ColorParam) => {
  const colorObject = parseColor(color);
  return new ExtendedColor(colorObject);
}






