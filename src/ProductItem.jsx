import * as React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import checkArticleAvailability from './utils/checkArticleAvailability'
import checkProductAvailability from './utils/checkProductAvailability'
import getArticlesById from './utils/getArticlesById'
import { useArticles } from './context/articles'
import { useSales } from './context/sales'

const Card = styled.div`
  width: 400px;
  margin-bottom: 20px;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`

const Title = styled.h2`
  margin-bottom: 10px;
  font-size: 24px;
  color: #333;
  border-bottom: 1px solid #333;
`

const Subtitle = styled.h3`
  margin-bottom: 5px;
  font-size: 16px;
  color: #666;
`

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
`

const Badge = styled.span`
  background-color: ${(props) => (props.isAvailable ? '#45a046' : '#ff6347')};
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
`

const SaleInput = styled.input`
  width: 80px;
  padding: 5px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`

const SaleButton = styled.button`
  padding: 5px 10px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #45a046;
  }
`

const ProductItem = ({ product }) => {
  const { articles } = useArticles()
  const { createSale, isSaleInProgress } = useSales()
  const [quantity, setQuantity] = React.useState(1)

  const isProductAvailable = React.useMemo(
    () => checkProductAvailability(product.articles, articles, quantity),
    [quantity, articles, product.articles]
  )

  function handleChangeQuantity(e) {
    setQuantity(e.target.value)
  }
  function handleSale() {
    const saleData = { productId: product.id, amountSold: quantity }
    createSale(saleData)
  }

  const articlesById = getArticlesById(articles)

  return (
    <Card key={product.id}>
      <Title>{product.name.toUpperCase()}</Title>
      <Subtitle>Articles:</Subtitle>
      <List>
        {product.articles.map((article) => {
          const articleName = articlesById[article.id].name
          const checkArticleAvailibilityForProduct = checkArticleAvailability(
            articlesById,
            quantity
          )
          const isArticleAvailable = checkArticleAvailibilityForProduct(article)

          return (
            <ListItem key={article.id}>
              <span>{`Article name: ${articleName.toUpperCase()}`}</span>
              <Badge
                isAvailable={isArticleAvailable}
              >{`Amount Required: ${article.amountRequired}`}</Badge>
            </ListItem>
          )
        })}
      </List>
      <div>
        <SaleInput
          type="number"
          min="0"
          step="1"
          placeholder="Quantity"
          value={quantity}
          onChange={handleChangeQuantity}
        />
        <SaleButton
          onClick={handleSale}
          disabled={!isProductAvailable || isSaleInProgress}
        >
          Register Sale
        </SaleButton>
      </div>
    </Card>
  )
}

ProductItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    articles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        amountRequired: PropTypes.number,
      })
    ),
  }),
}

export default ProductItem
