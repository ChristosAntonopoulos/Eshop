import { Input } from "@/components/ui/Input";
import type { Category } from "@/features/products/types/product.types";
import styles from "./ProductFilters.module.css";

export interface ProductFilterState {
  search: string;
  categoryId: string;
  onlyInStock: boolean;
}

interface ProductFiltersProps {
  filters: ProductFilterState;
  categories: Category[];
  onChange: (filters: ProductFilterState) => void;
}

export function ProductFilters({
  filters,
  categories,
  onChange,
}: ProductFiltersProps) {
  const update = (partial: Partial<ProductFilterState>) =>
    onChange({ ...filters, ...partial });

  return (
    <div className={styles.root}>
      <Input
        label="Search"
        type="search"
        placeholder="Search products…"
        value={filters.search}
        onChange={(e) => update({ search: e.target.value })}
      />

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Category</legend>
        <label className={styles.radio}>
          <input
            type="radio"
            name="category"
            checked={filters.categoryId === ""}
            onChange={() => update({ categoryId: "" })}
          />
          All categories
        </label>
        {categories.map((cat) => (
          <label key={cat.id} className={styles.radio}>
            <input
              type="radio"
              name="category"
              checked={filters.categoryId === cat.id}
              onChange={() => update({ categoryId: cat.id })}
            />
            {cat.name}
          </label>
        ))}
      </fieldset>

      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={filters.onlyInStock}
          onChange={(e) => update({ onlyInStock: e.target.checked })}
        />
        In stock only
      </label>
    </div>
  );
}
