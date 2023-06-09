import * as React from 'react'
import PropTypes from 'prop-types'
import { API_URL } from '../constants'
import getArticlesById from '../utils/getArticlesById'

const ArticlesContext = React.createContext()

function ArticlesProvider({ children }) {
  const [articles, setArticles] = React.useState([])
  const [isArticlesDataFetching, setIsArticlesDataFetching] =
    React.useState(false)

  React.useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    setIsArticlesDataFetching(true)
    try {
      const response = await fetch(`${API_URL}/articles/`)
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
      setArticles(data)
      setIsArticlesDataFetching(false)
    } catch (error) {
      setIsArticlesDataFetching(false)
      console.error('Error fetching articles:', error)
    }
  }

  const createArticle = async (newArticle) => {
    try {
      const response = await fetch(`${API_URL}/articles/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newArticle),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error({
          status: response.status,
          statusText: response.statusText,
          message: data.message,
        })
      }
      setArticles([...articles, data])
    } catch (error) {
      console.error('Error creating article:', error)
    }
  }

  const updateArticle = async (id, updatedArticle) => {
    try {
      const response = await fetch(`${API_URL}/articles/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedArticle),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error({
          status: response.status,
          statusText: response.statusText,
          message: data.message,
        })
      }
      const updatedArticles = articles.map((article) =>
        article.id === id ? data : article
      )
      setArticles(updatedArticles)
    } catch (error) {
      console.error('Error updating article:', error)
    }
  }

  const updateArticles = async (updatedItems) => {
    try {
      const response = await fetch(`${API_URL}/articles/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItems),
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
      const changedArticles = getArticlesById(data)
      const changedArticlesIds = Object.keys(changedArticles)
      const updatedArticles = articles.map((article) =>
        changedArticlesIds.includes(article.id)
          ? changedArticles[article.id]
          : article
      )
      setArticles(updatedArticles)
    } catch (error) {
      alert(
        "Something went wrong. Articles in the warehouse wasn't updated correctly"
      )
      console.error('Error updating article:', JSON.parse(error))
    }
  }

  const deleteArticle = async (id) => {
    try {
      const response = await fetch(`${API_URL}/articles/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error({
          status: response.status,
          statusText: response.statusText,
        })
      }
      const updatedArticles = articles.filter((article) => article.id !== id)
      setArticles(updatedArticles)
    } catch (error) {
      console.error('Error deleting article:', error)
    }
  }

  return (
    <ArticlesContext.Provider
      value={{
        articles,
        isArticlesDataFetching,
        fetchArticles,
        createArticle,
        updateArticle,
        updateArticles,
        deleteArticle,
      }}
    >
      {children}
    </ArticlesContext.Provider>
  )
}

ArticlesProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

function useArticles() {
  return React.useContext(ArticlesContext)
}

export { ArticlesProvider, useArticles }
