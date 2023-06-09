import * as React from 'react'

import { ArticlesProvider } from './context/articles'
import { ProductProvider } from './context/products'
import { SalesProvider } from './context/sales'

import Spinner from './Spinner'
import ErrorBoundary from './ErrorBoundary'
const ProductList = React.lazy(() => import('./ProductList'))

function App() {
  return (
    <ErrorBoundary>
      <ProductProvider>
        <ArticlesProvider>
          <SalesProvider>
            <React.Suspense fallback={Spinner}>
              <ProductList />
            </React.Suspense>
          </SalesProvider>
        </ArticlesProvider>
      </ProductProvider>
    </ErrorBoundary>
  )
}

export default App
