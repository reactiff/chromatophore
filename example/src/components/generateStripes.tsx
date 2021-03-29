export type ColorPortion = { color: string, parts?: number };
export type ColorNameOrPortion = string|ColorPortion;

interface ParsedColor { color: string, parts: number };

export type GradientOptionsType = {
    type?: 'linear-gradient' | 'radial-gradient' | 'repeating-linear-gradient' | 'repeating-radial-gradient',
    angle?: number,
    size?: any,
    colors?: ColorNameOrPortion[],
    segments?: string[],
};

const defaultProps = {
    type: 'linear-gradient',
    angle: 90,
};


export default (params: GradientOptionsType, merge?: any) => {

    const { type, angle, segments } = params;
    const colors = params.colors ? params.colors.map((c: ColorNameOrPortion) => parseColor(c)) : [];

    const partCount: number = colors.reduce((total: number, c: ParsedColor) => (+total) + c.parts, 0);
    const steps = partCount * 2;
    
    const step = 100 / steps;

    const colorCount = colors.length;
    const n = colorCount * 2;

    const outSegments: string[] = [];
    let distance = 0;
    
    for (let i = 0; i < n; i++) {
        const index = i % colorCount;
        const nextIndex = (i + 1) % colorCount;
        distance += step * colors[index].parts;
        outSegments.push(colors[index].color + ' ' + distance.toFixed(2) + '%');
        if (i < n - 1) {
            outSegments.push(colors[nextIndex].color + ' ' + distance.toFixed(2) + '%');
        }
    }

    const size = params.size || steps;
    const num = parseInt(size);

    const styleProps = {
        backgroundImage: (merge ? merge.backgroundImage + ',' : '') +
            `${type||defaultProps.type}(${angle}deg, ${outSegments.join(', ')})`,
        backgroundSize: !isNaN(num) ? `${num.toFixed(2)}px ${num.toFixed(2)}px` : size,
    };

    return styleProps;
}

function colorFromString(color: string) {
    const tokens = color.split(' ');
    if (tokens.length === 1) return { color: tokens[0], parts: 1 };
    if (tokens.length === 2) return { color: tokens[0], parts: +tokens[1] };
    throw new Error('Max number of color tokens expected is 2');
}
function parseColor(color: ColorNameOrPortion) {
    if (typeof color == 'string') return colorFromString(color);
    return color as ParsedColor;
}
