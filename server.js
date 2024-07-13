const express = require('express');
const app = express();
const pool = require('./models/localdb');
const citizenPool = require('./models/citizendb');
const path = require('path');
const passport = require('passport');
require('dotenv').config();
const cors = require('cors');
const session = require('express-session');
const flash = require('express-flash');
const initializePassport = require('./passportConfig');

//--> routes
const loginRouter = require('./routes/login');
const scannerRouter = require('./routes/qrcode-scanner');
const nurseRouter = require('./routes/nurse');
const doctorRouter = require('./routes/doctor');
const medtechRouter = require('./routes/medtech');
const pharmacyRouter = require('./routes/pharmacy');

pool.connect()
    .then(() => console.log('Connected to database'))
    .catch(err => console.error('Error connecting to database:', err));

citizenPool.connect()
    .then(() => console.log('Connected to citizen database'))
    .catch(err => console.error('Error connecting to citizen database:', err));

initializePassport(passport);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(cors());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());

app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

//---> initialize router
app.use('/', loginRouter);
app.use('/', scannerRouter);
app.use('/', nurseRouter);
app.use('/', doctorRouter);
app.use('/', medtechRouter);
app.use('/', pharmacyRouter);

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is up and running on port ${process.env.PORT}`);
});
//backend galicia, frontend garcia designer ui/ux alde, lovina, catalo