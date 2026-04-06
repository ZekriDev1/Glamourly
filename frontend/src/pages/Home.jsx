import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getPersonalizedRecommendations, getTrendingRecommendations } from '../services/api';
import ProductCard from '../components/ProductCard';
import RecommendationSection from '../components/RecommendationSection';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [personalized, setPersonalized] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    setLoading(true);
    Promise.all([
      getProducts(),
      getPersonalizedRecommendations(userId),
      getTrendingRecommendations()
    ]).then(([prodRes, persRes, trendRes]) => {
      setProducts(prodRes.data);
      setPersonalized(persRes.data);
      setTrending(trendRes.data);

      if (prodRes.data.length > 0) {
        const mostViewed = [...prodRes.data].sort((a, b) => b.views - a.views)[0];
        setMostPopular(mostViewed);
      }
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const [mostPopular, setMostPopular] = useState(null);

  return (
    <div className="pb-20">
      <header className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-pink-100/50 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 anim-blob"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-300 rounded-full blur-3xl opacity-30 -ml-20 -mb-20 anim-blob animation-delay-2000"></div>
        </div>

        <div className="text-center px-4 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Sublimez votre éclat avec <span className="text-pink-500 italic">Glamourly</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Découvrez la meilleure sélection de soins, maquillage et accessoires pour vous faire briller.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-600 transition-all shadow-lg hover:shadow-pink-200">
              Acheter maintenant
            </button>

          </div>
        </div>
      </header>

      {mostPopular && (
        <section className="container mx-auto px-6 mt-16">
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center border border-pink-50">
            <div className="w-full md:w-1/2 h-80 rounded-3xl overflow-hidden shadow-lg mb-8 md:mb-0 md:mr-12">
              <img src={mostPopular.image} alt={mostPopular.name} className="w-full h-full object-cover" />
            </div>
            <div className="w-full md:w-1/2">
              <span className="bg-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2 w-fit animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.5-7 3 10 1 15 1 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Coup de Foudre Client
              </span>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">{mostPopular.name}</h2>
              <p className="text-gray-500 text-lg mb-6 leading-relaxed">Le produit le plus convoité de notre boutique. Rejoignez des milliers de clients satisfaits.</p>
              <div className="flex items-center space-x-6 mb-8">
                <span className="text-3xl font-bold text-pink-500">{mostPopular.price} DH</span>
                <span className="text-gray-400 text-sm">Vues : {mostPopular.views}</span>
              </div>
              <Link to={`/product/${mostPopular.id}`} className="bg-gray-800 text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-900 transition-all inline-block shadow-lg">
                Découvrir ce Favori
              </Link>
            </div>
          </div>
        </section>
      )}

      <RecommendationSection
        title="Recommandé pour vous"
        subtitle="Basé sur vos préférences et votre historique"
        products={personalized}
        loading={loading}
      />

      <RecommendationSection
        title="En Vogue"
        subtitle="Les produits les plus consultés de la semaine"
        products={trending}
        loading={loading}
      />

      <section className="container mx-auto px-6 mt-20">
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-md">
            <h2 className="text-4xl font-bold mb-4">Vente d'Été Éclatante</h2>
            <p className="mb-6 opacity-90">Profitez de -30% sur tous les produits de soins cette semaine seulement. Ne ratez pas l'occasion !</p>
            <button className="bg-white text-pink-500 px-6 py-2 rounded-full font-bold">En profiter</button>
          </div>
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
              <path fill="#FFF" d="M45.5,-52.1C58.9,-43.5,69.5,-28.9,71.2,-13.6C72.9,1.7,65.7,17.7,55.5,29.9C45.3,42.1,32,50.6,17.2,56.5C2.4,62.4,-14,65.8,-27.2,60.5C-40.4,55.2,-50.3,41.2,-57.4,26.3C-64.5,11.4,-68.8,-4.4,-65.4,-18.2C-62,-32.1,-50.8,-43.9,-38.3,-52.8C-25.7,-61.7,-11.9,-67.7,1.8,-69.9C15.6,-72.1,28.9,-70.5,45.5,-52.1Z" transform="translate(100 100)" />
            </svg>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 mt-20 pb-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Collection Complète</h2>
            <div className="h-1.5 w-20 bg-pink-500 rounded-full mt-2"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 8).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
