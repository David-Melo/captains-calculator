export const capitalizeWord = (value: string): string => {
    if (typeof value !== 'string') return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export const capitalizeWords = (input: string): string => {
    let oldStrArr = input.split(' ');
    let newStrArr = oldStrArr.map((str)=>{
        str = str.toLowerCase();
        return str.charAt(0).toUpperCase() + str.slice(1);
    });
    return newStrArr.join(' ');    
}

export const pluralizeWord = (word: string, count: number): string => {
    return count > 1 ? `${word}s` : word;
}

type OptionalField = string | undefined | null

export const formatAddress = (address: OptionalField, city: OptionalField, state: OptionalField, zip: OptionalField): string => {
    return `${address ? `${address},` : ''} ${city ? `${city},` : ''} ${state ? `${state}` : ''} ${zip ? `${zip}` : ''}`
}

export const formatSnakeCase = (value: string): string => {
    return value  
        .split('_')  
        .map((word) => {  
            return capitalizeWord(word);  
        })  
        .join(' ');
}