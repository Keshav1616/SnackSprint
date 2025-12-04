// src/components/OrdersPage.jsx

import Navbar from './Navbar'
import AccountSidebar from './AccountSidebar'
import { useCart } from '../hooks/useApp'

export default function OrdersPage() {
  const cart = useCart()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <AccountSidebar />

      <div className="md:ml-64">
        <Navbar cartCount={cart.items?.length || 0} />
      </div>

      <div className="pt-24 pb-12 md:ml-64">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-sm text-slate-400">
              Track your recent orders and delivery status.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
            <div className="text-6xl mb-6">📦</div>
            <h2 className="text-2xl font-bold text-slate-200 mb-2">No orders yet</h2>
            <p>Your order history will appear here once you place your first order.</p>
            <button className="mt-6 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold rounded-2xl">
              Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
