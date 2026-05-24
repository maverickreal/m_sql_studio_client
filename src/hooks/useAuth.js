import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearSession } from "../features/auth/authSlice";
import { authClient } from "../services/authClient";
export function useAuth() {
    const dispatch = useDispatch();
    useEffect(() => {
        let cancelled = false;
        authClient
            .getSession()
            .then((session) => {
            if (cancelled)
                return;
            if (session?.data?.user) {
                const user = session.data.user;
                dispatch(setUser({
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role ?? null,
                    image: user.image ?? null,
                }));
            }
            else {
                dispatch(clearSession());
            }
        })
            .catch(() => {
            if (!cancelled)
                dispatch(clearSession());
        });
        return () => {
            cancelled = true;
        };
    }, [dispatch]);
}
