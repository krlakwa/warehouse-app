import getArticlesById from './getArticlesById'
import checkArticleAvailability from './checkArticleAvailability'
const checkProductAvailability = (
  productArticles = [],
  articles = [],
  modifier = 1
) => {
  const articlesById = getArticlesById(articles)
  const articlesAvailability = productArticles.map(
    checkArticleAvailability(articlesById, modifier)
  )

  // returns false when one or more articles are not available
  return Boolean(!articlesAvailability.includes(false))
}

export default checkProductAvailability
