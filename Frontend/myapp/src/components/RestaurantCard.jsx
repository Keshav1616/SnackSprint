import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

export default function RestaurantCard({ restaurant, onClick }) {
  const navigate = useNavigate()
  const app = useApp()

  const id = restaurant._id || restaurant.id
  const isFavorite = app.favorites?.some(f => (f._id || f.id) === id)

  const handleCardClick = () => {
    if (onClick) onClick()
    else navigate(`/restaurant/${id}`)
  }

  const handleToggleFavorite = (e) => {
    e.stopPropagation()
    e.preventDefault()
    app.toggleFavorite(restaurant)
  }

  const rating = restaurant.rating || 4.2
  const costForTwo = restaurant.cost_for_two || 299
  const deliveryText = restaurant.delivery_time?.text || '30-40 mins'

  return (
   <div 
      onClick={onClick}
      className="group relative bg-gradient-to-b from-slate-900/80 to-slate-950/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-xl hover:shadow-3xl hover:shadow-emerald-500/25 hover:-translate-y-3 hover:rotate-[1deg] hover:border-emerald-500/50 transition-all duration-500 cursor-pointer overflow-hidden h-full"
    >
      {/* Floating image container */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
        <img 
          src={restaurant.image_url || restaurant.image}
          className="w-full h-48 object-cover rounded-2xl group-hover:scale-110 transition-transform duration-700"
          alt={restaurant.name}
        />
        
        {/* Floating badges */}
        <div className="absolute top-4 left-4">
          <span className="bg-emerald-500/95 text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
            ⭐ {restaurant.rating || 0}
          </span>
        </div>
        
        <div className="absolute bottom-4 right-4 bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-black px-4 py-2 rounded-2xl font-bold text-xs shadow-2xl backdrop-blur-sm animate-pulse">
          {restaurant.delivery_time?.value} min
        </div>
      </div>

      {/* Content with stagger animation */}
      <div className="space-y-3">
        <h3 className="text-xl font-black text-slate-100 group-hover:text-emerald-400 transition-all duration-500 line-clamp-1">
          {restaurant.name}
        </h3>
        
        <p className="text-sm text-slate-400 line-clamp-2 group-hover:text-slate-300 transition-colors">
          {restaurant.cuisines?.join(', ')}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
          <span className="text-emerald-400 font-bold text-lg">
            ₹{restaurant.cost_for_two?.toLocaleString() || 0}
          </span>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
            <span className="text-xs text-slate-500 animate-pulse">Order Now</span>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
      
      {/* Floating sparkles on hover */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
      </div>
    </div>
  )
}