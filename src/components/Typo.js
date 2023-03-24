import styled from "styled-components";

const Title = styled.h1`
  color: #3d4852;
  margin:${props => props.big ? '20px' : 0} ;
  font-size:${props => props.big ? '56px' : '56px'} ;
  border-bottom: ${props => props.big ? '1px solid black' : 'none'} ;
  font-weight:100;
  text-transform:uppercase;
`

const Paragraph = styled.p`
  color: #3d4852;
  padding-left:10%;
  padding-right:10%;
  margin-bottom:30px;
  text-align:center;
`

export {
    Title,
    Paragraph
}