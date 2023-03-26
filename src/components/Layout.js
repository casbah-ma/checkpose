import styled from "styled-components";

const Layout = styled.div`
position: relative;
max-width: 600px; 
height: 100vh;
margin: 0px auto;
background-color: white;
overflow-y: ${props => props.scroll ? "scroll" : "hidden"}  ;
overflow-x: hidden ;
`

export const Footer = styled.div`
height:50px;
margin: 0px auto;
width:100%;
padding-top:20px ;
background-color: #111111;
text-align:center;
a{
    color:white;
    text-decoration:none;
    :before{
        content: " 🔗 ";
    }
}
`

export default Layout