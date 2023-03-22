import styled from "styled-components";

const Spacer = styled.div`
  margin-bottom: ${props => (props.bottom || 10)+'px' };
  margin-top: ${props => (props.top || '0')+'px'};
`

export default Spacer