import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const auth = createTRPCRouter({
  authCallback: publicProcedure.query(async ({ ctx }) => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id || !user?.email) {
      return {
        unauthorized: true,
      };
    }

    const dbUser = await ctx.db.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      await ctx.db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }

    return {
      success: true,
    };
  }),
});
