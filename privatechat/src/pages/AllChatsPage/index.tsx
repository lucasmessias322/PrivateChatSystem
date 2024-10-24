import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import { AuthContext } from "../../Context/AuthContext";
import { Link } from "react-router-dom";
import { getAllChats } from "../../Services/Api";
import { BiSolidMessageSquareAdd } from "react-icons/bi";

interface Chat {
  userOneInfo: { id: string; name: string; username: string };
  userTwoInfo: { id: string; name: string; username: string };
  _id: string;
  combineUsersId: string;
  messages: Array<{
    userId: string;
    msg: string;
    sendTime: string;
    image?: string | null;
  }>;
  lastMessage: string;
}

export default function AllChatsPage() {
  const { token, userId, userData, socket } = useContext(AuthContext);

  const [allChats, setAllChats] = useState([]);

  useEffect(() => {
    const joinChats = () => {
      allChats.forEach((chat: Chat) => {
        socket.emit("joinChat", chat.combineUsersId);
      });
    };

    if (allChats.length > 0) {
      joinChats();
    }
  }, [allChats, socket]);

  useEffect(() => {
    const handleChatMessage = (res: any) => {
      // Atualiza a última mensagem no chat correspondente
      setAllChats((prevChats: any) =>
        prevChats.map((chat: Chat) => {
          if (chat.combineUsersId === res.combineUsersId) {
            return {
              ...chat,
              lastMessage: res.lastMessage, // Atualiza a última mensagem com o conteúdo correto
            };
          }
          return chat;
        })
      );
      console.log("chatmessage_out recebeu algo", res);
    };

    socket.on("chatmessage_out", handleChatMessage);

    return () => {
      socket.off("chatmessage_out", handleChatMessage);
    };
  }, [socket]);

  // useEffect(() => {
  //   const handleChatMessage = (res: Chat) => {
  //     // Atualiza a última mensagem no chat correspondente
  //     const newMessage = allChats;
  //     newMessage.push(res);

  //     allChats.map(chat => {

  //     })

  //     setAllChats(newMessage);
  //     console.log("chatmessage_out recebeu algo", res);
  //   };

  //   socket.on("chatmessage_out", handleChatMessage);

  //   return () => {
  //     socket.off("chatmessage_out", handleChatMessage);
  //   };
  // }, [socket]);

  useEffect(() => {
    if (allChats.length > 0) {
      console.log(allChats);
    }
  }, [allChats]);

  useEffect(() => {
    if (token) {
      getAllChats(userId, token).then((res) => {
        console.log(res);

        // Filtrando os chats para mostrar apenas aqueles em que o usuário está envolvido com outra pessoa
        const filteredChats = res.filter((chat: any) => {
          // Verifica se o usuário é um dos participantes e define o outro participante
          const isUserOne = chat.userOneInfo?.id === userId;
          const isUserTwo = chat.userTwoInfo?.id === userId;

          if (!isUserOne && !isUserTwo) return false; // Se o usuário não for nenhum dos dois, ignora o chat

          // Define o nome do contato com base em quem é o usuário atual
          const contactName = isUserOne
            ? chat.userTwoInfo?.name
            : chat.userOneInfo?.name;

          // Filtra chats onde o nome do contato é diferente do nome do usuário atual
          return contactName !== userData.name;
        });

        setAllChats(filteredChats);
      });
    }
  }, [token, userId, userData.name]);

  return (
    <PageContainer>
      <Header>
        <UserProfileAndName>
          <h4 className="title">AnonChat</h4>
          {/* <span>{userData.name}</span> */}
        </UserProfileAndName>
      </Header>
      <ChatsList>
        {allChats?.map((chat: any) => (
          <ChatItem key={chat._id}>
            <Link
              to={`/chat/${
                chat.userTwoInfo?.id == userId
                  ? chat.userOneInfo?.id
                  : chat.userTwoInfo?.id
              }`}
            >
              <ChatInfoContainer>
                <ChatImage src="/blank-profile-picture.webp" />
                <div className="infoTexts">
                  <h4 className="contactName">
                    {chat.userTwoInfo?.name == userData.name
                      ? chat.userOneInfo?.name
                      : chat.userTwoInfo?.name}
                  </h4>
                  <span className="lastMessage">{chat.lastMessage}</span>
                </div>
              </ChatInfoContainer>
            </Link>
          </ChatItem>
        ))}
      </ChatsList>
      <AddNewChatBtnContainer>
        <Link to="/allUsers">
          <AddNewChatBtn>
            <BiSolidMessageSquareAdd size={30} color="white" />
          </AddNewChatBtn>
        </Link>
      </AddNewChatBtnContainer>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  width: 100%;
  height: 100vh;
`;

const Header = styled.div`
  padding: 20px 10px;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 9999;
  background-color: #1b202d;
`;

const UserProfileAndName = styled.div`
  display: flex;
  align-items: center;

  h4.title {
    color: white;
    font-size: 25px;
    margin: 0px 10px;
  }
`;

const ChatsList = styled.div`
  display: flex;
  flex-direction: column;

  list-style: none;
  padding: 0px;
  width: 100%;
  height: 100%;
  position: fixed;
  overflow-y: auto;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  margin-top: 100px;
  padding-top: 20px;
  background-color: #262b3a;

  @media (min-width: 1000px) {
    margin-top: 70px;
    max-width: 500px;
    border-top-right-radius: 0px;
  }
`;

const ChatItem = styled.li`
  width: 100%;

  padding: 20px 10px;
  cursor: pointer;
  &:hover {
    background-color: #212633;
  }
`;

const ChatInfoContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  .infoTexts {
    padding: 0px 10px;

    .contactName {
      font-size: 20px;
    }

    .lastMessage {
      font-size: 12px;
      color: #b3b9c9;
    }
  }
`;
const ChatImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 100%;
  border: 2px solid #444444;
`;

const AddNewChatBtnContainer = styled.div`
  position: fixed;
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: right;
  bottom: 0;
`;

const AddNewChatBtn = styled.div`
  height: 60px;
  width: 60px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1b202d;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    background-color: #25272b;
  }
`;
