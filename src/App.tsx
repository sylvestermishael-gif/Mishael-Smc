import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import CartSidebar from './components/CartSidebar';
import CheckoutModal from './components/CheckoutModal';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { MenuItem, CartItem, CheckoutData } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  const addToCart = useCallback((item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return newQty === 0 ? null : { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const handleCheckout = (data: CheckoutData) => {
    console.log('Order Details:', { data, items: cart });
    setIsCheckoutOpen(false);
    setIsOrderComplete(true);
    setCart([]);
    
    // Auto close success message after 5 seconds
    setTimeout(() => {
      setIsOrderComplete(false);
    }, 5000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen">
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        onScrollTo={scrollToSection}
      />
      
      <main>
        <Hero onExplore={() => scrollToSection('menu')} />
        
        {/* About Section Teaser */}
        <section id="about" className="section-padding grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-none shadow-2xl relative">
              <img 
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1548" 
                alt="Chef in Action" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-[1.5rem] border-brand-background/30 m-6" />
            </div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-brand-accent p-8 flex flex-col justify-end hidden md:flex">
              <span className="text-brand-dark/30 text-8xl font-serif absolute top-2 right-4 leading-none">"</span>
              <p className="text-brand-dark text-lg font-serif italic mb-4 leading-relaxed">
                Flavor is the memory of the earth.
              </p>
              <p className="text-xs uppercase font-bold tracking-widest text-brand-dark/60">Chef Ope — Executive Chef</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="space-y-8"
          >
            <span className="text-brand-secondary font-medium tracking-[0.3em] uppercase text-xs">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-serif leading-tight">Mastering the Art of <br/> Nigerian Fusion</h2>
            <p className="text-gray-600 leading-relaxed font-light text-lg">
              Born from a passion for the rich culinary landscape of Nigeria, Zuma Hearth reimagines heritage ingredients through international techniques. Our kitchen is a laboratory of taste, where Jollof becomes an infusion and Suya is elevated to fine-dining sculpture.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div>
                <h4 className="text-4xl font-serif text-brand-primary mb-2">12+</h4>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Hours slow-cooking our signatures</p>
              </div>
              <div>
                <h4 className="text-4xl font-serif text-brand-primary mb-2">100%</h4>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Ethically sourced local ingredients</p>
              </div>
            </div>
          </motion.div>
        </section>

        <MenuSection onAddToCart={addToCart} />

        {/* Testimonials */}
        <section className="bg-brand-dark text-white py-24">
          <div className="section-padding space-y-16">
            <div className="text-center">
              <span className="text-brand-accent tracking-[0.3em] font-medium uppercase text-xs mb-4 block">The Experience</span>
              <h2 className="text-4xl md:text-5xl font-serif">Guest Reflections</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { name: 'Amaka O.', text: 'The Seafood Okra is a spiritual experience. The freshness of the seafood is unparalleled in Abuja.' },
                { name: 'David W.', text: 'Incredibly sophisticated atmosphere. The Zobo cocktail is a revelation - perfectly balanced.' },
                { name: 'Dr. Bello', text: 'Zuma Hearth has set a new global standard for Nigerian cuisine. A masterpiece of fusion.' }
              ].map((t, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.4, duration: 1.2, ease: "easeOut" }}
                  className="bg-white/5 p-12 border border-white/10 relative"
                >
                  <p className="text-lg italic text-white/80 leading-relaxed mb-8">"{t.text}"</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">{t.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onSubmit={handleCheckout}
      />

      <WhatsAppButton />

      {/* Order Success Message */}
      <AnimatePresence>
        {isOrderComplete && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm px-4"
          >
            <div className="bg-brand-dark text-white p-6 shadow-2xl flex items-center gap-4 border border-brand-accent/30">
              <div className="w-12 h-12 bg-brand-accent/20 flex items-center justify-center rounded-full text-brand-accent">
                <CheckCircle size={28} />
              </div>
              <div className="flex-1">
                <h4 className="font-serif font-bold text-lg">Order Placed!</h4>
                <p className="text-xs text-white/60">We're preparing your hearth-fire meal.</p>
              </div>
              <button 
                onClick={() => setIsOrderComplete(false)}
                className="text-white/40 hover:text-white"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
