import { useState } from 'react'; 
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; 
import { Link, useNavigate } from 'react-router-dom';
import NavbarSimple from '../components/navbarSimple';
import Footer from '../components/footer';
import { createPedido } from '../services/pedido_service'; 
import PaymentSuccessModal from '../components/PaymentSuccessModal'; 

const CarritoPage = () => {
    const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
    const { user, profile } = useAuth(); 
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Cálculos financieros
    const subtotal = totalPrice / 1.18;
    const igv = totalPrice - subtotal;

    // --- FUNCIÓN PRINCIPAL DE PAGO ---
    const handleProcessPayment = async () => {
        // 1. Verificar si está logueado
        if (!user) {
            alert("Debes iniciar sesión para procesar tu pedido.");
            navigate('/login');
            return;
        }

        // 2. Verificar perfil completo (Dirección y Teléfono)
        if (!profile?.telefono || !profile?.direccion) {
            alert("Por favor completa tu información de entrega antes de continuar.");
            navigate('/completar-perfil');
            return;
        }

        // 3. Procesar Pedido
        setLoading(true);
        const result = await createPedido(user.id, cart, totalPrice);
        setLoading(false);

        if (result.success) {
            clearCart(); // Limpiamos el carrito
            setShowSuccess(true); // Mostramos el modal de éxito
        } else {
            alert("Hubo un error al procesar el pedido. Inténtalo de nuevo.");
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col relative">
            <NavbarSimple />

            <div className="container mx-auto px-4 py-10 flex-grow">
                <h1 className="text-3xl font-black text-gray-800 mb-8 text-center uppercase">
                    Tu Pedido
                </h1>

                {cart.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm max-w-2xl mx-auto">
                        <p className="text-gray-500 text-xl mb-6">Tu carrito está vacío 😔</p>
                        <Link to="/menu" className="bg-[#009951] text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-colors">
                            Ir a la Carta
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        
                        {/* COLUMNA IZQUIERDA: LISTA DE PRODUCTOS */}
                        <div className="w-full lg:w-2/3 bg-white p-6 rounded-2xl shadow-sm">
                            <div className="space-y-6">
                                {cart.map((item) => (
                                    <div key={item.productoid} className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-100 pb-6 last:border-0">
                                        <img 
                                            src={'/img/' + item.image_path} 
                                            alt={item.nombre} 
                                            className="w-24 h-24 object-contain rounded-md bg-gray-50"
                                        />
                                        <div className="flex-grow text-center sm:text-left">
                                            <h3 className="font-bold text-gray-800">{item.nombre}</h3>
                                            <p className="text-gray-500 text-sm">Unitario: S/ {item.precio.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center border border-gray-300 rounded-full overflow-hidden h-10">
                                            <button 
                                                onClick={() => updateQuantity(item.productoid, item.cantidad - 1)}
                                                className="w-8 h-full flex items-center justify-center hover:bg-gray-100 font-bold text-gray-600"
                                            >-</button>
                                            <span className="w-10 text-center font-bold text-sm">{item.cantidad}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.productoid, item.cantidad + 1)}
                                                className="w-8 h-full flex items-center justify-center hover:bg-gray-100 font-bold text-green-600"
                                            >+</button>
                                        </div>
                                        <div className="font-bold text-gray-800 w-24 text-center">
                                            S/ {(item.precio * item.cantidad).toFixed(2)}
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item.productoid)}
                                            className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={clearCart} className="mt-6 text-sm text-gray-500 hover:text-red-600 underline">Vaciar carrito</button>
                        </div>

                        {/* COLUMNA DERECHA: FACTURA */}
                        <div className="w-full lg:w-1/3">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
                                <h3 className="text-xl font-black text-gray-800 mb-6 uppercase border-b pb-4">Resumen de Pago</h3>
                                <div className="space-y-3 mb-6 text-sm text-gray-600">
                                    <div className="flex justify-between"><span>Subtotal</span><span>S/ {subtotal.toFixed(2)}</span></div>
                                    <div className="flex justify-between"><span>IGV (18%)</span><span>S/ {igv.toFixed(2)}</span></div>
                                    <div className="flex justify-between font-bold text-xl text-gray-900 pt-4 border-t mt-4">
                                        <span>Total a Pagar</span><span className="text-[#009951]">S/ {totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* BOTÓN DE PAGO CONECTADO */}
                                <button 
                                    onClick={handleProcessPayment}
                                    disabled={loading}
                                    className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all transform mb-4 text-lg
                                        ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#009951] hover:bg-[#007a40] active:scale-95'}
                                    `}
                                >
                                    {loading ? 'PROCESANDO...' : 'CONTINUAR COMPRA'}
                                </button>
                                
                                <div className="flex justify-center gap-2">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="mastercard" className="h-6"/>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="visa" className="h-6"/>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />

            {/* MODAL DE ÉXITO */}
            {showSuccess && <PaymentSuccessModal onClose={() => setShowSuccess(false)} />}
        </div>
    );
};

export default CarritoPage;