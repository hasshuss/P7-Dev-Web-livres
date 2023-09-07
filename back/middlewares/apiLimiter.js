const nodemailer = require('nodemailer');
const rateLimit = require("express-rate-limit");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password'
    }
});

function sendEmailNotification(subject, text, ipAddress) {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'destination-email@gmail.com',
        subject: subject,
        text: `${text} IP Address: ${ipAddress}`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function createRateLimiterPerXmin(minutes, nbRequest) {
    return rateLimit({
        windowMs: minutes * 60 * 1000,
        max: nbRequest,
        handler: function(req, res, next) {
            const ipAddress = req.ip;
            sendEmailNotification('Trop de requêtes envoyées depuis cette adresse IP :', ipAddress);
            res.status(429).send('Trop de requêtes envoyées depuis cette adresse IP. Veuillez réessayer plus tard.');
        }
    });
}

const limiter100Per15min = createRateLimiterPerXmin(15, 100);
const limiter50Per15min = createRateLimiterPerXmin(15, 50);
const limiter5PerMin = createRateLimiterPerXmin(5, 1);

module.exports = {
    createRateLimiterPerXmin,
    limiter100Per15min,
    limiter50Per15min,
    limiter5PerMin
};