import React from 'react';
import './tabs.css';
import {camelToSentenceCase} from './util';

type TabsProps = { 
    justify?: 'left'|'center'|'right'|'stretch',
    size?: 'xs'|'sm'|'md'|'lg'|'xl',
    data?: any, 
    keys?: string[],
    tabStyle?: (key: string, selected: boolean) => any,
    tabContent?: (key: string) => any,
    tabContentStyle?: (key: string) => any,
    onChange?: (key: string) => void,
}

const defaults: TabsProps = {
    data: null,
    size: 'sm',
    justify: 'left',
}

const defaultStyle = {
    tab: { opacity: 0.5 },
    tabContent: { paddingTop: 0 },
    selectedTab: {
        borderBottom: 'thin solid',
        opacity: 1,
    }
}
// tabs
export default (props: TabsProps) => {
    
    const keys = props.keys ? props.keys : Object.keys(props.data);
    const [selectedKey, setSelectedKey] = React.useState(() => keys[0]);

    const handleTabSelect = React.useCallback((key: string) => {
        setSelectedKey(key);
        props.onChange && props.onChange(key);
    }, []);

    const justify = props.justify||defaults.justify;
    const size = props.size || defaults.size;
    const tabsWidth = justify === 'stretch' ? 'full-width' : ''; 
    return <>
        <div className={`flex tabs-container justify-${justify}`}>
            <div className={`row tabs ${size} ${tabsWidth}`} >
                {
                    keys.map(key => {
                        const isSelected = key === selectedKey;
                        const tabStyle = { ...(props.tabStyle ? props.tabStyle(key, isSelected) : defaultStyle.tab ) };
                        if (isSelected && !props.tabStyle) {
                            Object.assign(tabStyle, defaultStyle.selectedTab);
                        }
                        return <div key={key} className={`tab grow ${isSelected ? 'selected' : ''}`} style={{...tabStyle}} onClick={() => handleTabSelect(key)}>
                            {camelToSentenceCase(key)}
                        </div>                
                    })
                }
            </div>
        </div>

        {
            (props.tabContent || props.data) &&
            <div className="tab-content" style={{...(props.tabContentStyle ? props.tabContentStyle(selectedKey) : defaultStyle.tabContent)}}>
                {
                    props.tabContent 
                    ? props.tabContent(selectedKey)
                    : props.data[selectedKey]
                }
            </div>
        }
        
    </>
}
