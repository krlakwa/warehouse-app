import * as React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`

const ErrorMessage = styled.div`
  font-size: 20px;
  margin-bottom: 20px;
`

const ReloadButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorMessage>Something went wrong. Please try again.</ErrorMessage>
          <ReloadButton onClick={this.handleReload}>Reload</ReloadButton>
        </ErrorContainer>
      )
    }
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ErrorBoundary
