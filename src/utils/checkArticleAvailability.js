function checkArticleAvailability(articlesById, modifier) {
  return (item) => {
    const article = articlesById[item.id]
    return item.amountRequired * modifier <= article.amountInStock
  }
}

export default checkArticleAvailability
