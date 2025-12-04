
import { useState, useEffect, useCallback, useMemo, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchRestaurants } from '../store/restaurantsSlice'
import { useCart, useApp } from '../hooks/useApp'
import { useViewToggle } from '../hooks/useViewToggle.jsx'
import Navbar from './Navbar'
import RestaurantCard from './RestaurantCard'
import FilterDrawer from './FilterDrawer'
import CartDrawer from '../cart/CartDrawer'
import AccountSidebar from './AccountSidebar'
import OrdersDrawer from './OrdersDrawer'
import FeedbackDrawer from './FeedbackDrawer'
import ChatBot from './chat/ChatBot'

export default function Home() {
  const [showLogin, setShowLogin] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    cuisines: [],
    costRange: 'all',
    minRating: 0,
    maxDelivery: 60,
    pureVeg: false
  })
  const [sortBy, setSortBy] = useState('rating')
  const [showFilterDrawer, setShowFilterDrawer] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isOrdersOpen, setIsOrdersOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)


  const [isPending, startTransition] = useTransition()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const restaurantsState = useSelector(state => state.restaurants)
  const cart = useCart()
  const app = useApp()
  const { viewMode, ViewToggleButton } = useViewToggle()

  useEffect(() => {
    dispatch(fetchRestaurants())
  }, [dispatch])


  const filteredRestaurants = useCallback(() => {
    let result = [...(restaurantsState.data || [])]

   
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        r =>
          r.name?.toLowerCase().includes(q) ||
          r.cuisines?.some(c => c.toLowerCase().includes(q))
      )
    }

    
    if (filters.cuisines?.length > 0) {
      result = result.filter(r =>
        filters.cuisines.some(cuisine => r.cuisines?.includes(cuisine))
      )
    }
   


    let sortedResult = [...result]
    switch (sortBy) {
      case 'rating':
        sortedResult.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'price':
        sortedResult.sort((a, b) => (a.cost_for_two || 0) - (b.cost_for_two || 0))
        break
      case 'delivery':
        sortedResult.sort((a, b) => (a.delivery_time?.value || 60) - (b.delivery_time?.value || 60))
        break
    }

    return sortedResult
  }, [restaurantsState.data, searchQuery, filters, sortBy])

  const results = useMemo(() => filteredRestaurants(), [filteredRestaurants])
  const activeFiltersCount = useMemo(() => [
    filters.cuisines?.length || 0,
    filters.costRange !== 'all' ? 1 : 0,
    filters.minRating > 0 ? 1 : 0,
    filters.maxDelivery < 60 ? 1 : 0,
    filters.pureVeg ? 1 : 0
  ].reduce((a, b) => a + b, 0), [filters])

  // OPTIMIZED: Debounced search
  const debouncedSearch = useCallback(
    useMemo(() => {
      let timeoutId
      return (query) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => setSearchQuery(query), 300)
      }
    }, [])
  , [])

  const handleRestaurantClick = useCallback((restaurant) => {
    if (!app.isLoggedIn) {
      setShowLogin(true)
      return
    }
      navigate(`/restaurant/${restaurant._id || restaurant.id}`)
  }, [app.isLoggedIn, navigate])

  const handleDemoLogin = useCallback(() => {
    app.login({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210'
    })
    setShowLogin(false)
  }, [app.login])

  // FLOATING ANIMATION VARS
  const floatingItems = [
    { id: 1, emoji: '🍟', top: '10%', left: '10%' },
    { id: 2, emoji: '🥟', top: '20%', right: '15%' },
    { id: 3, emoji: '🌮', top: '70%', left: '80%' },
    { id: 4, emoji: '🍲', top: '50%', right: '25%' },
    { id: 5, emoji: '🥡', top: '85%', left: '20%' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* ✅ FLOATING ANIMATIONS */}
      {floatingItems.map((item, index) => (
        <div
          key={item.id}
          className="absolute text-4xl animate-float opacity-20 pointer-events-none"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            animationDelay: `${index * 0.3}s`,
            animationDuration: `${8 + index}s`
          }}
        >
          {item.emoji}
        </div>
      ))}

      {/* Left permanent sidebar */}
      <AccountSidebar />

      {/* Status Indicator with float */}
      <div className="fixed top-4 left-72 bg-black/90 backdrop-blur-md p-4 rounded-2xl text-xs z-40 shadow-2xl border border-slate-700/50 animate-float-subtle">
        {restaurantsState.data?.length ? `${results.length} restaurants` : 'Loading...'}
        {isPending && <span className="ml-2 animate-pulse">🔄</span>}
      </div>

      {/* Navbar shifted right */}
      <div className="md:ml-64">
        <Navbar
          cartCount={cart.items?.length || 0}
          onCartClick={() => setIsCartOpen(true)}
        />
      </div>

      {/* Main Content shifted right */}
      <div className="pt-24 pb-12 md:ml-64">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent mb-6 leading-tight animate-float-subtle">
            SnackSprint
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto animate-fade-in">
            {results.length} restaurants {app.isLoggedIn ? 'near you' : 'available'}
            {app.isLoggedIn && app.currentAddress && ` • 📍 ${app.currentAddress.city}`}
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-6 mb-12 space-y-6">
          {/* ✅ SEARCH + VIEW TOGGLE + FILTERS - SMOOTH TRANSITION */}
          <div className="flex gap-4 items-end group">
            <div className="flex-1 relative group/search">
              <input
                value={searchQuery}
                onChange={(e) => startTransition(() => setSearchQuery(e.target.value))}
                placeholder="Search restaurants, cuisines..."
                className="w-full p-5 text-xl bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-3xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 transition-all duration-300 placeholder-slate-400 group-hover/search:border-slate-500 shadow-lg hover:shadow-xl"
              />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 text-xl transition-all group-hover/search:text-emerald-400">🔍</span>
            </div>
            
            <div className="flex gap-2">
              <ViewToggleButton />
              <button
                onClick={() => setShowFilterDrawer(true)}
                className="px-10 py-5 bg-gradient-to-r from-emerald-500/90 to-teal-500/90 hover:from-emerald-500 hover:to-teal-500 text-black font-bold text-lg rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm flex items-center gap-2 border border-emerald-400/30 animate-pulse-subtle"
              >
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-2xl text-sm font-bold shadow-md">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Sort buttons with float */}
          <div className="flex gap-3 max-w-lg mx-auto">
            {[
              { value: 'rating', label: 'Top Rated', icon: '⭐' },
              { value: 'price', label: 'Low Price', icon: '💰' },
              { value: 'delivery', label: 'Fast Delivery', icon: '⚡' }
            ].map(option => (
              <button
                                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg border-2 border-slate-600 hover:border-emerald-400 hover:scale-[1.02] group hover:shadow-emerald-500/25 backdrop-blur-sm ${
                  sortBy === option.value
                    ? 'bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-black scale-105 shadow-emerald-500/50 ring-2 ring-emerald-400/50 animate-pulse-subtle'
                    : 'bg-slate-800/50 hover:bg-slate-700/70 text-slate-200'
                }`}
              >
                <span className="text-lg">{option.icon}</span>
                <span className="ml-1">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ✅ OPTIMIZED RESTAURANTS SECTION */}
        <div className="max-w-6xl mx-auto px-6">
          {viewMode === 'card' ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
              {results.map(restaurant => (
                <RestaurantCard
                  key={restaurant._id || restaurant.id}
                  restaurant={restaurant}
                  onClick={() => handleRestaurantClick(restaurant)}
                />
              ))}
            </div>
          ) : (
            <div className="animate-fade-in-up">
              <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-800/90 backdrop-blur-md sticky top-0 z-20">
                      <tr>
                        <th className="p-4 text-left font-semibold text-slate-200 w-64 border-b-2 border-slate-700/50">Restaurant</th>
                        <th className="p-4 text-center font-semibold text-slate-200 hidden md:table-cell border-b-2 border-slate-700/50">Rating</th>
                        <th className="p-4 text-center font-semibold text-slate-200 hidden lg:table-cell border-b-2 border-slate-700/50">Delivery</th>
                        <th className="p-4 text-center font-semibold text-slate-200 hidden xl:table-cell border-b-2 border-slate-700/50">Cost</th>
                        <th className="p-4 text-right font-semibold text-slate-200 w-32 border-b-2 border-slate-700/50">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((restaurant, index) => (
                        <tr 
                          key={restaurant._id || restaurant.id} 
                          className="border-t border-slate-800/50 hover:bg-slate-800/40 transition-all duration-200 hover:shadow-inner group"
                        >
                          <td className="p-4 group-hover:translate-x-1 transition-transform">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img 
                                  src={restaurant.image_url || restaurant.image} 
                                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300"
                                  alt={restaurant.name}
                                />
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold text-black shadow-md animate-pulse">
                                  ⭐
                                </div>
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-slate-200 truncate group-hover:text-emerald-400 transition-colors">{restaurant.name}</h4>
                                <p className="text-xs text-slate-400 group-hover:text-slate-300">{restaurant.cuisines?.join(', ')}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 hidden md:table-cell">
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-400/30 shadow-md">
                              ⭐ {restaurant.rating || 0}
                            </span>
                          </td>
                          <td className="p-4 hidden lg:table-cell font-semibold text-emerald-400 animate-pulse-subtle">
                            {restaurant.delivery_time?.value || '30'} min
                          </td>
                          <td className="p-4 hidden xl:table-cell text-slate-400 font-mono">
                            ₹{restaurant.cost_for_two?.toLocaleString() || 0}
                          </td>
                          <td className="p-4">
                            <button 
                              onClick={() => handleRestaurantClick(restaurant)}
                              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-sm rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform group-hover:-rotate-1"
                            >
                              View Menu →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {results.length === 0 && !isPending && (
            <div className="text-center py-32 animate-bounce">
              <div className="text-7xl mx-auto mb-8 animate-float">🍟</div>
              <h3 className="text-3xl font-black text-slate-200 mb-4 bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text">
                No restaurants found
              </h3>
              <p className="text-xl text-slate-400 max-w-md mx-auto mb-8">
                Try adjusting your search, filters or sorting options
              </p>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-3xl hover:bg-slate-700/70 text-slate-300 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Clear Search
                </button>
                <button 
                  onClick={() => setShowFilterDrawer(true)}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
                >
                  Adjust Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* LOADING STATE */}
        {isPending && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4 shadow-xl"></div>
              <p className="text-slate-400 text-lg animate-pulse">Updating restaurants...</p>
            </div>
          </div>
        )}

        {/* All Drawers */}
        <FilterDrawer
          isOpen={showFilterDrawer}
                    filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowFilterDrawer(false)}
        />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />

        <OrdersDrawer
          isOpen={isOrdersOpen}
          onClose={() => setIsOrdersOpen(false)}
        />

        <FeedbackDrawer
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
        />

        {/* OPTIMIZED LOGIN POPUP */}
        {showLogin && (
          <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-slate-900/95 backdrop-blur-xl p-8 rounded-3xl max-w-sm w-full space-y-6 shadow-3xl border border-slate-700/50 animate-float-subtle">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center text-3xl font-bold text-black shadow-2xl mb-4">
                  👤
                </div>
                <h2 className="text-2xl font-black text-slate-100 mb-2 bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text">
                  Login Required
                </h2>
                <p className="text-slate-400 text-sm">Please login to view restaurant menu</p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleDemoLogin}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 ring-2 ring-emerald-400/30 backdrop-blur-sm"
                >
                  🚀 Quick Demo Login
                </button>
                <button
                  onClick={() => setShowLogin(false)}
                  className="w-full py-4 border-2 border-slate-600/50 rounded-2xl text-slate-300 hover:bg-slate-800/50 hover:border-slate-500 hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                >
                  ✕ Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
       <ChatBot />
    </div>
  )
}



