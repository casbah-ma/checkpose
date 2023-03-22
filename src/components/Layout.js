import styled from "styled-components";

const Layout = styled.div`
position:relative;
max-width: 600px; 
height: 100vh;
margin: 0px auto;
background-color: #07090a ;
overflow-y: ${props => props.scroll ? "scroll" : "hidden"}  ;
border: 2px solid rgba(255,255,255,.01);
overflow-x: hidden ;
box-shadow: -1px -1px 0px 0px #48abe047, -4px -5px 20px 0px #48abe02b, 1px 1px 0px 0px #48abe047, 4px 5px 20px 0px #48abe02b;
`

export default Layout