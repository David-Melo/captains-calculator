const colors = {
    debug: 'aqua',
    info: 'lime',
    warn: 'yellow',
    error: 'red'
}

const parseMessage = (message: string): string => {
    let ts = new Date()
    return `[${ts.getHours()}:${ts.getMinutes()}:${ts.getSeconds()}:${ts.getMilliseconds()}] ${message}`;
}

const logger = (message: string, data: any = undefined, level: 'debug' | 'info' | 'warn' | 'error' = 'debug', table: boolean = false): void => {   
    let color = colors[level];
    let msg = parseMessage(message);
    switch (level) {
        case 'warn':
            console.warn(`%c${msg}`, `color: ${color}`);
            break;
        case 'error':
            console.error(`%c${msg}`, `color: ${color}`);
            break;
        default:
            console.log(`%c${msg}`, `color: ${color}`);
            break;
    }
    if (data!==undefined) {
        if (table) {
            console.table(data)
        } else {
            console.log(data)
        }
    }
}

export default logger;