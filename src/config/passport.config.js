import passport from "passport";
import local from 'passport-local'
import UserModel from "../models/user.model.js"
import GitHubStrategy from 'passport-github2'
import { createHash, isValidPassword } from "../utils.js";
import jwt from 'passport-jwt'
import passportGoogle from 'passport-google-oauth20'

const JWTStrategy = jwt.Strategy // La estrategia de JWT
const ExtractJWT = jwt.ExtractJwt // La funcion de extraccion


const cookieExtractor = req => {
    const token = (req?.cookies) ? req.cookies['coderCookie'] : null

    console.log('COOKIE EXTRACTOR: ', token)
    return token
}


const initializePassport = () => {

    passport.use(
        'jwt',
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
                secretOrKey: 'coderTokenForJWT'
            },
            async (jwt_payload, done) => {

                try {
                    return done(null, jwt_payload)
                } catch (e) {
                    return done(e)
                }
            })
    )



    /*
        App ID: 377939
    
    Client ID: Iv1.d73b35cdba36e500
    
    secret 33805847d0d2ff9e2ededbca26d8cfb8f876a485
    
    * google */



    var GoogleStrategy = passportGoogle.Strategy;

    const GOOGLE_CLIENT_ID = '609516804216-3nioo3vq0d1vmtaq6o8itqnsusugu0om.apps.googleusercontent.com'
    const GOOGLE_CLIENT_SECRET = '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'



    passport.use('google', new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:8080/callback-google"
    },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile)
            const email = profile.emails[0].value
            const name = profile.displayName

            const user = await UserModel.findOne({ email })
            if (user) {
                console.log('Already exits')
                return done(null, user)
            }

            const result = await UserModel.create({ email, name, password: '' });

            return done(null, result)

        }

    ));

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })

    /*locall */
    const LocalStrategy = local.Strategy




    // register Es el nomber para Registrar con Local
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            const { name, email } = req.body
            try {
                const user = await UserModel.findOne({ email: username })
                if (user) {
                    console.log('User already exits')
                    return done(null, false)
                }

                const newUser = {
                    name,
                    email,
                    password: createHash(password)
                }
                const result = await UserModel.create(newUser)
                return done(null, result)
            } catch (e) {
                return done('Error to register ' + error)
            }
        }
    ))

    // login Es el nomber para IniciarSesion con Local
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ email: username }).lean().exec()
                if (!user) {
                    console.error('User doesnt exist')
                    return done(null, false)
                }

                if (!isValidPassword(user, password)) {
                    console.error('Password not valid')
                    return done(null, false)
                }

                return done(null, user)
            } catch (e) {
                return done('Error login ' + error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })





    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.Iv1.d73b35cdba36e500',
            clientSecret: '33805847d0d2ff9e2ededbca26d8cfb8f876a485',
            callbackURL: 'http://localhost:8080/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile)

            try {
                const user = await UserModel.findOne({ email: profile._json.email })
                if (user) {
                    console.log('User already exits ' + email)
                    return done(null, user)
                }

                const newUser = {
                    name: profile._json.name,
                    email: profile._json.email,
                    password: ''
                }
                const result = await UserModel.create(newUser)
                return done(null, result)
            } catch (e) {
                return done('Error to login wuth github' + e)
            }
        }
    ))

    // register Es el nomber para Registrar con Local
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            const { name, email } = req.body
            try {
                const user = await UserModel.findOne({ email: username })
                if (user) {
                    console.log('User already exits')
                    return done(null, false)
                }

                const newUser = {
                    name,
                    email,
                    password: createHash(password)
                }
                const result = await UserModel.create(newUser)
                return done(null, result)
            } catch (e) {
                return done('Error to register ' + error)
            }
        }
    ))

    // login Es el nomber para IniciarSesion con Local
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ email: username }).lean().exec()
                if (!user) {
                    console.error('User doesnt exist')
                    return done(null, false)
                }

                if (!isValidPassword(user, password)) {
                    console.error('Password not valid')
                    return done(null, false)
                }

                return done(null, user)
            } catch (e) {
                return done('Error login ' + error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })

}

export default initializePassport