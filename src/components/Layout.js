import styled from "styled-components";

const Layout = styled.div`
position:relative;
max-width: 600px; 
height: 100vh;
margin: 0px auto;
background-color: #07090a ;
overflow-y: ${props => props.scroll ? "scroll" : "hidden"}  ;
border: 2px solid rgba(0,0,0,.05);
overflow-x: hidden ;
`

export default Layout