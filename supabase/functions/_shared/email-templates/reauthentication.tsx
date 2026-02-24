/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="he" dir="rtl">
    <Head />
    <Preview>קוד האימות שלכם לשפי 🔐</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://awgblmeyyvrevnncfqho.supabase.co/storage/v1/object/public/email-assets/logo.png?v=1"
          alt="שפי"
          width="60"
          height="60"
          style={{ margin: '0 auto 24px', display: 'block', borderRadius: '12px' }}
        />
        <Heading style={h1}>קוד אימות 🔐</Heading>
        <Text style={text}>השתמשו בקוד הבא כדי לאמת את הזהות שלכם:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          הקוד תקף לזמן מוגבל. לא ביקשתם? אפשר להתעלם מהמייל הזה.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

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
const codeStyle = {
  fontFamily: "'Rubik', Courier, monospace",
  fontSize: '28px',
  fontWeight: '700' as const,
  color: 'hsl(0, 0%, 9%)',
  margin: '0 0 24px',
  letterSpacing: '4px',
  textAlign: 'center' as const,
  padding: '16px',
  backgroundColor: 'hsl(0, 0%, 96%)',
  borderRadius: '12px',
}
const footer = { fontSize: '13px', color: 'hsl(0, 0%, 65%)', margin: '24px 0 0' }
