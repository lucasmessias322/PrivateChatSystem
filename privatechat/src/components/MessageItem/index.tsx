import styled from "styled-components";

// Defina a interface para as props do MessageItem
interface MessageItemProps {
  message: {
    userId: string;
    sendTime: string;
    msg: string;
    image?: string;
  };
  userId: string;
  selectedMessages: Set<string>;

  handleClick: (sendTime: string) => void;
}

export default function MessageItem({
  message,
  userId,
  selectedMessages,

  handleClick,
}: MessageItemProps) {
  return (
    <MessageContainer
      isSender={message.userId === userId}
      onClick={() => handleClick(message.sendTime)}
      isSelected={selectedMessages.has(message.sendTime)}
    >
      <MessageBubble isSender={message.userId === userId}>
        {message.image ? (
          <img
            width={100}
            height={100}
            src={message.image}
            alt="Message content"
          />
        ) : null}
        <MessageText>{message.msg}</MessageText>
      </MessageBubble>
      <MessageOptionsIcons></MessageOptionsIcons>
    </MessageContainer>
  );
}

interface MessageBubbleProps {
  isSender: boolean;
  isSelected?: boolean; // Adicione isSelected se for usado
}

const MessageContainer = styled.div<MessageBubbleProps>`
  display: flex;
  width: 100%;

  ${({ isSender }) =>
    isSender &&
    `
    justify-content: flex-end;
  `}

  padding: 20px 10px;

  ${({ isSelected }) =>
    isSelected &&
    `  
    background-color: #202c337f;
 `}
`;

const MessageBubble = styled.div<MessageBubbleProps>`
  display: flex;
  flex-direction: column;
  background-color: #373e4e;
  padding: 15px 10px;
  border-radius: 10px;
  border-top-left-radius: 0px;
  max-width: 90%;

  .sendTime {
    font-size: 12px;
    color: #7a7a7a;
  }

  ${({ isSender }) =>
    isSender &&
    `
    background-color: #6b7181;
    border-top-left-radius: 10px;
    border-top-right-radius: 0px;

    .sendTime {
      font-size: 12px;
      color: #ffffff;
    }
  `}

  img {
    width: 100%;
    height: 100%;
    max-height: 250px;
    object-fit: cover;
    padding-bottom: 20px;
  }
`;

const MessageText = styled.div`
  margin: 0;
  font-size: 14px;
  color: white;
`;

const MessageOptionsIcons = styled.div`
  padding: 10px;

  #ReadMessage {
    cursor: pointer;
    color: gray;

    &:hover {
      color: white;
    }
  }
`;
