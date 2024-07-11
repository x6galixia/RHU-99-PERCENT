const LocalStrategy = require('passport-local').Strategy
const { pool } = require('./models/localdb') // Adjust according to your DB connection

function initialize(passport) {
    const authenticateUser = async (username, password, done) => {
        try {
            const result = await pool.query('SELECT * FROM users WHERE username = $1', [username])
            const user = result.rows[0]

            if (!user) {
                return done(null, false, { message: 'No user with that username' })
            }

            if (password === user.password) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }

        } catch (err) {
            return done(err)
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.user_id))
    passport.deserializeUser(async (id, done) => {
        try {
            const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id])
            const user = result.rows[0]
            done(null, user)
        } catch (err) {
            done(err, null)
        }
    });
}

module.exports = initialize;
