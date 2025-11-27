import { useNavigate } from 'react-router-dom'; // 1. Importar hook
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Carousel from '../components/carousel';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const Home = () => {
    const navigate = useNavigate(); // 2. Inicializar hook
    const { profile, loading } = useAuth();

    useEffect(() => {
        if (!loading && profile?.rol === 'admin') {
            navigate('/admin/dashboard');
        }
    }, [profile, loading, navigate]);

    const image_path= '/img/'
    // ... (tus arrays de imagenes y categorias siguen igual) ...
    const images = [image_path+'promociones/AMOR_A_LA_BRASA.jpg',image_path+'promociones/promocion_1_4.webp', image_path+'promociones/cajita_infantil.jpg']
    const categories = [
        { id: 1, title: 'Promoción', img: image_path+'promociones/1_pollo_1_papas_1_ensalada_1.5_gaseosa.png' },
        { id: 2, title: 'Brasas', img: image_path+'brasas/WEBP/1_4_pollo+papa+ensalada+gaseosa.webp' },
        { id: 3, title: 'Broaster', img: image_path+'broaster/WEBP/ComboBroasterx10.webp' },
        { id: 4, title: 'Parrillas', img: image_path+'parrillas/WEBP/1_2_PARRILLA_BRASA.webp' },
        { id: 5, title: 'Postres', img: image_path+'postres/PNG/TRES_LECHES.png' },
        { id: 6, title: 'Piqueos', img: image_path+'piqueos/WEBP/TEQUENOS_X12.webp' },
        { id: 7, title: 'Menu', img: image_path+'menu/LOMO_SALTADO.webp' },
        { id: 8, title: 'Hamburguesas', img: image_path+'hamburguesas/WEBP/HamburguesaSuprema+Papa_ondulada.webp' },
        { id: 9, title: 'Ensaladas', img: image_path+'ensaladas/PNG/ENSALADA_CLASICA_FAMILIAR.png' },
        { id: 10, title: 'Bebidas', img: image_path+'bebidas/WEBP/IncaKola3L.webp' },
    ];

    // 3. Función para manejar el clic
    const handleCategoryClick = (title: string) => {
        // Reemplazamos espacios por guiones para que coincida con los IDs de la pagina de productos
        // Ejemplo: "Fusión Criolla" se convierte en "Fusión-Criolla"
        const categoryId = title.replace(/\s+/g, '-');
        
        // Navegamos a la ruta del menú agregando el #ID
        navigate(`/menu#${categoryId}`);
    };

    return(
        <>
        <Navbar/>
        <Carousel images={images}/>
        <section className="py-8 px-4 md:px-8 bg-gray-50">

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                
                {categories.map((category) => (
                    <div 
                        key={category.id} 
                        // 4. Agregamos el evento onClick aquí
                        onClick={() => handleCategoryClick(category.title)}
                        className="flex flex-col items-center cursor-pointer group transition-transform hover:-translate-y-1"
                    >
                        <div className="bg-white p-4 rounded-xl shadow-sm group-hover:shadow-md w-full aspect-square flex items-center justify-center overflow-hidden">
                            <img 
                                src={category.img} 
                                alt={category.title} 
                                className="w-full h-full object-contain"
                            />
                        </div>
                        
                        <h3 className="mt-3 font-bold text-sm md:text-base text-gray-900 uppercase text-center">
                            {category.title}
                        </h3>
                    </div>
                ))}

            </div>
        </section>
        <Footer/>
        </>
    );
}
export default Home;