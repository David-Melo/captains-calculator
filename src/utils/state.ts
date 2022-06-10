export const mapArrayToStateObject = (array: any, key: string) => {
    return array.reduce((map: any, item: any)=>{
        let index = item[key];
        return {...map, [index]: item};
    },{});
}