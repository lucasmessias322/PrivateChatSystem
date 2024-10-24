import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { getAllUsers, postNewChat } from "../../Services/Api";
import { AuthContext } from "../../Context/AuthContext";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function AllUsers() {
  const { token, userId, userData } = useContext(AuthContext);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    getAllUsers(token).then((res) => {
      // Filtrar a lista de usuários para remover o usuário com o mesmo ID do userId
      const filteredUsers = res.filter((user: any) => user._id !== userId);
      console.log(res);

      setAllUsers(filteredUsers);
    });
  }, [token, userId]);

  function CreateNewChat({ contactId, contactName, contactUsername }: any) {
    const combinedId =
      userId < contactId ? userId + contactId : contactId + userId;
    const data = {
      userOneInfo: {
        id: userId,
        name: userData.name,
        username: userData.username,
      },
      userTwoInfo: {
        id: contactId,
        name: contactName,
        username: contactUsername,
      },

      combineUsersId: combinedId,
    };

    postNewChat(data, token).then((res) => {
      console.log(res);
    });
  }

  return (
    <div>
      <Header>
        <UserProfileAndName>
          <h4 className="botName">AnonChat - {userData.name}</h4>
        </UserProfileAndName>
        <SearchBarContainer>
          <form action="">
            <div className="inputContainer">
              <FaSearch color="gray" size={20} />
              <input type="text" placeholder="Nome do Usuario" />
            </div>
          </form>
        </SearchBarContainer>
      </Header>
      <ChatsList>
        {allUsers?.map((user: any) => (
          <ContactItem
            key={user._id}
            onClick={() =>
              CreateNewChat({
                contactId: user._id,
                contactName: user.name,
                contactUsername: user.username,
              })
            }
          >
            <Link to={`/chat/${user._id}`}>
              <ContactInfoContainer>
                <ContactImage src="/blank-profile-picture.webp" />
                <div className="infoTexts">
                  <h4 className="contactName">{user.name}</h4>
                  <span className="lastMessage">{user.lastMessage}</span>
                </div>
              </ContactInfoContainer>
            </Link>
          </ContactItem>
        ))}
      </ChatsList>
    </div>
  );
}

const Header = styled.div`
  padding: 20px 10px;

  position: fixed;
  width: 100%;
  top: 0;
  z-index: 9999;
`;

const SearchBarContainer = styled.div`
  width: 100%;

  form {
    padding-top: 20px;
    max-width: 400px;
    width: 100%;
    margin: 0 auto;

    .inputContainer {
      display: flex;
      align-items: center;
      background-color: #202c33;
      border-radius: 100px;
      padding: 15px 20px;

      input {
        font-size: 16px;
        width: 100%;
        padding: 0px 15px;
        background-color: transparent;
        color: white;
        border: none;
        outline: none;
      }
    }
  }
`;

const UserProfileAndName = styled.div`
  display: flex;
  align-items: center;

  h4.botName {
    color: white;
    font-size: 17px;
    margin: 0px 10px;
  }
`;

const ChatsList = styled.ul`
  list-style: none;
  padding: 0px;
  width: 100%;
  padding-top: 110px;
`;

const ContactItem = styled.li`
  width: 100%;
  height: 100%;
  padding: 20px 10px;
  cursor: pointer;
  &:hover {
    background-color: #202c337f;
  }
`;

const ContactInfoContainer = styled.div`
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
      color: #445f6d;
    }
  }
`;
const ContactImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 100%;
  border: 2px solid #444444;
`;
