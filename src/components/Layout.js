import styled from "styled-components";

const Layout = styled.div`
position:relative;
max-width: 700px; 
height: 100vh;
margin: 0px auto;
background-color: #f1f1f1 ;
overflow-y: ${props=>props.scroll ? "scroll" : "hidden"}  ;
overflow-x: hidden ;
`

export default Layout