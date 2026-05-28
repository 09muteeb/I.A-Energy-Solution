import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { contacts } from "@db/schema";

export const contactRouter = createRouter({
  submit: publicQuery
    .input(
      z.object({
        fullName: z.string().min(2),
        email: z.string().email(),
        phone: z.string().optional(),
        subject: z.string().min(1),
        message: z.string().min(10),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      
      // FIX: PostgreSQL uses .returning() to get inserted ID
      const result = await db.insert(contacts).values({
        fullName: input.fullName,
        email: input.email,
        phone: input.phone ?? null,
        subject: input.subject,
        message: input.message,
      }).returning({ id: contacts.id });
      
      return { success: true, id: result[0].id };
    }),
});