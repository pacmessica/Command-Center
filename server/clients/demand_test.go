package clients

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/pacmessica/command-center/server/facility"

	"github.com/stretchr/testify/assert"
)

var badID = "badID"

func TestGetReadingsForFacilities(t *testing.T) {
	// create demand Client
	dc := NewDemandClient(testServer(t).URL, "", "")

	tests := map[string]struct {
		fids      []string
		expectErr bool
	}{
		"should return demands for given facility": {
			[]string{"id1"}, false,
		},
		"should return an error when given a bad facility id": {
			[]string{badID}, true,
		},
		"should return demands for multiple facilities": {
			[]string{"id1", "id2", "id3", "id4", "id5", "id6"}, false,
		},
		"should return an error if any of the facilitiy ids are bad": {
			[]string{"id1", "id2", "id3", "id4", badID, "id5", "id6"}, true,
		},
	}

	for _, test := range tests {
		demands, err := dc.GetReadingsForFacilities(test.fids)

		if test.expectErr {
			assert.Equal(t, err != nil, true)
			continue
		}

		assert.Equal(t, len(demands), len(test.fids))

		// create map of results for easy lookup
		demandsIDMap := make(map[string]struct{})
		for _, dmd := range demands {
			demandsIDMap[dmd.FacilityID] = struct{}{}
		}

		// expect a demand for every requested id
		for _, fid := range test.fids {
			if _, ok := demandsIDMap[fid]; !ok {
				t.Errorf("expected %v to be returned in demands", fid)
			}
		}
	}
}

// successTestServer returns a dummy demand that echos facility id.
// It expects to be called at the endpoint "/demand/{facility_id}"
// Will return an error if called at "/demand/badID"
func testServer(t *testing.T) *httptest.Server {
	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		parts := strings.Split(r.URL.String(), "/") // get id from url
		if len(parts) != 3 {
			t.Error("invalid url")
		}
		id := parts[2]

		if id == badID {
			w.WriteHeader(400)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		data, _ := json.Marshal(facility.Reading{FacilityID: id})
		w.Write(data)
	}))
}
