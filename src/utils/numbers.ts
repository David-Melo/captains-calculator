export const decimalToPercentage = (value: number): string => {
    return ( Math.round( ( ( value * 100 ) + Number.EPSILON ) * 100 ) / 100 ).toString() + '%'
}