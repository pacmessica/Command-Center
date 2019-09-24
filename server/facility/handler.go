package facility

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
)

type Handler interface {
	GetByOrganizationID(w http.ResponseWriter, r *http.Request)
	GetReadings(w http.ResponseWriter, r *http.Request)
}

type facilityHandler struct {
	organizationRepo OrganizationRepository
	demandClient     DemandClient
}

func NewHandler(organizationRepo OrganizationRepository, demandClient DemandClient) Handler {
	return &facilityHandler{
		organizationRepo,
		demandClient,
	}
}

func (fh *facilityHandler) GetByOrganizationID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["organizationID"]
	logger := log.WithFields(log.Fields{
		"method":          "GetByOrganizationID",
		"organization_id": id,
	})

	logger.Info("new request")

	organization, err := fh.organizationRepo.GetByID(id)
	if err != nil {
		logger.Error("could not find organization")
		w.WriteHeader(http.StatusNotFound)
		return
	}

	b, err := json.Marshal(organization)
	if err != nil {
		logger.Error("could not marshal organization response")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, err = w.Write(b)
	if err != nil {
		logger.WithError(err).Error("could not write response body")
	}
}

func (fh *facilityHandler) GetReadings(w http.ResponseWriter, r *http.Request) {
	var ids []string
	logger := log.WithFields(log.Fields{
		"method": "GetReadings",
	})

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&ids)
	if err != nil {
		logger.Error("could not decode request ids")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	if len(ids) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("invalid id(s)"))
		return
	}

	logger.WithField("facility_ids", ids).Info("new request")

	readings, err := fh.demandClient.GetReadingsForFacilities(ids)
	if err != nil {
		logger.Error("could not fetch demand from client")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	b, err := json.Marshal(readings)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, err = w.Write(b)
	if err != nil {
		log.WithError(err).Error("could not write response body")
	}
}
