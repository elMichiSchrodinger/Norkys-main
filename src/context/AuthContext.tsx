import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '../models/profile';

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    signOut: () => Promise<void>;
    loading: boolean;
    authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);
    
    const navigate = useNavigate();
    useEffect(() => {
        let mounted = true;

        const checkUser = async () => {
            try {
                setAuthError(null);
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) throw error;

                if (session?.user) {
                    setUser(session.user);
                    await fetchProfile(session.user);
                } else {
                    setUser(null);
                    setProfile(null);
                }
            } catch (error: any) {
                console.error("🚨 Error de sesión:", error);
                setAuthError(error.message);
                
                // Auto-reparación si el token está mal
                if (error.message?.includes("JWT") || error.status === 400) {
                    await signOut(); // Usamos nuestra función blindada
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        checkUser();

        const safetyTimer = setTimeout(() => {
            if (mounted && loading) {
                console.warn("⚠️ Tiempo de espera agotado. Forzando carga.");
                setLoading(false);
            }
        }, 3000);

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser(session.user);
                await fetchProfile(session.user);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setProfile(null);
            }
            setLoading(false);
        });

        return () => {
            mounted = false;
            clearTimeout(safetyTimer);
            authListener.subscription.unsubscribe();
        };
    }, []);

    // Redirección a completar perfil ELIMINADA
    // Ahora permitimos navegar libremente y solo pedimos datos al comprar.
    /* 
    useEffect(() => {
        if (!loading && user && profile) {
            // ...
        }
    }, ...); 
    */

    const fetchProfile = async (currentUser: User) => {
        try {
            const { data, error } = await supabase
                .from('profile')
                .select('*')
                .eq('id', currentUser.id)
                .maybeSingle();
            
            // Perfil temporal basado en datos de Google/Auth
            const tempProfile: Profile = {
                id: currentUser.id,
                nombre: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Usuario',
                rol: 'usuario', // Rol seguro por defecto
                telefono: null,
                direccion: null
            };

            if (error) {
                console.error("Error recuperando perfil (usando temporal):", error);
                setProfile(tempProfile);
                return;
            }
            
            if (data) {
                setProfile(data as Profile);
            } else {
                setProfile(tempProfile);
                
                // Intentamos crear. Si falla por RLS, capturamos el error.
                const { error: insertError } = await supabase.from('profile').upsert(tempProfile);
                if (insertError) {
                    console.error("Error creando perfil:", insertError);
                }
            }
        } catch (error: any) {
            console.error("Error inesperado en fetchProfile:", error);
        }
    };

    // --- FUNCIÓN SIGNOUT BLINDADA ---
    const signOut = async () => {
        try {
            // Intentamos cerrar en el servidor
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Error al cerrar sesión en Supabase (ignorando):", error);
        } finally {
            // PASE LO QUE PASE, limpiamos el estado local y redirigimos
            setUser(null);
            setProfile(null);
            setAuthError(null);
            // Borramos local storage por si acaso
            localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_URL?.split('//')[1].split('.')[0] + '-auth-token');
            navigate('/login');
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex flex-col justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
                <p className="text-gray-500 font-semibold animate-pulse">Cargando Norky's...</p>
            </div>
        );
    }

    if (authError) {
        return (
            <div className="h-screen flex flex-col justify-center items-center bg-red-50 p-4">
                <h1 className="text-xl font-bold text-red-700 mb-2">Sesión Expirada</h1>
                <button onClick={signOut} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
                    Reiniciar Aplicación
                </button>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, profile, signOut, loading, authError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};