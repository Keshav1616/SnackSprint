// src/components/chat/ChatLogic.jsx
export function handleChatQuestion(question, { cart, app, restaurants }) {
  const q = question.toLowerCase().trim()

  // ---------- COMMON HELP / GREETING ----------
  if (
    ['hi', 'hello', 'hey'].some(w => q === w || q.startsWith(w + ' ')) ||
    q.includes('who are you') ||
    q.includes('what can you do') ||
    q.includes('help')
  ) {
    return 'Hi! Main SnackSprint bot hoon. Cart total, items, promo codes, favourites, saved addresses, orders, delivery time, veg / non‑veg, restaurant rating sab batata hoon.'
  }

  // ---------- CART TOTAL ----------
  if (
    q.includes('cart') &&
    (q.includes('total') || q.includes('amount') || q.includes('bill') || q.includes('price'))
  ) {
    return cart.items.length
      ? `Abhi tumhare cart ka total ₹${cart.total.toFixed(0)} hai, jisme delivery fee ₹${cart.deliveryFee} include hai.`
      : 'Tumhara cart abhi khali hai, kuch items add karo phir total bataunga.'
  }

  // ---------- CART SUBTOTAL ONLY (without delivery) ----------
  if (
    (q.includes('subtotal') || q.includes('only items') || q.includes('items total')) &&
    q.includes('cart')
  ) {
    return cart.items.length
      ? `Sirf items ka subtotal ₹${cart.subtotal.toFixed(0)} hai, delivery fee alag se ₹${cart.deliveryFee} lagegi.`
      : 'Cart khali hai, isliye subtotal 0 hai.'
  }

  // ---------- CART ITEMS COUNT ----------
  if (
    q.includes('cart') &&
    (q.includes('items') || q.includes('item') || q.includes('kitne') || q.includes('how many'))
  ) {
    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0)
    return count
      ? `Tumhare cart me total ${count} items hain (${cart.items.length} different dishes).`
      : 'Cart me abhi koi item nahi hai.'
  }

  // ---------- LIST CART ITEMS ----------
  if (q.includes('cart') && (q.includes('show') || q.includes('list') || q.includes('kya hai'))) {
    if (!cart.items.length) return 'Cart abhi empty hai.'
    const names = cart.items.map(i => `${i.name} x${i.quantity}`).join(', ')
    return `Cart me ye items hain: ${names}.`
  }

  // ---------- PROMO CODES / DISCOUNT ----------
  if (q.includes('promo') || q.includes('coupon') || q.includes('discount')) {
    if (cart.promoCode) {
      return `Abhi tumne ${cart.promoCode} apply kiya hai aur discount ₹${cart.promoDiscount.toFixed(0)} mil raha hai. Try: FIRST50 ya SNACK10.`
    }
    return 'Abhi koi promo code apply nahi hai. Tum FIRST50 (₹50 off) ya SNACK10 (10% off upto ₹100) use kar sakte ho.'
  }

  // ---------- FAVOURITES ----------
  if (q.includes('favourite') || q.includes('favorite') || q.includes('fav')) {
    const favs = app.favorites || []
    if (!favs.length) return 'Tumhare favourites list abhi empty hai.'
    const names = favs.slice(0, 5).map(r => r.name).join(', ')
    return `Tumhare favourites me ${favs.length} restaurants hain. Top: ${names}.`
  }

  // ---------- SAVED ADDRESSES ----------
  if (q.includes('address') || q.includes('addresses')) {
    const addrs = app.addresses || []
    if (q.includes('add') || q.includes('save')) {
      return 'Naya address add karne ke liye Address / Profile section me jao, wahan “Add Address” button use karo.'
    }
    if (!addrs.length) return 'Abhi tumne koi address save nahi kiya hai.'
    if (q.includes('default') || q.includes('primary') || q.includes('main')) {
      return `Tumhara default address: ${addrs[0].label || addrs[0].fullAddress}.`
    }
    return `Tumne ${addrs.length} addresses save kiye hain. Pehla: ${addrs[0].label || addrs[0].fullAddress}.`
  }

  // ---------- ORDERS / ORDER HISTORY ----------
  if (
    q.includes('order history') ||
    q.includes('orders') ||
    q.includes('previous orders') ||
    q.includes('last order') ||
    q.includes('pichla order')
  ) {
    const orders = app.orders || []
    if (!orders.length) return 'Abhi tumne koi order place nahi kiya hai.'
    if (q.includes('last') || q.includes('recent') || q.includes('pichla')) {
      const last = orders[orders.length - 1]
      return `Tumhara last order ₹${last.total.toFixed(0)} ka tha, jisme ${last.items.length} items the aur address "${last.address}" tha.`
    }
    return `Tumne ab tak ${orders.length} orders place kiye hain. Sabhi details Orders page par dekh sakte ho.`
  }

  // ---------- DELIVERY TIME / ETA ----------
  if (
    q.includes('delivery') &&
    (q.includes('time') || q.includes('kitna') || q.includes('kab tak') || q.includes('when'))
  ) {
    if (!restaurants?.length) return 'Restaurants ka data load ho raha hai, thodi der baad try karo.'
    const times = restaurants
      .map(r => parseInt((r.delivery_time || '40').toString().match(/\d+/)?.[0] || '40', 10))
      .filter(Boolean)
    if (!times.length) return 'Exact delivery time abhi available nahi hai.'
    const min = Math.min(...times)
    const max = Math.max(...times)
    return `Most restaurants ${min}–${max} minutes ke andar deliver karte hain. Exact time restaurant card par dikh raha hoga.`
  }

  // ---------- VEG / NON‑VEG FILTER FEEL ----------
  if (q.includes('veg') || q.includes('vegetarian')) {
    return 'Agar tumhe sirf Pure Veg chahiye to filters me “Pure Veg Only” option on kar sakte ho. Restaurant list automatically filter ho jayegi.'
  }

  // ---------- BEST / TOP RATED RESTAURANTS ----------
  if (
    q.includes('best') ||
    q.includes('top rated') ||
    q.includes('rating') ||
    q.includes('suggest') ||
    q.includes('recommend')
  ) {
    if (!restaurants?.length) return 'Restaurants load ho rahe hain, thoda wait karo phir main best options bataunga.'
    const sorted = [...restaurants].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    const top3 = sorted.slice(0, 3).map(r => `${r.name} (${r.rating}⭐)`).join(', ')
    return `Top rated nearby options: ${top3}. Tum filters se aur refine kar sakte ho.`
  }

  // ---------- LOGIN / ACCOUNT ----------
  if (q.includes('login') || q.includes('account') || q.includes('profile')) {
    if (app.user?.name) {
      return `Tum ${app.user.name} naam se logged‑in ho. Profile / Account section se details update kar sakte ho.`
    }
    return 'Abhi tum logged‑in nahi ho. Navbar me “Login” button se sign in ya sign up karo.'
  }

  // ---------- GENERIC CART EMPTY / HELP ----------
  if (q.includes('cart')) {
    if (!cart.items.length)
      return 'Cart abhi empty hai. Menu me se koi bhi dish pe “Add to Cart” click karo, phir main totals bata dunga.'
    return `Cart me ${cart.items.length} different items hain. Tum total, items list, promo code ya clear cart jaise sawal puch sakte ho.`
  }

  // ---------- DEFAULT FALLBACK ----------
  return 'Ye question directly samajh nahi aaya. Cart total, items, promo, favourites, saved address, orders, delivery time ya best restaurants jaisa kuch puch ke dekho.'
}
