import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { syncUser } from "@/lib/auth-helpers";

/**
 * Get the authenticated user and ensure they exist in the database.
 * Call this at the start of every server action that needs the user.
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  // Ensure user record exists in DB
  let dbUser = await prisma.user.findUnique({
    where: { id: authUser.id },
  });

  if (!dbUser) {
    dbUser = await syncUser(authUser);
  }

  return dbUser ? { authUser, dbUser } : null;
}
