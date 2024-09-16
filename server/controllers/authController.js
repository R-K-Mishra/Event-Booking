const User = require('../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const { OAuth2Client } = require('google-auth-library');
const bucket = require('../utils/initializeFirebase');
const dateConvertor = require('../utils/dateConvertor');
const uploadImageToStorage = require('../utils/uploadToFirebase');

const client = new OAuth2Client();

let errors = {
    username : "",
    email : "",
    password : "",
    token: "",
};

const clearErrors = () => {
    errors = {
        username : "",
        email : "",
        password : "",
        token: "",
    };
}

const signup = async (req, res) => {

    const { fname, lname, username, email, password, dob, imgUrl, token, client_id, authMode } = req.body;

    const usernameAlreadyExists = await User.findOne({ username });
    const emailAlreadyExists = await User.findOne({ email });

    clearErrors();

    if(usernameAlreadyExists){
        errors.username = "Username Already Exists!";
        return res.status(401).json({ errors });
    }

    if(emailAlreadyExists){
        errors.email = "Email Already Exists!";
        return res.status(401).json({ errors });
    }

    if(authMode === 'Email'){

        if(!password){
            errors.password = "Please provide a password for email register";
            res.status(401).json({ errors });
        }
        else{
            
            const salt = await bcrypt.genSalt(10);

            const hashed = await bcrypt.hash(password, salt);
 
            const user = new User({
                fname, lname, username, email, password : hashed, dob, authModes: ['Email']
            });
            
            const verificationToken = crypto.randomBytes(20).toString('hex');

            user.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

            user.emailVerificationExpire = Date.now() + (24 * 60 * 60 * 1000);

            await user.save();

            const createdUser = await User.findOne({ email });

            const defaultUserImg = process.env.DEFAULT_USER_IMGURL;

            const image = await uploadImageToStorage(defaultUserImg, `users/${createdUser._id}/profilePicture`);

            createdUser.imgUrl = image;

            await createdUser.save();

            const verificationUrl = `${process.env.CLIENT_DOMAIN}/auth/email-verification?token=${verificationToken}`;

            const message = `
                <h2> Thank You for registering with us! </h2>
                <p> Please click the below button to verify your email </p>
                <button> <a href=${verificationUrl} clicktracking=off> Verify Email </a> </button>
            `

            await sendEmail({
                from: 'userauthms@gmail.com',
                to: email,
                subject: 'Email Verification',
                html: message
            });

            console.log('Email Sent');

            res.status(200).json({ 
                "message" : "Successfully Registered"
            });
        }
    }
    else{
        if(authMode === 'Google'){

            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: client_id,  // Specify the CLIENT_ID of the app that accesses the backend
                // Or, if multiple clients access the backend:
                //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
            });
            const payload = ticket.getPayload();
            const userId = payload['sub'];

            if(!userId){
                errors.email = 'Invalid user';
                return res.status(401).json({ errors });
            }

            const user = new User({
                fname, username, email, dob, imgUrl, isVerified: true, authModes: ['Google']
            });

            await user.save();

            const createdUser = await User.findOne({ email });

            const image = await uploadImageToStorage(imgUrl, `users/${createdUser._id}/profilePicture`);

            createdUser.imgUrl = image;

            await createdUser.save();

            const eventsUrl = `${process.env.CLIENT_DOMAIN}/events`;

            const message = `
                <h2> Welcome to Ticketvibe! </h2>
                <p> Have a look at our events <a href=${eventsUrl}>here</a>. </p>
            `

            await sendEmail({
                from: 'userauthms@gmail.com',
                to: email,
                subject: 'Welcome',
                html: message
            });

            console.log('Email Sent');

            res.status(200).json({ 
                "message" : "Successfully Registered"
            });

        }
    }
    
}

const emailVerification = async (req, res) => {

    const { token } = req.query;

    const emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        emailVerificationToken,
        emailVerificationExpire: { $gt: Date.now() }
    });

    clearErrors();

    if(!user){
        errors.token = 'Invalid Verification Token';
        return res.status(404).json({ errors });
    }
    if(!user.authModes.includes('Email')){
        errors.token = `Your account doesn't have this signin method`;
        return res.status(401).json({ errors });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;

    await user.save();

    const eventsUrl = `${process.env.CLIENT_DOMAIN}/events`;

    const message = `
        <h2> Welcome to Ticketvibe! </h2>
        <p> Have a look at our events <a href=${eventsUrl}>here</a>. </p>
    `

    await sendEmail({
        from: 'userauthms@gmail.com',
        to: user.email,
        subject: 'Welcome',
        html: message
    });

    console.log('Email Sent');

    res.status(200).json({ 
        "message" : "Successfully Registered"
    });

}

