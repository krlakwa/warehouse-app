import * as React from 'react'
import PropTypes from 'prop-types'

import { API_URL } from '../constants'
import { useArticles } from './articles'
import { useProducts } from './products'

const SalesContext = React.createContext()

function SalesProvider({ children }) {
  const [sales, setSales] = React.useState([])
  const [isSalesDataFetching, setIsSalesDataFetching] = React.useState(false)
  const [isSaleInProgress, setIsSaleInProgress] = React.useState(false)
  const { products } = useProducts()
  const { updateArticles } = useArticles()

  React.useEffect(() => {
    fetchSales()
  }, [])

  const fetchSales = async () => {
    setIsSalesDataFetching(true)
    try {
      const response = await fetch(`${API_URL}/sales/`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error({
          status: response.status,
          statusText: response.statusText,
          message: data.message,
        })
      }
      setIsSalesDataFetching(false)
      setSales(data)
    } catch (error) {
      setIsSalesDataFetching(false)
      console.error('Error fetching sales:', error)
    }
  }

  const createSale = async (newSale) => {
    setIsSaleInProgress(true)
    try {
      const response = await fetch(`${API_URL}/sales/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSale),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          JSON.stringify({
            status: response.status,
            statusText: response.statusText,
            message: data.message,
          })
        )
      }
      setSales([...sales, data])
      setIsSaleInProgress(false)
      const product = products.find((item) => item.id === newSale.productId)
      const updatedArticles = product.articles.map((article) => ({
        id: article.id,
        amountToSubtract: article.amountRequired * newSale.amountSold,
      }))

      updateArticles(updatedArticles)
    } catch (error) {
      setIsSaleInProgress(false)
      alert('Something went wrong. Your sale was not registered properly')
      console.error('Error creating sale:', JSON.parse(error.message))
    }
  }

  const updateSale = async (id, updatedSale) => {
    try {
      const response = await fetch(`${API_URL}/sales/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSale),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error({
          status: response.status,
          statusText: response.statusText,
          message: data.message,
        })
      }
      const updatedSales = sales.map((sale) => (sale.id === id ? data : sale))
      setSales(updatedSales)
    } catch (error) {
      console.error('Error updating sale:', error)
    }
  }

  const deleteSale = async (id) => {
    try {
      const response = await fetch(`${API_URL}/sales/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(
          JSON.stringify({
            status: response.status,
            statusText: response.statusText,
          })
        )
      }
      const updatedSales = sales.filter((sale) => sale.id !== id)
      setSales(updatedSales)
    } catch (error) {
      console.error('Error deleting sale:', JSON.parse(error))
    }
  }

  return (
    <SalesContext.Provider
      value={{
        sales,
        isSalesDataFetching,
        isSaleInProgress,
        createSale,
        updateSale,
        deleteSale,
      }}
    >
      {children}
    </SalesContext.Provider>
  )
}

SalesProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

function useSales() {
  return React.useContext(SalesContext)
}

export { SalesProvider, useSales }
