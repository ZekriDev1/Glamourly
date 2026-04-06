import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
      <Link to={`/product/${product.id}`}>
        <div className="h-64 overflow-hidden relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1596462502278-27bfaf433394?w=400";
            }}
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-pink-600">
            {product.price} DH
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs text-pink-400 font-bold uppercase tracking-wider mb-1">{product.category}</p>
          <h3 className="text-gray-800 font-semibold text-lg">{product.name}</h3>
          <button className="mt-4 w-full bg-pink-50 text-pink-600 py-2 rounded-xl font-medium group-hover:bg-pink-500 group-hover:text-white transition-colors duration-300">
            Voir Détails
          </button>
        </div>
      </Link>
    </div>
  );
}
