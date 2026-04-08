import Contact from '../models/Contact.js';
import nodemailer from 'nodemailer';

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    console.log('Creating transporter with:', {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS ? '****' + process.env.SMTP_PASS.slice(-4) : 'not set'
    });
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return transporter;
};

export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const contact = new Contact({
      name,
      email,
      message
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const replyToContact = async (req, res) => {
  try {
    const { to, name, replyMessage } = req.body;

    if (!to || !replyMessage) {
      return res.status(400).json({
        success: false,
        message: 'Email and message are required'
      });
    }

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: to,
        subject: `Re: CompileHub Contact - ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">CompileHub</h1>
            </div>
            <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <p style="color: #374151; margin: 0 0 20px;">Hi ${name},</p>
              <p style="color: #374151; white-space: pre-wrap;">${replyMessage}</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Best regards,<br />
                <strong>CompileHub Team</strong>
              </p>
            </div>
          </div>
        `
      };

      await getTransporter().sendMail(mailOptions);
    } else {
      console.log('Email would be sent to:', to);
      console.log('Message:', replyMessage);
    }

    await Contact.findOneAndUpdate(
      { email: to },
      { isReplied: true }
    );

    res.status(200).json({
      success: true,
      message: 'Reply marked as sent!'
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send reply'
    });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: contacts,
      count: contacts.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Marked as read',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
