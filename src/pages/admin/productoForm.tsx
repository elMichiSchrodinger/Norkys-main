import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { getProductoById, createProducto, updateProducto } from '../../services/producto_service';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    // Estado inicial
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: 'Brasas',
        image_path: '',
        disponibilidad: true
    });

    // Cargar datos si estamos editando
    useEffect(() => {
        if (isEditing && id) {
            const cargarProducto = async () => {
                try {
                    const producto = await getProductoById(Number(id));
                    if (producto) {
                        setFormData({
                            nombre: producto.nombre,
                            descripcion: producto.descripcion || '',
                            precio: producto.precio.toString(),
                            categoria: producto.categoria,
                            image_path: producto.image_path || '',
                            disponibilidad: producto.disponibilidad
                        });
                    }
                } catch (error) {
                    console.error("Error cargando producto:", error);
                    // Opcional: Mostrar alerta o redirigir si falla
                }
            };
            cargarProducto();
        }
    }, [isEditing, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const payload = {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                precio: parseFloat(formData.precio),
                categoria: formData.categoria,
                image_path: formData.image_path || null,
                disponibilidad: formData.disponibilidad
            };

            if (isEditing && id) {
                await updateProducto(Number(id), payload);
                alert('Producto actualizado correctamente');
            } else {
                await createProducto(payload);
                alert('Producto creado correctamente');
            }
            
            // Redireccionar según la categoría
            if (formData.categoria === 'Promoción') {
                navigate('/admin/promociones');
            } else {
                navigate('/admin/productos');
            }
        } catch (error) {
            console.error("Error guardando producto:", error);
            alert('Error al guardar el producto. Verifica la consola para más detalles.');
        }
    };

    const categories = [
        "Promoción", "Brasas", "Broaster", "Parrillas", "Menu",
        "Hamburguesas", "Piqueos", "Ensaladas", "Postres", "Bebidas", "Acompañamiento"
    ];

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    
                    {/* Encabezado del Formulario */}
                    <div className="bg-green-600 px-6 py-4 border-b border-green-700">
                        <h1 className="text-xl font-bold text-yellow-300 uppercase tracking-wide flex items-center gap-2">
                            {isEditing ? (
                                <>✏️ Editar Producto</>
                            ) : (
                                <>✨ Nuevo Producto</>
                            )}
                        </h1>
                    </div>

                    {/* Formulario */}
                    <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                        
                        {/* Imagen del Producto */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2 uppercase text-xs tracking-wider">
                                Imagen del Producto (Ruta)
                            </label>
                            
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                {/* Previsualización */}
                                <div className="w-full md:w-1/3 aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group">
                                    {formData.image_path ? (
                                        <img 
                                            src={formData.image_path.startsWith('http') ? formData.image_path : `/img/${formData.image_path}`} 
                                            alt="Vista previa" 
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Sin+Imagen';
                                            }}
                                        />
                                    ) : (
                                        <div className="text-center p-4">
                                            <span className="text-4xl mb-2 block">📷</span>
                                            <span className="text-xs text-gray-400 font-medium">Sin imagen</span>
                                        </div>
                                    )}
                                </div>

                                {/* Input de Ruta (Temporal hasta tener Storage) */}
                                <div className="flex-1 w-full flex flex-col justify-center">
                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-600 mb-2 font-medium">
                                            Ruta de la imagen (ej: brasas/WEBP/pollo.webp)
                                        </p>
                                        <input 
                                            type="text" 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors bg-white"
                                            placeholder="carpeta/imagen.jpg"
                                            value={formData.image_path}
                                            onChange={(e) => setFormData({...formData, image_path: e.target.value})}
                                        />
                                        <p className="text-xs text-gray-400 mt-2">
                                            Ingresa la ruta relativa dentro de /public/img/
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Nombre */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2 uppercase text-xs tracking-wider">
                                Nombre del Producto
                            </label>
                            <input 
                                type="text" 
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors bg-gray-50"
                                placeholder="Ej: 1/4 de Pollo con Papas"
                                value={formData.nombre}
                                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                            />
                        </div>

                        {/* Categoría y Precio (Grid) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2 uppercase text-xs tracking-wider">
                                    Categoría
                                </label>
                                <select 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 bg-gray-50 cursor-pointer"
                                    value={formData.categoria}
                                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-bold mb-2 uppercase text-xs tracking-wider">
                                    Precio (S/)
                                </label>
                                <input 
                                    type="number" 
                                    step="0.10"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 bg-gray-50"
                                    placeholder="0.00"
                                    value={formData.precio}
                                    onChange={(e) => setFormData({...formData, precio: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2 uppercase text-xs tracking-wider">
                                Descripción
                            </label>
                            <textarea 
                                rows={4}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 bg-gray-50 resize-none"
                                placeholder="Detalles del producto, ingredientes, etc..."
                                value={formData.descripcion}
                                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                            />
                        </div>

                        {/* Disponibilidad (Switch simple) */}
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <input 
                                type="checkbox" 
                                id="disponibilidad"
                                className="w-5 h-5 text-green-600 rounded focus:ring-green-500 border-gray-300 cursor-pointer"
                                checked={formData.disponibilidad}
                                onChange={(e) => setFormData({...formData, disponibilidad: e.target.checked})}
                            />
                            <label htmlFor="disponibilidad" className="text-gray-700 font-bold uppercase text-xs cursor-pointer select-none">
                                Producto Disponible para la venta
                            </label>
                        </div>

                        {/* Botones de Acción */}
                        <div className="flex gap-4 pt-4 border-t border-gray-100">
                            <button 
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 px-6 py-3 rounded-full border border-gray-300 text-gray-600 font-bold uppercase text-sm hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 px-6 py-3 rounded-full bg-green-600 text-yellow-300 font-bold uppercase text-sm hover:bg-green-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                            >
                                Guardar Cambios
                            </button>
                        </div>

                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}
export default ProductForm;