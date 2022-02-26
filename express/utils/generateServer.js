const generateMemoryUsage = (min= 1, max= 100) => {
    return parseFloat((min + Math.random() * (max - min)).toFixed(1));
};

const generateCPULoad = () => {
    return Math.round(0.5 + Math.random() * 100);
};

const generateRequestsAmount = (min= 1, max = 1000) => {
    return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

const generateMemoryLoad = (min=1, max=1000) => {
    return parseFloat((min + Math.random() * (max - min)).toFixed(1));
}

const generateLatency = () => {
    return parseFloat(Math.random().toFixed(3));
}

module.exports = {
    generateMemoryUsage,
    generateCPULoad,
    generateRequestsAmount,
    generateMemoryLoad,
    generateLatency
}