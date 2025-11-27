// src/pages/busqueda.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import { searchProductos } from '../services/producto_service';
import type { Producto } from '../models/producto'; // ✅ Importa el tipo

const Busqueda = () => {
  // ✅ Tipamos el parámetro de ruta: query puede ser string | undefined
  const { query } = useParams<{ query?: string }>(); // <-- Añadimos tipado explícito
  const [resultados, setResultados] = useState<Producto[]>([]); // ✅ Tipado explícito
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const realizarBusqueda = async () => {
      // ✅ Validamos que query exista y sea string
    const safeQuery = query?.trim() || '';
    if (!safeQuery) {
        setResultados([]);
        setLoading(false);
        return;
    }

      setLoading(true);
      try {
        const data = await searchProductos(safeQuery); // ✅ Ahora query es string
        setResultados(data);
      } catch (error) {
        console.error(error);
        setResultados([]);
      } finally {
        setLoading(false);
      }
    };

    realizarBusqueda();
  }, [query]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 uppercase">
          Resultados para: <span className="text-red-600">"{query || ''}"</span>
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Buscando...</p>
        ) : resultados.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">No encontramos productos que coincidan.</p>
            <p className="text-gray-400 mt-2">Intenta con "Pollo", "Papas" o "Ensalada".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {resultados.map((prod) => (
              <div
                key={prod.productoid}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group"
              >
                <div className="flex flex-row gap-4 h-full">
                  {/* IMAGEN */}
                  <Link to={`/producto/${prod.productoid}`} className="w-2/5 flex-shrink-0 cursor-pointer">
                    <img
                      src={'/img/' + prod.image_path}
                      className="w-full h-auto object-contain rounded-lg aspect-square group-hover:scale-105 transition-transform duration-300"
                      alt={prod.nombre}
                    />
                  </Link>

                  {/* INFO */}
                  <div className="w-3/5 flex flex-col justify-between">
                    <Link to={`/producto/${prod.productoid}`} className="cursor-pointer">
                      <h3 className="font-bold text-gray-900 text-sm uppercase leading-tight mb-2 group-hover:text-red-600 transition-colors">
                        {prod.nombre}
                      </h3>
                      <p className="text-xs text-gray-600 leading-snug line-clamp-3 mb-3 uppercase font-medium">
                        {prod.descripcion}
                      </p>
                    </Link>

                    <div className="mt-auto">
                      <p className="font-bold text-gray-800 mb-2 text-base">
                        S/ {typeof prod.precio === 'string' 
                          ? parseFloat(prod.precio).toFixed(2) 
                          : prod.precio.toFixed(2)}
                      </p>
                      <Link to={`/producto/${prod.productoid}`}>
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-4 rounded-full text-sm transition-colors">
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