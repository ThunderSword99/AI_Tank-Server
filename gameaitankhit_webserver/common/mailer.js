const nodemailer = require('nodemailer');

module.exports = (to, link) => {
    nodemailer.createTestAccount(() => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'fit.aigame.2018@gmail.com',
                pass: 'AiGame2018'
            }
        });

        let mailOptions = {
            from: 'AI Game 2018', 
            to: to, 
            subject: 'Xác minh Email', 
            html: '<a href="' + link + '">Vui lòng click vào đây để kích hoạt tài khoản</a>'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    });
}
