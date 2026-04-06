import { useEffect, useState } from 'react';
import { getSimilarRecommendations, createOrder } from '../services/api';
import RecommendationSection from '../components/RecommendationSection';

export default function Cart({ cart, removeFromCart }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  useEffect(() => {
    if (cart.length > 0) {
      setLoading(true);
      getSimilarRecommendations(cart[0].id)
        .then(res => setRecommendations(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [cart]);

  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert("Veuillez vous connecter pour passer commande.");
      return;
    }

    const orderData = {
      user_id: user.id,
      items: cart.map(item => ({ product_id: item.id, quantity: 1 }))
    };

    createOrder(orderData).then(() => {
      setOrdered(true);
    }).catch(err => console.error(err));
  };

  if (ordered) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-xl max-w-xl mx-auto">
          <div className="flex justify-center mb-6 text-pink-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Merci pour votre commande !</h1>
          <p className="text-gray-500 text-lg mb-8">Votre rituel beauté est en route. Vous recevrez une confirmation par email sous peu.</p>
          <a href="/" className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-pink-600 transition-all inline-block">Retour à l'accueil</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-12">Votre Panier Beauté</h1>
      
      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
          <p className="text-gray-400 text-xl mb-8">Votre panier est vide. Offrez-vous quelque chose !</p>
          <a href="/" className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold">Continuer mes achats</a>
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 gap-12 mb-20">
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-inner">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                      <p className="text-pink-500 font-medium">{item.price} DH</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg h-fit">
              <h2 className="text-2xl font-bold mb-6">Récapitulatif</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{total.toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className="text-green-500">Gratuite</span>
                </div>
                <div className="h-px bg-gray-100"></div>
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span>{total.toFixed(2)} DH</span>
                </div>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-pink-500 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-pink-600 transition-all"
              >
                Commander
              </button>
            </div>
          </div>

          <RecommendationSection 
            title="Vous pourriez aussi aimer" 
            subtitle="Complétez votre commande avec ces coups de cœur"
            products={recommendations}
            loading={loading}
          />
        </>
      )}
    </div>
  );
}
