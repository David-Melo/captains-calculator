import dayjs from "dayjs"
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

export const formatDate = (date: string | null | undefined, format: string = 'MM/DD/YYYY'): string => {
    if (!date) return ''
    return dayjs(date).format(format)
}

export const getDurationDays = (start: string, end: string, string: boolean = false, unit: 'day' | 'month' | 'hour' | 'minute' = 'day') => {
    let duration = dayjs(end).diff(dayjs(start),unit)
    return !string ? duration.toString() : `${duration} ${unit}${duration>1?'s':''}` 
}

export const formatDuration = (duration: string | number | null | undefined, unit: 'day' | 'month' | 'hour' | 'minute' = 'day') => {
    if (duration===null) return '0';
    if (duration===undefined) return '0';
    let durationInt = typeof duration === 'string' ? parseInt(duration) : duration;
    let suffix = durationInt > 1 || durationInt === 0 ? `${unit}s` : `${unit}`
    return `${duration} ${suffix}`
}

export const generateHours = (): {label: string, value: string}[] => {
    var items = []
    var hours, minutes, ampm;
    for (var i = 420; i <= 1440; i += 60) {
        hours = Math.floor(i / 60);
        minutes = i % 60;
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        let hour24 = hours
        let hour24String = ''
        if (hour24 < 10) {
            hour24String = '0' + hour24;
        } else {
            hour24String = hour24.toString()
        }
        ampm = hours % 24 < 12 ? 'AM' : 'PM';
        hours = hours % 12;
        if (hours === 0) {
            hours = 12;
        }
        items.push({
            value: `${hour24String}:00:00`,
            label: hours + ':' + minutes + ' ' + ampm
        });
    }
    return items;
}

export const formatHour = (hour24: string) => {
    if (!hour24) return ''
    let hours = generateHours();
    return hours.reduce((hour,item)=>{
        if (hour24===item.value) {
            return item.label
        }
        return hour
    },'')
}