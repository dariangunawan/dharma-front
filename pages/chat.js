import { app, auth, db, storage } from "@/lib/firebase"
import style from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css"
import {
  Avatar,
  ChatContainer,
  Conversation,
  ConversationHeader,
  ConversationList,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  Sidebar,
} from "@chatscope/chat-ui-kit-react"
import axios from "axios"
import { onAuthStateChanged } from "firebase/auth"
import { get, onValue, push, ref, set } from "firebase/database"
import {
  ref as refStorage,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"

const ChatPage = () => {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [isLoggedIn, setIsLoggedIn] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const adminid = "ATIRAoZVTfQPAtkvn9CNEEkIqbF3"
  const url = `messages/${isLoggedIn?.userId}/${adminid}`

  const handleSendMessage = (message) => {
    if (message.trim() === "") {
      return
    }

    const messagesRef = ref(db, url)
    const newMessageRef = push(messagesRef)
    set(newMessageRef, {
      nama_pengirim: isLoggedIn?.name,
      nama_penerima: "Admin",
      pesan: message,
      tanggal: new Date().toISOString(),
      sender_id: isLoggedIn?.userId,
      receiver_id: adminid,
      isFile: false,
    })

    setNewMessage("")
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        axios.get("/api/auth?userId=" + user.uid).then((res) => {
          setIsLoggedIn(res.data)
          const messagesRef = ref(db, `messages/${res.data?.userId}/${adminid}`)
          get(messagesRef)
            .then((snapshot) => {
              const messagesData = snapshot.val()
              if (messagesData) {
                const messagesArray = Object.values(messagesData)
                setMessages(messagesArray)
              } else {
                setMessages([])
              }
            })
            .catch((error) => {
              console.error("Error fetching data:", error)
            })
        })
        // User is signed in
        // Redirect to protected routes or display logged-in content
      } else {
        return router.replace("/")
        // User is not signed in
        // Redirect to login or registration page
      }
    })

    const messagesRef = ref(db, url)
    onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val()
      if (messagesData) {
        const messagesArray = Object.values(messagesData)
        setMessages(messagesArray)
      } else {
        setMessages([])
      }
    })
  }, [])

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      const storageRef = refStorage(storage, `uploads/${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.error("snapshot", snapshot)
          // Handle progress if needed
        },
        (error) => {
          console.error("File upload error:", error)
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          console.log(downloadURL, "downloadURL")

          const messagesRef = ref(db, url)
          const newMessageRef = push(messagesRef)
          set(newMessageRef, {
            nama_pengirim: isLoggedIn?.name,
            nama_penerima: "Admin",
            tanggal: new Date().toISOString(),
            sender_id: isLoggedIn?.userId,
            receiver_id: adminid,
            pesan: "Mengirim Sebuah File, Klik Untuk Download",
            fileUrl: downloadURL,
            isFile: true,
          })

          setNewMessage("")
          // await addDoc(collection(db, "files"), {
          //   name: file.name,
          //   url: downloadURL,
          //   createdAt: new Date(),
          // })
          // setMessages([
          //   ...messages,
          //   {
          //     text: `File uploaded: ${file.name}`,
          //     url: downloadURL,
          //     direction: "outgoing",
          //   },
          // ])
        }
      )
    }
  }

  const handleAttachClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div style={{ height: "100vh" }}>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />
      <MainContainer>
        <Sidebar position="left">
          <ConversationList>
            <Conversation
              name={isLoggedIn?.name}
              lastSenderName="Admin"
              info="Ok"
              active={true}
            >
              <Avatar src="https://yt3.ggpht.com/yti/ANjgQV8JjOe0eDlu8qZbNN1SJ3Li_FtynE54MsLpQA=s88-c-k-c0x00ffffff-no-rj" />
            </Conversation>
          </ConversationList>
        </Sidebar>
        <ChatContainer>
          <ConversationHeader>
            <Avatar src="https://yt3.ggpht.com/yti/ANjgQV8JjOe0eDlu8qZbNN1SJ3Li_FtynE54MsLpQA=s88-c-k-c0x00ffffff-no-rj" />
            <ConversationHeader.Content userName="Admin" />
          </ConversationHeader>

          <MessageList>
            {messages.map((item, index) => {
              if (item?.sender_id === isLoggedIn?.userId) {
                return (
                  <Message
                    key={index}
                    model={{
                      message: item?.pesan,
                      sender: item?.nama_penerima,
                      sentTime: item?.tanggal,
                      direction: "outgoing",
                      position: "single",
                    }}
                    onClick={() => {
                      if (item?.isFile) {
                        window.open(item?.fileUrl, "_blank")
                      }
                    }}
                  ></Message>
                )
              }
              return (
                <Message
                  key={index}
                  model={{
                    message: item?.pesan,
                    sender: item?.nama_pengirim,
                    sentTime: item?.tanggal,
                    direction: "incoming",
                    position: "single",
                  }}
                  onClick={() => {
                    if (item?.isFile) {
                      window.open(item?.fileUrl, "_blank")
                    }
                  }}
                ></Message>
              )
            })}
          </MessageList>

          <MessageInput
            placeholder="Type message here"
            onSend={handleSendMessage}
            value={newMessage}
            onChange={(e) => setNewMessage(e)}
            onAttachClick={handleAttachClick}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  )
}

export default ChatPage
