import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar({ cartCount }) {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem('adminSession') === 'true';
    if (isAdmin) {
      setUser({ username: 'Glamourly' });
    } else {
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('adminSession');
    setUser(null);
    window.location.reload();
  };

  const navLinks = [
    { name: 'Maquillage', path: '/category/Makeup' },
    { name: 'Soins de la peau', path: '/category/Skincare' },
    { name: 'Accessoires', path: '/category/Accessories' },
  ];

  return (
    <>
      <nav className="bg-white px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden text-gray-600 hover:text-pink-500 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <Link to="/" className="text-2xl font-bold text-pink-500">Glamourly</Link>
        </div>

        <div className="hidden md:flex space-x-8 text-gray-600 font-medium text-sm lg:text-base">
          {navLinks.map(link => (
            <Link key={link.name} to={link.path} className="hover:text-pink-500 transition-colors">{link.name}</Link>
          ))}
        </div>

        <div className="flex items-center space-x-4 md:space-x-6">
          {user ? (
            <div className="hidden md:block relative group">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                alt={user.username}
                className="w-10 h-10 rounded-full border-2 border-pink-500 p-0.5 cursor-pointer hover:shadow-lg transition-all"
              />
              <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl p-3 hidden group-hover:block w-40 z-50 border border-pink-50">
                <p className="text-gray-800 font-bold text-sm mb-2">{user.username}</p>
                <div className="h-px bg-pink-50 w-full mb-3"></div>
                <Link to="/admin" className="text-xs text-gray-600 hover:text-pink-500 font-bold w-full text-left flex items-center gap-2 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Panel Admin
                </Link>
                <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-600 font-bold w-full text-left flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <Link to="/admin" className="hidden md:block text-gray-600 hover:text-pink-500 transition-colors font-medium">Connexion</Link>
          )}

          <Link to="/cart" className="relative group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-600 group-hover:text-pink-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
        <aside className={`absolute top-0 left-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-10">
              <span className="text-xl font-bold text-pink-500">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-pink-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6 flex-1">
              {navLinks.map(link => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-semibold text-gray-700 hover:text-pink-500 transition-all border-l-4 border-transparent hover:border-pink-500 pl-4"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-gray-100">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-6 bg-pink-50 p-4 rounded-2xl">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                      alt={user.username}
                      className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                    />
                    <span className="font-bold text-gray-800">{user.username}</span>
                  </div>
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 w-full text-left font-bold text-gray-600 px-4 py-3 hover:bg-gray-50 rounded-xl transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Panel Admin
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left font-bold text-red-500 px-4 py-3 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link 
                  to="/admin" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-4 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-100"
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
