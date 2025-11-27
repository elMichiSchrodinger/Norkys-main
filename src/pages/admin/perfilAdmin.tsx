import { useState, useEffect } from 'react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabase';
import type { Profile } from '../../models/profile';

const PerfilAdmin = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    // Estado para el formulario
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        direccion: '',
        email: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                // Si no hay usuario, no cargamos nada, pero quitamos el loading si ya pasó un tiempo prudente
                // O dejamos que el AdminRoute maneje la redirección.
                return;
            }
            
            try {
                const { data, error } = await supabase
                    .from('profile')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                
                if (error && error.code !== 'PGRST116') throw error; // Ignoramos error si no encuentra fila (PGRST116)

                if (data) {
                    setProfile(data);
                    setFormData({
                        nombre: data.nombre || '',
                        telefono: data.telefono || '',
                        direccion: data.direccion || '',
                        email: user.email || ''
                    });
                } else {
                    // Si no hay perfil, inicializamos con datos del usuario
                    setFormData(prev => ({ ...prev, email: user.email || '' }));
                }
            } catch (error) {
                console.error("Error cargando perfil:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const { error } = await supabase
                .from('profile')
                .update({
                    nombre: formData.nombre,
                    telefono: formData.telefono,
                    direccion: formData.direccion
                })
                .eq('id', user.id);

            if (error) throw error;

            // Actualizar estado local
            setProfile(prev => prev ? { ...prev, ...formData } : null);
            setIsEditing(false);
            alert("Perfil actualizado correctamente");
        } catch (error) {
            console.error("Error actualizando perfil:", error);
            alert("Error al actualizar el perfil");
        }
    };

    const handleCancel = () => {
        if (profile) {
            setFormData({
                nombre: profile.nombre || '',
                telefono: profile.telefono || '',
                direccion: profile.direccion || '',
                email: user?.email || ''
            });
        }
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009951]"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl font-black text-gray-800 uppercase mb-6 border-l-4 border-[#009951] pl-4">
                        Mi Perfil
                    </h1>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Header del Perfil */}
                        <div className="bg-gray-900 p-8 flex flex-col md:flex-row items-center gap-6">
                            <div className="w-24 h-24 bg-white rounded-full p-1">
                                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center overflow-hidden text-4xl">
                                    👤
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl font-bold text-white">{profile?.nombre || 'Usuario'}</h2>
                                <p className="text-[#009951] font-medium uppercase tracking-wider text-sm">{profile?.rol || 'Admin'}</p>
                                <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
                            </div>
                        </div>

                        {/* Formulario */}
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800 uppercase">Información Personal</h3>
                                {!isEditing && (
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="text-sm font-bold text-[#009951] hover:underline flex items-center gap-1"
                                    >
                                        ✏️ Editar Datos
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Campos */}
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Nombre Completo</label>
                                        <input 
                                            type="text" 
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full border rounded-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#009951] ${
                                                isEditing ? 'bg-white border-gray-300 text-gray-800' : 'bg-gray-50 border-gray-200 text-gray-600'
                                            }`}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Correo Electrónico</label>
                                        <input 
                                            type="email" 
                                            value={formData.email}
                                            disabled
                                            className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 text-gray-500 font-medium cursor-not-allowed"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1">* El correo no se puede modificar</p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Teléfono / Celular</label>
                                        <input 
                                            type="tel" 
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full border rounded-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#009951] ${
                                                isEditing ? 'bg-white border-gray-300 text-gray-800' : 'bg-gray-50 border-gray-200 text-gray-600'
                                            }`}
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Dirección</label>
                                        <input 
                                            type="text" 
                                            name="direccion"
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full border rounded-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#009951] ${
                                                isEditing ? 'bg-white border-gray-300 text-gray-800' : 'bg-gray-50 border-gray-200 text-gray-600'
                                            }`}
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 mt-6">
                                        <button 
                                            type="button"
                                            onClick={handleCancel}
                                            className="px-6 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            type="submit"
                                            className="px-6 py-2 rounded-lg font-bold text-[#FED800] bg-[#009951] hover:opacity-90 shadow-md transition-colors"
                                        >
                                            Guardar Cambios
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PerfilAdmin;
