import { useEffect, useState } from 'react'
import './App.css'

const DEFAULT_ADMIN = { email:'admin@comwebp.shop', password:'admin123', role:'admin' }

function App() {
  const [store, setStore] = useState([])
  const [local, setLocal] = useState([])
  const [cart, setCart] = useState(()=>JSON.parse(localStorage.getItem('cart')||'[]'))
  const [users, setUsers] = useState(()=>JSON.parse(localStorage.getItem('cwp_users')||'null') || [DEFAULT_ADMIN])
  const [user, setUser] = useState(()=>JSON.parse(localStorage.getItem('cwp_user')||'null'))
  const [orders, setOrders] = useState(()=>JSON.parse(localStorage.getItem('cwp_orders')||'[]'))
  const [showCart, setShowCart] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login') // login | register
  const [authForm, setAuthForm] = useState({ email:'', password:'', role:'customer' })
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('all')
  const [showOrders, setShowOrders] = useState(false)
  const [editProd, setEditProd] = useState(null)
  const [prodForm, setProdForm] = useState({ name:'', price:'', stock:'', description:'' })

  useEffect(()=>{
    fetch('https://fakestoreapi.com/products').then(r=>r.json()).then(setStore)
    fetch('http://localhost:5000/api/products').then(r=>r.json()).then(setLocal).catch(()=>{})
  },[])
  useEffect(()=>localStorage.setItem('cart', JSON.stringify(cart)),[cart])
  useEffect(()=>localStorage.setItem('cwp_users', JSON.stringify(users)),[users])
  useEffect(()=>localStorage.setItem('cwp_orders', JSON.stringify(orders)),[orders])

  const allProducts = [
   ...local.map(p=>({...p, image:p.imageUrl||`https://picsum.photos/seed/${p.id}/400`, category:'local', rating:{rate:4.9,count:p.stock}, isLocal:true})),
   ...store.map(s=>({...s, isLocal:false}))
  ]
  const filtered = allProducts.filter(p=>{
    const q=search.toLowerCase()
    const t=(p.title||p.name||'').toLowerCase()
    return (!q||t.includes(q)) && (cat==='all'||p.category===cat)
  })
  const cats = ['all','local',...new Set(store.map(s=>s.category))]

  const login = (e)=>{
    e.preventDefault()
    const found = users.find(u=>u.email===authForm.email && u.password===authForm.password)
    if(!found){ alert('Wrong email/password'); return }
    setUser(found); localStorage.setItem('cwp_user', JSON.stringify(found)); setShowAuth(false)
  }
  const register = (e)=>{
    e.preventDefault()
    if(users.find(u=>u.email===authForm.email)){ alert('Email already exists'); return }
    const newUser = { email:authForm.email, password:authForm.password, role:authForm.role }
    setUsers([...users, newUser]); setUser(newUser)
    localStorage.setItem('cwp_user', JSON.stringify(newUser)); setShowAuth(false)
  }
  const logout = ()=>{ setUser(null); localStorage.removeItem('cwp_user'); setShowOrders(false) }

  const addToCart = (p)=>{
    if(!user){ setShowAuth(true); setAuthMode('login'); return }
    setCart(c=>{
      const ex=c.find(i=>i.id===p.id)
      if(ex) return c.map(i=>i.id===p.id?{...i, qty:i.qty+1}:i)
      return [...c, {id:p.id, title:p.title||p.name, price:p.price, image:p.image, qty:1}]
    }); setShowCart(true)
  }
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0)
  const buy = ()=>{
    if(!user) return
    const newOrder = { id: Date.now(), user:user.email, role:user.role, items:cart, total, date:new Date().toLocaleString() }
    setOrders([newOrder,...orders]); setCart([]); setShowCart(false); setShowOrders(true)
  }

  // Admin product actions
  const saveLocalProduct = async (e)=>{
    e.preventDefault()
    if(user?.role!=='admin') return
    if(editProd){
      await fetch(`http://localhost:5000/api/products/${editProd}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id:editProd, name:prodForm.name, description:prodForm.description, price:parseFloat(prodForm.price), stock:parseInt(prodForm.stock), imageUrl:''})})
    }else{
      await fetch('http://localhost:5000/api/products', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name:prodForm.name, description:prodForm.description, price:parseFloat(prodForm.price), stock:parseInt(prodForm.stock), imageUrl:''})})
    }
    setProdForm({name:'',price:'',stock:'',description:''}); setEditProd(null)
    const r=await fetch('http://localhost:5000/api/products').then(r=>r.json()); setLocal(r)
  }
  const delLocal = async (id)=>{
    if(user?.role!=='admin') return
    if(!confirm('Delete?')) return
    await fetch(`http://localhost:5000/api/products/${id}`,{method:'DELETE'})
    setLocal(local.filter(l=>l.id!==id))
  }
  const startEdit = (p)=>{
    if(!p.isLocal) { alert('Only local DB products can be edited'); return }
    setEditProd(p.id); setProdForm({name:p.name, price:p.price, stock:p.stock, description:p.description||''}); window.scrollTo({top:500, behavior:'smooth'})
  }

  const myOrders = user?.role==='admin'? orders : orders.filter(o=>o.user===user?.email)

  return (
    <>
      <div style={{background:'#111', color:'#fff', textAlign:'center', padding:'8px', fontSize:'13px'}}>✨ FREE DELIVERY | COD Available | Easy Returns ✨</div>
      <div className="header">
        <div className="logo">ComWebP<span>.SHOP</span></div>
        <input className="search" placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)} />
        <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
          {user? <>
            <span style={{fontSize:'12px', background:user.role==='admin'?'#7c3aed':'#eee', color:user.role==='admin'?'white':'#111', padding:'6px 10px', borderRadius:'999px', fontWeight:700}}>{user.role.toUpperCase()} • {user.email}</span>
            <button className="chip" onClick={()=>setShowOrders(!showOrders)}>{user.role==='admin'?'All Orders':'My Orders'}</button>
            <button className="cart-btn" onClick={()=>setShowCart(!showCart)}>🛒 {cart.reduce((a,b)=>a+b.qty,0)}</button>
            <button className="chip" onClick={logout}>Logout</button>
          </> : <>
            <button className="chip" onClick={()=>{setShowAuth(true); setAuthMode('login')}}>Login</button>
            <button className="cart-btn" onClick={()=>{setShowAuth(true); setAuthMode('register')}}>Register</button>
          </>}
        </div>
      </div>

      <div className="hero">
        <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'20px', alignItems:'center'}}>
          <div>
            <div style={{background:'rgba(255,255,255,0.22)', display:'inline-block', padding:'6px 14px', borderRadius:'999px', fontSize:'13px', fontWeight:800}}>🔥 SUMMER MEGA SALE</div>
            <h1 style={{marginTop:'14px', fontSize:'44px', lineHeight:'1.05'}}>Up To 70% OFF<br/>Trending Styles</h1>
            <p style={{marginTop:'10px'}}>Fashion, Electronics, Jewelry • Trusted by 10k+ Customers • 100% Authentic</p>
          </div>
          <div style={{fontSize:'80px'}}>🛍️</div>
        </div>
      </div>

      {user?.role==='admin' && (
        <div className="admin">
          <h3>Admin Panel — Manage D:/ app.db {editProd?`(Editing ID ${editProd})`:''}</h3>
          <form onSubmit={saveLocalProduct} style={{display:'flex', gap:'8px', flexWrap:'wrap', marginTop:'12px'}}>
            <input required placeholder="Name" value={prodForm.name} onChange={e=>setProdForm({...prodForm,name:e.target.value})} style={{flex:1, minWidth:'120px'}}/>
            <input placeholder="Price" type="number" value={prodForm.price} onChange={e=>setProdForm({...prodForm,price:e.target.value})} style={{width:'100px'}}/>
            <input placeholder="Stock" type="number" value={prodForm.stock} onChange={e=>setProdForm({...prodForm,stock:e.target.value})} style={{width:'100px'}}/>
            <input placeholder="Desc" value={prodForm.description} onChange={e=>setProdForm({...prodForm,description:e.target.value})} style={{flex:1}}/>
            <button style={{padding:'10px 20px', borderRadius:'10px', border:'none', background:'#7c3aed', color:'white', fontWeight:700}}>{editProd?'Update':'Add'}</button>
            {editProd && <button type="button" onClick={()=>{setEditProd(null); setProdForm({name:'',price:'',stock:'',description:''})}} className="chip">Cancel</button>}
          </form>
          <div style={{marginTop:'10px', fontSize:'12px', color:'#666'}}>Default Admin: admin@comwebp.shop / admin123</div>
        </div>
      )}

      {showOrders && user && (
        <div style={{margin:'20px 30px'}}>
          <h2>{user.role==='admin'?`All Purchaser Orders (${orders.length})`:`My Buying History (${myOrders.length})`}</h2>
          <div style={{marginTop:'12px'}}>
            {myOrders.length===0 && <p>No orders yet.</p>}
            {myOrders.map(o=>(
              <div key={o.id} className="order-card">
                <div style={{display:'flex', justifyContent:'space-between'}}><b>#{o.id}</b><span>{o.date}</span></div>
                <div style={{fontSize:'13px', color:'#666'}}>{o.user} • {o.role} • Total ${o.total.toFixed(2)}</div>
                <div style={{marginTop:'8px', fontSize:'13px'}}>{o.items.map(i=>`${i.title.slice(0,20)} x${i.qty}`).join(', ')}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="filters">{cats.map(c=><button key={c} className={`chip ${cat===c?'active':''}`} onClick={()=>setCat(c)}>{c}</button>)}</div>

      <div className="grid">
        {filtered.map((p,i)=>(
          <div key={p.id+i} className="card">
            <img src={p.image} alt=""/>
            <h4>{p.title||p.name}</h4>
            <div style={{fontSize:'12px', color:'#888'}}>{p.category} • ⭐ {p.rating?.rate} {p.isLocal?'(Local DB)':''}</div>
            <div className="price">${p.price}</div>
            <div style={{display:'flex', gap:'6px', marginTop:'auto'}}>
              <button className="add" style={{flex:1}} onClick={()=>addToCart(p)}>Add to Cart</button>
              {user?.role==='admin' && p.isLocal && <>
                <button className="chip" onClick={()=>startEdit(p)}>Edit</button>
                <button className="chip" onClick={()=>delLocal(p.id)}>Del</button>
              </>}
            </div>
          </div>
        ))}
      </div>

      <div className={`cart-drawer ${showCart?'open':''}`}>
        <h2>Cart ({cart.reduce((a,b)=>a+b.qty,0)})</h2>
        <div style={{flex:1, overflow:'auto', marginTop:'12px'}}>
          {cart.map(i=><div key={i.id} style={{display:'flex', gap:'10px', marginBottom:'10px'}}><img src={i.image} style={{width:'50px', height:'50px', objectFit:'contain', background:'#f5f5f5', borderRadius:'8px'}}/><div style={{flex:1}}>{i.title.slice(0,20)}<br/>${i.price} x {i.qty}</div><button onClick={()=>setCart(c=>c.filter(x=>x.id!==i.id))}>X</button></div>)}
        </div>
        <h3>Total: ${total.toFixed(2)}</h3>
        <button onClick={buy} style={{width:'100%', padding:'14px', background:'#111', color:'white', borderRadius:'12px', border:'none', marginTop:'10px', fontWeight:800}}>Confirm Purchase</button>
        <button onClick={()=>setShowCart(false)} className="chip" style={{width:'100%', marginTop:'8px'}}>Close</button>
      </div>

      {showAuth && (
        <div className="modal-bg" onClick={()=>setShowAuth(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>{authMode==='login'?'Login':'Register'} — ComWebP.SHOP</h3>
            <form onSubmit={authMode==='login'?login:register}>
              <input required type="email" placeholder="Email" value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} />
              <input required type="password" placeholder="Password" value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} />
              {authMode==='register' && (
                <div style={{display:'flex', gap:'8px', margin:'8px 0'}}>
                  <div className={`role-chip ${authForm.role==='customer'?'active':''}`} onClick={()=>setAuthForm({...authForm,role:'customer'})}>Customer</div>
                  <div className={`role-chip ${authForm.role==='admin'?'active':''}`} onClick={()=>setAuthForm({...authForm,role:'admin'})}>Admin</div>
                </div>
              )}
              <button type="submit" style={{width:'100%', padding:'12px', background:'#7c3aed', color:'white', border:'none', borderRadius:'12px', fontWeight:700, marginTop:'10px'}}>{authMode==='login'?'Login':'Create Account'}</button>
            </form>
            <div style={{marginTop:'12px', fontSize:'13px', textAlign:'center'}}>
              {authMode==='login'? <><span>New?</span> <b style={{cursor:'pointer'}} onClick={()=>setAuthMode('register')}>Register as Customer/Admin</b><br/><span style={{color:'#888'}}>Admin demo: admin@comwebp.shop / admin123</span></> : <><span>Have account?</span> <b style={{cursor:'pointer'}} onClick={()=>setAuthMode('login')}>Login</b></>}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default App