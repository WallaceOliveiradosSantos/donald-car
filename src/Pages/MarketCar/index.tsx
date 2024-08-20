'use client'
import React, { useState, useCallback, useRef } from 'react'

interface ICurso {
  id: number,
  titulo: string,
  preco: number,
  imagem: string,
  estoque: number
}

interface IShoppingItem {
  produto: ICurso
  quantidade: number
}

const initialCursos: ICurso[] = [
  { id: 1, titulo: "Informatica Basica", preco: 670.00, imagem: "/images/informatica-basica.jpg", estoque: 10 },
  { id: 2, titulo: "Como Subir sua Banca na Bet", preco: 500.00, imagem: "/images/subir-banca.jpg", estoque: 10 },
  { id: 3, titulo: "Como vender Ebook", preco: 109.00, imagem: "/images/vender-ebook.jpg", estoque: 10 },
  { id: 4, titulo: "Aprenda a Cozinhar", preco: 104.90, imagem: "/images/aprender-cozinhar.jpg", estoque: 10 },
  { id: 5, titulo: "Como vender na kiwify", preco: 700.00, imagem: "/images/vender-kiwify.jpg", estoque: 10 },
  { id: 6, titulo: "Curso de Fotografia", preco: 300.00, imagem: "/images/curso-fotografia.jpg", estoque: 10 },
  { id: 7, titulo: "Marketing Digital para Iniciantes", preco: 450.00, imagem: "/images/marketing-digital.jpg", estoque: 10 },
  { id: 8, titulo: "Programação em Python", preco: 550.00, imagem: "/images/programacao-python.jpg", estoque: 10 },
  { id: 9, titulo: "Design Gráfico Essencial", preco: 400.00, imagem: "/images/design-grafico.jpg", estoque: 10 },
  { id: 10, titulo: "Gestão de Projetos Ágeis", preco: 650.00, imagem: "/images/gestao-projetos.jpg", estoque: 10 },
]

