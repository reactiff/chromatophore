import React, { ReactNode } from 'react';
import { ExtendedColor } from '../chromatophore';
import {camelToSentenceCase} from './util';
import './range-input.css';
import Tabs from './Tabs';

export const configurationContext = React.createContext({});

type NumberConfugurationOptions = {
    min?: number,
    max?: number,
    step?: number,
}
type SchemaPropertyValue = number|ExtendedColor;
type BaseSchemaProperty = { 
    type: 'number'|'color',
    defaultValue: SchemaPropertyValue,
    nullable?: boolean,
};
type SchemaProperty = (BaseSchemaProperty&NumberConfugurationOptions)|null; 
type SchemaPropertyIndex = { [index: string]: SchemaProperty }; 
type Schema = SchemaPropertyIndex;
type ConfigurableSectionProps = {
    schema: Schema,
    children?: any,
    theme: any,
    color: ExtendedColor,
}

export default (props: ConfigurableSectionProps) => {
    
    const { color, theme } = props;
    const colors = theme.colors;

    const [data, setData] = React.useState(() => {
        const s = props.schema;
        return Object.keys(s).reduce(
            (acc: any, key) => {
                const defaultValue = s[key]?.defaultValue;
                if (typeof defaultValue === 'undefined') return acc;
                const value = s[key]?.type === 'number' ? defaultValue as number : defaultValue;
                return Object.assign(acc, {[key]: value});
            }
        , {});
    });

    const tabs = {
        controls: <Controls {...{ data, setData, schema: props.schema, theme, color }} />,
    };

    return <div className="flex row">
        <div className="grow" style={{width: '60%', marginRight: 2}}>
            <configurationContext.Provider value={data}>
                { React.cloneElement(props.children, { config: data }) }
            </configurationContext.Provider>
        </div>
        <div style={{width: '40%', color: theme.background.contrast(7).style.color }} >
            <Controls {...{ data, setData, schema: props.schema, theme, color }} />
        </div>
    </div>
}

export type SchemaPropertyPurpose = 'amplitude'|'contrast'|'color';
export type ConfigOptions = NumberConfugurationOptions&{ nullable?: boolean }
export type ConfigFunction = (type: SchemaPropertyPurpose, defaultValue: SchemaPropertyValue, options?: ConfigOptions) => SchemaProperty|null
/**
 * Helper method for quick creation of schema properties.
 */
export const configure: ConfigFunction = (
    type: SchemaPropertyPurpose, 
    defaultValue: SchemaPropertyValue,
    options?: ConfigOptions
) => {
    switch(type) {
        case 'amplitude': 
            return { 
                type: 'number', 
                defaultValue,
                min: options?.min||-1, 
                max: options?.max||1, 
                step: options?.step||0.01,
            } as SchemaProperty;
        case 'contrast': 
            return { 
                type: 'number', 
                defaultValue,
                min: options?.min||1, 
                max: options?.max||21, 
                step: options?.step||0.1 
            } as SchemaProperty;
    }
    return null;
}

type ControlProps = { data: any, setData: (data: any) => void, schema: Schema, theme: any, color: ExtendedColor };
const Controls = (props: ControlProps) => {
    const { data, setData, schema, theme, color } = props;
    const keys = Object.keys(schema).filter(key => !!props.schema[key]);
    
    const contrast = color.desaturate(0.9).contrast(15);
    
    return <div 
        style={{ 
            backgroundColor: contrast.background.hex(),
        }}>
            { keys.map((key, index: number) => <ControlRow key={key} {...props} index={index} name={key} backgroundColor={contrast.background} />) }
    </div>
}

type ControlRowProps = ControlProps&{ name: string, index: number, backgroundColor: ExtendedColor };
const ControlRow = (props: ControlRowProps) => {
    return <div 
        style={{ 
            padding: 0, 
            borderTop: `thin solid ${props.backgroundColor.pull(0.2).hex()}` ,
            borderBottom: `thin solid ${props.backgroundColor.push(0.2).hex()}` 
        }}
        className="flex row spaced align-center" 
    >
        <small style={{width: 120, textAlign: 'right'}}>{camelToSentenceCase(props.name)}:</small>      
        <Control {...props} />
    </div>
}

const Control = (props: ControlRowProps) => {
    const schemaProperty = props.schema[props.name];
    switch(schemaProperty?.type) {
        case 'number':
            return <NumberControl {...props} />;
    }
    throw new Error('Invalid schema property type: ' + schemaProperty?.type);
}

const NumberControl = (props: ControlRowProps) => {
    const sp: SchemaProperty = props.schema[props.name];
    const {min, max, step} = sp as NumberConfugurationOptions;
    const value = props.data[props.name];
    if (!value.toFixed) {
        console.log();
    }
    const handleChange = React.useCallback((event: {target: HTMLInputElement}) => {
        setTimeout((x) => {
            props.setData((data: any) => {
                return { 
                    ...data, 
                    [props.name]: x 
                }
            })
        }, 0, parseFloat(event.target.value));
    }, []);
    return <div className="flex row grow spaced justify-center align-center" >
        <input 
            type="range" 
            {...{ min, max, step, defaultValue: value}} 
            onChange={handleChange} 
        />
        <div style={{
            textAlign: 'right', 
            width: 60,
            padding: '0px 3px',
            backgroundColor: props.backgroundColor.darken(0.3).hex(),
        }}>
            <small>
                {value.toFixed(1)}
            </small>
        </div>
    </div>
}

