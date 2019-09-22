package facility

// Organization
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
