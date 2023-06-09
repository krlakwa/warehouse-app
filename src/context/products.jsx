import * as React from 'react'
import PropTypes from 'prop-types'

import { API_URL } from '../constants'

const ProductContext = React.createContext()

const ProductProvider = ({ children }) => {
  const [products, setProducts] = React.useState([])
  const [isProductsDataFetching, setIsProductsDataFetching] =
    React.useState(false)

  React.useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setIsProductsDataFetching(true)
    try {
      const response = await fetch(`${API_URL}/products/`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error({
          status: response.status,
          statusText: response.statusText,
          message: data.message,
        })
      }
      setProducts(data)
      setIsProductsDataFetching(false)
    } catch (error) {
      setIsProductsDataFetching(false)
      console.error('Error fetching products:', error)
    }
  }

  const createProduct = async (newProduct) => {
    try {
      const response = await fetch(`${API_URL}/products/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error({
          status: response.status,
          statusText: response.statusText,
          message: data.message,
        })
      }
      setProducts([...products, data])
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  const updateProduct = async (id, updatedProduct) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
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
      const updatedProducts = products.map((product) =>
        product.id === id ? data : product
      )
      setProducts(updatedProducts)
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error({
          status: response.status,
          statusText: response.statusText,
        })
      }
      const updatedProducts = products.filter((product) => product.id !== id)
      setProducts(updatedProducts)
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        isProductsDataFetching,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

function useProducts() {
  return React.useContext(ProductContext)
}

ProductProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export { ProductProvider, useProducts }
