import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";

const VerifyQuerySchema = z.object({
  verifyCode: verifySchema,
});

export async function POST(request: Request) {
  await dbConnect();

  const body = await request.json();

  // Validate with zod
  const result = VerifyQuerySchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      {
        success: false,
        message: "Invalid request data",
        errors: result.error.errors,
      },
      { status: 400 }
    );
  }
  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({
      username: decodedUsername,
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid || isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User verified",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Code has expired",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Error verifying user", error);

    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      {
        status: 500,
      }
    );
  }
}
