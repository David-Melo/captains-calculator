import { GenericDictionary } from "state/_types";

export const isObject = (item: any) => {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

export const mergeDeep = (target: { [index: string]: any }, ...sources: any): object => {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, {
                    [key]: {}
                });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, {
                    [key]: source[key]
                });
            }
        }
    }

    return mergeDeep(target, ...sources);
}


export const changeNullPropsDeep = (source: GenericDictionary, target: GenericDictionary = {}): object => {
    
    if (isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, {
                    [key]: {}
                });
                target[key] = changeNullPropsDeep(target[key], source[key]);
            } else {
                Object.assign(target, {
                    [key]: source[key] !== null ? source[key]: undefined
                });
            }
        }
    }

    return target;
}