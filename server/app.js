require('dotenv').config();

const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
    // Fork workers based on the number of CPU cores
    const numCPUs = os.cpus().length;
  
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  
    // Handle worker death and respawn
    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died. Restarting...`);
      cluster.fork();
    });
} 
else {

    const express = require('express');
    const mongoose = require('mongoose');
    const compression = require('compression');

    const authRoutes = require('./routes/authRoutes'); 
    const eventRoutes = require('./routes/eventRoutes'); 

    const cors = require('cors');

    const app = express();

    app.use(express.json());
    app.use(compression());
    app.use(cors());

    app.use(
        cors({
            origin: process.env.CLIENT_DOMAIN,
            credentials: true,
        })
    );

    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            app.listen(process.env.PORT, () => {
                console.log(`Connected to db and listening on port ${process.env.PORT}`);
            });
        })
        .catch((err) => {
            console.log(`Error connecting to DB: ${err}`);
        })

    app.use((req, res, next) => {
        res.setHeader(
            "Access-Control-Allow-Origin",
            process.env.CLIENT_DOMAIN
        );
        res.header(
            "Access-Control-Allow-Origin",
            "Origin,X-Requested-With,Content-Type,Accept",
            "Access-Control-Allow-Methods: GET, DELETE, PUT, PATCH, HEAD, OPTIONS, POST"
        );
        next();
    });

    app.get('/', (req, res) => {
        const url = process.env.CLIENT_DOMAIN;
        res.send(`<a href=${url}>${url}</a>`);
    });

    app.use('/auth', authRoutes);

    app.use('/events', eventRoutes);

}