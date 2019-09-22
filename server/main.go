package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/pacmessica/command-center/server/facility"
	"github.com/pacmessica/command-center/server/storage"

	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
)

func main() {
	dataDirectory := flag.String("data-directory", "data/", "directory where company_list.json is stored")
	httpListenAddress := flag.String("http", ":3002", "port service is listening on, eg :3000")

	flag.Parse()

	fields := make(map[string]interface{})
	flag.VisitAll(func(arg *flag.Flag) {
		fields[arg.Name] = arg.Value
	})
	log.WithFields(fields).Info("started service")

	organizationRepo, err := storage.NewOrganizationRepository(*dataDirectory)
	if err != nil {
		log.Fatalf("cannot initiate repo: %v", err)
	}

	facilityHandler := facility.NewHandler(organizationRepo)

	r := mux.NewRouter()
	r.HandleFunc("/facilities/{organizationID}", facilityHandler.GetByOrganizationID).Methods("GET")

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
