import { useEffect, useState } from 'react'
import './App.css'
const DEFAULT_ADMIN = { email:'admin@comwebp.shop', password:'admin123', role:'admin' }
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
function App() {
  const [store, setStore] = useState([])
  const [local, setLocal] = useState([])
  const [cart, setCart] = useState(()=>JSON.parse(localStorage.getItem('cart')||'[]'))
  const [users, setUsers] = useState(()=>JSON.parse(localStorage.getItem('cwp_users')||'null') || [DEFAULT_ADMIN])
  const [user, setUser] = useState(()=>JSON.parse(localStorage.getItem('cwp_user')||'null'))
  const [orders, setOrders] = useState(()=>JSON.parse(localStorage.getItem('cwp_orders')||'[]'))
  const [showCart, setShowCart] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ email:'', password:'', role:'customer' })
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('all')
  const [showOrders, setShowOrders] = useState(false)
  const [editProd, setEditProd] = useState(null)
  const [prodForm, setProdForm] = useState({ name:'', price:'', stock:'', description:'', imageUrl:'' })
  useEffect(()=>{
    fetch('https://fakestoreapi.com/products').then(r=>r.json()).then(setStore).catch(()=>setStore([]))
    fetch(`${API_URL}/api/products`).then(r=>r.json()).then(r=>setLocal(Array.isArray(r)?r: r.data || [])).catch(()=>setLocal([]))
  },[])
  useEffect(()=>localStorage.setItem('cart', JSON.stringify(cart)),[cart])
  useEffect(()=>localStorage.setItem('cwp_users', JSON.stringify(users)),[users])
  useEffect(()=>localStorage.setItem('cwp_orders', JSON.stringify(orders)),[orders])
  const allProducts = [
  ...local.map(p=>({...p, image: p.imageUrl || p.ImageUrl || p.image || `https://picsum.photos/seed/${p.id}/400`, category:'local', rating:{rate:4.9,count:p.stock}, isLocal:true})),
  ...store.map(s=>({...s, isLocal:false}))
  ]
  const filtered = allProducts.filter(p=>{ const q=search.toLowerCase(); const t=(p.title||p.name||'').toLowerCase(); return (!q||t.includes(q)) && (cat==='all'||p.category===cat) })
  const cats = ['all','local',...new Set(store.map(s=>s.category))]
  const login = (e)=>{ e.preventDefault(); const found = users.find(u=>u.email===authForm.email && u.password===authForm.password); if(!found){ alert('Wrong email/password'); return } setUser(found); localStorage.setItem('cwp_user', JSON.stringify(found)); setShowAuth(false) }
  const register = (e)=>{ e.preventDefault(); if(users.find(u=>u.email===authForm.email)){ alert('Email exists'); return } const newUser = { email:authForm.email, password:authForm.password, role:authForm.role }; setUsers([...users, newUser]); setUser(newUser); localStorage.setItem('cwp_user', JSON.stringify(newUser)); setShowAuth(false) }
  const logout = ()=>{ setUser(null); localStorage.removeItem('cwp_user'); setShowOrders(false) }
  const addToCart = (p)=>{ if(!user){ setShowAuth(true); setAuthMode('login'); return } setCart(c=>{ const ex=c.find(i=>i.id===p.id); if(ex) return c.map(i=>i.id===p.id?{...i, qty:i.qty+1}:i); return [...c, {id:p.id, title:p.title||p.name, price:p.price, image:p.image || p.imageUrl || p.ImageUrl, qty:1}] }); setShowCart(true) }
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0)
  const buy = ()=>{ if(!user) return; const newOrder = { id: Date.now(), user:user.email, role:user.role, items:cart, total, date:new Date().toLocaleString() }; setOrders([newOrder,...orders]); setCart([]); setShowCart(false); setShowOrders(true) }
  const saveLocalProduct = async (e)=>{ e.preventDefault(); if(user?.role!=='admin') return; const payload = { name: prodForm.name, description: prodForm.description || prodForm.name, price: parseFloat(prodForm.price), stock: parseInt(prodForm.stock || '10'), imageUrl: prodForm.imageUrl || `https://picsum.photos/seed/${Date.now()}/400` }; try{ if(editProd){ await fetch(`${API_URL}/api/products/${editProd}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id:editProd,...payload})}) }else{ await fetch(`${API_URL}/api/products`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)}) } }catch{} setProdForm({name:'',price:'',stock:'',description:'', imageUrl:''}); setEditProd(null); try{ const r=await fetch(`${API_URL}/api/products`).then(r=>r.json()); setLocal(Array.isArray(r)?r: r.data || []) }catch{} }
  const delLocal = async (id)=>{ if(user?.role!=='admin') return; if(!confirm('Delete?')) return; try{ await fetch(`${API_URL}/api/products/${id}`,{method:'DELETE'}) }catch{}; setLocal(local.filter(l=>l.id!==id)) }
  const startEdit = (p)=>{ if(!p.isLocal) { alert('Only local can be edited'); return } setEditProd(p.id); setProdForm({name:p.name || p.title, price:p.price, stock:p.stock, description:p.description||'', imageUrl:p.imageUrl||p.ImageUrl||p.image||''}); window.scrollTo({top:500, behavior:'smooth'}) }
  const myOrders = user?.role==='admin'? orders : orders.filter(o=>o.user===user?.email)
  return (
    <>
      <div style={{background:'#111', color:'#fff', textAlign:'center', padding:'8px', fontSize:'13px'}}>✨ FREE DELIVERY | COD Available ✨ API: {API_URL}</div>
      <div className="header"><div className="logo">ComWebP<span>.SHOP</span></div><input className="search" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} /><div style={{display:'flex', gap:'8px'}}>{user? <><span style={{fontSize:'12px', background:user.role==='admin'?'#7c3aed':'#eee', color:user.role==='admin'?'white':'#111', padding:'6px 10px', borderRadius:'999px', fontWeight:700}}>{user.role.toUpperCase()} • {user.email}</span><button className="chip" onClick={()=>setShowOrders(!showOrders)}>{user.role==='admin'?'All Orders':'My Orders'}</button><button className="cart-btn" onClick={()=>setShowCart(!showCart)}>🛒 {cart.reduce((a,b)=>a+b.qty,0)}</button><button className="chip" onClick={logout}>Logout</button></> : <><button className="chip" onClick={()=>{setShowAuth(true); setAuthMode('login')}}>Login</button><button className="cart-btn" onClick={()=>{setShowAuth(true); setAuthMode('register')}}>Register</button></>}</div></div>
      {user?.role==='admin' && (<div style={{margin:'20px 30px', padding:'16px', border:'1px dashed #7c3aed', borderRadius:'12px', background:'#faf5ff'}}><div style={{display:'flex', justifyContent:'space-between'}}><h3 style={{margin:0}}>🛠 Admin Dashboard</h3><span style={{fontSize:'12px', background:'#7c3aed', color:'white', padding:'4px 8px', borderRadius:'999px'}}>LIVE API • {local.length} Local</span></div><form onSubmit={saveLocalProduct} style={{display:'flex', gap:'8px', flexWrap:'wrap', marginTop:'16px'}}><input required placeholder="Name" value={prodForm.name} onChange={e=>setProdForm({...prodForm,name:e.target.value})} style={{flex:1}}/><input required placeholder="Price" type="number" step="0.01" value={prodForm.price} onChange={e=>setProdForm({...prodForm,price:e.target.value})} style={{width:'110px'}}/><input required placeholder="Stock" type="number" value={prodForm.stock} onChange={e=>setProdForm({...prodForm,stock:e.target.value})} style={{width:'90px'}}/><input placeholder="Image URL (empty = picsum)" value={prodForm.imageUrl} onChange={e=>setProdForm({...prodForm,imageUrl:e.target.value})} style={{flex:1}}/><input placeholder="Desc" value={prodForm.description} onChange={e=>setProdForm({...prodForm,description:e.target.value})} style={{flex:1}}/><button style={{padding:'10px 22px', borderRadius:'10px', border:'none', background:'#7c3aed', color:'white', fontWeight:800}}>{editProd?'Update':'Add Product'}</button></form></div>)}
      {showOrders && user && (<div style={{margin:'20px 30px'}}><h2>{user.role==='admin'?`All Orders (${orders.length})`:`My History (${myOrders.length})`}</h2>{myOrders.map(o=>(<div key={o.id} className="order-card"><b>#{o.id}</b> - {o.date} - {o.user} - ${o.total.toFixed(2)}</div>))}</div>)}
      <div className="filters">{cats.map(c=><button key={c} className={`chip ${cat===c?'active':''}`} onClick={()=>setCat(c)}>{c}</button>)}</div>
      <div className="grid">{filtered.map((p,i)=>(<div key={p.id+i} className="card"><img src={p.image} alt={p.title||p.name} loading="lazy" referrerPolicy="no-referrer" onError={(e)=>{e.currentTarget.src=`https://picsum.photos/seed/${p.id}/400`}} /><h4>{p.title||p.name}</h4><div className="price">${p.price}</div><div style={{display:'flex', gap:'6px'}}><button className="add" style={{flex:1}} onClick={()=>addToCart(p)}>Add to Cart</button>{user?.role==='admin' && p.isLocal && <><button className="chip" onClick={()=>startEdit(p)}>Edit</button><button className="chip" onClick={()=>delLocal(p.id)}>Del</button></>}</div></div>))}</div>
      <div className={`cart-drawer ${showCart?'open':''}`}><h2>Cart</h2><div style={{flex:1}}>{cart.map(i=><div key={i.id}>{i.title.slice(0,20)} x{i.qty} <button onClick={()=>setCart(c=>c.filter(x=>x.id!==i.id))}>X</button></div>)}</div><h3>Total: ${total.toFixed(2)}</h3><button onClick={buy} style={{width:'100%', padding:'14px', background:'#111', color:'white', borderRadius:'12px'}}>Buy</button><button onClick={()=>setShowCart(false)} className="chip">Close</button></div>
      {showAuth && (<div className="modal-bg" onClick={()=>setShowAuth(false)}><div className="modal" onClick={e=>e.stopPropagation()}><h3>{authMode}</h3><form onSubmit={authMode==='login'?login:register}><input required type="email" placeholder="Email" value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} /><input required type="password" placeholder="Pass" value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} />{authMode==='register' && (<div style={{display:'flex', gap:'8px'}}><div onClick={()=>setAuthForm({...authForm,role:'customer'})}>Customer</div><div onClick={()=>setAuthForm({...authForm,role:'admin'})}>Admin</div></div>)}<button type="submit">{authMode}</button></form></div></div>)}
    </>
  )
}
export default App