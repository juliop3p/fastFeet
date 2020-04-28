export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
  },
  default: {
    from: 'Equipe FastFeet <noreply@fastfeet.com>',
  },
};
