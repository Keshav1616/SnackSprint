import { useNavigate } from 'react-router-dom'
import { useApp, useCart } from '../hooks/useApp'

export default function Navbar({ cartCount = 0, onCartClick, onAccountClick }) {
  const navigate = useNavigate()
  const app = useApp()
  const cart = useCart()

  return (
    <nav className="fixed top-0 inset-x-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"
        >
          SnackSprint
        </button>

        <div className="flex items-center gap-3">
          {/* Account / menu sidebar */}
          <button
            onClick={onAccountClick}
            className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-sm flex items-center gap-2"
          >
            <span>👤</span>
            <span>{app.user?.name || 'Account'}</span>
          </button>

          <button
            onClick={onCartClick}
            className="px-4 py-2 rounded-2xl bg-emerald-500 text-black font-semibold flex items-center gap-2"
          >
            🛒 Cart
            <span className="bg-black/20 px-2 py-0.5 rounded-xl text-xs">
              {cartCount || cart.items?.length || 0}
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}
