import { useState, FormEvent } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';

const CompletarPerfil = () => {
    const { user, profile } = useAuth();
    
    // Estados para el formulario
    const [telefono, setTelefono] = useState(profile?.telefono || '');
    const [direccion, setDireccion] = useState(profile?.direccion || '');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();
        
        // Verificación de seguridad para TypeScript
        if (!user) return;

        setLoading(true);

        try {
            // Usamos UPSERT: Crea si no existe, actualiza si ya existe
            const { error } = await supabase
                .from('profile')
                .upsert({ 
                    id: user.id,
                    nombre: profile?.nombre || user.user_metadata?.full_name || 'Usuario',
                    telefono: telefono, 
                    direccion: direccion,
                    rol: 'usuario' 
                });

            if (error) throw error;

            // Forzamos la recarga hacia el Home
            window.location.href = '/'; 

        } catch (error: any) {
            console.error("Error al guardar:", error.message || error);
            alert('Error al guardar datos. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    ¡Casi listo, {profile?.nombre || 'Usuario'}!
                </h2>
                <p className="text-gray-500 mb-6">
                    Para entregarte tu pedido, necesitamos estos datos obligatorios.
                </p>

                <form onSubmit={handleUpdate} className="space-y-4 text-left">
                    <div>
                        <label htmlFor="telefono" className="text-sm font-bold text-gray-700">
                            Teléfono / Celular
                        </label>
                        <input 
                            id="telefono"
                            name="telefono"
                            type="tel" 
                            required
                            autoComplete="tel"
                            value={telefono} 
                            onChange={(e) => setTelefono(e.target.value)} 
                            className="w-full p-3 border rounded-lg mt-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500" 
                        />
                    </div>
                    <div>
                        <label htmlFor="direccion" className="text-sm font-bold text-gray-700">
                            Dirección de Entrega
                        </label>
                        <input 
                            id="direccion"
                            name="direccion"
                            type="text" 
                            required
                            autoComplete="street-address"
                            value={direccion} 
                            onChange={(e) => setDireccion(e.target.value)} 
                            className="w-full p-3 border rounded-lg mt-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500" 
                        />
                    </div>
                    <button 
                        disabled={loading} 
                        className="w-full bg-green-600 text-white font-bold p-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                    >
                        {loading ? 'Guardando...' : 'Guardar y Continuar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompletarPerfil;