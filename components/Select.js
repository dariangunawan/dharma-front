import styled from "styled-components"

const StyledInput = styled.select`
  width: 100%;
  padding: 5px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
`

export default function Select(props) {
  return <StyledInput {...props} />
}
