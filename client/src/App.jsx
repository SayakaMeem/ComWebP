import { useEffect, useState } from 'react'

function App() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name: '', description: '', price: 0, stock: 0, imageUrl: '' })

  const load = () => {
    fetch('http://localhost:5000/api/products')
      .then(r => r.json())
      .then(setProducts)
      .catch(() => setProducts([]))
  }

  useEffect(() => { load() }, [])

  const add = async (e) => {
    e.preventDefault()
    await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...form, 
        price: parseFloat(form.price), 
        stock: parseInt(form.stock) 
      })
    })
    setForm({ name: '', description: '', price: 0, stock: 0, imageUrl: '' })
    load()
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1>ComWebP - Store on D:</h1>
      <p>Backend: localhost:5000 | Frontend: localhost:5173</p>
      
      <form onSubmit={add} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', background: '#111', color: 'white' }}>
        <h3>Add Product</h3>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required style={{width:'100%', margin:'5px 0', padding:'8px'}}/>
        <input placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} style={{width:'100%', margin:'5px 0', padding:'8px'}}/>
        <input type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} style={{width:'100%', margin:'5px 0', padding:'8px'}}/>
        <input type="number" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form, stock:e.target.value})} style={{width:'100%', margin:'5px 0', padding:'8px'}}/>
        <button type="submit" style={{ padding:'10px 20px', background:'white', color:'black', cursor: 'pointer' }}>Add Product</button>
      </form>

      <h3>Products in DB ({products.length})</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {products.map(p => (
          <div key={p.id} style={{ border: '1px solid #ddd', padding: '10px' }}>
            <b>{p.name}</b><br/> {p.description}<br/> ${p.price} - Stock: {p.stock}<br/>
            <button 
              onClick={async () => { 
                await fetch(`http://localhost:5000/api/products/${p.id}`, {method:'DELETE'}); 
                load(); 
              }} 
              style={{marginTop:'8px', background:'red', color:'white', border:'none', padding:'6px 12px', cursor:'pointer'}}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App