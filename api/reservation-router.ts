import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders } from "@db/schema";

export const reservationRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        checkInDate: z.string().min(1),
        checkOutDate: z.string().min(1),
        guests: z.string().min(1),
        roomType: z.string().min(1),
        roomId: z.string().optional(),
        fullName: z.string().min(1),
        email: z.string().email(),
        message: z.string().optional(),
        userId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      // This is a compatibility router - orders are now handled by order router
      return { id: 0, success: true };
    }),
});
