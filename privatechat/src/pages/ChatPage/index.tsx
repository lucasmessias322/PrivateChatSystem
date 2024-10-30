import { useContext, useEffect, useRef, useState } from "react";
import { BsEmojiLaughingFill } from "react-icons/bs";
import { IoArrowBackOutline, IoSend, IoTrashOutline } from "react-icons/io5";
import { BsPaperclip } from "react-icons/bs";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../../Context/AuthContext";
import { getchat } from "../../Services/Api";

import { Link } from "react-router-dom";
import MessageItem from "../../components/MessageItem";

interface Message {
  userId: string;
  msg: string;
  image: string;
  sendTime: string;
}

interface Chat {
  userOneInfo: { name: string };
  userTwoInfo: { name: string };
  combineUsersId: string;
  messages: [];
  lastMessage: string;
}

export default function ChatPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null); // Referência para o final do contêiner de mensagens
  const [chat, setChat] = useState<Chat>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(
    new Set()
  );
  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { contactID } = useParams();
  const { token, userId, userData, socket } = useContext(AuthContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [SelectedFile, setSelectedFile] = useState<any>();

  useEffect(() => {
    if (contactID) {
      const combinedId =
        userId < contactID ? userId + contactID : contactID + userId;
      socket.emit("joinChat", combinedId);

      socket.emit("joinChat", contactID);
    }
  }, [socket]);

  useEffect(() => {
    socket.on("chatmessage_out", (res: any) => {
      if (res.messages) {
        setMessages(res.messages);
      }
    });
  }, [socket]);

  useEffect(() => {
    if (contactID && token) {
      const combinedId =
        userId < contactID ? userId + contactID : contactID + userId;
      getchat(combinedId, token).then((res) => {
        if (res.messages) {
          setMessages(res.messages);
        }

        setChat(res);
      });
    }
  }, [contactID, token, socket]);

  useEffect(() => {
    scrollToBottom(); // Scroll para o final sempre que as mensagens forem atualizadas
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  async function handleDeleteSelectedMessages() {
    if (!contactID || !userId) return;

    const combinedId =
      userId < contactID ? userId + contactID : contactID + userId;

    const updatedMessages = messages.filter(
      (msg) => !selectedMessages.has(msg.sendTime)
    );

    setMessages(updatedMessages);
    setSelectedMessages(new Set());

    const data = {
      token: token,
      combineUsersId: combinedId,
      messages: updatedMessages,
    };

    socket.emit("deletarMensagem", data);
  }

  function toggleSelectMessage(messageId: string) {
    setSelectedMessages((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(messageId)) {
        newSelected.delete(messageId);
      } else {
        newSelected.add(messageId);
      }
      return newSelected;
    });
  }

  useEffect(() => {
    if (contactID) {
      // Escuta o evento "mensagemDeletada" para atualizar as mensagens
      socket.on("mensagemDeletada", (res: any) => {
        const combinedId =
          userId < contactID ? userId + contactID : contactID + userId;
        console.log("algo chegou");

        // Verifica se o ID combinado é o mesmo do chat atual
        if (res.combineUsersId === combinedId) {
          setMessages(res.messages); // Atualiza as mensagens
        }
      });

      // Limpa o listener ao desmontar o componente para evitar múltiplas inscrições
      return () => {
        socket.off("mensagemDeletada");
      };
    }
  }, [contactID, userId, socket]);

  const handleClick = (messageId: string) => {
    toggleSelectMessage(messageId);
  };

  // Função para lidar com o clique no ícone do clipe de papel
  const handleFileClick = () => {
    fileInputRef.current?.click(); // Simula o clique no input de arquivo
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verifica se o tamanho do arquivo é maior que 5 MB (5 * 1024 * 1024 bytes)
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      alert(
        "O arquivo selecionado é muito grande. O tamanho máximo permitido é 5 MB."
      );
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Image = reader.result;

      setSelectedFile(base64Image);
    };

    // Limpa o campo de arquivo após o envio
    event.target.value = "";
  };

  async function SendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (question || SelectedFile) {
      setLoading(true);

      const currentQuestion = question;
      const currentFile = SelectedFile; // Verificar se há um arquivo selecionado

      // Define o tempo de expiração baseado na presença de uma imagem
      let expireTime;
      const now = new Date(); // Obtém o horário atual
      // Criptografando a mensagem

      if (currentFile) {
        // Se a mensagem tem uma imagem, define para 5 minutos
        expireTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutos
      } else {
        // Se não tem imagem, define para 30 minutos
        expireTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutos
      }
      const newMessage = {
        userId: userId,
        msg: currentQuestion,
        image: SelectedFile,
        sendTime: String(Date.now()),
        expireAt: expireTime, // Adiciona a data de expiração
      };
      // Atualiza o estado local de mensagens
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      if (contactID) {
        const combinedId =
          userId < contactID ? userId + contactID : contactID + userId;

        const data = {
          token: token,
          combineUsersId: combinedId,
          messages: [...messages, newMessage],
          lastMessage: currentQuestion || (currentFile ? "Imagem enviada" : ""),
        };

        socket.emit("chatmessage", data);

        setQuestion("");
        setSelectedFile(null); // Limpa o estado após o envio
        setLoading(false);
      }
    }
  }

  return (
    <Container>
      <Header>
        {selectedMessages.size > 0 ? ( // Mostrar o botão de deletar se houver mensagens selecionadas
          <MessagesSelectedContainer>
            <div className="wrapper">
              <Link to="/allChats">
                <IoArrowBackOutline color="#5A6A82" size={25} />
              </Link>
              <span className="selectedmessagenssize">
                {selectedMessages.size}
              </span>
            </div>

            <DeleteButton onClick={handleDeleteSelectedMessages}>
              <IoTrashOutline />
            </DeleteButton>
          </MessagesSelectedContainer>
        ) : (
          <ContactProfileAndName>
            <Link to="/allChats">
              <IoArrowBackOutline color="#5A6A82" size={25} />
            </Link>

            <AvatarImage src="/blank-profile-picture.webp" alt="Avatar" />
            <div className="userbasicInfo">
              <h4 className="botName">
                {chat
                  ? chat.userTwoInfo?.name == userData.name
                    ? chat.userOneInfo?.name
                    : chat.userTwoInfo?.name
                  : "Carregando.."}
              </h4>
            </div>
          </ContactProfileAndName>
        )}
      </Header>
      <ChatContainer>
        <MessagesContainer>
          {messages
            .slice(0)
            .reverse()
            .map((message, i) => (
              <MessageItem
                key={i}
                message={message}
                userId={userId}
                selectedMessages={selectedMessages}
                handleClick={handleClick}
              />
            ))}
        </MessagesContainer>
        <div ref={messagesEndRef} />
      </ChatContainer>
      <ChatInputBar>
        <form onSubmit={SendMessage}>
          <BsEmojiLaughingFill className="formitem" size={25} color="#9398A7" />
          <input
            type="text"
            value={question}
            onChange={handleTyping}
            disabled={loading}
          />

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/png, image/jpeg, image/gif"
            onChange={handleFileChange}
          />

          {SelectedFile && <img src={SelectedFile} alt="Arquivo Selecionado" />}

          {question.length > 0 || SelectedFile ? (
            <button
              type="submit"
              disabled={loading || (question.trim() === "" && !SelectedFile)}
            >
              <IoSend
                className="formitem"
                size={25}
                color={
                  loading || (question.trim() === "" && !SelectedFile)
                    ? "gray"
                    : "white"
                }
              />
            </button>
          ) : (
            <button type="button" onClick={handleFileClick}>
              <BsPaperclip className="formitem" size={25} />
            </button>
          )}
        </form>
      </ChatInputBar>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  height: 100vh;

  h2 {
    text-align: center;
    color: #747bff;
  }
`;

const ChatContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url("/");

  @media (min-width: 1000px) {
    padding: 0px 250px;
  }
`;

const Header = styled.div`
  padding: 15px 10px;
  background-color: #1c1f2d;
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  top: 0;
  z-index: 9;
`;

const MessagesSelectedContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .wrapper {
    display: flex;
    align-items: center;

    .selectedmessagenssize {
      padding: 0px 20px;
      font-size: 16px;
      color: whitesmoke;
    }
  }
`;

const DeleteButton = styled.button`
  padding: 0px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 25px;
  color: whitesmoke;
  display: flex;
  align-items: center;
`;

const ContactProfileAndName = styled.div`
  display: flex;
  align-items: center;

  h4.botName {
    cursor: pointer;
    width: 100%;
    color: white;
    font-size: 17px;
    font-weight: normal;
    padding: 0px 10px;
  }
`;

const AvatarImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  border: 1px solid #202c33;
  object-fit: cover;
`;

const ChatInputBar = styled.div`
  width: 100%;
  position: fixed;
  padding: 10px;
  bottom: 0;

  form {
    box-shadow: 5px 5px 20px #0d1214;
    max-width: 500px;
    margin: auto;
    border-radius: 100px;
    background-color: #212433;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 5px 10px;

    input {
      width: 100%;
      padding: 10px;
      border: 0;
      outline: none;
      font-size: 20px;
      background-color: transparent;
      color: white;
    }

    .formitem {
      margin: 0px 5px;
    }

    button {
      border: 0;
      padding: 0px;
      border-radius: 5px;
      background-color: transparent;
      cursor: pointer;
      color: #9398a7;
    }

    img {
      width: 40px;
      height: 40px;
      border: 1px dashed whitesmoke;
      object-fit: contain;
    }
  }
`;

const MessagesContainer = styled.div`
  width: 100%;
  margin-top: 70px; /* Corrigido para evitar sobreposição */
  margin-bottom: 60px;
  padding: 0px;
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  overflow-y: auto;
`;
