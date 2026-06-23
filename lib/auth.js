import { cookies } from "next/headers";

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("ravtron_session")?.value;
    if (!sessionCookie) return null;
    return JSON.parse(decodeURIComponent(sessionCookie));
  } catch (error) {
    console.error("Error retrieving user session:", error);
    return null;
  }
}

export async function verifyAdmin() {
  const session = await getSession();
  return session && session.role === "Administrator";
}

export async function verifyUser(email) {
  const session = await getSession();
  if (!session) return false;
  if (session.role === "Administrator") return true;
  return session.email && session.email.toLowerCase() === email.toLowerCase();
}
