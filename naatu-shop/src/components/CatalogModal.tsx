import React, { useState, useMemo } from 'react'
import { X, Search, ShoppingBag } from 'lucide-react'
import { useProductStore, type Product } from '../store/store'

interface CatalogModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (product: Product) => void
}

export default function CatalogModal({ isOpen, onClose, onAdd }: CatalogModalProps) {
  const { products } = useProductStore()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.filter(p => p.isActive).map(p => p.category))).filter(Boolean)
    return ['All', ...cats]
  }, [products])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let src = products.filter(p => p.isActive)
    if (activeCategory !== 'All') src = src.filter(p => p.category === activeCategory)
    if (q) src = src.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.nameTa || '').toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
    return src.slice(0, 120)
  }, [products, search, activeCategory])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl flex flex-col shadow-2xl overflow-hidden border border-[#EAD7B7]/40 max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#EAD7B7]/40 bg-[#F7F6F2]">
          <h2 className="text-[18px] font-black text-[#2C392A] flex items-center gap-2">
            <Search size={18} className="text-[#8B2332]" />
            Search Catalog
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-black/5 text-[#5F6D59]">
            <X size={20} />
          </button>
        </div>

        {/* Search & Filter */}
        <div className="p-4 border-b border-[#EAD7B7]/40 bg-white space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5F6D59]" />
            <input 
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by product name, Tamil name, or category..."
              className="w-full pl-10 pr-4 py-3 bg-[#FAFAFA] border border-[#EAD7B7]/60 rounded-xl focus:outline-none focus:border-[#8B2332] text-[13px] font-bold text-[#2C392A]"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-[#8B2332] text-white' : 'bg-[#FAFAFA] text-[#5F6D59] hover:bg-[#F7F6F2] border border-[#EAD7B7]/60'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#FAFAFA]">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#5F6D59]/60 py-12">
              <ShoppingBag size={48} className="mb-4 opacity-20" />
              <p className="text-[14px] font-bold">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map(product => (
                <div 
                  key={product.id}
                  onClick={() => onAdd(product)}
                  className="bg-white border border-[#EAD7B7]/60 rounded-2xl p-3 flex flex-col gap-2 cursor-pointer hover:border-[#8B2332]/40 hover:shadow-md transition-all group"
                >
                  <div className="flex-1">
                    <h4 className="text-[13px] font-black text-[#2C392A] leading-tight group-hover:text-[#8B2332] transition-colors">{product.name}</h4>
                    {product.nameTa && <p className="text-[10px] font-bold text-[#5F6D59] mt-0.5">{product.nameTa}</p>}
                  </div>
                  <div className="flex items-end justify-between mt-2 pt-2 border-t border-[#EAD7B7]/30">
                    <span className="text-[14px] font-black text-[#2C392A]">₹{product.price}</span>
                    <span className="text-[9px] font-black text-[#5F6D59] uppercase tracking-wider bg-[#F7F6F2] px-2 py-1 rounded border border-[#EAD7B7]/40">{product.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
