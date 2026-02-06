import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Store as StoreIcon, Shirt, ShoppingCart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Store() {
  const queryClient = useQueryClient();
  const [createProductOpen, setCreateProductOpen] = useState(false);
  const [createStoreOpen, setCreateStoreOpen] = useState(false);

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list('-created_date'),
  });

  const { data: teamStores = [] } = useQuery({
    queryKey: ['team-stores'],
    queryFn: () => base44.entities.TeamStore.list('-created_date'),
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => base44.entities.Team.list(),
  });

  const createProductMutation = useMutation({
    mutationFn: (data) => base44.entities.Product.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      setCreateProductOpen(false);
    },
  });

  const createStoreMutation = useMutation({
    mutationFn: (data) => base44.entities.TeamStore.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['team-stores']);
      setCreateStoreOpen(false);
    },
  });

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: 'jersey',
    base_price: 0,
    customizable: false,
    customization_price: 0,
    sizes: ['YS', 'YM', 'YL', 'S', 'M', 'L', 'XL'],
  });

  const [storeForm, setStoreForm] = useState({
    name: '',
    team_id: '',
    description: '',
    close_date: '',
  });

  const categoryIcons = {
    jersey: Shirt,
    hoodie: Shirt,
    't-shirt': Shirt,
    pants: Shirt,
    jacket: Shirt,
    hat: Shirt,
    accessory: ShoppingCart,
    equipment: ShoppingCart,
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Store</h1>
            <p className="text-white/40">Manage products, team stores & merch drops</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setCreateProductOpen(true)}
              variant="outline"
              className="border-white/[0.06]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
            <Button 
              onClick={() => setCreateStoreOpen(true)}
              className="bg-[#c9a962] text-[#0A0A0A] hover:bg-[#c9a962]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Team Store
            </Button>
          </div>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-white/[0.05] border-white/[0.06]">
            <TabsTrigger value="products">All Products ({products.length})</TabsTrigger>
            <TabsTrigger value="stores">Team Stores ({teamStores.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => {
                const Icon = categoryIcons[product.category] || Shirt;
                return (
                  <Card key={product.id} className="bg-white/[0.05] border-white/[0.06] hover:border-[#c9a962]/50 transition-all group">
                    <CardHeader className="p-0">
                      <div className="aspect-square bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center rounded-t-lg">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-t-lg" />
                        ) : (
                          <Icon className="w-16 h-16 text-white/40" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-sm">{product.name}</h3>
                          <p className="text-xs text-white/40 capitalize">{product.category}</p>
                        </div>
                        {product.customizable && (
                          <span className="text-xs bg-[#c9a962]/20 text-[#c9a962] px-2 py-1 rounded">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-lg font-bold text-[#c9a962]">
                        ${product.base_price}
                        {product.customizable && <span className="text-sm text-white/40"> + ${product.customization_price}</span>}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="stores" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamStores.map((store) => (
                <Card key={store.id} className="bg-white/[0.05] border-white/[0.06] hover:border-[#c9a962]/50 transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#c9a962]/20 rounded-lg flex items-center justify-center">
                          <StoreIcon className="w-6 h-6 text-[#c9a962]" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{store.name}</h3>
                          <p className="text-sm text-white/40">{store.slug}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${store.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-white/40'}`}>
                        {store.is_active ? 'Active' : 'Closed'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/50 mb-3">{store.description}</p>
                    {store.close_date && (
                      <p className="text-xs text-white/40">
                        Orders close: {new Date(store.close_date).toLocaleDateString()}
                      </p>
                    )}
                    <Button variant="outline" className="w-full mt-3 border-white/[0.06]">
                      View Store
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Product Dialog */}
        <Dialog open={createProductOpen} onOpenChange={setCreateProductOpen}>
          <DialogContent className="bg-[#121212] border-white/[0.06] text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input 
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    placeholder="e.g., Team Jersey Home"
                    className="bg-white/[0.05] border-white/[0.06]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={productForm.category} onValueChange={(val) => setProductForm({...productForm, category: val})}>
                    <SelectTrigger className="bg-white/[0.05] border-white/[0.06]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-white/[0.06]">
                      <SelectItem value="jersey">Jersey</SelectItem>
                      <SelectItem value="hoodie">Hoodie</SelectItem>
                      <SelectItem value="t-shirt">T-Shirt</SelectItem>
                      <SelectItem value="pants">Pants</SelectItem>
                      <SelectItem value="jacket">Jacket</SelectItem>
                      <SelectItem value="hat">Hat</SelectItem>
                      <SelectItem value="accessory">Accessory</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  placeholder="Product details..."
                  className="bg-white/[0.05] border-white/[0.06]"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Base Price ($)</Label>
                  <Input 
                    type="number"
                    value={productForm.base_price}
                    onChange={(e) => setProductForm({...productForm, base_price: parseFloat(e.target.value)})}
                    className="bg-white/[0.05] border-white/[0.06]"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Customizable (Name/Number)</Label>
                    <Switch 
                      checked={productForm.customizable}
                      onCheckedChange={(val) => setProductForm({...productForm, customizable: val})}
                    />
                  </div>
                  {productForm.customizable && (
                    <div className="space-y-2">
                      <Label>Customization Fee ($)</Label>
                      <Input 
                        type="number"
                        value={productForm.customization_price}
                        onChange={(e) => setProductForm({...productForm, customization_price: parseFloat(e.target.value)})}
                        className="bg-white/[0.05] border-white/[0.06]"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Button 
                onClick={() => createProductMutation.mutate(productForm)}
                className="w-full bg-[#c9a962] text-[#0A0A0A] hover:bg-[#c9a962]/90"
                disabled={!productForm.name || !productForm.base_price}
              >
                Add Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Team Store Dialog */}
        <Dialog open={createStoreOpen} onOpenChange={setCreateStoreOpen}>
          <DialogContent className="bg-[#121212] border-white/[0.06] text-white">
            <DialogHeader>
              <DialogTitle>Create Team Store</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Store Name</Label>
                <Input 
                  value={storeForm.name}
                  onChange={(e) => setStoreForm({...storeForm, name: e.target.value})}
                  placeholder="e.g., Elite Raptors Team Store"
                  className="bg-white/[0.05] border-white/[0.06]"
                />
              </div>

              <div className="space-y-2">
                <Label>Team</Label>
                <Select value={storeForm.team_id} onValueChange={(val) => setStoreForm({...storeForm, team_id: val})}>
                  <SelectTrigger className="bg-white/[0.05] border-white/[0.06]">
                    <SelectValue placeholder="Select team..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#121212] border-white/[0.06]">
                    {teams.map(team => (
                      <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={storeForm.description}
                  onChange={(e) => setStoreForm({...storeForm, description: e.target.value})}
                  placeholder="Store description..."
                  className="bg-white/[0.05] border-white/[0.06]"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Order Deadline (Optional)</Label>
                <Input 
                  type="date"
                  value={storeForm.close_date}
                  onChange={(e) => setStoreForm({...storeForm, close_date: e.target.value})}
                  className="bg-white/[0.05] border-white/[0.06]"
                />
              </div>

              <Button 
                onClick={() => createStoreMutation.mutate(storeForm)}
                className="w-full bg-[#c9a962] text-[#0A0A0A] hover:bg-[#c9a962]/90"
                disabled={!storeForm.name}
              >
                Create Store
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}