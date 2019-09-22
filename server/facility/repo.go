package facility

type OrganizationRepository interface {
	GetByID(id string) (*Organization, error)
}
