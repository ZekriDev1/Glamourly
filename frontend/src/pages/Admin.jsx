import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admin() {
  const [isLogged, setIsLogged] = useState(() => localStorage.getItem('adminSession') === 'true');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLogged) {
      fetchStats();
    }
  }, [isLogged]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "Glamourly" && password === "Test1234") {
      localStorage.setItem('adminSession', 'true');
      window.location.href = "/";
    } else {
      setError("Identifiants incorrects");
    }
  };

  const handleLogout = () => {
    setIsLogged(false);
    localStorage.removeItem('adminSession');
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-[#FDF2F5] flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-white">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Espace Admin</h2>
            <p className="text-gray-500">Veuillez vous authentifier pour accéder aux statistiques réelles.</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Identifiant"
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:border-pink-300 focus:bg-white focus:ring-0 transition-all font-medium"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Mot de passe"
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:border-pink-300 focus:bg-white focus:ring-0 transition-all font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-center font-bold text-sm bg-red-50 p-3 rounded-xl">{error}</p>}

            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl"
            >
              Connexion Admin
            </button>

            <div className="bg-pink-50 p-4 rounded-2xl border border-dashed border-pink-200 mt-6">
              <p className="text-pink-600 text-[10px] uppercase font-black mb-1 text-center">Accès de Test :</p>
              <div className="flex justify-between text-xs text-gray-400 font-mono">
                <span>User: <b>Glamourly</b></span>
                <span>Pass: <b>Test1234</b></span>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-4">
                Tableau de Bord Admin
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
            </h1>
            <p className="mt-4 text-xl text-gray-500">Statistiques de production réelles</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-100 text-red-600 font-bold rounded-2xl hover:bg-red-200 transition-all font-medium"
          >
            Déconnexion
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-100 bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Produits les plus populaires</h2>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.5-7 3 10 1 15 1 15z" />
            </svg>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold border-b border-gray-100">
                  <th className="px-6 py-4">Produit</th>
                  <th className="px-6 py-4">Catégorie</th>
                  <th className="px-6 py-4">Prix (DH)</th>
                  <th className="px-6 py-4 text-center">Vues</th>
                  <th className="px-6 py-4 text-right">Tendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.length > 0 ? stats.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-pink-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-100" />
                        <span className="font-semibold text-gray-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-4 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-600 shadow-sm uppercase">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-bold">{item.price}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-black text-gray-900">{item.views}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="w-full bg-gray-100 rounded-full h-2.5 max-w-[100px] inline-block shadow-inner">
                        <div
                          className="bg-gradient-to-r from-pink-400 to-rose-500 h-2.5 rounded-full"
                          style={{ width: `${Math.min(100, (item.views / (stats[0]?.views || 1)) * 100)}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center text-gray-400">
                        <div className="flex flex-col items-center gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            Aucune donnée. Visitez plus de produits !
                        </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-lg border-b-4 border-pink-500">
            <h3 className="text-gray-400 text-xs font-black uppercase mb-2 tracking-widest">Base de Données</h3>
            <p className="text-3xl font-black text-gray-900 italic">SQLite (V2)</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-lg border-b-4 border-rose-500">
            <h3 className="text-gray-400 text-xs font-black uppercase mb-2 tracking-widest">Utilisateurs</h3>
            <p className="text-3xl font-black text-gray-900">Actifs</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-lg border-b-4 border-black">
            <h3 className="text-gray-400 text-xs font-black uppercase mb-2 tracking-widest">Source JSON</h3>
            <p className="text-3xl font-black text-gray-900">75 Produits</p>
          </div>
        </div>
      </div>
    </div>
  );
}
