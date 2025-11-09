"use client"
import { useProducts } from "@/lib/products-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Edit } from "lucide-react"
import { useState, useEffect } from "react"

export default function AdminProductsPage() {
  const { fetchAllProducts, addProduct, updateProduct, deleteProduct } = useProducts()
  const [products, setProducts] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    income: "",
    plan: "Starter",
    isLuckyOrderProduct: "no",
    imageFile: undefined as File | undefined
  })

  const [editProduct, setEditProduct] = useState({
    id: "",
    name: "",
    description: "",
    rating: "",
    income: "",
    plan: "",
    isLuckyOrderProduct: "",
    imageFile: undefined as File | undefined,
    currentImageUrl: ""
  })

  // ✅ Fetch all products
  useEffect(() => {
    const getProducts = async () => {
      const allProducts = await fetchAllProducts()
      console.log("Products:", allProducts)
      setProducts(allProducts)
    }
    getProducts()
  }, [])

  // ✅ Add Product
  const handleAddProduct = async () => {
    if (!newProduct.name) return alert("Name is required")
    setIsUploading(true)
    try {
      await addProduct(newProduct)
      setNewProduct({ name: "", description: "", income: "", plan: "Starter", isLuckyOrderProduct: "no", imageFile: undefined })
      setIsModalOpen(false)
    } catch (e: any) {
      alert(e.message)
    } finally {
      setIsUploading(false)
    }
  }

  // ✅ Edit Product
  const handleEditProduct = async () => {
    if (!editProduct.name) return alert("Name is required")
    setIsUploading(true)
    try {
      await updateProduct(editProduct.id, {
        name: editProduct.name,
        description: editProduct.description,
        rating: Number(editProduct.rating),
        ...(editProduct.imageFile ? { imageFile: editProduct.imageFile } : {}),
        income: editProduct.income,
        plan: editProduct.plan,
        isLuckyOrderProduct: editProduct.isLuckyOrderProduct
      })
      setIsEditModalOpen(false)
      setEditProduct({
        id: "",
        name: "",
        description: "",
        rating: "",
        income: "",
        plan: "",
        isLuckyOrderProduct: "",
        imageFile: undefined,
        currentImageUrl: ""
      })
    } catch (e: any) {
      alert(e.message)
    } finally {
      setIsUploading(false)
    }
  }

  // ✅ Separate products by type
  const normalProducts = products.filter(p => p.isLuckyOrderProduct === "no")
  const luckyProducts = products.filter(p => p.isLuckyOrderProduct === "yes")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
          <p className="text-gray-600">Add, edit, or remove products</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
          Add Product
        </Button>
      </div>

      {/* ➕ Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>

            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="number"
              placeholder="Product Income"
              value={newProduct.income}
              onChange={(e) => setNewProduct({ ...newProduct, income: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            />

            {/* Lucky Order Type */}
            <select
              value={newProduct.isLuckyOrderProduct}
              onChange={(e) => setNewProduct({ ...newProduct, isLuckyOrderProduct: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            >
              <option value="no">Normal Product</option>
              <option value="yes">Lucky Order Product</option>
            </select>

            {/* Plan */}
            <select
              value={newProduct.plan}
              onChange={(e) => setNewProduct({ ...newProduct, plan: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            >
              <option value="Starter">Starter $100</option>
              <option value="Basic">Basic $300</option>
              <option value="Beginner">Beginner $500</option>
              <option value="Advanced">Advanced $1,000</option>
              <option value="Professional">Professional $1,500</option>
              <option value="Premium">Premium $2,000</option>
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setNewProduct({ ...newProduct, imageFile: e.target.files[0] })
                }
              }}
              className="border p-2 rounded w-full mb-4"
            />

            <div className="flex gap-2">
              <Button onClick={handleAddProduct} className="flex-1 bg-green-600 hover:bg-green-700 text-white" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Add Product"}
              </Button>
              <Button onClick={() => setIsModalOpen(false)} variant="outline" className="flex-1" disabled={isUploading}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ✏️ Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>

            {editProduct.currentImageUrl && (
              <img src={editProduct.currentImageUrl} alt="Current" className="w-full h-48 object-contain rounded mb-4 bg-gray-100" />
            )}

            <input
              type="text"
              placeholder="Product Name"
              value={editProduct.name}
              onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              placeholder="Description"
              value={editProduct.description}
              onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="number"
              placeholder="Product Income"
              value={editProduct.income}
              onChange={(e) => setEditProduct({ ...editProduct, income: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            />

            <select
              value={editProduct.isLuckyOrderProduct}
              onChange={(e) => setEditProduct({ ...editProduct, isLuckyOrderProduct: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            >
              <option value="no">Normal Product</option>
              <option value="yes">Lucky Order Product</option>
            </select>

            <select
              value={editProduct.plan}
              onChange={(e) => setEditProduct({ ...editProduct, plan: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            >
              <option value="Starter">Starter $100</option>
              <option value="Basic">Basic $300</option>
              <option value="Beginner">Beginner $500</option>
              <option value="Advanced">Advanced $1,000</option>
              <option value="Professional">Professional $1,500</option>
              <option value="Premium">Premium $2,000</option>
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setEditProduct({ ...editProduct, imageFile: e.target.files[0] })
                }
              }}
              className="border p-2 rounded w-full mb-4"
            />

            <div className="flex gap-2">
              <Button onClick={handleEditProduct} className="flex-1 bg-green-600 hover:bg-green-700 text-white" disabled={isUploading}>
                {isUploading ? "Saving..." : "Save Changes"}
              </Button>
              <Button onClick={() => setIsEditModalOpen(false)} variant="outline" className="flex-1" disabled={isUploading}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 📦 Product Tabs */}
      <Tabs defaultValue="normal" className="space-y-4">
        <TabsList className="bg-green-50 border-2 border-green-200">
          <TabsTrigger value="normal" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Normal Products ({normalProducts.length})
          </TabsTrigger>
          <TabsTrigger value="lucky" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Lucky Order Products ({luckyProducts.length})
          </TabsTrigger>
        </TabsList>

        {/* Normal Products */}
        <TabsContent value="normal" className="space-y-4">
          {normalProducts.length === 0 ? (
            <Card><CardContent className="py-10 text-center text-gray-500">No normal products found</CardContent></Card>
          ) : (
            normalProducts.map((p) => (
              <ProductCard key={p._id} product={p} onEdit={setEditProduct} onDelete={deleteProduct} setIsEditModalOpen={setIsEditModalOpen} />
            ))
          )}
        </TabsContent>

        {/* Lucky Products */}
        <TabsContent value="lucky" className="space-y-4">
          {luckyProducts.length === 0 ? (
            <Card><CardContent className="py-10 text-center text-gray-500">No lucky order products found</CardContent></Card>
          ) : (
            luckyProducts.map((p) => (
              <ProductCard key={p._id} product={p} onEdit={setEditProduct} onDelete={deleteProduct} setIsEditModalOpen={setIsEditModalOpen} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ✅ Reusable Product Card
function ProductCard({ product, onEdit, onDelete, setIsEditModalOpen }: any) {
  return (
    <Card className="border-2 border-green-200 hover:border-green-500 transition-colors">
      <CardHeader className="flex justify-between items-start">
        <div>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>{product.isLuckyOrderProduct === "yes" ? "🎁 Lucky Order" : "🛍️ Normal Product"}</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onEdit({
                id: product._id,
                name: product.name,
                description: product.description,
                rating: product.rating?.toString() || "",
                imageFile: undefined,
                currentImageUrl: product.imageUrl,
                income: product.income?.toString() || "",
                plan: product.plan,
                isLuckyOrderProduct: product.isLuckyOrderProduct
              })
              setIsEditModalOpen(true)
            }}
            className="gap-2"
          >
            <Edit className="w-4 h-4" /> Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this product?")) {
                onDelete(product._id)
              }
            }}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>{product.description}</p>
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-contain rounded bg-gray-100" />
        )}
        <p className="text-sm text-muted-foreground">Plan: {product.plan}</p>
        <p className="text-xs text-muted-foreground">Added: {new Date(product.createdAt).toLocaleString()}</p>
      </CardContent>
    </Card>
  )
}
