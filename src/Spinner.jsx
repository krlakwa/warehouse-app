// eslint-disable-next-line no-unused-vars
import * as React from 'react'
import styled, { keyframes } from 'styled-components'

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spinAnimation} 1s linear infinite;
`

const SpinnerComponent = () => {
  return (
    <SpinnerContainer>
      <Spinner />
    </SpinnerContainer>
  )
}

export default SpinnerComponent
