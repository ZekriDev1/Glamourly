import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getByCategory } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Category() {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getByCategory(name).then(res => {
      setProducts(res.data);
      setLoading(false);
    }).catch(err => {
        console.error(err);
        setLoading(false);
    });
  }, [name]);

  const displayNames = {
    "Makeup": "Maquillage",
    "Skincare": "Soin",
    "Accessories": "Accessoires"
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-800 capitalize">Collection {displayNames[name] || name}</h1>
        <p className="text-gray-500 mt-2">Découvrez notre sélection exclusive de produits {name.toLowerCase()}.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {[1,2,3,4].map(i => (
                 <div key={i} className="bg-gray-100 h-80 rounded-2xl animate-pulse"></div>
             ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}
