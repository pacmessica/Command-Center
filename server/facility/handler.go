package facility

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
)

type FacilityHandler interface {
	GetByOrganizationID(w http.ResponseWriter, r *http.Request)
}

type facilityHandler struct {
	organizationRepo OrganizationRepository
}

func NewHandler(organizationRepo OrganizationRepository) FacilityHandler {
	return &facilityHandler{
		organizationRepo,
	}
}

func (oh *facilityHandler) GetByOrganizationID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["organizationID"]

	log.WithFields(log.Fields{
		"method":          "GetByOrganizationID",
		"organization_id": id,
	}).Info("new request")

	organization, err := oh.organizationRepo.GetByID(id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound) // TODO
		return
	}

	b, err := json.Marshal(organization)
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
