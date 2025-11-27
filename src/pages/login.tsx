import { useState } from 'react';
import { supabase } from '../utils/supabase'; // Ajusta ruta
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/navbar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) {
            alert(error.message);
            setLoading(false);
        } else {
            // Verificar rol para redirección
            const { data: profileData } = await supabase
                .from('profile')
                .select('rol')
                .eq('id', data.user?.id)
                .single();

            if (profileData?.rol === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        }
    };

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // IMPORTANTE: Esto debe coincidir con lo que pongas en Supabase Dashboard
                redirectTo: window.location.origin 
            }
        });
    };

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center min-h-screen bg-gray-100 py-10">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar Sesión</h2>
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input 
                            type="email" placeholder="Correo" 
                            className="w-full p-3 border rounded-lg" 
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                        <input 
                            type="password" placeholder="Contraseña" 
                            className="w-full p-3 border rounded-lg" 
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                        <button disabled={loading} className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400">
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </button>
                    </form>

                    <div className="mt-4 flex flex-col gap-3">
                        <button onClick={handleGoogleLogin} className="w-full bg-white border border-gray-300 text-gray-700 p-3 rounded-lg font-bold hover:bg-gray-50 flex justify-center items-center gap-2 transition-colors">
                            {/* SVG de Google */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                            </svg>
                            Continuar con Google
                        </button>
                                                <p className="text-center text-sm">¿No tienes cuenta? <Link to="/registro" className="text-green-600 font-bold">Regístrate</Link></p>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Login;