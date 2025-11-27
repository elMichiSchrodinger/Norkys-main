import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getProductosByCategoria } from '../services/producto_service';

const CategorySection = ({ categoryName }) => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const { hash } = useLocation();

    // --- CORRECCIÓN DE SEGURIDAD ---
    // Si por alguna razón categoryName llega vacío, no hacemos nada para evitar el crash.
    if (!categoryName) return null; 

    // Ahora es seguro usar replace
    const sectionId = categoryName.replace(/\s+/g, '-');

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const data = await getProductosByCategoria(categoryName);
                setProductos(data);
            } catch (error) {
                console.error(`Error cargando ${categoryName}:`, error);
            } finally {
                setLoading(false);
            }
        };
        
        if (categoryName) {
            cargarProductos();
        }
    }, [categoryName]);

    useEffect(() => {
        if (!loading && hash === `#${sectionId}`) {
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 200);
        }
    }, [loading, hash, sectionId]);

    if (!loading && productos.length === 0) return null;

    return (
        <div 
            id={sectionId} 
            style={{ scrollMarginTop: '220px' }}
            className='mb-12 mx-5 px-4 py-8 bg-white shadow-md hover:shadow-xl rounded-xl transition-all duration-300 border border-gray-100'
        >
            <h2 className="text-3xl font-black text-gray-900 mb-8 uppercase border-b pb-4 border-gray-200">
                {categoryName}
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12'>
                {productos.map((prod) => (
                    <div key={prod.productoid} className='flex flex-row gap-4 group relative'>
                        
                        {/* Enlace a la página de detalle */}
                        <Link 
                            to={`/producto/${prod.productoid}`} 
                            className="flex flex-row gap-4 w-full cursor-pointer"
                        >
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
                                        {prod.nombre}
                                    </h3>
                                    <p className='text-xs text-gray-600 leading-snug line-clamp-4 mb-3 uppercase font-medium'>
                                        {prod.descripcion}
                                    </p>
                                </div>
                                <div className="h-8"></div> 
                            </div>
                        </Link>

                        {/* Botón Agregar */}
                        <div className='absolute bottom-0 right-0 w-3/5 pl-4'>
                            <p className='font-bold text-gray-800 mb-2 text-base'>
                                S/ {parseFloat(prod.precio).toFixed(2)}
                            </p>
                            <Link to={`/producto/${prod.productoid}`}>
                                <button className='w-full bg-green-600 hover:bg-green-700 text-yellow-300 font-bold py-1.5 px-4 rounded-full text-sm transition-colors shadow-sm'>
                                    Agregar
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategorySection;