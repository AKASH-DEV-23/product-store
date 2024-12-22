import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],

  // Set products state
  setProducts: (products) => set({ products }),

  // Fetch all products
  fetchProducts: async () => {
    try {
      const res = await fetch("/api/products");

      // Handle non-JSON or error responses
      if (!res.ok) {
        console.error("Failed to fetch products:", res.statusText);
        return { success: false, message: "Failed to fetch products" };
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : { data: [] };

      set({ products: data.data });
      return { success: true, message: "Products fetched successfully" };
    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        success: false,
        message: "An error occurred while fetching products",
      };
    }
  },

  // Create a new product
  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      return { success: false, message: "Please fill in all fields." };
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return {
          success: false,
          message: errorText || "Failed to create product",
        };
      }

      const data = await res.json();
      set((state) => ({ products: [...state.products, data.data] }));
      return { success: true, message: "Product created successfully" };
    } catch (error) {
      console.error("Error creating product:", error);
      return {
        success: false,
        message: "An error occurred while creating the product",
      };
    }
  },

  // Delete a product
  deleteProduct: async (pid) => {
    try {
      const res = await fetch(`/api/products/${pid}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorText = await res.text();
        return {
          success: false,
          message: errorText || "Failed to delete product",
        };
      }

      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        products: state.products.filter((product) => product._id !== pid),
      }));
      return { success: true, message: "Product deleted successfully" };
    } catch (error) {
      console.error("Error deleting product:", error);
      return {
        success: false,
        message: "An error occurred while deleting the product",
      };
    }
  },

  // Update a product
  updateProduct: async (pid, updatedProduct) => {
    try {
      const res = await fetch(`/api/products/${pid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return {
          success: false,
          message: errorText || "Failed to update product",
        };
      }

      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        products: state.products.map((product) =>
          product._id === pid ? data.data : product
        ),
      }));
      return { success: true, message: "Product updated successfully" };
    } catch (error) {
      console.error("Error updating product:", error);
      return {
        success: false,
        message: "An error occurred while updating the product",
      };
    }
  },
}));
