import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
      const userRole = cookieStore.get("userRole")?.value || "USER";
        const userName = cookieStore.get("userName")?.value || "";

          if (!userId) return null;

            return {
                userId,
                    role: userRole,
                        name: userName,
                          };
                          }

                          export async function setSession(userId: string, role: string, name: string) {
                            const cookieStore = await cookies();
                              cookieStore.set("userId", userId, { httpOnly: true, secure: true, path: "/" });
                                cookieStore.set("userRole", role, { httpOnly: true, secure: true, path: "/" });
                                  cookieStore.set("userName", name, { httpOnly: true, secure: true, path: "/" });
                                  }

                                  export async function destroySession() {
                                    const cookieStore = await cookies();
                                      cookieStore.delete("userId");
                                        cookieStore.delete("userRole");
                                          cookieStore.delete("userName");
                                          }