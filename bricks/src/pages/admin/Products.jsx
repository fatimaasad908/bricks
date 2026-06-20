import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Trash2, X, Edit, Box } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import ExportButton from '../../components/ExportButton';
const getProductImage = (imagePath, productName = '') => {
  if (!imagePath) return 'https://placehold.co/100x100?text=Brick';
  const pathLower = imagePath.toLowerCase();
  const nameLower = productName.toLowerCase();
  if (pathLower === "first" || pathLower.includes("first") || pathLower.includes("red") || nameLower.includes("red") || nameLower.includes("awaal")) {
    return "/images/red_brick.png";
  }
  if (pathLower === "second" || pathLower.includes("second") || pathLower.includes("fire") || nameLower.includes("fire") || nameLower.includes("doem")) {
    return "/images/fire_brick.png";
  }
  if (pathLower === "third" || pathLower.includes("third") || pathLower.includes("clay") || nameLower.includes("clay") || nameLower.includes("soem")) {
    return "/images/clay_brick.png";
  }
  if (imagePath.startsWith('/uploads')) {
    return `http://localhost:5000${imagePath}`;
  }
  return imagePath;
};
export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    tag: 'Premium',
    price: '₨ 25 / Unit',
    iconName: 'Box',
   image: "third",
    desc: 'Premium quality clay brick',
    sku: '',
    dimensions: '',
    weight: '',
    color: '',
    category: 'Clay Bricks',
    unitPrice: 25,
    wholesalePrice: 20,
    stockStatus: 'In Stock'
  });

  const fetchItems = async () => {
    try {
      const data = await apiFetch('/products');
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiFetch(`/products/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/products', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({
        productId: '',
        name: '',
        tag: 'Premium',
        price: '₨ 25 / Unit',
        iconName: 'Box',
        image: "second",
        desc: 'Premium quality clay brick',
        sku: '',
        dimensions: '',
        weight: '',
        color: '',
        category: 'Clay Bricks',
        unitPrice: 25,
        wholesalePrice: 20,
        stockStatus: 'In Stock'
      });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (item, e) => {
    e.stopPropagation();
    setFormData({
      productId: item.productId,
      name: item.name,
      tag: item.tag || 'Premium',
      price: item.price || `₨ ${item.unitPrice || 0} / Unit`,
      iconName: item.iconName || 'Box',
      image: item.image || "first",
      desc: item.desc || '',
      sku: item.sku || '',
      dimensions: item.dimensions || '',
      weight: item.weight || '',
      color: item.color || '',
      category: item.category || 'Clay Bricks',
      unitPrice: item.unitPrice || 0,
      wholesalePrice: item.wholesalePrice || 0,
      stockStatus: item.stockStatus || 'In Stock'
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await apiFetch(`/products/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (i.sku && i.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (i.productId && i.productId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (i.category && i.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportHeaders = ['Product ID', 'Name', 'SKU', 'Category', 'Dimensions', 'Weight', 'Color', 'Unit Price', 'Wholesale Price', 'Stock Status'];
  const exportKeys = ['productId', 'name', 'sku', 'category', 'dimensions', 'weight', 'color', 'unitPrice', 'wholesalePrice', 'stockStatus'];

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Brick Catalog & Variants</h2>
          <p className="text-gray-500 text-sm">Add and configure products, wholesale pricing, dimensions, and specifications</p>
        </div>
        <div className="flex gap-3">
          <ExportButton 
            filteredData={filteredItems}
            allData={items}
            headers={exportHeaders}
            keys={exportKeys}
            title="Products Catalog Export"
            filename="products_catalog"
          />
          <button onClick={() => { setEditingId(null); setFormData({ productId: 'BRK-' + Date.now().toString().slice(-4), name: '', tag: 'Premium', price: '₨ 25 / Unit', iconName: 'Box', image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=400&auto=format&fit=crop', desc: 'Premium quality clay brick', sku: 'SKU-' + Date.now().toString().slice(-4), dimensions: '9" x 4.5" x 3"', weight: '3.2 kg', color: 'Terracotta Red', category: 'Clay Bricks', unitPrice: 25, wholesalePrice: 20, stockStatus: 'In Stock' }); setShowModal(true); }} className="flex items-center gap-2 bg-terracotta-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm shadow-terracotta-600/20 cursor-pointer">
            <Box className="w-4 h-4" /> Add Brick Variant
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Brick Types</p>
            <h3 className="text-2xl font-bold text-brown-900">{items.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Low / Out of Stock</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.filter(i => i.stockStatus !== 'In Stock').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-terracotta-50 text-terracotta-600 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xl font-bold">₨</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Average Wholesale Price</p>
            <h3 className="text-2xl font-bold text-brown-900">
              ₨ {items.length > 0 ? (items.reduce((sum, item) => sum + (item.wholesalePrice || 0), 0) / items.length).toFixed(1) : '0.0'}
            </h3>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Active Products List</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading products...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No products found. Add one!</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4">Brick Product</th>
                  <th className="px-6 py-4">Specifications</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Unit Price</th>
                  <th className="px-6 py-4">Wholesale Price</th>
                  <th className="px-6 py-4">Stock Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={getProductImage(item.image, item.name)} 
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0" 
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-brown-900 text-[15px] group-hover:text-terracotta-600 transition-colors">
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-400">SKU: {item.sku || 'N/A'} • ID: {item.productId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-medium">
                      <div className="flex flex-col text-xs">
                        <span>Dim: {item.dimensions || 'Standard'}</span>
                        <span>Weight: {item.weight || '--'} • Color: {item.color || '--'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-500 font-semibold text-xs">
                      {item.category || 'Clay Bricks'}
                    </td>
                    <td className="px-6 py-5 font-bold text-brown-900">
                      ₨ {item.unitPrice || 0}
                    </td>
                    <td className="px-6 py-5 font-bold text-terracotta-600">
                      ₨ {item.wholesalePrice || 0}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold tracking-wide
                        ${item.stockStatus === 'In Stock' ? 'bg-green-50 text-green-700' : item.stockStatus === 'Low Stock' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.stockStatus === 'In Stock' ? 'bg-green-500' : item.stockStatus === 'Low Stock' ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                        {item.stockStatus || 'In Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right flex justify-end gap-3">
                       <button onClick={(e) => handleEditClick(item, e)} className="text-blue-500 hover:text-blue-700">
                          <Edit className="w-4 h-4" />
                       </button>
                       <button onClick={(e) => handleDelete(item._id, e)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-brown-900">{editingId ? 'Edit Product Variant' : 'Add Brick Product'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Red Fire Brick" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none">
                    <option>Clay Bricks</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product ID</label>
                  <input required value={formData.productId} onChange={e => setFormData({...formData, productId: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="BRK-001" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">SKU</label>
                  <input required value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="SKU-BRK" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dimensions</label>
                  <input required value={formData.dimensions} onChange={e => setFormData({...formData, dimensions: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="9 x 4 x 3 in" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Weight</label>
                  <input required value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="3.2 kg" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Color</label>
                  <input required value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Dark Red" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Retail Price (₨)</label>
                  <input required value={formData.unitPrice} onChange={e => setFormData({...formData, unitPrice: Number(e.target.value), price: `₨ ${e.target.value} / Unit`})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="25" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Wholesale Price (₨)</label>
                  <input required value={formData.wholesalePrice} onChange={e => setFormData({...formData, wholesalePrice: Number(e.target.value)})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock Status</label>
                  <select value={formData.stockStatus} onChange={e => setFormData({...formData, stockStatus: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none">
                    <option>In Stock</option>
                    <option>Low Stock</option>
                    <option>Out of Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Description</label>
                <textarea required rows="2" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none resize-none" placeholder="Description of this brick category..."></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Brick Photo</label>
                <div className="mt-1 flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        
                        const reader = new FileReader();
                        reader.onloadend = async () => {
                          const base64String = reader.result;
                          try {
                            const res = await apiFetch('/products/upload', {
                              method: 'POST',
                              body: JSON.stringify({ image: base64String })
                            });
                            if (res.imageUrl) {
                              setFormData(prev => ({ ...prev, image: res.imageUrl }));
                            }
                          } catch (err) {
                            alert('Failed to upload image: ' + err.message);
                          }
                        };
                        reader.readAsDataURL(file);
                      }} 
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-xs file:font-semibold
                        file:bg-terracotta-50 file:text-terracotta-700
                        hover:file:bg-terracotta-100 cursor-pointer"
                    />
                  </div>
                  <div className="text-[10px] text-gray-400 text-center">- OR -</div>
                  <input 
                    value={formData.image} 
                    onChange={e => setFormData({...formData, image: e.target.value})} 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none text-xs" 
                    placeholder="Image URL (e.g. https://...)" 
                  />
                  {formData.image && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">Current path:</span>
                      <span className="text-xs text-brown-900 truncate font-mono max-w-[200px]">{formData.image}</span>
                      <img 
                        src={getProductImage(formData.image, formData.name)} 
                        alt="Preview" 
                        className="w-8 h-8 rounded object-cover border border-gray-300 ml-auto"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-3 rounded-lg hover:bg-terracotta-700 transition-colors mt-6">
                {editingId ? 'Update Product' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
