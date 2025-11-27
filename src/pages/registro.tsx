import { useState } from 'react';
import { supabase } from '../utils/supabase'; 
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/img/logo_actual.jpg'
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const Registro = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Registro con Correo y Contraseña
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: nombre } 
                }
            });

            if (error) throw error;

            alert("Registro exitoso. Por favor inicia sesión.");
            navigate('/login');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Registro con Google
    const handleGoogleLogin = async () => {
        try {
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin // Redirige a tu página actual
                }
            });
        } catch (error) {
            console.error("Error con Google:", error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center min-h-screen bg-gray-100 py-10">
                <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-3 text-center text-gray-800">Crear Cuenta</h2>
                    <img src={logo} className='size-24 rounded-full mb-6' alt="logo norkys" />
                    
                    <form onSubmit={handleRegister} className="space-y-4 w-full">
                        <div>
                            <label htmlFor="nombre" className="sr-only">Nombre Completo</label>
                            <input 
                                id="nombre"
                                name="nombre"
                                type="text" 
                                placeholder="Nombre Completo" 
                                required
                                autoComplete="name"
                                className="w-full p-3 border rounded-lg" 
                                onChange={(e)=>setNombre(e.target.value)} 
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">Correo Electrónico</label>
                            <input 
                                id="email"
                                name="email"
                                type="email" 
                                placeholder="Correo Electrónico" 
                                required
                                autoComplete="email"
                                className="w-full p-3 border rounded-lg" 
                                onChange={(e)=>setEmail(e.target.value)} 
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Contraseña</label>
                            <input 
                                id="password"
                                name="password"
                                type="password" 
                                placeholder="Contraseña" 
                                required
                                autoComplete="new-password"
                                className="w-full p-3 border rounded-lg" 
                                onChange={(e)=>setPassword(e.target.value)} 
                            />
                        </div>
                        <button disabled={loading} className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 transition-colors">
                            {loading ? 'Registrando...' : 'Registrarse'}
                        </button>
                    </form>

                    {/* Separador */}
                    <div className="w-full flex items-center justify-between mt-6 mb-4">
                        <hr className="w-full border-gray-300" />
                        <span className="px-2 text-gray-400 text-sm">O</span>
                        <hr className="w-full border-gray-300" />
                    </div>

                    {/* Botón de Google */}
                    <button 
                        onClick={handleGoogleLogin} 
                        className="w-full bg-white border border-gray-300 text-gray-700 p-3 rounded-lg font-bold hover:bg-gray-50 flex justify-center items-center gap-2 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                        </svg>
                        Registrarse con Google
                    </button>

                    <p className="mt-6 text-center text-sm">
                        ¿Ya tienes cuenta? <Link to="/login" className="text-green-600 font-bold hover:underline">Inicia Sesión</Link>
                    </p>
                </div>
            </div>
            <Footer/>
        </>
    );
};
export default Registro;