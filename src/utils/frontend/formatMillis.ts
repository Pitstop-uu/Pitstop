const formatMillis = (millis: number) => {
    const d = new Date(Date.UTC(0,0,0,0,0,0,millis));
    const minutes = d.getUTCMinutes()
    const seconds = d.getUTCSeconds()
    const milliseconds = d.getUTCMilliseconds()
    const result = seconds < 10
        ? milliseconds < 100
            ? milliseconds < 10
                ? `0${minutes}:0${seconds}:00${milliseconds}`
                : `0${minutes}:0${seconds}:0${milliseconds}`
            : `0${minutes}:0${seconds}:${milliseconds}`
        : milliseconds < 100
            ? milliseconds < 10
                ? `0${minutes}:${seconds}:00${milliseconds}`
                : `0${minutes}:${seconds}:0${milliseconds}`
            : `0${minutes}:${seconds}:${milliseconds}`
    return result
};

export default formatMillis;