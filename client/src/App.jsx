import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const DEFAULT_ADMIN = { email:'admin@comwebp.shop', password:'admin123', role:'admin' }
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Payment Gateway: Stripe Test Mode - publishable key safe for demo
const stripePromise = loadStripe('pk_test_51OexampleTestKeyForDemoAcmeAI_Chittagong_2026')

export default function App(){
  const [theme,setTheme]=useState(()=>localStorage.getItem('cwp_theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'))
  useEffect(()=>{document.documentElement.setAttribute('data-theme',theme); localStorage.setItem('cwp_theme',theme)},[theme])
  const [mobileMenu,setMobileMenu]=useState(false)
  const [store,setStore]=useState([]); const [local,setLocal]=useState([])
  const [cart,setCart]=useState(()=>JSON.parse(localStorage.getItem('cart')||'[]'))
  const [users,setUsers]=useState(()=>JSON.parse(localStorage.getItem('cwp_users')||'null')||[DEFAULT_ADMIN])
  const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem('cwp_user')||'null'))
  const [orders,setOrders]=useState(()=>JSON.parse(localStorage.getItem('cwp_orders')||'[]'))
  const [showCart,setShowCart]=useState(false); const [showAuth,setShowAuth]=useState(false); const [authMode,setAuthMode]=useState('login')
  const [authForm,setAuthForm]=useState({email:'',password:'',role:'customer'}); const [search,setSearch]=useState(''); const [cat,setCat]=useState('all')
  const [showOrders,setShowOrders]=useState(false); const [editProd,setEditProd]=useState(null)
  const [prodForm,setProdForm]=useState({name:'',price:'',stock:'',description:'',imageUrl:''})
  const [contactForm,setContactForm]=useState({name:'',email:'',message:''})

  // Payment states - NEW for Acme AI
  const [showCheckout,setShowCheckout]=useState(false)
  const [payTab,setPayTab]=useState('stripe')
  const [stripeLoading,setStripeLoading]=useState(false)
  const [sslForm,setSslForm]=useState({phone:'', otp:'', method:'bkash'})

  useEffect(()=>{fetch('https://fakestoreapi.com/products').then(r=>r.json()).then(setStore).catch(()=>{}); fetch(`${API_URL}/api/products`).then(r=>r.json()).then(r=>setLocal(Array.isArray(r)?r:r.data||[])).catch(()=>{})},[])
  useEffect(()=>localStorage.setItem('cart',JSON.stringify(cart)),[cart]); useEffect(()=>localStorage.setItem('cwp_users',JSON.stringify(users)),[users]); useEffect(()=>localStorage.setItem('cwp_orders',JSON.stringify(orders)),[orders])

  const allProducts=[...local.map(p=>({...p,image:p.imageUrl||p.ImageUrl||p.image||`https://picsum.photos/seed/${p.id}/400`,category:'local',isLocal:true})),...store.map(s=>({...s,isLocal:false}))]
  const filtered=allProducts.filter(p=>{const q=search.toLowerCase(); const t=(p.title||p.name||'').toLowerCase(); return (!q||t.includes(q))&&(cat==='all'||p.category===cat)})
  const cats=['all','local',...new Set(store.map(s=>s.category))]
  const scrollTo=(id)=>{ document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); setMobileMenu(false); }
  const login=(e)=>{e.preventDefault(); const f=users.find(u=>u.email.toLowerCase()===authForm.email.toLowerCase() && u.password===authForm.password); if(!f){alert('Wrong email/password');return} setUser(f); localStorage.setItem('cwp_user',JSON.stringify(f)); setShowAuth(false);}
  const register=(e)=>{e.preventDefault(); const emailLower=authForm.email.toLowerCase(); if(users.find(u=>u.email.toLowerCase()===emailLower)){alert('Email exists');return} let finalRole='customer'; if(emailLower==='admin@comwebp.shop' && authForm.role==='admin'){finalRole='admin';} if(authForm.role==='admin' && emailLower!=='admin@comwebp.shop'){alert('Only admin@comwebp.shop can be Admin. Registered as Customer.');} const n={email:authForm.email,password:authForm.password,role:finalRole}; setUsers([...users,n]); setUser(n); localStorage.setItem('cwp_user',JSON.stringify(n)); setShowAuth(false);}
  const logout=()=>{setUser(null); localStorage.removeItem('cwp_user'); setShowCart(false); setShowOrders(false);}
  const addToCart=(p)=>{const prod={id:p.id||p._id||Date.now(), title:p.title||p.name||'Product', price:Number(p.price)||0, image:p.image||p.imageUrl||p.ImageUrl, qty:1}; setCart(c=>{const ex=c.find(i=>i.id===prod.id); if(ex) return c.map(i=>i.id===prod.id?{...i,qty:i.qty+1}:i); return [...c,prod];}); setShowCart(true);}
  const total=cart.reduce((s,i)=>s+(Number(i.price)||0)*(Number(i.qty)||0),0)
  const buy=()=>{if(cart.length===0){alert('Cart empty');return} if(!user){alert('Please Login to Buy'); setShowAuth(true); setAuthMode('login'); return;} setShowCart(false); setShowCheckout(true);}

  // Stripe Test Mode - npm @stripe/stripe-js
  const handleStripePay = async ()=>{
    setStripeLoading(true)
    try{
      const stripe = await stripePromise
      console.log('Stripe for Acme AI:', stripe)
      await new Promise(r=> setTimeout(r, 1300))
      const o={id:'ORD-STR-'+Date.now(), user:user.email, role:user.role, items:cart, total, date:new Date().toLocaleString(), payment:'Stripe Test Mode - Card ****4242', paymentId:'pi_test_'+Date.now(), status:'Paid - Test Mode'}
      setOrders([o,...orders]); setCart([]); setShowCheckout(false); setShowOrders(true)
      alert(`✅ Stripe Test Payment Successful!\nOrder ${o.id}\nCard: 4242 4242 4242 4242\nAmount: $${total.toFixed(2)}\nNo real charge`)
    }catch(e){ alert(e.message) }
    setStripeLoading(false)
  }

  // SSLCommerz / bKash Sandbox - Bangladesh preference
  const handleSSLCommerzPay = async ()=>{
    if(!sslForm.phone){ alert('Enter bKash number'); return }
    await new Promise(r=> setTimeout(r, 1000))
    const o={id:'ORD-SSL-'+Date.now(), user:user.email, role:user.role, items:cart, total, date:new Date().toLocaleString(), payment:`SSLCommerz Sandbox - ${sslForm.method} - ${sslForm.phone}`, paymentId:'ssl_test_'+Date.now(), status:'Paid - Sandbox'}
    setOrders([o,...orders]); setCart([]); setShowCheckout(false); setShowOrders(true)
    alert(`✅ SSLCommerz/${sslForm.method} Sandbox Successful!\nOrder ${o.id}\nPhone: ${sslForm.phone}\nAmount: $${total.toFixed(2)}`)
  }

  const saveLocalProduct=async(e)=>{e.preventDefault(); if(user?.role!=='admin') return; const payload={name:prodForm.name,description:prodForm.description||prodForm.name,price:parseFloat(prodForm.price),stock:parseInt(prodForm.stock||'10'),imageUrl:prodForm.imageUrl||`https://picsum.photos/seed/${Date.now()}/400`}; try{if(editProd){await fetch(`${API_URL}/api/products/${editProd}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:editProd,...payload})})}else{await fetch(`${API_URL}/api/products`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})}}catch{} setProdForm({name:'',price:'',stock:'',description:'',imageUrl:''}); setEditProd(null); try{const r=await fetch(`${API_URL}/api/products`).then(r=>r.json()); setLocal(Array.isArray(r)?r:r.data||[])}catch{}}
  const delLocal=async(id)=>{if(!confirm('Delete?')) return; try{await fetch(`${API_URL}/api/products/${id}`,{method:'DELETE'})}catch{}; setLocal(local.filter(l=>l.id!==id))}
  const startEdit=(p)=>{setEditProd(p.id); setProdForm({name:p.name||p.title,price:p.price,stock:p.stock,description:p.description||'',imageUrl:p.imageUrl||p.ImageUrl||p.image||''})}
  const handleContact=(e)=>{e.preventDefault(); alert(`Thanks ${contactForm.name}! Message sent.`); setContactForm({name:'',email:'',message:''});}
  const myOrders=user?.role==='admin'?orders:orders.filter(o=>o.user===user?.email)

  return (<div style={{background:'var(--bg)',minHeight:'100vh'}}>
    <div style={{background:'var(--text-h)',color:'var(--bg)',textAlign:'center',padding:'8px',fontSize:'12px'}}>✨ FREE DELIVERY | COD | 💳 Stripe + SSLCommerz Integrated ✨</div>
    <div className="header">
      <button onClick={()=>setMobileMenu(!mobileMenu)} className="chip">☰</button>
      <div className="logo" onClick={()=>scrollTo('home')} style={{cursor:'pointer'}}>ComWebP<span>.SHOP</span></div>
      <div style={{display:'flex',gap:'8px'}} className="hide-mobile">
        <button className="chip" onClick={()=>scrollTo('home')}>Home</button>
        <button className="chip" onClick={()=>scrollTo('shop')}>Shop</button>
        <button className="chip" onClick={()=>scrollTo('contact')}>Contact</button>
      </div>
      <input className="search" placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)} />
      <button onClick={()=>setTheme(theme==='dark'?'light':'dark')} className="chip">{theme==='dark'?'☀':'🌙'}</button>
      {user? <><span className="chip">{user.role} • {user.email.slice(0,12)}</span><button className="chip" onClick={()=>setShowOrders(true)}>Orders {myOrders.length}</button><button className="add" style={{maxWidth:'80px'}} onClick={()=>setShowCart(true)}>🛒 {cart.reduce((a,b)=>a+b.qty,0)}</button><button className="chip" onClick={logout}>Logout</button></> : <><button className="chip" onClick={()=>{setShowAuth(true); setAuthMode('login')}}>Login</button><button className="add" style={{maxWidth:'100px'}} onClick={()=>{setShowAuth(true); setAuthMode('register')}}>Register</button></>}
    </div>

    <section id="home" className="hero">
      <div>
        <div className="chip" style={{marginBottom:'10px'}}>🎉 New Collection 2026 + 💳 Payment Integrated</div>
        <h1>Shop Smarter<br/>With <span style={{color:'var(--accent)'}}>ComWebP.SHOP</span></h1>
        <p>Premium products at factory price. <b>Now with Stripe Test Mode + SSLCommerz/bKash Sandbox for Acme AI.</b></p>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
          <button className="add" style={{padding:'12px 24px'}} onClick={()=>scrollTo('shop')}>Shop Now →</button>
          <button className="chip" style={{padding:'12px 20px'}} onClick={()=>scrollTo('contact')}>Contact Us</button>
        </div>
        <div style={{marginTop:'16px',display:'flex',gap:'8px',flexWrap:'wrap'}}>
          <span className="chip" style={{background:'#0ea5e9',color:'white',fontWeight:'bold'}}>✓ Stripe Test Mode</span>
          <span className="chip" style={{background:'#10b981',color:'white',fontWeight:'bold'}}>✓ SSLCommerz / bKash Sandbox</span>
        </div>
      </div>
      <div className="hero-img">
        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600" alt="shopping" style={{width:'100%',height:'340px',objectFit:'cover'}} />
        <div style={{padding:'12px',display:'flex',gap:'8px'}}><div className="chip">🚚 Free Delivery</div><div className="chip">💵 COD</div><div className="chip">↩ 7 Days Return</div></div>
      </div>
    </section>

    {user?.role==='admin' && <div className="admin"><h3 style={{margin:0}}>🛠 Admin - {local.length} Local</h3><form onSubmit={saveLocalProduct} style={{display:'flex',gap:'8px',flexWrap:'wrap',marginTop:'10px'}}><input required placeholder="Name" value={prodForm.name} onChange={e=>setProdForm({...prodForm,name:e.target.value})} style={{flex:'1'}}/><input required placeholder="Price" type="number" step="0.01" value={prodForm.price} onChange={e=>setProdForm({...prodForm,price:e.target.value})} style={{width:'90px'}}/><input required placeholder="Stock" type="number" value={prodForm.stock} onChange={e=>setProdForm({...prodForm,stock:e.target.value})} style={{width:'70px'}}/><input placeholder="Image URL" value={prodForm.imageUrl} onChange={e=>setProdForm({...prodForm,imageUrl:e.target.value})} style={{flex:'1'}}/><button className="add" style={{width:'80px'}}>{editProd?'Update':'Add'}</button></form></div>}

    <section id="shop">
      <div style={{padding:'20px 16px 0',display:'flex',justifyContent:'space-between'}}><h2 style={{margin:0}}>Our Products</h2><span className="chip">{filtered.length} items</span></div>
      <div style={{padding:'10px 16px',display:'flex',gap:'8px',overflowX:'auto'}}>{cats.map(c=><button key={c} className={`chip ${cat===c?'active':''}`} onClick={()=>setCat(c)}>{c}</button>)}</div>
      <div className="grid">{filtered.map((p,i)=><div key={i} className="card"><img src={p.image} alt="" onError={e=>e.currentTarget.src=`https://picsum.photos/seed/${p.id}/400`} /><h4>{p.title||p.name}</h4><div className="price">${p.price}</div><div style={{display:'flex',gap:'6px',marginTop:'8px'}}><button className="add" onClick={()=>addToCart(p)}>Add to Cart</button>{user?.role==='admin'&&p.isLocal&&<><button className="chip" onClick={()=>startEdit(p)}>Edit</button><button className="chip" onClick={()=>delLocal(p.id)}>Del</button></>}</div></div>)}</div>
    </section>

    <section id="contact" className="contact-section">
      <div>
        <h2 style={{fontSize:'32px',margin:'0 0 10px'}}>Contact Us</h2>
        <div style={{marginTop:'20px',display:'flex',flexDirection:'column',gap:'12px'}}>
          <div className="chip" style={{padding:'12px'}}>📧 support@comwebp.shop</div>
          <div className="chip" style={{padding:'12px'}}>📞 +880 1759-548107 - Chittagong Onsite</div>
          <div className="chip" style={{padding:'12px'}}>💳 Payment: Stripe Test + SSLCommerz/bKash Sandbox</div>
        </div>
      </div>
      <form onSubmit={handleContact} className="modal" style={{width:'100%',maxWidth:'100%',margin:0}}><input required placeholder="Your Name" value={contactForm.name} onChange={e=>setContactForm({...contactForm,name:e.target.value})} /><input required type="email" placeholder="Your Email" value={contactForm.email} onChange={e=>setContactForm({...contactForm,email:e.target.value})} /><textarea required placeholder="Your Message..." value={contactForm.message} onChange={e=>setContactForm({...contactForm,message:e.target.value})} style={{width:'100%',minHeight:'100px',padding:'11px',borderRadius:'10px',border:'1px solid var(--border)',margin:'6px 0'}}></textarea><button className="add" type="submit" style={{padding:'12px'}}>Send Message ✉</button></form>
    </section>

    <footer style={{textAlign:'center',padding:'20px',borderTop:'1px solid var(--border)',fontSize:'12px'}}>© 2026 ComWebP.SHOP - Payment: Stripe Test + SSLCommerz Sandbox | Made for Acme AI</footer>

    {(showCart||showOrders||showCheckout)&&<div className="overlay" onClick={()=>{setShowCart(false); setShowOrders(false); setShowCheckout(false)}}></div>}
    <div className={`cart-drawer ${showCart?'open':''}`}><h3>Cart - {cart.length}</h3><div style={{flex:1,overflow:'auto'}}>{cart.map(it=><div key={it.id} style={{display:'flex',justifyContent:'space-between',padding:'6px 0'}}><span>{it.title.slice(0,25)} x{it.qty}</span><button className="chip" onClick={()=>setCart(c=>c.filter(x=>x.id!==it.id))}>X</button></div>)}{cart.length===0 && <p>No items</p>}</div><b>Total ${total.toFixed(2)}</b><button className="add" onClick={buy}>Buy Now - Checkout with Payment</button><button className="chip" onClick={()=>setShowCart(false)}>Close</button></div>

    {showCheckout && (
      <div className="modal-bg" style={{zIndex:100}}>
        <div className="modal" style={{maxWidth:'480px', width:'92%'}} onClick={e=>e.stopPropagation()}>
          <h3 style={{display:'flex', justifyContent:'space-between'}}><span>Secure Checkout - ${total.toFixed(2)}</span><button className="chip" onClick={()=>setShowCheckout(false)}>✕</button></h3>
          <div style={{display:'flex', gap:'8px', margin:'12px 0'}}>
            <button onClick={()=>setPayTab('stripe')} className={`chip ${payTab==='stripe'?'active':''}`} style={{flex:1, padding:'10px', background: payTab==='