import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm overflow-hidden group cursor-pointer">
        {/* Image */}
        <div className="aspect-video bg-gradient-to-br from-white/10 to-white/5 relative overflow-hidden">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
          )}
          
          {/* Featured Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-[#D0FF00] rounded-full text-[#0A0A0A] text-xs font-bold">
            <Sparkles className="w-3 h-3" />
            Featured
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg mb-1">{product.name}</h3>
              <p className="text-sm text-gray-400 capitalize">{product.category}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#D0FF00]">
                ${product.base_price}
              </p>
              {product.customizable && (
                <p className="text-xs text-gray-400">+ custom options</p>
              )}
            </div>
          </div>

          {product.description && (
            <p className="text-sm text-gray-300 mb-4 line-clamp-2">
              {product.description}
            </p>
          )}

          <Button className="w-full bg-[#D0FF00] text-[#0A0A0A] hover:bg-[#D0FF00]/90 group">
            <ShoppingCart className="w-4 h-4 mr-2 group-hover:animate-bounce" />
            Shop Now
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}