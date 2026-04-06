import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, getSimilarRecommendations, getFrequentRecommendations, toggleWishlist } from '../services/api';
import ProductCard from '../components/ProductCard';
import RecommendationSection from '../components/RecommendationSection';

export default function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [frequent, setFrequent] = useState([]);
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loadingRecs, setLoadingRecs] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    getProductById(id, userId).then(res => {
      setProduct(res.data);
      setLoadingRecs(true);
      return Promise.all([
        getSimilarRecommendations(id),
        getFrequentRecommendations(id)
      ]);
    }).then(([simRes, freqRes]) => {
      setSimilar(simRes.data.filter(p => p.id !== parseInt(id)));
      setFrequent(freqRes.data.filter(p => p.id !== parseInt(id)));
    }).catch(err => console.error(err))
    .finally(() => setLoadingRecs(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert("Veuillez vous connecter pour ajouter à votre liste de souhaits.");
        return;
    }
    toggleWishlist(product.id, user.id).then(() => {
        setIsWishlisted(!isWishlisted);
    }).catch(err => console.error(err));
  };

  if (!product) return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl grid md:grid-cols-2 gap-8 items-center">
        <div className="h-[500px]">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-8 lg:p-12">
          <div className="flex items-center justify-between mb-2">
            <p className="text-pink-500 font-bold uppercase tracking-widest text-sm">{product.category}</p>
            <span className="text-gray-400 text-xs font-medium bg-gray-50 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                {product.views} personnes consultent ce produit
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-3xl text-gray-900 font-light mb-6">{product.price} DH</p>
          <div className="h-px bg-gray-100 w-full mb-8"></div>
          <p className="text-gray-600 mb-8 leading-relaxed text-lg">
            {product.description || "Notre produit signature est conçu avec les meilleurs ingrédients pour sublimer votre éclat naturel. Testé dermatologiquement."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              className={`flex-1 ${added ? 'bg-green-500' : 'bg-pink-500 hover:bg-pink-600'} text-white py-4 rounded-2xl font-bold transition-all shadow-lg text-lg flex justify-center items-center gap-2`}
            >
              {added ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Ajouté au Sac
                </>
              ) : 'Ajouter au Panier'}
            </button>
            <button 
                onClick={handleWishlist}
                className={`px-6 py-4 rounded-2xl border-2 transition-all font-bold flex items-center justify-center ${isWishlisted ? 'border-pink-500 text-pink-500 bg-pink-50' : 'border-gray-200 text-gray-400 hover:text-pink-500 hover:border-pink-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <RecommendationSection 
        title="Produits Similaires" 
        subtitle={`Découvrez d'autres articles dans la catégorie ${product.category}`}
        products={similar}
        loading={loadingRecs}
      />

      <RecommendationSection 
        title="Fréquemment achetés ensemble" 
        subtitle="Complétez votre look avec ces articles complémentaires"
        products={frequent}
        loading={loadingRecs}
      />
    </div>
  );
}
