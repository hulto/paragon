package http

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/kcarretto/paragon/pkg/script/stdlib/pivot"
)

var upgrader = websocket.Upgrader{} // use default options
var WsConnsAgents = make(map[string]*pivot.WsConn)
var WsConnsClients = make(map[string]*pivot.WsConn)

func cmd(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	defer c.Close()

	// client := &Client{conn: c, send: make(chan []byte, 256), Uuid: "", Rxtx: ""}
	// WsConns[client] = true
	for {
		fmt.Println(c.RemoteAddr())
		_, message, err := c.ReadMessage()
		if err != nil {
			log.Println("server.cmd ReadMessage:", err)
			break
		}

		// Create a WebSocket message from thhe data recieved.
		wsMsg := &pivot.WsMsg{}
		err = pivot.WsMsgFromJson(string(message), wsMsg)
		if err != nil {
			log.Println("Error creating WsMsg from JSON:\n", err)
		}

		// fmt.Println(wsMsg.ToString())

		//Create an object to define the current connection.
		wsConn := &pivot.WsConn{Conn: c, Send: make(chan []pivot.WsMsg, 256), Uuid: wsMsg.Uuid, Active: true}
		wsJsonMsg, err := wsMsg.ToJson()
		switch wsMsg.SrcType {
		case pivot.Agent:
			//Not sure registering or registering matters atm.
			// if wsConn, okay := WsConnsAgents[wsMsg.Uuid]; okay {
			// 	fmt.Printf("Already registered agent %s", wsMsg.Uuid)
			// } else {
			// 	fmt.Printf("Registering agent %s", wsMsg.Uuid)
			// }
			WsConnsAgents[wsMsg.Uuid] = wsConn
		case pivot.Client:
			WsConnsClients[wsMsg.Uuid] = wsConn
		}

		switch wsMsg.MsgType {
		case pivot.Command:
			fmt.Printf("Recieved command:\n%s\n", wsMsg.Data)
			switch wsMsg.SrcType {
			case pivot.Client:
				// Chheck if agent is registered in connection list.
				if wsConn, okay := WsConnsAgents[wsMsg.Uuid]; okay {
					// Send Command to agent.
					err = wsConn.Conn.WriteMessage(websocket.TextMessage, []byte(string(wsJsonMsg)))
					if err != nil {
						log.Printf("Error sending message back", err)
					}
				}
			default:
				fmt.Println("SrcType error")
			}

		case pivot.Response:
			fmt.Printf("Recived response:\n%s", wsMsg.Data)
			switch wsMsg.SrcType {
			case pivot.Agent:
				if wsConn, okay := WsConnsClients[wsMsg.Uuid]; okay {
					fmt.Println("Here")
					// Send Command to client.
					err = wsConn.Conn.WriteMessage(websocket.TextMessage, []byte(string(wsJsonMsg)))
					if err != nil {
						log.Printf("Error sending message back", err)
					}
				}
			default:
				fmt.Println("SrcType error")
			}

		}
	}

}

func ServeWebSocket() {
	log.SetFlags(0)
	log.Printf("Starting websocket")
	http.HandleFunc("/cmd", cmd)
	log.Fatal(http.ListenAndServe("0.0.0.0:9050", nil))
}
