import nodemailer from "nodemailer"
import config from "./variables";

const transporterConfig = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

export default transporterConfig