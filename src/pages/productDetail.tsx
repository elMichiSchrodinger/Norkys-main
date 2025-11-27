import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductoById } from '../services/producto_service';
// 1. Importar hook
import { useCart } from '../context/CartContext'; 
import Navbar from '../components/Navbar';
import Footer from '../components/footer';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart(); // 2. Extraer función
    
    const [producto, setProducto] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [cantidad, setCantidad] = useState(1);

    useEffect(() => {
        const fetchProducto = async () => {
            if (!id) return;
            const data = await getProductoById(id);
            setProducto(data);
            setLoading(false);
        };
        fetchProducto();
    }, [id]);

    const handleIncrement = () => setCantidad(p => p + 1);
    const handleDecrement = () => { if (cantidad > 1) setCantidad(p => p - 1); };

    // 3. Lógica para agregar al carrito
    const handleAddToCart = () => {
        if (producto) {
            addToCart(producto, cantidad);
            // Opcional: Confirmación simple o ir directo al carrito
            if (window.confirm("¡Producto agregado! ¿Ir a pagar?")) {
                navigate('/carrito');
            } else {
                setCantidad(1); // Resetear contador si sigue comprando
            }
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center">Cargando...</div>;
    if (!producto) return <div>No encontrado</div>;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-10 px-4">
                <div className="container mx-auto max-w-5xl">
                    <button onClick={() => navigate(-1)} className="mb-6 text-gray-600 hover:text-red-600 font-bold">← Volver</button>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                        <div className="w-full md:w-1/2 bg-gray-100 flex justify-center items-center p-8">
                             <img src={'/img/' + producto.image_path} alt={producto.nombre} className="w-full h-auto max-h-[400px] object-contain" />
                        </div>
                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                            <h1 className="text-3xl font-black text-gray-900 uppercase mb-4">{producto.nombre}</h1>
                            <p className="text-gray-600 text-lg mb-8">{producto.descripcion}</p>
                            <span className="text-4xl font-black text-red-600 mb-8 block">S/ {parseFloat(producto.precio).toFixed(2)}</span>

                            <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-gray-100 pt-8">
                                <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
                                    <button onClick={handleDecrement} className="p-4 hover:bg-gray-100 font-bold text-xl">-</button>
                                    <span className="px-4 py-2 font-black text-xl w-6 text-center">{cantidad}</span>
                                    <button onClick={handleIncrement} className="p-4 hover:bg-gray-100 font-bold text-xl">+</button>
                                </div>
                                <button 
                                    onClick={handleAddToCart}
                                    className="w-1/2 bg-green-600 hover:bg-green-700 text-white text-lg font-black py-3 px-4 rounded-full shadow-lg transition-transform active:scale-95 mx-auto"
                                >
                                    AGREGAR S/ {(producto.precio * cantidad).toFixed(2)}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};
export default ProductDetail;