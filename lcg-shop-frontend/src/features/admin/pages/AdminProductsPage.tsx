import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { productRepository } from "@/services/products";
import { categoryRepository } from "@/services/categories";
import type { Product } from "@/features/products/types/product.types";
import type { Category } from "@/features/products/types/product.types";
import { formatCurrency } from "@/utils/formatCurrency";
import styles from "../admin.module.css";

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (nextSearch = search, nextCategory = categoryId) => {
    setLoading(true);
    setError(null);
    try {
      const [list, cats] = await Promise.all([
        productRepository.getProducts({
          includeInactive: true,
          search: nextSearch || undefined,
          categoryId: nextCategory || undefined,
          sortBy: "newest",
        }),
        categoryRepository.getCategories({ includeInactive: true }),
      ]);
      setProducts(list);
      setCategories(cats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleActive = async (product: Product) => {
    try {
      await productRepository.setActive(product.id, !product.isActive);
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update product.",
      );
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1>Products</h1>
          <p>Create, edit, and activate catalog items.</p>
        </div>
        <Link to="/admin/products/new">
          <Button variant="accent">
            <Plus size={16} />
            New product
          </Button>
        </Link>
      </div>

      <div className={styles.toolbar}>
        <Input
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Name or tags"
        />
        <Select
          label="Category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={[
            { value: "", label: "All categories" },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
        <Button
          variant="secondary"
          onClick={() => void load(search, categoryId)}
        >
          Filter
        </Button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <Spinner />
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Flags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                    <div className={styles.muted}>{product.categoryId}</div>
                  </td>
                  <td>{formatCurrency(product.price)}</td>
                  <td
                    className={
                      product.stockQuantity <= 5 ? styles.lowStock : undefined
                    }
                  >
                    {product.stockQuantity}
                  </td>
                  <td>
                    {product.isActive ? (
                      <Badge variant="category">Active</Badge>
                    ) : (
                      <Badge variant="out-of-stock">Inactive</Badge>
                    )}
                  </td>
                  <td>
                    {product.isFeatured && (
                      <Badge variant="sale">Featured</Badge>
                    )}{" "}
                    {product.isNew && <Badge variant="new">New</Badge>}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link to={`/admin/products/${product.id}/edit`}>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => void handleToggleActive(product)}
                      >
                        {product.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className={styles.muted}>
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
