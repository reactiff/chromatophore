import React, { useMemo, useState } from 'react'
// import chromatophore from 'react-chromatophore';
import chromatophore, { ExtendedColor, createScheme } from './chromatophore';
import Tabs from './components/Tabs';
import './app.css';
import ColorDemo from './ColorDemo';
import generateStripes from './components/generateStripes';

import { Popover } from 'react-tiny-popover'

import './react-color.css';
import { ChromePicker, HuePicker } from 'react-color';

import { LoremIpsum } from "lorem-ipsum";
const lorem = new LoremIpsum({
  sentencesPerParagraph: { max: 5, min: 4 },
  wordsPerSentence: { max: 10, min: 4 }
});

const App = () => {
  
  const defaultBase: ExtendedColor = chromatophore('#192546');
  const defaultPrimary: ExtendedColor = chromatophore('#8BB3FF');

  const [baseColor, setBaseColor] = useState(() => defaultBase);
  const [primaryColor, setPrimaryColor] = useState(() => defaultPrimary);
  const [selectedColor, setSelectedColor] = useState(defaultBase);
 
  const [backgroundColorPickerOpen, setBackgroundColorPickerOpen] = useState(false);
  const [foregroundColorPickerOpen, setForegroundColorPickerOpen] = useState(false);

  const additionalColors = {
    background: baseColor,
    cyan: chromatophore('#00ffff'),
    magenta: chromatophore('#ff00ff'),
    yellow: chromatophore('#ffff00'),
    black: chromatophore('#000000'),
    white: chromatophore('#ffffff'),
  };

  const theme = {
    base: baseColor,
    background: baseColor,
    colors: {
      ...createScheme('tetradicRect', primaryColor, additionalColors)
    },
    setBaseColor,
    setPrimaryColor,
  }

  const gridLines = baseColor.pull(0.03);
  const grid = generateStripes({ 
      angle: 90,
      colors: [`transparent 15`, `${gridLines.hex()} 1`], 
      size: 17,
    }, generateStripes({ 
      angle: 0,
      colors: [`transparent 15`, `${gridLines.hex()} 1`], 
      size: 17,
    })
  );


  const contrast = {
    section: theme.background.contrast(10),
    header: theme.colors.black.contrast(21),
  }

  const containerTextColor = theme.background.pull(0.5).hex();
  const style = {
    background: {
      backgroundColor: theme.background.hex(),
      ...grid,
    },
    container: {
      color: containerTextColor,
    },
    header: {
      backgroundColor: contrast.header.background.darken(0.1).hex(),
      color: contrast.header.foreground.hex(),
    },
    nav: {},
    content: {},
    article: {},
    section: {},
    aside: {
      color: theme.background.pull().hex()
    },
    sideMenu: {},
    footer: {},
    blockQuote: {
      borderLeft: `10px solid ${theme.colors.default.hex()}`,
      paddingLeft: 8
    },
  };


  const handlePickBackgroundColor = (pickedColor: any) => {
    setBaseColor(chromatophore(pickedColor.hex));
  }

  const handlePickForegroundColor = (pickedColor: any) => {
    setPrimaryColor(chromatophore(pickedColor.hex));
  }

  const toggleBackgroundColorPicker = () => {
    setBackgroundColorPickerOpen((x: boolean) => !x);
    setForegroundColorPickerOpen(false);
  };
  const toggleForegroundColorPicker = () => {
    setForegroundColorPickerOpen((x: boolean) => !x);
    setBackgroundColorPickerOpen(false);
  };

  return <div className="background" style={style.background}>

    <header style={style.header}>
      <div className="container">
        <div className="flex row spaced align-start">
          <div>
            <svg fill={theme.colors.primary.hex()} height="45" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M845.952 815.648c-54.144-41.44-1.792-161.312-76-235.52a126.016 126.016 0 0 0-84.128-41.6 265.6 265.6 0 0 1 34.336-105.408 281.6 281.6 0 0 0 32.608-128.384 240.768 240.768 0 1 0-481.536 0 281.6 281.6 0 0 0 32.608 128.384 265.6 265.6 0 0 1 34.336 105.408 126.016 126.016 0 0 0-84.128 41.6c-74.208 74.208-21.856 194.08-76 235.52-39.456 30.208-60 30.4-50.144 54.4 7.392 18.144 51.2 41.6 117.344-7.808 72.128-53.76 48.736-140.96 89.824-182.048a62.752 62.752 0 0 1 45.344-16c-10.912 49.216-5.888 91.712-18.88 152.128-19.456 90.432-78.432 114.24-38.592 139.936 25.056 16 88.928-21.248 128.832-107.616 26.176-56.64 24.608-88.512 60.224-122.592 35.616 34.08 34.048 65.984 60.224 122.592 39.904 86.4 103.776 123.744 128.832 107.616 39.84-25.6-19.2-49.472-38.592-139.936-12.992-60.416-7.968-102.912-18.88-152.128a62.752 62.752 0 0 1 45.344 16c41.088 41.088 17.696 128.288 89.824 182.048 66.176 49.344 109.92 25.952 117.344 7.808 9.856-24-10.656-24.192-50.144-54.4z" fill="" />
            </svg>
          </div>
          <div className="grow">
            <h1>react-chromatophore</h1>
            <p>One Theme | All Modes</p>
          </div>
        </div>      
      </div>
    </header>
    
    <div className="container" style={style.container} >
      
      <div className="content" style={style.content}>

        {/* Theme colors */}
        <section 
          style={{ 
            
            color: contrast.section.foreground.hex(),
            padding: 16, 
            paddingTop: 0, 
            borderRadius: 0,
            borderLeft: `thin solid ${selectedColor.darken(0.3).hex()}`
          }}>
            <div className="flex row spaced" style={{width: '100%'}}>

              <div className="grow" style={{marginRight: 16}}>
                <h1>1. Theme</h1>
                <p style={{
                  padding: '5px 10px',
                  backgroundColor: contrast.section.background.opacity(0.3).hex()
                }}>
                  {React.useMemo(() => lorem.generateParagraphs(1), [])}
                </p>
              </div>

              <ColorPicker {...{
                caption: 'Background',
                isOpen: backgroundColorPickerOpen,
                color: baseColor,
                handler: handlePickBackgroundColor,
                toggler: toggleBackgroundColorPicker
              }} />

              <ColorPicker {...{
                caption: 'Primary',
                isOpen: foregroundColorPickerOpen,
                color: primaryColor,
                handler: handlePickForegroundColor,
                toggler: toggleForegroundColorPicker
              }} />

            </div>
           
        </section>
        

        <section style={{ 
            // backgroundColor: contrast.section.background.opacity(0.3).hex(),
            color: contrast.section.foreground.hex(),
            padding: 0, 
            borderRadius: 0,
            borderLeft: `thin solid ${selectedColor.darken(0.3).hex()}`
          }}>
          <Tabs 
            justify="center"
            keys={'background,primary,secondary,default,alert,danger'.split(',')}
            tabStyle={(key: string, selected: boolean) => {
              return { 
                transitionProperty: 'padding, margin',
                transitionDuration: '0.1s',
                transitionTimingFunction: 'linear',
                padding: '8px 10px 8px 10px', 
                marginTop: 4,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                opacity: 1,
                ...(
                  selected 
                  ? { ...theme.colors[key].contrast(7).style, padding: '10px 10px 10px 10px', marginTop: 0, } 
                  : { ...theme.colors[key].desaturate(0.7).darken(0.7).contrast(7).style }
                )
              }
            }} 
            onChange={(key: string) => setSelectedColor(theme.colors[key])}
          />
        </section>

        <ColorDemo theme={theme} color={selectedColor} />


      </div>
      <footer style={style.footer}></footer>
    </div>
  </div>
}

export default App



const ColorPicker = (props: { caption: string, isOpen: boolean, color: ExtendedColor, handler: (x: any) => void, toggler: (x: any) => void }) => (
  <div className="column">
    <small>{props.caption}</small>
    <Popover
      isOpen={props.isOpen}
      positions={['bottom']} // preferred positions by priority
      content={
        <div className="color-picker-popup" style={{
          padding: '8px 16px 16px 16px',
          width: 200,
          backgroundColor: props.color.darken(0.9).opacity(0.98).hex(),
          color: props.color.contrast(15).style.color,
          borderRadius: 5,
        }}>
          <small>Select new {props.caption} color</small>
          <ChromePicker color={props.color.hex()} onChange={props.handler} />
          <HuePicker color={props.color.hex()} onChange={props.handler} /> 
        </div>
      }
    >
      <div 
        style={{
          marginTop: 8,
          marginBottom: 8,
          backgroundColor: props.color.hex(),
          border: `2px solid ${props.color.pull(0.5).hex()}`,
          borderRadius: 4,
          width: 80,
          height: 80,
        }} 
        onClick={props.toggler}
      />
    </Popover>
    <small>
      {props.color.hex()}
    </small>
  </div>
);
