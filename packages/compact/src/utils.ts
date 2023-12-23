export const capitalizeWord = (string: string) => {
    return string[0].toUpperCase() + string.slice(1);
};
export const capitalizeHeaders = (headers: { [x: string]: string }) => {
    return Object.keys(headers).reduce((acc, key) => ({ ...acc, [capitalizeWord(key)]: headers[key] }), {});
};