package storage

import (
	"encoding/json"
	"errors"
	"os"
	"strings"

	"github.com/pacmessica/command-center/server/facility"

	log "github.com/sirupsen/logrus"
)

const fileName = "company_list.json"

type organizationRepository struct {
	organizations map[string]*facility.Organization
}

// NewOrganizationRepository creates a facility.OrganizationRepository. The provided dataPath
// is expected to contain a  company_list.json file which contains an array of organizations
func NewOrganizationRepository(dataPath string) (facility.OrganizationRepository, error) {
	filePath := strings.TrimRight(dataPath, "/") + "/" + fileName

	organizations, err := loadOrganizationsFromFile(filePath)
	if err != nil {
		return nil, err
	}

	log.WithField("len_organizations", len(organizations)).Info("Initalized organization repository")

	return &organizationRepository{
		organizations: organizations,
	}, nil
}

func (r *organizationRepository) GetByID(id string) (*facility.Organization, error) {
	org, ok := r.organizations[id]
	if !ok {
		return nil, errors.New("organization not found")
	}

	return org, nil
}

func loadOrganizationsFromFile(filePath string) (map[string]*facility.Organization, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var organizations []*facility.Organization
	if err := json.NewDecoder(file).Decode(&organizations); err != nil {
		return nil, err
	}

	organizationMap := make(map[string]*facility.Organization)
	for _, org := range organizations {
		organizationMap[org.ID] = org
	}

	return organizationMap, nil
}
