import { useEffect, useMemo, useState } from "react";
import { useCategories } from "../hooks/useCategories";
import { useSearchParams } from "react-router-dom";
import type { ProductFilterState } from "@/components/product/ProductFilters";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductSort, type SortValue } from "@/components/product/ProductSort";
import { useProducts } from "../hooks/useProducts";
import { debounce } from "@/utils/debounce";
import styles from "./ProductsPage.module.css";

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useCategories();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const categoryParam = searchParams.get("category") ?? "";
  const searchParam = searchParams.get("search") ?? "";

  const [filters, setFilters] = useState<ProductFilterState>({
    search: searchParam,
    categoryId: categoryParam,
    onlyInStock: false,
  });

  const [sortBy, setSortBy] = useState<SortValue>("newest");

  useEffect(() => {
    setFilters((f) => ({
      ...f,
      search: searchParam,
      categoryId: categoryParam,
    }));
  }, [searchParam, categoryParam]);

  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 300),
    [],
  );

  useEffect(() => {
    debouncedSetSearch(filters.search);
  }, [filters.search, debouncedSetSearch]);

  const query = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      categoryId: filters.categoryId || undefined,
      onlyInStock: filters.onlyInStock || undefined,
      sortBy,
    }),
    [debouncedSearch, filters.categoryId, filters.onlyInStock, sortBy],
  );

  const { products, loading, error } = useProducts(query);

  const handleFiltersChange = (next: ProductFilterState) => {
    setFilters(next);
    const params = new URLSearchParams(searchParams);
    if (next.search.trim()) {
      params.set("search", next.search.trim());
    } else {
      params.delete("search");
    }
    if (next.categoryId) {
      params.set("category", next.categoryId);
    } else {
      params.delete("category");
    }
    setSearchParams(params, { replace: true });
  };

  return (
    <Container>
      <header className={styles.header}>
        <h1 className="page-title">Products</h1>
        <p className="page-subtitle">
          Supplements, snacks, hydration and gear for training near OAKA
        </p>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <button
            type="button"
            className={styles.filterToggle}
            onClick={() => setFiltersOpen((v) => !v)}
          >
            Filters {filtersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <div
            className={`${styles.filtersPanel} ${filtersOpen ? styles.filtersOpen : ""}`}
          >
            <ProductFilters
              filters={filters}
              categories={categories}
              onChange={handleFiltersChange}
            />
          </div>
        </aside>

        <div className={styles.main}>
          <div className={styles.toolbar}>
            <p className={styles.count}>
              {loading ? "Loading…" : `${products.length} products`}
            </p>
            <ProductSort value={sortBy} onChange={setSortBy} />
          </div>

          {loading && (
            <div className={styles.center}>
              <Spinner />
            </div>
          )}

          {error && (
            <EmptyState title="Could not load products" description={error} />
          )}

          {!loading && !error && products.length === 0 && (
            <EmptyState
              title="No products found"
              description="Try adjusting filters or search terms."
            />
          )}

          {!loading && !error && products.length > 0 && (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </Container>
  );
}
