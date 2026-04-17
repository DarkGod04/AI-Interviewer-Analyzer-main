'use client'
import React, { useEffect, useState, useContext, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from './../services/supabaseClient';
import UserDetailContext from '../context/UserDetailContext'

function Provider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const syncedRef = useRef(false); // prevent double-sync

    // Fetch/create DB user record from auth user
    const syncUserToDB = async (authUser) => {
        if (!authUser) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            let { data: Users, error } = await supabase
                .from('Users')
                .select('*')
                .eq('email', authUser.email);

            if (error) {
                console.error('Error fetching user:', error);
                // Still set user from auth metadata as fallback
                setUser({
                    name: authUser?.user_metadata?.name || authUser.email,
                    email: authUser?.email,
                    picture: authUser?.user_metadata?.picture,
                });
                setLoading(false);
                return;
            }

            if (!Users || Users.length === 0) {
                // New user — create record
                const { data, error: insertError } = await supabase
                    .from('Users')
                    .insert([{
                        name: authUser?.user_metadata?.name,
                        email: authUser?.email,
                        picture: authUser?.user_metadata?.picture,
                        credits: 3,
                    }])
                    .select();

                if (insertError) {
                    console.error('Error creating user:', insertError);
                    // Fallback: use auth metadata directly
                    setUser({
                        name: authUser?.user_metadata?.name || authUser.email,
                        email: authUser?.email,
                        picture: authUser?.user_metadata?.picture,
                    });
                    setLoading(false);
                    return;
                }

                const newUser = data?.[0];
                setUser(newUser);
                if (pathname !== '/onboarding' && !newUser?.onboarding_completed) {
                    router.push('/onboarding');
                }
            } else {
                const existingUser = Users[0];
                setUser(existingUser);
                if (pathname !== '/onboarding' && !existingUser?.onboarding_completed) {
                    router.push('/onboarding');
                }
            }
        } catch (err) {
            console.error('syncUserToDB error:', err);
            // Emergency fallback — show user from auth metadata
            setUser({
                name: authUser?.user_metadata?.name || authUser.email,
                email: authUser?.email,
                picture: authUser?.user_metadata?.picture,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // ── Strategy 1: Get the current session immediately ──
        // This catches the case where onAuthStateChange fires before mount
        const initSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user && !syncedRef.current) {
                    syncedRef.current = true;
                    await syncUserToDB(session.user);
                } else if (!session) {
                    setUser(null);
                    setLoading(false);
                }
            } catch (err) {
                console.error('getSession error:', err);
                setLoading(false);
            }
        };
        initSession();

        // ── Strategy 2: Listen for auth state changes (login/logout/refresh) ──
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (session?.user) {
                    if (!syncedRef.current) {
                        syncedRef.current = true;
                        await syncUserToDB(session.user);
                    }
                } else {
                    syncedRef.current = false;
                    setUser(null);
                    setLoading(false);
                }
            }
        );

        // ── Strategy 3: Failsafe timeout — never stay in loading >5s ──
        const timeout = setTimeout(() => {
            setLoading(prev => {
                if (prev) {
                    console.warn('Provider: loading timeout reached, forcing loading=false');
                    return false;
                }
                return prev;
            });
        }, 5000);

        return () => {
            subscription?.unsubscribe();
            clearTimeout(timeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <UserDetailContext.Provider value={{ user, setUser, loading }}>
            <div>
                {children}
            </div>
        </UserDetailContext.Provider>
    );
}

export default Provider;

// ✅ Custom hook to use context
export const useUser = () => {
    const context = useContext(UserDetailContext);
    return context;
}