const signin = async (req, res) => {

    const { authMode, usernameOrEmail, password, authToken, client_id } = req.body;

    clearErrors();

    const usernameExists = await User.findOne({ username : usernameOrEmail });
    const emailExists = await User.findOne({ email : usernameOrEmail });

    if(!usernameExists && !emailExists){
        errors.username = "Username or Email not found!";
        return res.status(404).json({ errors });
    }
    let user;
    let hashPassword;
    
    if(authMode === 'Email'){

        if(usernameExists){
            user = usernameExists;
            if(!usernameExists.isVerified){
                errors.username = 'Please Verify your Email first';
                return res.status(401).json({ errors });
            }
            if(!usernameExists.authModes.includes('Email')){
                errors.username = 'Your account has a different signin method';
                return res.status(401).json({ errors });
            }
            hashPassword = usernameExists.password;
        }
        if(emailExists){
            user = emailExists;
            if(!emailExists.isVerified){
                errors.username = 'Please Verify your Email first';
                return res.status(401).json({ errors });
            }
            if(!emailExists.authModes.includes('Email')){
                errors.username = 'Your account has a different signin method';
                return res.status(401).json({ errors });
            }
            hashPassword = emailExists.password;
        }

        const auth = await bcrypt.compare(password, hashPassword);
        if(!auth){
            errors.password = "Incorrect Password!";
            return res.status(401).json({ errors });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        // user._id = undefined;
        user.password = undefined;

        await user.populate({
            path: 'events.booked events.organized events.saved',
            model: 'event',
            select: 'title start end reg_start reg_end venue description images rating tags'
        });

        const resetUrl = `${process.env.CLIENT_DOMAIN}/auth/forgot-password`;

        const message = `
            <p> A new login was detected at ${dateConvertor(Date.now())}. If it's you, safely ignore this message otherwise immediately change your password <a href=${resetUrl}>here</a>. </p>
        `;

        await sendEmail({
            from: 'userauthms@gmail.com',
            to: user.email,
            subject: 'New Login Detected',
            html: message
        });

        res.status(200).json({ token, user });

    }
    else{

        if(authMode === 'Google'){

            const ticket = await client.verifyIdToken({
                idToken: authToken,
                audience: client_id,  // Specify the CLIENT_ID of the app that accesses the backend
                // Or, if multiple clients access the backend:
                //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
            });
            const payload = ticket.getPayload();
            const userId = payload['sub'];

            if(!userId){
                errors.email = 'Invalid user';
                return res.status(401).json({ errors });
            }

            if(usernameExists){
                user = usernameExists;
                if(!usernameExists.authModes.includes('Google')){
                    errors.username = 'Your account has a different signin method';
                    return res.status(401).json({ errors });
                }
            }
            if(emailExists){
                user = emailExists;
                if(!emailExists.authModes.includes('Google')){
                    errors.username = 'Your account has a different signin method';
                    return res.status(401).json({ errors });
                }
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '24h'
            });
    
            await user.populate({
                path: 'events.booked events.organized events.saved',
                model: 'event',
                select: 'title start end reg_start reg_end venue description images rating tags'
            });

            const resetUrl = `${process.env.CLIENT_DOMAIN}/auth/forgot-password`;

            const message = `
                <p> A new login was detected at ${dateConvertor(Date.now())} in your local timezone. If it's you, safely ignore this message otherwise immediately change your password at <a href=${resetUrl}>here</a>. </p>
            `;

            await sendEmail({
                from: 'userauthms@gmail.com',
                to: user.email,
                subject: 'New Login Detected',
                html: message
            });
    
            res.status(200).json({ token, user });

        }
    }
}

const forgotPassword = async (req, res) => {

    const { email } = req.body;

    const user = await User.findOne({ email });

    clearErrors();

    if(!user){
        errors.email = 'Email not found';
        return res.status(404).json({ errors });
    }
    if(!user.authModes.includes('Email')){
        errors.email = `Your account doesn't have this signin method`;
        return res.status(401).json({ errors });
    }

    const resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetPasswordToken).digest('hex');
    user.resetPasswordExpire = Date.now() + (10 * 60 * 1000);

    await user.save();

    const resetPasswordUrl = `${process.env.CLIENT_DOMAIN}/auth/reset-password?token=${resetPasswordToken}`;

    const message = `
        <h2> You requested a password reset </h2>
        <h2> Click on this button to reset your password </h2>
        <button> <a href=${resetPasswordUrl}> Reset Password </a> </button> 
        <p> This link is valid for only 10 mins, after that it will expire. </p> 
    `;

    await sendEmail({
        from : "userauthms@gmail.com",
        to : email,
        subject : "Password Reset",
        html : message
    });
     
    res.status(200).json({
        "message" : "Email Sent"
    });

}

const resetPassword = async (req, res) => {
    
    const { password } = req.body;

    const { resetToken } = req.query;

    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    clearErrors();

    if(!user){
        errors.token = 'Invalid Token';
        return res.status(401).json({ errors });
    }
    if(!user.authModes.includes('Email')){
        errors.token = `Your account doesn't have this signin method`;
        return res.status(401).json({ errors });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        "message" : "Password Updated Successfully"
    });

}

const userDetails = async (req, res) => {

    const user = req.user;

    user.password = undefined;

    await user.populate({
        path: 'events.booked events.organized events.saved',
        model: 'event',
        select: 'title start end reg_start reg_end venue description images rating tags'
    });

    res.status(201).json({ user });

}

const deleteAccount = async (req, res) => {

    const userId = req.user._id;

    const user = await User.findOne({ _id: userId });

    if(user){
        user.events.booked.forEach(async (eventId) => {
            const event = await Event.findOne({ _id: eventId });
            const index = event.bookedBy.indexOf(userId);
            if (index !== -1) {
                event.bookedBy.splice(index, 1);
            }
        });
        user.events.organized.forEach(async (eventId) => {
            const [eventFiles] = await bucket.getFiles({ prefix: `events/${eventId}` });
            await Promise.all(eventFiles.map(file => file.delete()));
            await Event.findByIdAndDelete(eventId);
        });
    }

    const [files] = await bucket.getFiles({ prefix: `users/${userId}` });
    await Promise.all(files.map(file => file.delete()));

    await User.findByIdAndDelete(userId);

    res.status(200).json({
        "message" : "Account Deleted Successfully"
    });
}

module.exports = {
    signup,
    emailVerification,
    signin,
    forgotPassword,
    resetPassword,
    userDetails,
    deleteAccount
}