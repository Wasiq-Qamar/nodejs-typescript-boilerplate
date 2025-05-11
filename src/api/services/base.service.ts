import {google} from 'googleapis';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import {config} from '../../config';
import {AppContext} from '../../interface';
const OAuth2 = google.auth.OAuth2;

class BaseService {
  protected dbSession: mongoose.mongo.ClientSession;
  protected context: AppContext;

  constructor(context: AppContext, dbSession: mongoose.mongo.ClientSession) {
    this.context = context;
    this.dbSession = dbSession;
  }

  public async sendEmail(data: {
    email: string;
    subject: string;
    textContent: string;
    htmlContent: string;
    attachements?: any;
  }): Promise<void> {
    const {
      mail: {fromMailId, clientId, clientSecret, refreshToken},
    } = config;

    const oauth2Client = new OAuth2(clientId, clientSecret);

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject('Failed to create access token');
        }
        resolve(token);
      });
    });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: fromMailId,
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: accessToken,
      },
    } as nodemailer.TransportOptions);

    const mailOptions = {
      from: fromMailId,
      to: data.email,
      subject: data.subject,
      text: data.textContent,
      html: data.htmlContent,
      attachments: data.attachements,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        this.context.logger.error('Error while sending email', error);
        return error;
      } else {
        console.log('Email sent: ' + info.response);
        return info.response;
      }
    });
  }
}

export {BaseService};
