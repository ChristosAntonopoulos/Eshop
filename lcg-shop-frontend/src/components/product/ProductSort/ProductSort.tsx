import { Select } from "@/components/ui/Select";
import type { ProductQueryParams } from "@/services/products/productRepository";

export type SortValue = NonNullable<ProductQueryParams["sortBy"]>;

interface ProductSortProps {
  value: SortValue;
  onChange: (value: SortValue) => void;
}

const options = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name A–Z" },
];

export function ProductSort({ value, onChange }: ProductSortProps) {
  return (
    <Select
      label="Sort by"
      options={options}
      value={value}
      onChange={(e) => onChange(e.target.value as SortValue)}
    />
  );
}
