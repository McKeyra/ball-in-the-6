'use client';

import { useState } from 'react';
import { Plus, ShoppingCart } from 'lucide-react';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  base_price: number;
  customizable: boolean;
  customization_price: number;
  image_url?: string;
}

interface TeamStore {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  team_id: string;
  is_active: boolean;
  close_date?: string;
}

interface Team {
  id: string;
  name: string;
}

export function StorePage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState('products');
  const [createProductOpen, setCreateProductOpen] = useState(false);
  const [createStoreOpen, setCreateStoreOpen] = useState(false);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: 'jersey',
    base_price: 0,
    customizable: false,
    customization_price: 0,
  });

  const [storeForm, setStoreForm] = useState({
    name: '',
    team_id: '',
    description: '',
    close_date: '',
  });

  // TODO: Replace with API calls
  // const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: ... });
  // const { data: teamStores = [] } = useQuery({ queryKey: ['team-stores'], queryFn: ... });
  // const { data: teams = [] } = useQuery({ queryKey: ['teams'], queryFn: ... });
  const products: Product[] = [];
  const teamStores: TeamStore[] = [];
  const teams: Team[] = [];

  const handleCreateProduct = (): void => {
    if (!productForm.name || !productForm.base_price) return;
    // TODO: POST /api/products
    setCreateProductOpen(false);
  };

  const handleCreateStore = (): void => {
    if (!storeForm.name) return;
    // TODO: POST /api/team-stores
    setCreateStoreOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 md:mb-2 text-white">Store</h1>
            <p className="text-white/40 text-sm md:text-base">Manage products, team stores &amp; merch drops</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={() => setCreateProductOpen(true)}
              className="border border-white/[0.06] min-h-[44px] w-full sm:w-auto px-4 py-2 rounded-lg text-white/70 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
            <button
              onClick={() => setCreateStoreOpen(true)}
              className="bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 min-h-[44px] w-full sm:w-auto px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Team Store
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/[0.05] border border-white/[0.06] rounded-lg overflow-x-auto mb-4 md:mb-6 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 sm:flex-initial min-h-[44px] text-xs sm:text-sm px-4 py-2 font-medium ${activeTab === 'products' ? 'bg-white/[0.1] text-white' : 'text-white/50'}`}
          >
            All Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('stores')}
            className={`flex-1 sm:flex-initial min-h-[44px] text-xs sm:text-sm px-4 py-2 font-medium ${activeTab === 'stores' ? 'bg-white/[0.1] text-white' : 'text-white/50'}`}
          >
            Team Stores ({teamStores.length})
          </button>
        </div>

        {/* Products Grid */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white/[0.05] border border-white/[0.06] hover:border-[#c9a962]/50 transition-all group active:scale-[0.98] rounded-xl overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingCart className="w-10 h-10 md:w-16 md:h-16 text-white/40" />
                  )}
                </div>
                <div className="p-3 md:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-xs sm:text-sm truncate text-white">{product.name}</h3>
                      <p className="text-xs text-white/40 capitalize">{product.category}</p>
                    </div>
                    {product.customizable && (
                      <span className="text-xs bg-[#c9a962]/20 text-[#c9a962] px-2 py-0.5 rounded self-start flex-shrink-0">Custom</span>
                    )}
                  </div>
                  <p className="text-base md:text-lg font-bold text-[#c9a962]">
                    ${product.base_price}
                    {product.customizable && <span className="text-xs md:text-sm text-white/40"> + ${product.customization_price}</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Team Stores */}
        {activeTab === 'stores' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {teamStores.map((store) => (
              <div key={store.id} className="bg-white/[0.05] border border-white/[0.06] hover:border-[#c9a962]/50 transition-all active:scale-[0.99] rounded-xl">
                <div className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-[#c9a962]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-[#c9a962]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm md:text-base truncate text-white">{store.name}</h3>
                        <p className="text-xs md:text-sm text-white/40 truncate">{store.slug}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded self-start sm:self-center flex-shrink-0 ${store.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-white/40'}`}>
                      {store.is_active ? 'Active' : 'Closed'}
                    </span>
                  </div>
                </div>
                <div className="px-4 pb-4 md:px-6 md:pb-6 pt-0">
                  <p className="text-xs md:text-sm text-white/50 mb-3 line-clamp-2">{store.description}</p>
                  {store.close_date && (
                    <p className="text-xs text-white/40">Orders close: {new Date(store.close_date).toLocaleDateString()}</p>
                  )}
                  <button className="w-full mt-3 border border-white/[0.06] min-h-[44px] rounded-lg text-white/60 hover:bg-white/[0.05]">View Store</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Product Dialog */}
        {createProductOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="max-w-2xl w-full bg-[#121212] border border-white/[0.06] text-white rounded-2xl p-6 max-h-[90vh] overflow-auto">
              <h2 className="text-lg font-bold mb-4">Add New Product</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Product Name</label>
                    <input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} placeholder="e.g., Team Jersey Home" className="w-full bg-white/[0.05] border border-white/[0.06] rounded-lg text-white p-2 min-h-[44px]" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="w-full bg-white/[0.05] border border-white/[0.06] rounded-lg text-white p-2 min-h-[44px]">
                      {['jersey', 'hoodie', 't-shirt', 'pants', 'jacket', 'hat', 'accessory', 'equipment'].map((cat) => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} placeholder="Product details..." className="w-full bg-white/[0.05] border border-white/[0.06] rounded-lg text-white p-3 resize-none min-h-[80px]" rows={3} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Base Price ($)</label>
                    <input type="number" value={productForm.base_price} onChange={(e) => setProductForm({ ...productForm, base_price: parseFloat(e.target.value) })} className="w-full bg-white/[0.05] border border-white/[0.06] rounded-lg text-white p-2 min-h-[44px]" />
                  </div>
                  <div>
                    <label className="flex items-center justify-between text-sm font-medium mb-2">
                      <span>Customizable</span>
                      <input type="checkbox" checked={productForm.customizable} onChange={(e) => setProductForm({ ...productForm, customizable: e.target.checked })} className="w-5 h-5" />
                    </label>
                    {productForm.customizable && (
                      <>
                        <label className="text-sm font-medium mb-1 block">Fee ($)</label>
                        <input type="number" value={productForm.customization_price} onChange={(e) => setProductForm({ ...productForm, customization_price: parseFloat(e.target.value) })} className="w-full bg-white/[0.05] border border-white/[0.06] rounded-lg text-white p-2 min-h-[44px]" />
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setCreateProductOpen(false)} className="flex-1 min-h-[44px] border border-white/[0.06] rounded-lg text-white/60">Cancel</button>
                  <button onClick={handleCreateProduct} className="flex-1 bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 min-h-[44px] rounded-lg font-medium disabled:opacity-50" disabled={!productForm.name || !productForm.base_price}>Add Product</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Team Store Dialog */}
        {createStoreOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="max-w-lg w-full bg-[#121212] border border-white/[0.06] text-white rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">Create Team Store</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Store Name</label>
                  <input value={storeForm.name} onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })} placeholder="e.g., Elite Raptors Team Store" className="w-full bg-white/[0.05] border border-white/[0.06] rounded-lg text-white p-2 min-h-[44px]" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Team</label>
                  <select value={storeForm.team_id} onChange={(e) => setStoreForm({ ...storeForm, team_id: e.target.value })} className="w-full bg-white/[0.05] border border-white/[0.06] rounded-lg text-white p-2 min-h-[44px]">
                    <option value="">Select team...</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <textarea value={storeForm.description} onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })} placeholder="Store description..." className="w-full bg-white/[0.05] border border-white/[0.06] rounded-lg text-white p-3 resize-none min-h-[80px]" rows={3} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Order Deadline (Optional)</label>
                  <input type="date" value={storeForm.close_date} onChange={(e) => setStoreForm({ ...storeForm, close_date: e.target.value })} className="w-full bg-white/[0.05] border border-white/[0.06] rounded-lg text-white p-2 min-h-[44px]" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setCreateStoreOpen(false)} className="flex-1 min-h-[44px] border border-white/[0.06] rounded-lg text-white/60">Cancel</button>
                  <button onClick={handleCreateStore} className="flex-1 bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 min-h-[44px] rounded-lg font-medium disabled:opacity-50" disabled={!storeForm.name}>Create Store</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
