import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);

    // console.log(result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message: "Invalid query parameters",
          errors: usernameErrors,
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerfiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerfiedUser) {
      return Response.json(
        { success: false, message: "Username already exists" },
        { status: 400 }
      );
    }
    return Response.json({ success: true, message: "Username available" });
  } catch (error) {
    console.log("Error checking username", error);
    return Response.json(
      { success: false, message: "Error checking username" },
      { status: 500 }
    );
  }
}
