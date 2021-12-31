package http

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	// "github.com/urfave/cli/v2"

	"github.com/kost/tty2web/backend/localcommand"
	"github.com/kost/tty2web/server"
	"github.com/kost/tty2web/utils"
)

func ListenAndServeWS(listenAddress string, serverAddress string) {
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
	// appOptions.Connect = c2ip
	appOptions.Listen = listenAddress //"0.0.0.0:4444"
	appOptions.Server = serverAddress //"0.0.0.0:8080"

	err := appOptions.Validate()
	if err != nil {
		log.Printf("Error validating options: %v", err)
		exit(err, 6)
	}

	if appOptions.Listen != "" {
		log.Printf("Listening for reverse connection %s", appOptions.Listen)
		go func() {
			log.Fatal(listenForAgents(true, true, appOptions.Listen, appOptions.Server, appOptions.ListenCert, appOptions.Password))
		}()
		wait4Signals()
	}
}

func exit(err error, code int) {
	if err != nil {
		fmt.Println(err)
	}
	os.Exit(code)
}

func wait4Signals() {
	c := make(chan os.Signal)
	signal.Notify(c, os.Interrupt)
	select {
	case sig := <-c:
		fmt.Printf("Got %s signal. Aborting...\n", sig)
		os.Exit(1)
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
