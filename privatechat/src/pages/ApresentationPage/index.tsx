import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export default function ApresentationPage() {
  return (
    <Container>
      <h2>Pagina inicial</h2>
      <Link to="/account/login">Clique para Fazer Login</Link>
    </Container>
  );
}

const Container = styled.div`
  h2 {
    color: whitesmoke;
    padding: 10px;
  }

  a {
    padding: 10px;
    color: #5e6aaf;
  }
`;
