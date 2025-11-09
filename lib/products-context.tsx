"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface Product {
  createdAt: string | number | Date
  _id: string
  name: string
  description: string
  rating: number  // Changed from string to number
  ratedBy: number
  ratedCount?: number  // Added for consistency
  addedTime: string
  imageUrl: string
  addedBy: string
  price?: number      // Added price field
  income?: number     // Added income field
  plan?: string       // Added plan field
  isLuckyOrderProduct?: string
}

interface ProductsContextType {
  products: Product[]
  addProduct: (product: { name: string; description: string; income: string; plan: string; imageFile?: File, isLuckyOrderProduct?: string }) => Promise<void>
  updateProduct: (id: string, updates: Partial<Product> & { imageFile?: File; plan?: string; income?: string; isLuckyOrderProduct?: string}) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  fetchProducts: () => Promise<void>
  fetchAllProducts: () => Promise<Product[]>  // ✅ add this
  fetchLuckyOrderProducts: () => Promise<Product[]>
  fetchProductById : (productId: string) => Promise<Product[]>
}

const API_URL = process.env.NEXT_PUBLIC_API_URL
const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])

  // Fetch all products 30 rates per day
  const fetchProducts = async () => {
    const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/products/get-unrated-30-products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    // console.log("Fetched products 30 unrated:", data);

    if (res.ok) setProducts(data)
    else throw new Error(data.message || "Failed to fetch products")
  }

  useEffect(() => {
    fetchProducts().catch(console.error)
  }, [])



  // ✅ Add product
  const addProduct = async (product: { name: string; description: string; income: string; plan: string; imageFile?: File, isLuckyOrderProduct: string }) => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")
    const email = user ? JSON.parse(user).email : "unknown"
    const now = new Date().toLocaleString();
    

    const formData = new FormData()
    formData.append("name", product.name)
    formData.append("description", product.description)
    formData.append("addedBy", email)
    formData.append("now", now)
    formData.append("income", product.income)
    formData.append("isLuckyOrderProduct", product.isLuckyOrderProduct)
  if (product.imageFile) formData.append("image", product.imageFile)
  if (product.plan) formData.append("plan", product.plan)
    
    // ✅ Debug
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    const res = await fetch(`${API_URL}/api/products/add`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to add product")

    // ✅ Instantly add to UI
    setProducts((prev) => [...prev, data.product])
  }

  // ✅ Update product - handles both text and image updates
  const updateProduct = async (id: string, updates: Partial<Product> & { imageFile?: File; plan?: string; income?: string, isLuckyOrderProduct?: string }) => {
    const token = localStorage.getItem("token")
    console.log("update product", updates);
    
    const formData = new FormData()
    
    // Add text fields
    if (updates.name !== undefined) formData.append("name", updates.name)
    if (updates.description !== undefined) formData.append("description", updates.description)
    if (updates.rating !== undefined) formData.append("rating", updates.rating.toString())  // Convert to string
    if (updates.income !== undefined ) formData.append("income", String(updates.income))
    if (updates.plan !== undefined ) formData.append("plan", updates.plan)
    if (updates.isLuckyOrderProduct != undefined ) formData.append("isLuckyOrderProduct", updates.isLuckyOrderProduct)
 
    // Add image file if provided
    if (updates.imageFile) {
        formData.append("image", updates.imageFile)
    }
    
    // Debug: Log formData contents
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }
    
    const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "PUT",
        headers: { 
        Authorization: `Bearer ${token}` 
        // Don't set Content-Type - let browser set it with boundary for FormData
        },
        body: formData,
    })
    
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to update product")
    
    // Update UI immediately
    setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, ...data.product } : p)))
    
    // Refresh products to ensure consistency
    await fetchProducts()
    }

  // ✅ Delete product
  const deleteProduct = async (id: string) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to delete product")

    // ✅ Remove from UI instantly (use _id)
    setProducts((prev) => prev.filter((p) => p._id !== id))
  }

  const fetchAllProducts = async (): Promise<any[]> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return [];

      const res = await fetch(`${API_URL}/api/products/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch products");
      }

      const data = await res.json();
      return data; // ✅ return products
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      return [];
    }
  };


  const fetchLuckyOrderProducts = async (): Promise<Product[]> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return [];

      const res = await fetch(`${API_URL}/api/products/lucky-products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch lucky order products");

      return data; // ✅ Returns only lucky order products
    } catch (err) {
      console.error("❌ Error fetching lucky order products:", err);
      return [];
    }
  };


const fetchProductById = async (productId: string): Promise<Product | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const res = await fetch(`${API_URL}/api/products/product/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch product");

    return data.product || null; // ✅ single product
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    return null;
  }
};




  return (
    <ProductsContext.Provider value={{ 
      products, 
      addProduct, 
      updateProduct, 
      deleteProduct, 
      fetchProducts,
      fetchAllProducts,
      fetchLuckyOrderProducts,
      fetchProductById   
      }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) throw new Error("useProducts must be used within ProductsProvider")
  return context
}
