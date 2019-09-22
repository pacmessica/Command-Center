package facility

type DemandClient interface {
	GetReadingsForFacilities(facilityIDs []string) ([]*Reading, error)
}
