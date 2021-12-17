package pivot

import (
	"fmt"

	"github.com/kcarretto/paragon/pkg/script"
)

var debug bool = true
var timeoutMS int = 2000
var parallelism int = 1000
var portSelection string

// var scanType = "connect"
var hideUnavailableHosts bool
var versionRequested bool

func giveshell(parser script.ArgParser) (script.Retval, error) {
	websocket_addr, err := parser.GetString(0)
	if err != nil {
		return nil, err
	}
	shell_cmd, err := parser.GetString(1)
	if err != nil {
		return nil, err
	}

	retVal, retErr := Giveshell(websocket_addr, shell_cmd)
	return script.WithError(retVal, retErr), nil
}

func Giveshell(websocket_addr string, shell_cmd string) (string, error) {
	final_res := ""
	fmt.Println("Trying to give shell", websocket_addr, " ", shell_cmd)
	return final_res, nil
}

