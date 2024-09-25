import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "Message cannot be empty")
    .max(1000, "Message cannot be longer than 1000 characters"),
});
