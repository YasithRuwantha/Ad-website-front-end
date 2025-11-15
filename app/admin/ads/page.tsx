"use client"
import { useProducts } from "@/lib/products-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Edit, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

const LIMIT = 50
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function AdminProductsPage() {
  const { addProduct, updateProduct, deleteProduct } = useProducts()

  // Pagination states
  const [normalProducts, setNormalProducts] = useState<any[]>([])
  const [luckyProducts, setLuckyProducts] = useState<any[]>([])
  const [normalPage, setNormalPage] = useState(1)
  const [luckyPage, setLuckyPage] = useState(1)
  const [normalHasMore, setNormalHasMore] = useState(true)
  const [luckyHasMore, setLuckyHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  // Modal states
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

  // Load Normal Products
  const loadNormalProducts = async (page: number = 1, reset = false) => {
    if (loading || (!normalHasMore && !reset)) return
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/products/all?page=${page}&limit=${LIMIT}&type=normal`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()

      setNormalProducts(prev => reset ? data.products : [...prev, ...data.products])
      setNormalHasMore(data.hasMore)
      setNormalPage(page)
    } catch (err) {
      console.error("Failed to load normal products:", err)
    } finally {
      setLoading(false)
    }
  }

  // Load Lucky Products
  const loadLuckyProducts = async (page: number = 1, reset = false) => {
    if (loading || (!luckyHasMore && !reset)) return
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/products/all?page=${page}&limit=${LIMIT}&type=lucky`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()

      setLuckyProducts(prev => reset ? data.products : [...prev, ...data.products])
      setLuckyHasMore(data.hasMore)
      setLuckyPage(page)
    } catch (err) {
      console.error("Failed to load lucky products:", err)
    } finally {
      setLoading(false)
    }
  }

  // Initial Load
  useEffect(() => {
    loadNormalProducts(1, true)
    loadLuckyProducts(1, true)
  }, [])

  // Add Product
  const handleAddProduct = async () => {
    if (!newProduct.name) return alert("Name is required")
    setIsUploading(true)
    try {
      await addProduct(newProduct)
      setNewProduct({ name: "", description: "", income: "", plan: "Starter", isLuckyOrderProduct: "no", imageFile: undefined })
      setIsModalOpen(false)

      // Reload first page of correct tab
      if (newProduct.isLuckyOrderProduct === "yes") {
        loadLuckyProducts(1, true)
      } else {
        loadNormalProducts(1, true)
      }
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
        income: editProduct.income,
        plan: editProduct.plan,
        isLuckyOrderProduct: editProduct.isLuckyOrderProduct,
        ...(editProduct.imageFile && { imageFile: editProduct.imageFile })
      })
      setIsEditModalOpen(false)

      // Refresh both tabs to reflect changes
      loadNormalProducts(1, true)
      loadLuckyProducts(1, true)
    } catch (e: any) {
      alert(e.message)
    } finally {
      setIsUploading(false)
    }
  }

  // Delete Product
  const handleDelete = async (id: string, isLucky: boolean) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return
    try {
      await deleteProduct(id)
      if (isLucky) {
        setLuckyProducts(prev => prev.filter(p => p._id !== id))
      } else {
        setNormalProducts(prev => prev.filter(p => p._id !== id))
      }
    } catch (err) {
      alert("Failed to delete product")
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

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>

            <input type="text" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="border p-2 rounded w-full mb-2" />
            <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="border p-2 rounded w-full mb-2 h-20" />
            <input type="number" placeholder="Income" value={newProduct.income} onChange={e => setNewProduct({ ...newProduct, income: e.target.value })} className="border p-2 rounded w-full mb-2" />

            <select value={newProduct.isLuckyOrderProduct} onChange={e => setNewProduct({ ...newProduct, isLuckyOrderProduct: e.target.value })} className="border p-2 rounded w-full mb-2">
              <option value="no">Normal Product</option>
              <option value="yes">Lucky Order Product</option>
            </select>

            <select value={newProduct.plan} onChange={e => setNewProduct({ ...newProduct, plan: e.target.value })} className="border p-2 rounded w-full mb-2">
              <option value="Starter">Starter $100</option>
              <option value="Basic">Basic $300</option>
              <option value="Beginner">Beginner $500</option>
              <option value="Advanced">Advanced $1,000</option>
              <option value="Professional">Professional $1,500</option>
              <option value="Premium">Premium $2,000</option>
            </select>

            <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && setNewProduct({ ...newProduct, imageFile: e.target.files[0] })} className="border p-2 rounded w-full mb-4" />

            <div className="flex gap-2">
              <Button onClick={handleAddProduct} disabled={isUploading} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                {isUploading ? "Adding..." : "Add Product"}
              </Button>
              <Button onClick={() => setIsModalOpen(false)} variant="outline" className="flex-1" disabled={isUploading}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            {editProduct.currentImageUrl && <img src={editProduct.currentImageUrl} alt="Current" className="w-full h-48 object-contain rounded mb-4 bg-gray-100" />}

            <input type="text" placeholder="Name" value={editProduct.name} onChange={e => setEditProduct({ ...editProduct, name: e.target.value })} className="border p-2 rounded w-full mb-2" />
            <textarea placeholder="Description" value={editProduct.description} onChange={e => setEditProduct({ ...editProduct, description: e.target.value })} className="border p-2 rounded w-full mb-2 h-20" />
            <input type="number" placeholder="Income" value={editProduct.income} onChange={e => setEditProduct({ ...editProduct, income: e.target.value })} className="border p-2 rounded w-full mb-2" />

            <select value={editProduct.isLuckyOrderProduct} onChange={e => setEditProduct({ ...editProduct, isLuckyOrderProduct: e.target.value })} className="border p-2 rounded w-full mb-2">
              <option value="no">Normal Product</option>
              <option value="yes">Lucky Order Product</option>
            </select>

            <select value={editProduct.plan} onChange={e => setEditProduct({ ...editProduct, plan: e.target.value })} className="border p-2 rounded w-full mb-2">
              <option value="Starter">Starter $100</option>
              <option value="Basic">Basic $300</option>
              <option value="Beginner">Beginner $500</option>
              <option value="Advanced">Advanced $1,000</option>
              <option value="Professional">Professional $1,500</option>
              <option value="Premium">Premium $2,000</option>
            </select>

            <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && setEditProduct({ ...editProduct, imageFile: e.target.files[0] })} className="border p-2 rounded w-full mb-4" />

            <div className="flex gap-2">
              <Button onClick={handleEditProduct} disabled={isUploading} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                {isUploading ? "Saving..." : "Save Changes"}
              </Button>
              <Button onClick={() => setIsEditModalOpen(false)} variant="outline" className="flex-1" disabled={isUploading}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs with Pagination */}
      <Tabs defaultValue="normal" className="space-y-6">
        <TabsList className="bg-green-50 border-2 border-green-200">
          <TabsTrigger value="normal" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Normal Products ({normalProducts.length})
          </TabsTrigger>
          <TabsTrigger value="lucky" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Lucky Order Products ({luckyProducts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="normal" className="space-y-4">
          {normalProducts.length === 0 && !loading && (
            <Card><CardContent className="py-10 text-center text-gray-500">No normal products found</CardContent></Card>
          )}

          {normalProducts.map(p => (
            <ProductCard
              key={p._id}
              product={p}
              onEdit={(data: any) => { setEditProduct({ ...data, rating: p.rating?.toString() || "" }); setIsEditModalOpen(true) }}
              onDelete={() => handleDelete(p._id, false)}
            />
          ))}

          {normalHasMore && (
            <div className="flex justify-center py-8">
              <Button onClick={() => loadNormalProducts(normalPage + 1)} disabled={loading} className="bg-green-600 hover:bg-green-700">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</> : "Load More Normal Products"}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="lucky" className="space-y-4">
          {luckyProducts.length === 0 && !loading && (
            <Card><CardContent className="py-10 text-center text-gray-500">No lucky order products found</CardContent></Card>
          )}

          {luckyProducts.map(p => (
            <ProductCard
              key={p._id}
              product={p}
              onEdit={(data: any) => { setEditProduct({ ...data, rating: p.rating?.toString() || "" }); setIsEditModalOpen(true) }}
              onDelete={() => handleDelete(p._id, true)}
            />
          ))}

          {luckyHasMore && (
            <div className="flex justify-center py-8">
              <Button onClick={() => loadLuckyProducts(luckyPage + 1)} disabled={loading} className="bg-green-600 hover:bg-green-700">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</> : "Load More Lucky Products"}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Reusable Product Card
function ProductCard({ product, onEdit, onDelete }: any) {
  return (
    <Card className="border-2 border-green-200 hover:border-green-500 transition-colors">
      <CardHeader className="flex flex-row justify-between items-start gap-4">
        <div className="space-y-1">
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>
            {product.isLuckyOrderProduct === "yes" ? "Lucky Order" : "Normal Product"}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit({
            id: product._id,
            name: product.name,
            description: product.description || "",
            income: product.income?.toString() || "",
            plan: product.plan || "Starter",
            isLuckyOrderProduct: product.isLuckyOrderProduct || "no",
            currentImageUrl: product.imageUrl || ""
          })}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600">{product.description || "No description"}</p>
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-contain rounded bg-gray-50" />
        )}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Plan: <strong>{product.plan}</strong></span>
          <span>Income: <strong>${product.income || 0}</strong></span>
          <span>Added: {new Date(product.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}