const MarketCarPages = () => {
  const [shoppingCursos, setShoppingCursos] = useState<IShoppingItem[]>([])
  const [cursos, setCursos] = useState<ICurso[]>(initialCursos)
  const [showOutOfStock, setShowOutOfStock] = useState<boolean>(false)
  const [minPrice, setMinPrice] = useState<number | ''>('')
  const [maxPrice, setMaxPrice] = useState<number | ''>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('') // Estado para método de pagamento
  const [paymentDetails, setPaymentDetails] = useState<{ cardNumber: string, cardName: string, boletoNumber: string, pixCode: string, bankTransferDetails: string }>({
    cardNumber: '',
    cardName: '',
    boletoNumber: '',
    pixCode: '',
    bankTransferDetails: ''
  }) // Estado para detalhes de pagamento
  const cartRef = useRef<HTMLDivElement>(null)

  const handleAddCurso = useCallback((id: number) => {
    setShoppingCursos(prevShoppingCursos => {
      const cursoIndex = cursos.findIndex(curso => curso.id === id)
      if (cursoIndex === -1) return prevShoppingCursos

      const curso = cursos[cursoIndex]
      if (curso.estoque <= 0) return prevShoppingCursos

      const existingItemIndex = prevShoppingCursos.findIndex(item => item.produto.id === id)
      if (existingItemIndex !== -1) {
        const existingItem = prevShoppingCursos[existingItemIndex]
        if (existingItem.quantidade < 10 && curso.estoque > 0) {
          const updatedCourses = [...cursos]
          updatedCourses[cursoIndex] = { ...curso, estoque: curso.estoque - 1 }
          setCursos(updatedCourses)
          return prevShoppingCursos.map(item =>
            item.produto.id === id
              ? { ...item, quantidade: item.quantidade + 1 }
              : item
          )
        }
        return prevShoppingCursos
      } else {
        if (curso.estoque > 0) {
          const updatedCourses = [...cursos]
          updatedCourses[cursoIndex] = { ...curso, estoque: curso.estoque - 1 }
          setCursos(updatedCourses)
          return [...prevShoppingCursos, { produto: curso, quantidade: 1 }]
        }
        return prevShoppingCursos
      }
    })
  }, [cursos])

  const handleRemoveCurso = useCallback((id: number) => {
    setShoppingCursos(prevShoppingCursos => {
      const itemIndex = prevShoppingCursos.findIndex(item => item.produto.id === id)
      if (itemIndex === -1) return prevShoppingCursos

      const itemToRemove = prevShoppingCursos[itemIndex]
      const cursoIndex = cursos.findIndex(curso => curso.id === id)
      if (cursoIndex === -1) return prevShoppingCursos

      const updatedCourses = [...cursos]
      updatedCourses[cursoIndex] = { ...cursos[cursoIndex], estoque: cursos[cursoIndex].estoque + 1 }
      setCursos(updatedCourses)

      if (itemToRemove.quantidade > 1) {
        return prevShoppingCursos.map(item =>
          item.produto.id === id
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        )
      } else {
        return prevShoppingCursos.filter(item => item.produto.id !== id)
      }
    })
  }, [cursos])

  const totalCursos = shoppingCursos.reduce((total, item) => {
    return total + item.produto.preco * item.quantidade
  }, 0)

  const handlePrint = useCallback(() => {
    if (cartRef.current) {
      const printWindow = window.open('', '', 'height=600,width=800')
      printWindow?.document.write('<html><head><title>Carrinho de Compras</title></head><body>')
      printWindow?.document.write(cartRef.current.innerHTML)
      printWindow?.document.write('</body></html>')
      printWindow?.document.close()
      printWindow?.focus()
      printWindow?.print()
    }
  }, [])

  const handleFilter = () => {
    // No additional logic needed, minPrice and maxPrice are used directly in rendering
  }

  // Filtra os cursos baseados no intervalo de preços
  const filteredCursos = cursos.filter(curso => {
    const isWithinMinPrice = minPrice === '' || curso.preco >= minPrice
    const isWithinMaxPrice = maxPrice === '' || curso.preco <= maxPrice
    return isWithinMinPrice && isWithinMaxPrice
  })

  const availableCursos = filteredCursos.filter(curso => curso.estoque > 0)
  const outOfStockCursos = filteredCursos.filter(curso => curso.estoque <= 0)

  return (
    <div style={{ position: 'relative', padding: '20px', background: 'linear-gradient(to right, #f8f9fa, #e9ecef)', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', padding: '20px', backgroundColor: '#343a40', color: '#fff', borderBottom: '2px solid #dee2e6' }}>
        <h1 style={{ margin: 0, fontSize: '2rem' }}>Curso de Como Vender Curso - Atualizado</h1>
      </header>
      <aside style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '10px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        width: '300px'
      }} ref={cartRef}>
        <h2 style={{ marginTop: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Carrinho de Compras</span>
          <span>Total: R$ {totalCursos.toFixed(2)}</span>
        </h2>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {shoppingCursos.map(item => (
            <div key={item.produto.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #ddd', padding: '10px 0' }}>
              <img src={item.produto.imagem} alt={item.produto.titulo} style={{ width: '80px', height: 'auto', borderRadius: '8px' }} />
              <div style={{ flex: '1' }}>
                <p style={{ margin: 0 }}>Produto: {item.produto.titulo}</p>
                <p style={{ margin: 0 }}>Preço: R$ {item.produto.preco.toFixed(2)}</p>
                <p style={{ margin: 0 }}>Quantidade: {item.quantidade}</p>
                <p style={{ margin: 0 }}>Total: R$ {(item.quantidade * item.produto.preco).toFixed(2)}</p>
              </div>
              <button onClick={() => handleRemoveCurso(item.produto.id)} style={{ padding: '5px 10px', border: 'none', borderRadius: '4px', backgroundColor: '#f00', color: '#fff' }}>Remover</button>
            </div>
          ))}
        </div>
        {shoppingCursos.length > 0 && (
          <>
            <button onClick={handlePrint} style={{ marginTop: '10px', padding: '10px', border: 'none', borderRadius: '4px', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer' }}>
              Imprimir Carrinho
            </button>
            <div style={{ marginTop: '20px' }}>
              <h3>Método de Pagamento</h3>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', width: '100%' }}
              >
                <option value="">Selecione um método</option>
                <option value="creditCard">Cartão de Crédito</option>
                <option value="paypal">PayPal</option>
                <option value="boleto">Boleto Bancário</option>
                <option value="pix">Pix</option>
                <option value="bankTransfer">Transferência Bancária</option>
              </select>
              {paymentMethod === 'creditCard' && (
                <div style={{ marginTop: '10px' }}>
                  <h4>Detalhes do Cartão de Crédito</h4>
                  <input
                    type="text"
                    placeholder="Número do Cartão"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', width: '100%', marginBottom: '10px' }}
                  />
                  <input
                    type="text"
                    placeholder="Nome no Cartão"
                    value={paymentDetails.cardName}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardName: e.target.value }))}
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', width: '100%' }}
                  />
                </div>
              )}
              {paymentMethod === 'paypal' && (
                <div style={{ marginTop: '10px' }}>
                  <h4>Detalhes do PayPal</h4>
                  <p>Por favor, complete o pagamento através do site do PayPal.</p>
                </div>
              )}
              {paymentMethod === 'boleto' && (
                <div style={{ marginTop: '10px' }}>
                  <h4>Detalhes do Boleto Bancário</h4>
                  <input
                    type="text"
                    placeholder="Número do Boleto"
                    value={paymentDetails.boletoNumber}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, boletoNumber: e.target.value }))}
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', width: '100%' }}
                  />
                </div>
              )}
              {paymentMethod === 'pix' && (
                <div style={{ marginTop: '10px' }}>
                  <h4>Detalhes do Pix</h4>
                  <input
                    type="text"
                    placeholder="Código Pix"
                    value={paymentDetails.pixCode}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, pixCode: e.target.value }))}
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', width: '100%' }}
                  />
                </div>
              )}
              {paymentMethod === 'bankTransfer' && (
                <div style={{ marginTop: '10px' }}>
                  <h4>Detalhes da Transferência Bancária</h4>
                  <textarea
                    placeholder="Dados da Conta para Transferência"
                    value={paymentDetails.bankTransferDetails}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, bankTransferDetails: e.target.value }))}
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', width: '100%', height: '100px' }}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </aside>
      <main style={{ marginTop: '60px' }}>
        <h2>Filtros de Preço</h2>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="number"
            placeholder="Preço Mínimo"
            value={minPrice === '' ? '' : minPrice}
            onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', width: '120px' }}
          />
          <input
            type="number"
            placeholder="Preço Máximo"
            value={maxPrice === '' ? '' : maxPrice}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', width: '120px' }}
          />
          <button
            onClick={handleFilter}
            style={{ padding: '10px', border: 'none', borderRadius: '4px', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer' }}
          >
            Filtrar
          </button>
        </div>
        <h2>Produtos Disponíveis</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {availableCursos.map(curso => (
            <div key={curso.id} style={{ flex: '1 1 calc(33.333% - 20px)', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
              <img src={curso.imagem} alt={curso.titulo} style={{ width: '200px', height: 'auto', borderRadius: '8px' }} />
              <h3 style={{ fontSize: '16px' }}>{curso.titulo}</h3>
              <p>R$ {curso.preco.toFixed(2)}</p>
              <p>Estoque: {curso.estoque}</p>
              <button
                onClick={() => handleAddCurso(curso.id)}
                disabled={curso.estoque <= 0 || shoppingCursos.find(item => item.produto.id === curso.id)?.quantidade === 10}
                style={{ padding: '10px', border: 'none', borderRadius: '4px', backgroundColor: curso.estoque > 0 ? '#28a745' : '#ccc', color: '#fff', cursor: curso.estoque > 0 ? 'pointer' : 'not-allowed' }}
              >
                {curso.estoque <= 0 ? 'Esgotado' : 'Adicionar'}
              </button>
            </div>
          ))}
        </div>
        {showOutOfStock && (
          <div style={{ display: 'block' }}>
            <h2>Produtos Esgotados</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {outOfStockCursos.map(curso => (
                <div key={curso.id} style={{ flex: '1 1 calc(33.333% - 20px)', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                  <img src={curso.imagem} alt={curso.titulo} style={{ width: '200px', height: 'auto', borderRadius: '8px' }} />
                  <h3 style={{ fontSize: '16px' }}>{curso.titulo}</h3>
                  <p>R$ {curso.preco.toFixed(2)}</p>
                  <p>Estoque: {curso.estoque}</p>
                  <button
                    disabled
                    style={{ padding: '10px', border: 'none', borderRadius: '4px', backgroundColor: '#ccc', color: '#fff', cursor: 'not-allowed' }}
                  >
                    Esgotado
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={() => setShowOutOfStock(prev => !prev)}
          style={{ marginTop: '20px', padding: '10px', border: 'none', borderRadius: '4px', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer' }}
        >
          {showOutOfStock ? 'Ocultar Produtos Esgotados' : 'Mostrar Produtos Esgotados'}
        </button>
      </main>
    </div>
  )
}

export default MarketCarPages
