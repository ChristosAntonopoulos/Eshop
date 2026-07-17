import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { productRepository } from "@/services/products";
import { categoryRepository } from "@/services/categories";
import type { Category } from "@/features/products/types/product.types";
import type { ProductWriteInput } from "@/services/products/productRepository";
import styles from "../admin.module.css";

const emptyForm: ProductWriteInput = {
  name: "",
  description: "",
  shortDescription: "",
  categoryId: "",
  brand: "",
  price: 0,
  compareAtPrice: undefined,
  imageUrl: "https://picsum.photos/seed/new-product/600/600",
  gallery: [],
  stockQuantity: 0,
  isActive: true,
  isFeatured: false,
  isNew: true,
  tags: [],
};

export function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductWriteInput>(emptyForm);
  const [tagsText, setTagsText] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const cats = await categoryRepository.getCategories({
          includeInactive: true,
        });
        if (cancelled) return;
        setCategories(cats);

        if (!id) {
          setForm((prev) => ({
            ...prev,
            categoryId: cats[0]?.id ?? "",
          }));
          setLoading(false);
          return;
        }

        const product = await productRepository.getProductById(id);
        if (cancelled) return;
        if (!product) {
          setError("Product not found.");
          setLoading(false);
          return;
        }

        setForm({
          name: product.name,
          description: product.description,
          shortDescription: product.shortDescription,
          categoryId: product.categoryId,
          brand: product.brand ?? "",
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          imageUrl: product.imageUrl,
          gallery: product.gallery,
          stockQuantity: product.stockQuantity,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          isNew: product.isNew,
          tags: product.tags,
          nutritionalInfo: product.nutritionalInfo,
          slug: product.slug,
        });
        setTagsText(product.tags.join(", "));
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load product.",
          );
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const updateField = <K extends keyof ProductWriteInput>(
    key: K,
    value: ProductWriteInput[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload: ProductWriteInput = {
      ...form,
      tags: tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      gallery: form.gallery.length ? form.gallery : [form.imageUrl],
      brand: form.brand || undefined,
      compareAtPrice: form.compareAtPrice || undefined,
    };

    try {
      if (isEdit && id) {
        await productRepository.update(id, payload);
      } else {
        await productRepository.create(payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1>{isEdit ? "Edit product" : "New product"}</h1>
          <p>
            <Link to="/admin/products">← Back to products</Link>
          </p>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.form} onSubmit={(e) => void handleSubmit(e)}>
        <Input
          label="Name"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          required
        />
        <Input
          label="Short description"
          value={form.shortDescription}
          onChange={(e) => updateField("shortDescription", e.target.value)}
          required
        />
        <label className={styles.muted} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={4}
          required
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "10px",
            border: "1px solid var(--color-border)",
            font: "inherit",
          }}
        />

        <div className={styles.formRow}>
          <Select
            label="Category"
            value={form.categoryId}
            onChange={(e) => updateField("categoryId", e.target.value)}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            required
          />
          <Input
            label="Brand"
            value={form.brand ?? ""}
            onChange={(e) => updateField("brand", e.target.value)}
          />
        </div>

        <div className={styles.formRow}>
          <Input
            label="Price (€)"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => updateField("price", Number(e.target.value))}
            required
          />
          <Input
            label="Compare at price (€)"
            type="number"
            step="0.01"
            min="0"
            value={form.compareAtPrice ?? ""}
            onChange={(e) =>
              updateField(
                "compareAtPrice",
                e.target.value === "" ? undefined : Number(e.target.value),
              )
            }
          />
        </div>

        <div className={styles.formRow}>
          <Input
            label="Stock quantity"
            type="number"
            min="0"
            value={form.stockQuantity}
            onChange={(e) =>
              updateField("stockQuantity", Number(e.target.value))
            }
            required
          />
          <Input
            label="Image URL"
            value={form.imageUrl}
            onChange={(e) => updateField("imageUrl", e.target.value)}
            required
          />
        </div>

        <Input
          label="Tags (comma-separated)"
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
        />

        <div className={styles.checkRow}>
          <label>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => updateField("isActive", e.target.checked)}
            />
            Active
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => updateField("isFeatured", e.target.checked)}
            />
            Featured
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.isNew}
              onChange={(e) => updateField("isNew", e.target.checked)}
            />
            New
          </label>
        </div>

        <div className={styles.actions}>
          <Button type="submit" variant="accent" isLoading={saving}>
            {isEdit ? "Save changes" : "Create product"}
          </Button>
          <Link to="/admin/products">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
