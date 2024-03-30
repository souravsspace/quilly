import z from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const user = createTRPCRouter({
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId, db } = ctx;

    const dbFiles = await db.file.findMany({
      where: {
        userId,
      },
    });

    return dbFiles;
  }),
  deleteFile: privateProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const { userId, db } = ctx;

      const dbFiles = await db.file.findUnique({
        where: {
          id,
          userId,
        },
      });

      if (!dbFiles) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      await db.file.delete({
        where: {
          id,
          userId,
        },
      });

      return {
        success: true,
      };
    }),
  getFiles: privateProcedure
    .input(
      z.object({
        key: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { key } = input;
      const { userId, db } = ctx;

      const dbFiles = await db.file.findFirst({
        where: {
          key,
          userId,
        },
      });

      if (!dbFiles) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return dbFiles;
    }),
});
