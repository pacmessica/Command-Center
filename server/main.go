package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/pacmessica/command-center/server/clients"
	"github.com/pacmessica/command-center/server/facility"
	"github.com/pacmessica/command-center/server/storage"

	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
)

func main() {
	cmdChallengeKey := flag.String("api-key", "", "api key for command challenge service")
	cmdChallengeSecret := flag.String("api-secret", "", "api-secret for command challenge service")
	cmdChallengeURL := flag.String("api-url", "", "url for command challenge service backend")
	dataDirectory := flag.String("data-directory", "data/", "directory where company_list.json is stored")
	httpListenAddress := flag.String("http", ":3002", "port service is listening on, eg :3000")

	flag.Parse()

	log.WithFields(log.Fields{
		"api-url":        *cmdChallengeURL,
		"http":           *httpListenAddress,
		"data-directory": *dataDirectory,
	}).Info("started service")

	organizationRepo, err := storage.NewOrganizationRepository(*dataDirectory)
	if err != nil {
		log.Fatalf("cannot initiate repo: %v", err)
	}

	demandClient := clients.NewDemandClient(*cmdChallengeURL, *cmdChallengeKey, *cmdChallengeSecret)
	facilityHandler := facility.NewHandler(organizationRepo, demandClient)

	r := mux.NewRouter()
	r.HandleFunc("/facilities/{organizationID}", facilityHandler.GetByOrganizationID).Methods("GET")
	r.HandleFunc("/facilities/demand", facilityHandler.GetReadings).Methods("POST")

	errs := make(chan error, 2)
	go func() {
		log.Infof("Listening on port %s", *httpListenAddress)
		errs <- http.ListenAndServe(*httpListenAddress, r)
	}()

	go func() {
		c := make(chan os.Signal, 1)
		signal.Notify(c, syscall.SIGINT)
		errs <- fmt.Errorf("%s", <-c)
	}()

	log.Printf("terminated %s", <-errs)
}
