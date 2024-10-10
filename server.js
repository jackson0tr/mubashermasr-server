const express = require('express')
const app = express()
const dotenv = require('dotenv')
const body_parser = require('body-parser')
const cors = require('cors')
const { RateLimiterMemory } = require('rate-limiter-flexible');
const db_connect = require('./utils/db')
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const winston = require('winston');

dotenv.config()
app.use(body_parser.json())

// const rateLimiter = new RateLimiterMemory({
//     points: 100,
//     duration: 15 * 60 
// });
// const logger = winston.createLogger({
//     level: 'info', 
//     format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.json() 
//     ),
//     transports: [
//         new winston.transports.Console(), 
//         new winston.transports.File({ filename: 'error.log', level: 'error' }),
//         new winston.transports.File({ filename: 'combined.log' })
//     ]
// });
if(process.env.mode === 'production'){
    app.use(cors())
}else{
    app.use(cors({
        origin: ["http://localhost:3000", "https://mubashermasr.vercel.app"]
    }))
}

// const allowedOrigins = ["http://localhost:3000", "https://mubashermasr.vercel.app", "https://mubashermasr.com"];
// const corsOptions = {
//     origin: (origin, callback) => {
//         if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     }
// };
// app.use(cors(corsOptions));
// app.use(helmet());
// app.use(compression());
// app.use((req, res, next) => {
//     rateLimiter.consume(req.ip) 
//         .then(() => {
//             next(); 
//         })
//         .catch(() => {
//             res.status(429).send('Too Many Requests');
//         });
// });
// app.use(morgan('combined', {
//     stream: {
//         write: (message) => logger.info(message.trim())
//     }
// }));
app.use('/', require('./routes/authRoutes'))
app.use('/', require('./routes/newsRoute'))
app.use('/', require('./routes/categoryRoute'))
app.get('/', (req, res) => res.send('Hello World!'))

const port = process.env.port;
db_connect()

app.listen(port, () => console.log(`server is running on port ${port}!`))