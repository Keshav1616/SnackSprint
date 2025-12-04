// src/components/SupportPage.jsx

import Navbar from './Navbar'
import AccountSidebar from './AccountSidebar'
import { useCart } from '../hooks/useApp'

export default function SupportPage() {
  const cart = useCart()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <AccountSidebar />

      <div className="md:ml-64">
        <Navbar cartCount={cart.items?.length || 0} />
      </div>

      <div className="pt-24 pb-12 md:ml-64">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <h1 className="text-3xl font-bold">Contact & Help</h1>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-700 space-y-3">
            <h2 className="text-xl font-semibold">Contact Support</h2>
            <p className="text-sm text-slate-400">
              Koi problem ho to is email par message karein:
            </p>
            <a
              href="mailto:support@snacksprint.demo"
              className="inline-block mt-2 px-4 py-2 rounded-2xl bg-emerald-500 text-black font-semibold"
            >
              support@snacksprint.demo
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-700 space-y-3">
            <h2 className="text-xl font-semibold">Quick Help</h2>
            <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
              <li>Restaurant card par ❤️ dabao to favorite me add ho jayega.</li>
              <li>Saved Addresses page se delivery address add / edit kar sakte ho.</li>
              <li>Cart se Checkout par jao, address select karo aur payment method choose karo.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
