"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface Product {
  createdAt: string | number | Date
  _id: string
  name: string
  description: string
  rating: string
  ratedBy: number
  addedTime: string
  imageUrl: string
  addedBy: string
}

interface ProductsContextType {
  products: Product[]
  addProduct: (product: { name: string; description: string; imageFile?: File }) => Promise<void>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  fetchProducts: () => Promise<void>
}

const API_URL = process.env.NEXT_PUBLIC_API_URL
const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])

  // Fetch all products
  const fetchProducts = async () => {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API_URL}/api/products/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (res.ok) setProducts(data)
    else throw new Error(data.message || "Failed to fetch products")
  }

  useEffect(() => {
    fetchProducts().catch(console.error)
  }, [])

  // ✅ Add product
  const addProduct = async (product: { name: string; description: string; imageFile?: File }) => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")
    const email = user ? JSON.parse(user).email : "unknown"
    const now = new Date().toLocaleString();

    const formData = new FormData()
    formData.append("name", product.name)
    formData.append("description", product.description)
    formData.append("addedBy", email)
    formData.append("now", now)
    if (product.imageFile) formData.append("image", product.imageFile)
    
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

  // ✅ Update product
  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const token = localStorage.getItem("token")
    console.log("update product", updates);
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to update product")

    // ✅ Update UI immediately (use _id not id)
    setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, ...data } : p)))
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

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, fetchProducts }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) throw new Error("useProducts must be used within ProductsProvider")
  return context
}
