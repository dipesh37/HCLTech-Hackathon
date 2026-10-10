import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Heart, ShoppingBag, Truck, RefreshCw, ShieldCheck, ChevronRight, PackageOpen } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage = ({
  allProducts = [],
  wishlistIds = [],
  onAddToCart,
  onToggleWishlist
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the product by ID from the products list
  const product = allProducts.find((p) => String(p.id) === String(id));

  // Scroll to top whenever the product ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Related products from the same category (excluding current product)
  const relatedProducts = allProducts
    .filter((p) => p.category === product?.category && String(p.id) !== String(id))
    .slice(0, 4);

  // If no related products in same category, pick other products
  const finalRelated = relatedProducts.length > 0
    ? relatedProducts
    : allProducts.filter((p) => String(p.id) !== String(id)).slice(0, 4);

  const isWishlisted = product ? wishlistIds.includes(product.id) : false;

  // Render Product Not Found state if invalid ID
  if (!product) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-white dark:bg-[#2C3625] border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex items-center justify-center text-[#F28482]">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0]">
          Product Not Found
        </h2>
        <p className="text-sm text-[#2C3625]/70 dark:text-[#FEF9F0]/70 max-w-md mx-auto">
          The product you are looking for does not exist or may have been removed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F28482] hover:bg-[#E57371] text-[#FEF9F0] text-xs font-semibold shadow-xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shop</span>
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[#2C3625]/70 dark:text-[#FEF9F0]/70 hover:text-[#F28482] dark:hover:text-[#F28482] font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shop</span>
        </Link>

        {/* Breadcrumb path */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[#2C3625]/60 dark:text-[#FEF9F0]/60">
          <Link to="/" className="hover:underline">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span>{product.category}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="font-semibold text-[#2C3625] dark:text-[#FEF9F0] truncate max-w-[160px] sm:max-w-xs">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left Column: Product Image (Sticky on Desktop) */}
        <div className="md:sticky md:top-24 rounded-3xl overflow-hidden border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 bg-white dark:bg-[#2C3625]/50 aspect-square shadow-sm">
          <img
            src={product.image || product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Right Column: Product Details & Actions */}
        <div className="space-y-6">
          {/* Category & Bestseller Tag */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#84A59D]">
              {product.category}
            </span>
            {product.isBestseller && (
              <span className="bg-[#F28482] text-[#FEF9F0] text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Bestseller
              </span>
            )}
          </div>

          {/* Product Title */}
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0] leading-tight">
            {product.name}
          </h1>

          {/* Rating & Brand */}
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 bg-[#F9DC5C]/30 dark:bg-[#F9DC5C]/20 px-2.5 py-1 rounded-full text-[#2C3625] dark:text-[#FEF9F0]">
              <Star className="w-4 h-4 fill-[#F9DC5C] text-[#F9DC5C]" />
              <span className="font-bold tabular-nums">{product.rating}</span>
            </div>
            <span className="text-[#2C3625]/80 dark:text-[#FEF9F0]/80">
              ({product.reviewsCount || 45} customer reviews)
            </span>
            {product.brand && (
              <>
                <span className="text-[#2C3625]/40 dark:text-[#FEF9F0]/40">•</span>
                <span className="font-medium text-[#2C3625]/85 dark:text-[#FEF9F0]/85">
                  Brand: {product.brand}
                </span>
              </>
            )}
          </div>

          {/* Price Tag */}
          <div className="pt-1 border-t border-[#2C3625]/10 dark:border-[#FEF9F0]/15">
            <span className="font-display text-3xl font-bold tracking-tight tabular-nums text-[#2C3625] dark:text-[#FEF9F0]">
              ${product.price?.toLocaleString()}
            </span>
          </div>

          {/* Description */}
          <p className="font-sans text-base text-[#2C3625]/90 dark:text-[#FEF9F0]/90 leading-relaxed font-normal max-w-prose">
            {product.description}
          </p>

          {/* Action Buttons: Add to Cart & Wishlist */}
          <div className="pt-4 flex items-center gap-3">
            <button
              onClick={() => onAddToCart(product)}
              className="flex-1 py-3.5 px-6 rounded-full bg-[#F28482] hover:bg-[#E57371] text-[#FEF9F0] text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#FEF9F0]" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={() => onToggleWishlist(product)}
              className="p-3.5 rounded-full bg-white dark:bg-[#2C3625] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 text-[#2C3625] dark:text-[#FEF9F0] hover:border-[#F28482] hover:text-[#F28482] transition-colors shadow-xs cursor-pointer"
              title={isWishlisted ? "Remove from Saved" : "Save to Wishlist"}
              aria-label={isWishlisted ? "Remove from Saved" : "Save to Wishlist"}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isWishlisted
                    ? 'fill-[#F28482] text-[#F28482]'
                    : 'text-[#2C3625] dark:text-[#FEF9F0]'
                }`}
              />
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#2C3625]/10 dark:border-[#FEF9F0]/15 text-center text-xs text-[#2C3625]/85 dark:text-[#FEF9F0]/85">
            <div className="p-3 rounded-2xl bg-white dark:bg-[#2C3625] border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex flex-col items-center gap-1.5 shadow-xs">
              <Truck className="w-4 h-4 text-[#84A59D]" />
              <span className="font-medium text-xs">Free Shipping</span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-[#2C3625] border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex flex-col items-center gap-1.5 shadow-xs">
              <RefreshCw className="w-4 h-4 text-[#84A59D]" />
              <span className="font-medium text-xs">30-Day Returns</span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-[#2C3625] border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex flex-col items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#84A59D]" />
              <span className="font-medium text-xs">Quality Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Card */}
      {product.details && (
        <section className="p-6 rounded-3xl bg-white dark:bg-[#2C3625] border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 space-y-2 shadow-xs">
          <h3 className="font-display text-xs font-semibold text-[#84A59D] uppercase tracking-wider">
            Specifications
          </h3>
          <p className="font-sans text-sm sm:text-base text-[#2C3625]/90 dark:text-[#FEF9F0]/90 leading-relaxed font-normal max-w-prose">
            {product.details}
          </p>
        </section>
      )}

      {/* "You May Also Like" Grid */}
      {finalRelated.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-[#2C3625]/10 dark:border-[#FEF9F0]/15">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0]">
              You May Also Like
            </h2>
            <span className="text-xs text-[#2C3625]/75 dark:text-[#FEF9F0]/75 font-medium">
              More from {product.category}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {finalRelated.map((relProduct) => (
              <ProductCard
                key={relProduct.id}
                product={relProduct}
                isWishlisted={wishlistIds.includes(relProduct.id)}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
