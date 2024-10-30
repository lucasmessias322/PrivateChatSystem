import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../../Context/AuthContext";

export default function ApresentationPage() {
  const { token, userData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/allChats");
    }
  }, [token]);

  return (
    <Container>
      <h2>AnonChat</h2>

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
