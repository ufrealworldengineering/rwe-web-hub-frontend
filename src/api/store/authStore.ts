import { create } from 'zustand';
import { persist } from 'zustand/middleware';


//the four roles that exist in backend
export type UserRole = 'president' | 'treasurer' |'program_manager' | 'member';

export interface User{ 
    name: string;
    email: string;
    role: UserRole;
    first_name: string | null;
    last_name: string | null;
    
}

interface AuthState {
    user: User | null;
    token: string | null;
    refreshTokenValue: string | null;
    isAuthenticated: boolean;
    role: UserRole | null;
    login:(email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshToken: () => Promise<void>;
    checkAuth: () => void;
}

const API_Base = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

//refresh 5 min before expiration so the user doesn't get kicked mid session 
const REFRESH_BUFFER_MS=5 * 60 * 1000;

let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

//decode JWT, figore out when it expires, and set a timer to refresh before that
function scheduleRefresh(token:string, refreshFn: () => Promise<void>) {
    if (refreshTimeout) clearTimeout(refreshTimeout);
  try{ 
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiresAt = payload.exp * 1000; // convert to ms
    const delay= Math.max(expiresAt - REFRESH_BUFFER_MS, 0);
    refreshTimeout = setTimeout(refreshFn, delay);

  } catch(error) {
    // if we can't decode it just try agin in 15 min
    refreshTimeout = setTimeout(refreshFn, 15 * 60 * 1000);
  }
        
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            refreshTokenValue: null,
            isAuthenticated: false,
            role: null,
             //!!backend doesn't have POST /api/auth/login yet so this will error until its added
            login: async (email: string, password: string) => {
                const res= await fetch(`${API_Base}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }, body: JSON.stringify({email, password}),
                });

                if (!res.ok) {
                    const error=await res.json().catch(()=>({}));
                    throw new Error(error.detail ?? 'Login failed');
                }

                const data= await res.json() as { 
                    access_token: string;
                    refresh_token: string;
                    user: User;

                };

                set({ 
                    token: data.access_token,
                    refreshTokenValue: data.refresh_token,
                    user: data.user,
                    role: data.user.role,
                    isAuthenticated: true,
                }); 

                scheduleRefresh(data.access_token, get().refreshToken);
            },
            logout: () => {
                if (refreshTimeout) clearTimeout(refreshTimeout);
                set({
                    user: null,
                    token: null,
                    refreshTokenValue: null,
                    isAuthenticated: false,
                    role: null,
                });
            }, 
            //!!backend doesn't have POST /api/auth/refresh yet so this will error until its added
            refreshToken: async () => {
                const {refreshTokenValue} = get();
                if (!refreshTokenValue) {
                    get().logout(); 
                    return;
                }

                try { 
                    const res = await fetch(`${API_Base}/api/auth/refresh`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({refresh_token: refreshTokenValue}),
                    });

                    if (!res.ok) {
                        get().logout();
                        return;
                    }
                    const data = await res.json() as {
                        access_token: string;
                        refresh_token: string;
                    };
                    set({
                        token: data.access_token,
                        refreshTokenValue: data.refresh_token,
                    });
                    scheduleRefresh(data.access_token, get().refreshToken);
                } catch (error) {
                    get().logout();
                }
                },

        // call this on app mount, picks up any saved session fromm localStroage
        //also rechdules the refresh timer if we have a valid token
            checkAuth: () => {
                const {token, isAuthenticated,refreshToken} = get();
                if (!isAuthenticated || !token) return;
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const isExpired = payload.exp * 1000 < Date.now();

                    if (isExpired) {
                        void refreshToken();//try to get a new token right away 
                    } else {
                        scheduleRefresh(token, refreshToken);
                    }
                } catch (error) {
                    get().logout();
                }
            },
        }),

        { 
            name: 'auth-storage', // name of the item in storage
            // only save data to localStroage, not functions
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                refreshTokenValue: state.refreshTokenValue,
                isAuthenticated: state.isAuthenticated,
                role: state.role,
            }),
        }
    )
);
        

 
