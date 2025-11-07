"use client"
import { useProducts } from "@/lib/products-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Edit } from "lucide-react"
import { useState } from "react"

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const [newProduct, setNewProduct] = useState<{
    name: string;
    description: string;
    income: string;
    plan: string;
    imageFile?: File;
  }>({
    name: "",
    description: "",
    income: "",
    plan: "Basic"
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<{
    rating: string
    id: string
    name: string
    description: string
    income: string
    imageFile?: File
    currentImageUrl?: string
  }>({
    id: "",
    name: "",
    description: "",
    rating: "",
    currentImageUrl: "",
    income: ""
  })
  const [isUploading, setIsUploading] = useState(false)

  // Add Product
  const handleAddProduct = async () => {
    if (!newProduct.name) return alert("Name is required")
    setIsUploading(true)
    try {
      await addProduct(newProduct)
  setNewProduct({ name: "", description: "", income: "", plan: "Basic" })
      setIsModalOpen(false)
    } catch (e: any) {
      alert(e.message)
    } finally {
      setIsUploading(false)
    }
  }

  // Edit Product
  const handleEditProduct = async () => {
    if (!editProduct.name) return alert("Name is required")
    setIsUploading(true)
    try {
      await updateProduct(editProduct.id, {
        name: editProduct.name,
        description: editProduct.description,
        rating: Number(editProduct.rating),
        ...(editProduct.imageFile ? { imageFile: editProduct.imageFile } : {}),
        income: Number(editProduct.income)
      })
      setIsEditModalOpen(false)
      setEditProduct({
        id: "",
        name: "",
        description: "",
        rating: "",
        imageFile: undefined,
        currentImageUrl: "",
        income: ""
      })
    } catch (e: any) {
      alert(e.message)
    } finally {
      setIsUploading(false)
    }
  }

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
            {/* Plan Dropdown */}
            <select
              value={newProduct.plan}
              onChange={(e) => setNewProduct({ ...newProduct, plan: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            >
              <option value="Basic">Starter $100</option>
              <option value="Silver">Basic $300</option>
              <option value="Gold">Beginner $500</option>
              <option value="Platinum">Advanced $1,000</option>
              <option value="Diamond">Professional $1,500</option>
              <option value="VIP">Premium $2,000</option>
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setNewProduct({ ...newProduct, imageFile: e.target.files[0] })
                }
              }}
              className="border p-2 rounded w-full mb-4"
            />

            <div className="flex gap-2">
              <Button
                onClick={handleAddProduct}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Add Product"}
              </Button>
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="outline"
                className="flex-1"
                disabled={isUploading}
              >
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

            {/* Current Image */}
            {editProduct.currentImageUrl && (
              <img
                src={editProduct.currentImageUrl}
                alt="Current Image"
                className="w-full h-48 object-contain rounded mb-4 bg-gray-100"
              />
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
              type="text"
              placeholder="Rating"
              value={editProduct.rating}
              onChange={(e) => setEditProduct({ ...editProduct, rating: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="number"
              placeholder="Product Income"
              value={editProduct.income}
              onChange={(e) => setEditProduct({ ...editProduct, income: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setEditProduct({ ...editProduct, imageFile: e.target.files[0] })
                }
              }}
              className="border p-2 rounded w-full mb-4"
            />

            <div className="flex gap-2">
              <Button
                onClick={handleEditProduct}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Save Changes"}
              </Button>
              <Button
                onClick={() => setIsEditModalOpen(false)}
                variant="outline"
                className="flex-1"
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 📦 Product List Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-green-50 border-2 border-green-200">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            All Products ({products.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {products.length === 0 ? (
            <Card className="border-2 border-green-200">
              <CardContent className="pt-12 pb-12 text-center text-gray-500">
                No products found
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {products.map((p) => (
                <Card key={p._id} className="border-2 border-green-200 hover:border-green-500 transition-colors">
                  <CardHeader className="flex justify-between items-start">
                    <div>
                      <CardTitle>{p.name}</CardTitle>
                      <CardDescription>Added by {p.addedBy}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditProduct({
                            id: p._id,
                            name: p.name,
                            description: p.description,
                            rating: p.rating.toString(),
                            imageFile: undefined,
                            currentImageUrl: p.imageUrl,
                            income: p.income?.toString() || ""
                          })
                          setIsEditModalOpen(true)
                        }}
                        className="gap-2"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => deleteProduct(p._id)}
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-foreground line-clamp-2">{p.description}</p>
                    {p.imageUrl && (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-48 object-contain rounded bg-gray-100"
                      />
                    )}
                    <p className="text-sm text-muted-foreground">
                      Rating: {p.rating} ({p.ratedBy} people rated)
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Plan: {p.plan || "-"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Added: {new Date(p.createdAt).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
