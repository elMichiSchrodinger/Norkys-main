import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // <--- Importamos Link
import Navbar from '../components/Navbar';
import { searchProductos } from '../services/producto_service';

const Busqueda = () => {
    const { query } = useParams();
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const realizarBusqueda = async () => {
            setLoading(true);
            try {
                const data = await searchProductos(query);
                setResultados(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            realizarBusqueda();
        }
    }, [query]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 uppercase">
                    Resultados para: <span className="text-red-600">"{query}"</span>
                </h2>

                {loading ? (
                    <p className="text-center text-gray-500">Buscando...</p>
                ) : resultados.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-xl text-gray-600">No encontramos productos que coincidan.</p>
                        <p className="text-gray-400 mt-2">Intenta con "Pollo", "Papas" o "Ensalada".</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12'>
                        {resultados.map((prod) => (
                            <div 
                                key={prod.productoid} 
                                className='bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group'
                            >
                                <div className='flex flex-row gap-4 h-full'>
                                    
                                    {/* COLUMNA IZQUIERDA: IMAGEN (Con Link al detalle) */}
                                    <Link 
                                        to={`/producto/${prod.productoid}`} 
                                        className='w-2/5 flex-shrink-0 cursor-pointer'
                                    >
                                        <img 
                                            src={'/img/' + prod.image_path} 
                                            className='w-full h-auto object-contain rounded-lg aspect-square group-hover:scale-105 transition-transform duration-300' 
                                            alt={prod.nombre} 
                                        />
                                    </Link>

                                    {/* COLUMNA DERECHA: INFO */}
                                    <div className='w-3/5 flex flex-col justify-between'>
                                        
                                        {/* Título y Descripción (Con Link al detalle) */}
                                        <Link to={`/producto/${prod.productoid}`} className='cursor-pointer'>
                                            <h3 className='font-bold text-gray-900 text-sm uppercase leading-tight mb-2 group-hover:text-red-600 transition-colors'>
                                                {prod.nombre}
                                            </h3>
                                            <p className='text-xs text-gray-600 leading-snug line-clamp-3 mb-3 uppercase font-medium'>
                                                {prod.descripcion}
                                            </p>
                                        </Link>

                                        {/* Precio y Botón */}
                                        <div className='mt-auto'>
                                            <p className='font-bold text-gray-800 mb-2 text-base'>
                                                S/ {parseFloat(prod.precio).toFixed(2)}
                                            </p>
                                            
                                            {/* Botón que también lleva al detalle */}
                                            <Link to={`/producto/${prod.productoid}`}>
                                                <button className='w-full bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-4 rounded-full text-sm transition-colors'>
                                                    Agregar
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Busqueda;