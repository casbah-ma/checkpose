import styled from "styled-components";

const Title = styled.h1`
  color: #ffea35;
  margin:${props => props.big ? '20px' : 0} ;
  font-size:${props => props.big ? '56px' : '26px'} ;
  border-bottom: ${props => props.big ? '1px solid white' : 'none'} ;
`

const Paragraph = styled.p`
  color: white;
  max-width:250px;

`

export {
    Title,
    Paragraph
}