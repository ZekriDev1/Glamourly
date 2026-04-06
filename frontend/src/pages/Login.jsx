import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../services/api';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [msg, setMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(formData).then(res => {
      localStorage.setItem('user', JSON.stringify(res.data));
      window.location.href = "/";
    }).catch(() => setMsg('Invalid credentials. Hint: register first!'));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="bg-white w-full max-w-md p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-full blur-2xl -mr-10 -mt-10 opacity-60"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{isLogin ? 'Bon Retour' : 'Rejoindre Glamourly'}</h1>
          <p className="text-gray-500 mb-10">{isLogin ? 'Connectez-vous pour continuer.' : 'Créez un compte pour commencer votre voyage.'}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nom d'utilisateur</label>
              <input
                type="text"
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-300 outline-none transition-all"
                placeholder="Votre pseudo"
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mot de passe</label>
              <input
                type="password"
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-300 outline-none transition-all"
                placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-pink-500 text-white py-4 rounded-2xl font-bold shadow-xl hover:shadow-pink-200 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLogin ? 'Se Connecter' : "S'inscrire"}
            </button>
          </form>

          <div className="mt-8 text-center flex flex-col space-y-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-pink-500 font-semibold hover:underline text-sm"
            >
              {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
            </button>

            <div className="h-px bg-gray-100 w-full"></div>

            <Link to="/admin" className="text-gray-400 hover:text-pink-500 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Espace Administration
            </Link>
          </div>

          {msg && (
            <div className="mt-6 p-4 bg-pink-50 text-pink-600 rounded-2xl text-center font-medium animate-fade-in">
              {msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
