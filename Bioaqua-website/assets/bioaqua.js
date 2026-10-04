// BIOAQUA Shopify Theme JavaScript & Cart Ajax Integration
document.addEventListener('DOMContentLoaded', () => {
  initCartDrawer();
  initMobileMenu();
  initDynamicDates();
});

function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }
}

function initDynamicDates() {
  const el = document.getElementById('current-year');
  if (el) el.innerText = new Date().getFullYear();
}

function initCartDrawer() {
  const openCartBtn = document.getElementById('open-cart-icon');
  const backdrop = document.getElementById('cart-drawer-backdrop');
  if (openCartBtn) {
    openCartBtn.addEventListener('click', openCartDrawer);
  }
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeCartDrawer();
    });
  }
}

function openCartDrawer() {
  const backdrop = document.getElementById('cart-drawer-backdrop');
  const panel = document.getElementById('cart-drawer-panel');
  if (backdrop && panel) {
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    backdrop.classList.add('opacity-100');
    panel.classList.remove('translate-x-full');
    panel.classList.add('translate-x-0');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const backdrop = document.getElementById('cart-drawer-backdrop');
  const panel = document.getElementById('cart-drawer-panel');
  if (backdrop && panel) {
    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    panel.classList.remove('translate-x-0');
    panel.classList.add('translate-x-full');
    document.body.style.overflow = '';
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (toast && toastMsg) {
    toastMsg.innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 2500);
  }
}

// Function to add product to Shopify Cart using Shopify Ajax API
window.addShopifyVariantToCart = function(variantId, quantity = 1) {
  showToast("Adding to Shopify Cart...");
  
  // Real Shopify Ajax API call:
  fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      id: variantId,
      quantity: quantity
    })
  })
  .then(res => res.json())
  .then(item => {
    showToast(`Added ${item.title || 'BIOAQUA'} to cart!`);
    refreshShopifyCart();
    openCartDrawer();
  })
  .catch(err => {
    console.warn("Shopify Cart API not available or running outside live Shopify store:", err);
    openCartDrawer();
  });
};

function refreshShopifyCart() {
  fetch('/cart.js')
    .then(res => res.json())
    .then(cart => {
      const badge = document.getElementById('cart-badge-count');
      if (badge) badge.innerText = cart.item_count;
    })
    .catch(err => console.log('Cart fetch notice:', err));
}
