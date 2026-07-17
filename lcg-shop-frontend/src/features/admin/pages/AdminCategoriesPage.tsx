import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { categoryRepository } from "@/services/categories";
import type { Category } from "@/features/products/types/product.types";
import type { CategoryWriteInput } from "@/services/categories/categoryRepository";
import styles from "../admin.module.css";

const emptyForm: CategoryWriteInput = {
  name: "",
  description: "",
  imageUrl: "",
  isActive: true,
};

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryWriteInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await categoryRepository.getCategories({
        includeInactive: true,
      });
      setCategories(list);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load categories.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl ?? "",
      isActive: category.isActive,
      slug: category.slug,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload: CategoryWriteInput = {
      ...form,
      imageUrl: form.imageUrl?.trim() || undefined,
    };

    try {
      if (editingId) {
        await categoryRepository.update(editingId, payload);
      } else {
        await categoryRepository.create(payload);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save category.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      await categoryRepository.setActive(category.id, !category.isActive);
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update category.",
      );
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1>Categories</h1>
          <p>Organize the product catalog.</p>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.form} onSubmit={(e) => void handleSubmit(e)}>
        <h2 style={{ margin: 0, fontSize: "1.05rem" }}>
          {editingId ? "Edit category" : "New category"}
        </h2>
        <Input
          label="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
        <Input
          label="Description"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          required
        />
        <Input
          label="Image URL"
          value={form.imageUrl ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, imageUrl: e.target.value }))
          }
        />
        <label className={styles.checkRow}>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm((f) => ({ ...f, isActive: e.target.checked }))
            }
          />
          Active
        </label>
        <div className={styles.actions}>
          <Button type="submit" variant="accent" isLoading={saving}>
            {editingId ? "Save changes" : "Create category"}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel edit
            </Button>
          )}
        </div>
      </form>

      <section className={styles.section} style={{ marginTop: "2rem" }}>
        <h2>All categories</h2>
        {loading ? (
          <Spinner />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>
                      <strong>{category.name}</strong>
                      <div className={styles.muted}>{category.description}</div>
                    </td>
                    <td>{category.slug}</td>
                    <td>
                      {category.isActive ? (
                        <Badge variant="category">Active</Badge>
                      ) : (
                        <Badge variant="out-of-stock">Inactive</Badge>
                      )}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(category)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => void handleToggleActive(category)}
                        >
                          {category.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
