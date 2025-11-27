import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { getProductosByCategoria, softDeleteProducto } from '../../services/producto_service';
import type { Producto } from '../../models/producto';

// Componente interno para listar productos con opciones de admin
const AdminCategorySection = ({ categoryName }: { categoryName: string }) => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const cargarProductos = async () => {
        try {
            const data = await getProductosByCategoria(categoryName, false);
            setProductos(data);
        } catch (error) {
            console.error(`Error cargando ${categoryName}:`, error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (categoryName) {
            cargarProductos();
        }
    }, [categoryName]);

    const handleDelete = async (id: number) => {
        if(confirm('¿Estás seguro de eliminar esta promoción? Dejará de ser visible para los usuarios.')) {
            try {
                await softDeleteProducto(id);
                await cargarProductos();
            } catch (error) {
                console.error("Error al eliminar:", error);
                alert("Hubo un error al eliminar la promoción");
            }
        }
    };

    if (loading) return <div className="text-center py-10">Cargando promociones...</div>;

    return (
        <div className='mb-12 mx-5 px-4 py-8 bg-white shadow-md rounded-xl border border-gray-100'>
            <h2 className="text-3xl font-black text-gray-900 mb-8 uppercase border-b pb-4 border-gray-200">
                {categoryName}
            </h2>

            {productos.length === 0 ? (
                <p className="text-gray-500 text-center">No hay promociones registradas.</p>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12'>
                    {productos.map((prod) => (
                        <div key={prod.productoid} className={`flex flex-row gap-4 group relative ${!prod.disponibilidad ? 'opacity-50 grayscale' : ''}`}>
                            <div className='w-2/5 flex-shrink-0'>
                                <img 
                                    src={'/img/' + prod.image_path} 
                                    className='w-full h-auto object-contain rounded-lg aspect-square group-hover:scale-105 transition-transform duration-300' 
                                    alt={prod.nombre} 
                                />
                            </div>
                            <div className='w-3/5 flex flex-col justify-between'>
                                <div>
                                    <h3 className='font-bold text-gray-900 text-sm uppercase leading-tight mb-2 group-hover:text-red-600 transition-colors'>
                                        {prod.nombre} { !prod.disponibilidad && <span className="text-red-500 text-xs">(No disponible)</span> }
                                    </h3>
                                    <p className='text-xs text-gray-600 leading-snug line-clamp-3 mb-3 uppercase font-medium'>
                                        {prod.descripcion}
                                    </p>
                                </div>
                                <div className="h-8"></div> 
                                
                                <div className='absolute bottom-0 right-0 w-3/5 pl-4'>
                                    <p className='font-bold text-gray-800 mb-2 text-base'>
                                        S/ {Number(prod.precio).toFixed(2)}
                                    </p>
                                    <div className="flex gap-2 items-center">
                                        <button 
                                            onClick={() => navigate(`/admin/producto/editar/${prod.productoid}`)}
                                            className="flex-grow bg-green-600 hover:bg-green-700 text-yellow-300 font-bold py-1.5 px-4 rounded-full text-sm transition-colors shadow-sm"
                                        >
                                            Editar
                                        </button>
                                        {prod.disponibilidad && (
                                            <button 
                                                className="bg-white hover:bg-red-50 text-red-600 p-2 rounded-full transition-colors border border-red-200 shadow-sm"
                                                title="Eliminar"
                                                onClick={() => handleDelete(prod.productoid)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const PromocionesAdmin = () => {
    const navigate = useNavigate();
    
    // Solo mostramos la categoría Promoción
    const categoria = "Promoción";

    return (
       <div className="bg-gray-50 min-h-screen flex flex-col">
            <Navbar />
            
            {/* Barra de Herramientas Admin */}
            <div className="sticky top-0 z-20 bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-700">Administrar Promociones</h1>
                    
                    {/* Botón Crear Nuevo */}
                    <button 
                        onClick={() => navigate('/admin/producto/nuevo')}
                        className="bg-green-600 hover:bg-green-700 text-yellow-300 font-bold py-2 px-6 rounded-full shadow-md transition-transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
                    >
                        <span className="text-xl leading-none">+</span> Nueva Promoción
                    </button>
                </div>
            </div>

            {/* Contenido */}
            <div className="container mx-auto mt-8 flex-grow">
                <AdminCategorySection categoryName={categoria} />
            </div>

            <Footer/>
        </div>
    );
}

export default PromocionesAdmin;
