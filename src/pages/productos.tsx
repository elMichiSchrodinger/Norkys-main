// pages/Productos.jsx
import Navbar from '../components/navbar';
import CategorySection from '../components/CategorySection';
import './producto.css';

const Productos = () => {
    
    const categories = [
        "Promoción", "Brasas", "Broaster", "Parrillas", "Menu",
        "Hamburguesas", "Piqueos", "Ensaladas", "Postres", "Bebidas", "Acompañamiento"
    ];

    // Esta función la mantenemos SOLO para los clics manuales en la barra superior
    const scrollToCategory = (catName) => {
        const id = catName.replace(/\s+/g, '-');
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 180; // Mismo ajuste que en el hijo
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    // YA NO NECESITAS EL useEffect QUE LEÍA EL HASH AQUÍ.
    // LO ELIMINAMOS PORQUE CategorySection SE ENCARGA AHORA.

    return (
        <div className="bg-gray-50 min-h-screen pb-10">
            <Navbar />
            
            {/* Menú Sticky Superior */}
            <div className="sticky top-0 z-20 bg-white shadow-sm py-4 overflow-x-auto">
                <ul className='flex flex-row gap-6 px-5 min-w-max whitespace-nowrap'>
                    {categories.map((cat) => (
                        <li key={cat}>
                            <button 
                                onClick={() => scrollToCategory(cat)}
                                className="text-gray-600 hover:text-red-600 font-bold text-sm uppercase transition-colors cursor-pointer"
                            >
                                {cat}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="container mx-auto mt-5">
                {categories.map((cat) => (
                    <CategorySection key={cat} categoryName={cat} />
                ))}
            </div>
        </div>
    );
}

export default Productos;