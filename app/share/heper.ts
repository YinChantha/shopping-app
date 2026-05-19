import { getToken } from "./api";

export function requireAuth(router: any) {
    const token = getToken();
    if (!token) {
      router.replace("/");
    }
}