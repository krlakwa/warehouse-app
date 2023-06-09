function getArticlesById(articles = []) {
  return articles.reduce(
    (acc, article) => ({ ...acc, [article.id]: article }),
    {}
  )
}

export default getArticlesById
