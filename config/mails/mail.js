module.exports = {
    config: {
        host: "smtp.server.com",
        secureConnection: false,
        port: 587,
        auth: {
            user: "user@mailer.com",
            pass: "password"
        },
        tls: {
            ciphers: "SSLv3"
        }
    },
    contacts: [
        "contact@contact.com"
    ]
}