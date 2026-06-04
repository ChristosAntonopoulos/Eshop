import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductPrice } from "@/components/product/ProductPrice";
import { ProductBadges } from "@/components/product/ProductBadges";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "@/features/cart/CartContext";
import { productRepository } from "@/services/products";
import type { Product } from "../types/product.types";
import styles from "./ProductDetailPage.module.css";

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading, error } = useProduct(slug);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setActiveImage(0);
      productRepository.getRelatedProducts(product.id).then(setRelated);
    }
  }, [product]);

  if (loading) {
    return (
      <Container>
        <div className={styles.center}>
          <Spinner />
        </div>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container>
        <EmptyState
          title="Product not found"
          description="This item may no longer be available."
          action={
            <Link to="/products">
              <Button variant="primary">Back to products</Button>
            </Link>
          }
        />
      </Container>
    );
  }

  const inStock = product.stockQuantity > 0;
  const lowStock = inStock && product.stockQuantity <= 5;
  const images =
    product.gallery.length > 0 ? product.gallery : [product.imageUrl];

  return (
    <Container>
      <nav className={styles.breadcrumb}>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      <div className={styles.grid}>
        <div className={styles.gallery}>
          <img
            src={images[activeImage]}
            alt={product.name}
            className={styles.mainImage}
          />
          {images.length > 1 && (
            <div className={styles.thumbs}>
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className={i === activeImage ? styles.thumbActive : styles.thumb}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.info}>
          <ProductBadges product={product} />
          <h1 className={styles.title}>{product.name}</h1>
          {product.brand && <p className={styles.brand}>{product.brand}</p>}
          <ProductPrice
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            size="lg"
          />
          <p
            className={
              inStock
                ? lowStock
                  ? styles.stockLow
                  : styles.stockOk
                : styles.stockOut
            }
            role="status"
          >
            {!inStock
              ? "Out of stock — check back soon"
              : lowStock
                ? `Only ${product.stockQuantity} left in stock`
                : "In stock — ready to ship"}
          </p>
          <p className={styles.short}>{product.shortDescription}</p>
          <p className={styles.desc}>{product.description}</p>

          {product.nutritionalInfo && (
            <div className={styles.nutrition}>
              <h2>Nutritional info</h2>
              <dl>
                {product.nutritionalInfo.servingSize && (
                  <>
                    <dt>Serving</dt>
                    <dd>{product.nutritionalInfo.servingSize}</dd>
                  </>
                )}
                {product.nutritionalInfo.protein && (
                  <>
                    <dt>Protein</dt>
                    <dd>{product.nutritionalInfo.protein}</dd>
                  </>
                )}
                {product.nutritionalInfo.carbs && (
                  <>
                    <dt>Carbs</dt>
                    <dd>{product.nutritionalInfo.carbs}</dd>
                  </>
                )}
                {product.nutritionalInfo.calories && (
                  <>
                    <dt>Calories</dt>
                    <dd>{product.nutritionalInfo.calories}</dd>
                  </>
                )}
              </dl>
            </div>
          )}

          <div className={styles.purchase}>
            <QuantitySelector
              value={quantity}
              max={product.stockQuantity}
              onChange={setQuantity}
              disabled={!inStock}
            />
            <Button
              variant="accent"
              size="lg"
              disabled={!inStock}
              onClick={() => addToCart(product, quantity)}
            >
              {inStock ? "Add to cart" : "Out of stock"}
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className={styles.related}>
          <h2>Related products</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </Container>
  );
}
