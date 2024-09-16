const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const client_id = process.env.GMAIL_CLIENT_ID;
const client_secret = process.env.GMAIL_CLIENT_SECRET;
const refresh_token = process.env.GMAIL_REFRESH_TOKEN;
const redirect_uri = process.env.REDIRECT_URI;

const oauth2client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
oauth2client.setCredentials({ refresh_token });

const sendEmail = async (options) => {
    
    console.log('refresh token: ', refresh_token);
    const accessToken = await oauth2client.getAccessToken();
    console.log('access token: ', accessToken);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: 'userauthms@gmail.com',
            clientId: client_id,
            clientSecret: client_secret,
            refreshToken: refresh_token,
            accessToken: accessToken,
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(info);
        }
    });
}

module.exports = sendEmail; 