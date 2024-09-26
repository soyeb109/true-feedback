import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Text,
  Section,
  Button,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily={"Verdana"}
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap",
            format: "woff2",
          }}
          fontWeight={"400"}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your verification code</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>Here is your verification code</Text>
        </Row>
        <Row>
          <Text>{otp}</Text>
        </Row>
        <Row>
          <Text>
            If you did not request a verification code, please ignore this
            email.
          </Text>
        </Row>
        <Row>
          <Button
            href={`http://localhost:3000/verify/${username}`}
            style={{ color: "#61dafb", padding: "10px 20px" }}
          >
            Verify here
          </Button>
        </Row>
      </Section>
    </Html>
  );
}
