package facility

type Organization struct {
	Name       string     `json:"name"`
	ID         string     `json:"id"`
	Facilities []Facility `json:"facilities"`
}

type Facility struct {
	Name        string    `json:"name"`
	ID          string    `json:"id"`
	Coordinates []float32 `json:"coord"`
}

type Reading struct {
	Demand     float64 `json:"demand"`
	FacilityID string  `json:"facility_id"`
	LastSeen   float64 `json:"last_seen"`
}
