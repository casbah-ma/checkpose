import styled from "styled-components";

const Layout = styled.div`
position:relative;
max-width: 600px; 
height: 100vh;
margin: 0px auto;
background-color: ${props=>props.bgColor|| "#f1f1f1"} ;
overflow-y: ${props=>props.scroll ? "scroll" : "hidden"}  ;
overflow-x: hidden ;
`

export default Layout