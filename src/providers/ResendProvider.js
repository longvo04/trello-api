import { Resend } from 'resend'
import { env } from '~/config/environment'
const resend = new Resend(env.RESEND_API_KEY)

const ADMIN_SENDER_EMAIL = 'onboarding@resend.dev'

const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = await resend.emails.send({
      from: ADMIN_SENDER_EMAIL,
      to,
      subject,
      html
    })
    return data
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export const ResendProvider = {
  sendEmail
}