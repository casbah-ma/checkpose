import styled from "styled-components";

const Layout = styled.div`
position: relative;
max-width: 600px; 
height: 100vh;
margin: 0px auto;
background-color: #07090a;
background-color: rgba(7,9,10,.98) ;
overflow-y: ${props => props.scroll ? "scroll" : "hidden"}  ;
overflow-x: hidden ;

`

export default Layout