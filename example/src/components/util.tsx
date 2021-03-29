export function camelToSentenceCase (string: string) { 
    if(!string) return string; 
    const tokens = string.replace(/([A-Z]+)/g, " $1").trim().split(' '); 
    return tokens.filter(t=>t && t.length).map(token => { 
        const trimmed = token.trim(); 
        return trimmed[0].toUpperCase() + trimmed.substring(1); 
    }).join(' '); 
}