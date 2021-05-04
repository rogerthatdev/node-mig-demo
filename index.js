const express = require('express')
const app = express();
const http = require('http')
const hostname = require('os').hostname();
let healthy = true;
let working = false;
const port = 80

class CpuBurner {
    constructor() {
        this.toggle = false;
    }
    start() {
        this.toggle = true;
        return
    }
    stop() {
        this.toggle = false;
        return
    }
}
const cpuBurn = new CpuBurner();
function getZone() {
    const options = {
        hostname: 'http://metadata.google.internal',
        path: 'computeMetadata/v1/instance/zone',
        port: 80,
        method: 'GET',
        headers: {
            'Metadata-Flavor': 'Google'
        }
    }
    // const req = http.request(options, res =>{
    //     console.log(`statusCode: ${res.statusCode}`)
    //     res.on('data', d=>{
    //         process.stdout.write(d)
    //     })
    // })
    // req.write(data)
    // req.end()
    return "ZONE"
}

app.set('view engine', 'jade')
app.set('views', './views')
app.listen(port, () => {
    console.log(`listening to port ${port}`);
})
app.get('/health', async (req, res) => {
    if (healthy) {
        res.status(200);
    } else {
        res.status(500);
    }
    res.render('health', { healthy: healthy })
})
app.get('/', async (req, res) => {
    let zone
    res.render('index', {
        hostname: hostname, 
        zone: getZone(), 
        healthy: healthy, 
        working: working 
    })
    res.status(200)
})
app.get('/startLoad', async (req, res) => {
    working = true;
    res.render('index', {
        hostname: hostname,
        zone: getZone(),
        healthy: healthy,
        working: working
    })
    cpuBurn.start();
})
app.get('/stopLoad', async (req, res) => {
    working = false;
    res.render('index', {
        hostname: hostname,
        zone: getZone(),
        healthy: healthy,
        working: working
    })
    cpuBurn.stop();
})
app.get('/makeUnhealthy', async (req, res) => {
    healthy = false;
    res.render('index', {
        hostname: hostname,
        zone: getZone(),
        healthy: healthy,
        working: working
    })
})
app.get('/makeHealthy', async (req, res) => {
    healthy = true;
    res.render('index', {
        hostname: hostname,
        zone: getZone(),
        healthy: healthy,
        working: working
    })
})

