import { View, Text } from 'react-native'
import React, {useState, useCallback, useEffect} from 'react'
import { GiftedChat } from 'react-native-gifted-chat'

// For other users in user._id: 1
// For self is user._id: 2

// for _id: has to be unique for different chat bubbles

// Data structure seems to render bottom to top, stack (LIFO- Last in, First Out)
// Each new message seems to append towards the top of the list in the messages object
const Chat = (onPress) => {

	const [messages, setMessages] = useState([])

	useEffect(() => {
        setMessages([
          {
            _id: 1,
            text: 'We leaving at 4pm, catch you at the lot',
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'React Native',
              avatar: 'https://picsum.photos/140/140',
            },
          },
          {
            _id: 2,
            text: 'Whats going on',
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'React Native',
              avatar: 'https://picsum.photos/140/140',
            },
          },
          {
            _id: 3,
            text: "I'm doing great, thanks for asking!",
            createdAt: new Date(),
            user: {
              _id: 1,
              name: 'You',
              avatar: 'https://picsum.photos/140/140',
            },
          },
          {
            _id: 4,
            text: 'What are you working on today?',
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'React Native',
              avatar: 'https://picsum.photos/140/140',
            },
          },
        ])
      }, [])
  
	const onSend = useCallback((messages = []) => {
	  setMessages(previousMessages =>
		GiftedChat.append(previousMessages, messages),
	  )
	}, [])

	return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: 1,
            }}
            />
	)
}

export default Chat;