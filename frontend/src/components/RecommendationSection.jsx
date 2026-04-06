import ProductCard from './ProductCard';

export default function RecommendationSection({ title, subtitle, products, loading }) {
  if (loading) {
    return (
      <div className="container mx-auto px-6 mt-20">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded-full mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[4/5] bg-gray-100 rounded-3xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <section className="container mx-auto px-6 mt-20">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
          {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
          <div className="h-1.5 w-20 bg-pink-500 rounded-full mt-2"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
