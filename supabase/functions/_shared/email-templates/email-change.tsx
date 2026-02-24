/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  email,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="he" dir="rtl">
    <Head />
    <Preview>אישור שינוי כתובת מייל בשפי 📧</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://awgblmeyyvrevnncfqho.supabase.co/storage/v1/object/public/email-assets/logo.png?v=1"
          alt="שפי"
          width="60"
          height="60"
          style={{ margin: '0 auto 24px', display: 'block', borderRadius: '12px' }}
        />
        <Heading style={h1}>שינוי כתובת מייל 📧</Heading>
        <Text style={text}>
          ביקשתם לשנות את כתובת המייל שלכם מ-{email} ל-{newEmail}.
        </Text>
        <Text style={text}>
          לחצו על הכפתור למטה כדי לאשר:
        </Text>
        <Button style={button} href={confirmationUrl}>
          אישור השינוי
        </Button>
        <Text style={footer}>
          לא ביקשתם את השינוי? מומלץ לאבטח את החשבון שלכם מיד.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Rubik', Arial, sans-serif" }
const container = { padding: '32px 24px', maxWidth: '420px', margin: '0 auto', textAlign: 'right' as const }
const h1 = {
  fontSize: '22px',
  fontWeight: '600' as const,
  color: 'hsl(0, 0%, 9%)',
  margin: '0 0 16px',
}
const text = {
  fontSize: '15px',
  color: 'hsl(0, 0%, 45%)',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const button = {
  backgroundColor: 'hsl(0, 0%, 9%)',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '500' as const,
  borderRadius: '12px',
  padding: '14px 28px',
  textDecoration: 'none',
  display: 'block',
  textAlign: 'center' as const,
  margin: '0 0 24px',
}
const footer = { fontSize: '13px', color: 'hsl(0, 0%, 65%)', margin: '24px 0 0' }
