import React, { useRef, useState } from "react";
import io from "socket.io-client";
import styled from "styled-components";
import { BaseUrl } from "../../Services/Api";

interface JoinProps {
  setChatVisibility: (visible: boolean) => void;
  setSocket: (socket: any) => void; // You can replace 'any' with a more specific type if available
}

const Join: React.FC<JoinProps> = ({ setChatVisibility, setSocket }) => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const [username, setUserName] = useState<string>("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const usernameValue = usernameRef.current?.value; // Use optional chaining to handle potential null
    if (!usernameValue?.trim()) return;

    const socket = await io(BaseUrl);
    socket.emit("set_username", usernameValue);
    setSocket(socket);
    setChatVisibility(true);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <h2>Chat em tempo real</h2>
        <input
          ref={usernameRef}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Nome de usuário"
        />
        <button>Entrar</button>
      </form>
    </Container>
  );
};

export default Join;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  form {
    display: flex;
    justify-content: center;
    flex-direction: column;
    max-width: 400px;
    padding: 40px 10px;

    input {
      width: 100%;
      border: none;
      color: #ffffff;
      padding: 5px;
      outline: none;
      background-color: #141c20;
      border-radius: 5px;
      font-size: 20px;
      margin: 5px 0px;
      border-bottom: 4px solid #425b68;
    }

    button {
      width: 100px;
      border: none;
      background-color: #0147df;
      border-radius: 10px;
      padding: 5px;
    }
  }
`;
