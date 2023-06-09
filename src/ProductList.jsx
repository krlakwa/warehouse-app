// eslint-disable-next-line no-unused-vars
import * as React from 'react'
import styled from 'styled-components'

import ProductItem from './ProductItem'
import Spinner from './Spinner'
import { useProducts } from './context/products'
import { useArticles } from './context/articles'
import { useSales } from './context/sales'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ProductList = () => {
  const { products, isProductsDataFetching } = useProducts()
  const { isArticlesDataFetching } = useArticles()
  const { isSalesDataFetching } = useSales()

  if (
    [
      isProductsDataFetching,
      isArticlesDataFetching,
      isSalesDataFetching,
    ].includes(true)
  ) {
    return <Spinner />
  }

  if (!products) {
    return null
  }

  return (
    <Container>
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </Container>
  )
}

export default ProductList
