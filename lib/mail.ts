import nodemailer from 'nodemailer';

interface SendWelcomeEmailParams {
  to: string;
  name: string;
}

export async function sendWelcomeEmail({ to, name }: SendWelcomeEmailParams) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        }
    });

    const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background: linear-gradient(90deg, #4b6cb7 0%, #182848 100%); padding: 20px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 24px;">Welcome to Startify, ${name}!</h1>
            </div>

            <div style="padding: 30px; background: #fff;">
                <p style="font-size: 16px; line-height: 1.5;">
                Hi <strong>${name}</strong>,<br/><br/>
                We're thrilled to have you on board! Your journey to sharing and discovering amazing SaaS ideas starts now.
                </p>

                <p style="font-size: 16px; line-height: 1.5;">
                If you have any questions or need help, just reply to this email or visit our <a href="https://yourapp.com/help" style="color: #4b6cb7; text-decoration: none;">Help Center</a>.
                </p>

                <div style="text-align: center; margin: 40px 0;">
                    <a href=${process.env.NEXTAPP_BASE_URL} 
                        style="
                        background-color: #4b6cb7; 
                        color: white; 
                        padding: 12px 25px; 
                        border-radius: 5px; 
                        font-weight: 600; 
                        text-decoration: none;
                        display: inline-block;
                        ">
                        Get Started
                    </a>
                </div>

                <p style="font-size: 14px; color: #666;">
                by soufian,<br/>
                The Startify Team
                </p>
            </div>

            <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                © 2025 Startify. All rights reserved.
            </div>
        </div>
    </div>
    `;

    await transporter.sendMail({
        from: `"Startify Team" <${process.env.SMTP_USER}>`,
        to,
        subject: "Welcome to Startify! 🚀",
        html: htmlContent,
    });
}
