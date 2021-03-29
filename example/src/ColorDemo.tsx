import React, { useContext, useMemo } from 'react'
// import chromatophore from 'react-chromatophore';
import chromatophore, {ExtendedColor} from './chromatophore';
import {camelToSentenceCase} from './components/util';

import Tabs from './components/Tabs';
import ConfigurableSection, {configure, configurationContext} from './components/ConfigurableSection';
import { LoremIpsum } from "lorem-ipsum";
const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

const ColorDemo = (props: { theme: any, color: ExtendedColor }) => {
    const { theme, color } = props;
    return <section style={{ borderTop: `1px solid ${color.hex()}`}}>
        <ConfigurableSection 
            theme={theme}
            color={color}
            schema={{ 
                background: configure('amplitude', -0.1),
                contrast: configure('contrast', 3),
            }}
        >
            <Section1 {...props} />
        </ConfigurableSection>
    </section>
    
}

export default ColorDemo;

const Section1 = (props: any) => {
    const { theme, color } = props;
    const config = useContext(configurationContext);
    const contrast = color.desaturate(0.8).contrast(15);
    return <div style={{ 
            backgroundColor: contrast.background.opacity(0.5).hex(),
            color: contrast.foreground.hex(),
            padding: 16, 
            borderRadius: 0 
    }}>
        {/* <h1>{ camelToSentenceCase(props.color.name) } color manipulation</h1> */}
        <h1>Manipulation tests</h1>
        
        <ColorFunctionTest description="BG pull(0.1)" color={theme.background} fn={(color: ExtendedColor) => color.pull(0.01) } />
        <ColorFunctionTest description="BG pull(0.3)" color={theme.background} fn={(color: ExtendedColor) => color.pull(0.03) } />
        <ColorFunctionTest description="BG pull(0.5)" color={theme.background} fn={(color: ExtendedColor) => color.pull(0.05) } />
        <ColorFunctionTest description="BG pull(0.5)" color={theme.background} fn={(color: ExtendedColor) => color.pull(0.1) } />
        <ColorFunctionTest description="BG pull()" color={theme.background} fn={(color: ExtendedColor) => color.pull(0.3) } />

        <ColorFunctionTest description="BG push(0.1)" color={theme.background} fn={(color: ExtendedColor) => color.push(0.01) } />
        <ColorFunctionTest description="BG push(0.3)" color={theme.background} fn={(color: ExtendedColor) => color.push(0.03) } />
        <ColorFunctionTest description="BG push(0.5)" color={theme.background} fn={(color: ExtendedColor) => color.push(0.05) } />
        <ColorFunctionTest description="BG push()" color={theme.background} fn={(color: ExtendedColor) => color.push() } />

    </div>
}

const ColorFunctionTest = (props: any) => {

    const { color, fn } = props;

    const result = fn(color);
    const resultColor = result.foreground ? result.foreground : result;

    const style = {
        ...(result.style ? result.style : { backgroundColor: resultColor.hex() })
    }

    return <div className="flex row" style={props.color.contrast(3).style}>
        <div style={{width: '40%'}}>
            {props.description}
        </div>
        <div style={{width: '60%'}}>
            <div className="flex row spaced">
                <div className="grow">{color.rgbString()}</div>
                <div className="grow">{resultColor.rgbString()}</div>
                <div style={{ backgroundColor: resultColor.hex() , width: 20, height: 20 }} />
            </div>
        </div>
    </div>
}