'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECOND = 5000


//* count Connection
const countConnect = () => {
    const numConnections = mongoose.connections.length
    console.log('numConnections:', numConnections)
    return ''
}

//* check over load
const checkOverload = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss
        // ? Example maxium number of connections based on number of cores
        const maxConnections = numCores * 5;

        console.log(`Active connections: ${numConnections}`)
        console.log(`Memory usage: ${memoryUsage/ 1024 / 1024} MB`)

        if(numConnections > maxConnections){
            console.log('Connection overload detected')
        }
    }, _SECOND) //* Monitor every 5 seconds
}

module.exports = {
    countConnect
}