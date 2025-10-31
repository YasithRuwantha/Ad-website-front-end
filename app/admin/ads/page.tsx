"use client"
import { useProducts } from "@/lib/products-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Edit } from "lucide-react"
import { useState } from "react"

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const [newProduct, setNewProduct] = useState<{ name: string; description: string; imageFile?: File }>({
    name: "",
    description: "",
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<{ id: string; name: string; description: string; imageFile?: File }>({
    id: "",
    name: "",
    description: "",
  })

  // ✅ Add Product
  const handleAddProduct = async () => {
    if (!newProduct.name) return alert("Name is required")

    try {
      await addProduct(newProduct)
      setNewProduct({ name: "", description: "" })
      setIsModalOpen(false)
    } catch (e: any) {
      alert(e.message)
    }
  }

  // ✅ Edit Product
  const handleEditProduct = async () => {
    if (!editProduct.name) return alert("Name is required")

    try {
      await updateProduct(editProduct.id, {
        name: editProduct.name,
        description: editProduct.description,
      })
      setIsEditModalOpen(false)
    } catch (e: any) {
      alert(e.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Products</h1>
          <p className="text-muted-foreground">Add, edit, or remove products</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-white">
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
              <Button onClick={handleAddProduct} className="flex-1 bg-primary text-white">
                Add Product
              </Button>
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="outline"
                className="flex-1"
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
              <Button onClick={handleEditProduct} className="flex-1 bg-primary text-white">
                Save Changes
              </Button>
              <Button
                onClick={() => setIsEditModalOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 📦 Product List Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-primary/10 border border-primary/20">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All Products ({products.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {products.length === 0 ? (
            <Card className="border-primary/20">
              <CardContent className="pt-12 pb-12 text-center text-muted-foreground">
                No products found
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {products.map((p) => (
                <Card key={p._id} className="border-primary/20">
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
                          })
                          setIsEditModalOpen(true)
                        }}
                        className="gap-2"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </Button>
                      <Button variant="destructive" onClick={() => deleteProduct(p._id)} className="gap-2">
                        <Trash2 className="w-4 h-4" /> Delete
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-foreground line-clamp-2">{p.description}</p>
                    {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-48 object-cover rounded" />}
                    <p className="text-sm text-muted-foreground">
                      Rating: {p.rating} ({p.ratedBy} people rated)
                    </p>
                    <p className="text-xs text-muted-foreground">Added: {new Date(p.addedTime).toLocaleString()}</p>
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
