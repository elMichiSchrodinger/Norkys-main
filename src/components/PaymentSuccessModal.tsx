import { useNavigate } from 'react-router-dom';

const PaymentSuccessModal = ({ onClose }) => {
    const navigate = useNavigate();

    const handleContinue = () => {
        if (onClose) onClose(); // Limpiar estado si es necesario
        navigate('/menu'); // Redirigir a productos
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all scale-100 animate-bounce-in">
                
                {/* Icono de Check Animado (SVG simple) */}
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                    <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>

                <h2 className="text-2xl font-black text-gray-800 mb-2">¡Pago Realizado!</h2>
                <p className="text-gray-500 mb-6">Tu pedido ha sido registrado exitosamente y ya se está preparando.</p>

                <button 
                    onClick={handleContinue}
                    className="w-full bg-[#009951] hover:bg-[#007a40] text-white font-bold py-3 rounded-xl transition-colors shadow-lg"
                >
                    SEGUIR COMPRANDO
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccessModal;