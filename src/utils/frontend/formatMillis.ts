const formatMillis = (millis: number) => {
    const d = new Date(Date.UTC(0,0,0,0,0,0,millis));
    const minutes = d.getUTCMinutes()
    const seconds = d.getUTCSeconds()
    const milliseconds = d.getUTCMilliseconds()
    const result = seconds < 10
        ? milliseconds < 100
            ? milliseconds < 10
                ? `${minutes}:0${seconds}:00${milliseconds}`
                : `${minutes}:0${seconds}:0${milliseconds}`
            : `${minutes}:0${seconds}:${milliseconds}`
        : milliseconds < 100
            ? milliseconds < 10
                ? `${minutes}:${seconds}:00${milliseconds}`
                : `${minutes}:${seconds}:0${milliseconds}`
            : `${minutes}:${seconds}:${milliseconds}`
    return result
};

export default formatMillis;