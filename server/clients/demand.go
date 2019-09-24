package clients

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/pacmessica/command-center/server/facility"

	log "github.com/sirupsen/logrus"
)

const demandEndpoint = "/demand/%s" // /demand/<facility_id: uuid>

type demandClient struct {
	baseURL      string
	clientKey    string
	clientSecret string
	httpClient   *http.Client
}

func NewDemandClient(baseURL, clientKey, clientSecret string) facility.DemandClient {
	return &demandClient{
		baseURL:      baseURL,
		clientKey:    clientKey,
		clientSecret: clientSecret,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (dc *demandClient) GetReadingsForFacilities(facilityIDs []string) ([]*facility.Reading, error) {
	type result struct {
		reading *facility.Reading
		err     error
	}

	ch := make(chan result)
	defer close(ch)

	for i, facID := range facilityIDs {
		go func(id string, i int) {
			reading, err := dc.GetReading(id)
			ch <- result{reading, err}
		}(facID, i)
	}

	readings := []*facility.Reading{}
	var resultErr error
	for result := range ch {
		if result.err != nil {
			resultErr = result.err
		}
		readings = append(readings, result.reading)

		if len(readings) == len(facilityIDs) {
			break
		}
	}

	if resultErr != nil {
		return nil, resultErr
	}

	return readings, nil
}

func (dc *demandClient) GetReading(facilityID string) (*facility.Reading, error) {
	url := dc.baseURL + fmt.Sprintf(demandEndpoint, facilityID)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.WithError(err).Error("unable to create GET request")
		return nil, err
	}

	req.SetBasicAuth(dc.clientKey, dc.clientSecret)
	res, err := dc.httpClient.Do(req)
	if err != nil {
		log.WithError(err).Error("unable to do request")
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		var err error
		body, readErr := ioutil.ReadAll(res.Body)
		// return an error containing the status code and body of the request (or read error)
		if readErr != nil {
			err = readErr
		} else {
			err = fmt.Errorf("Status: %s; Body: %s;", res.Status, string(body))
		}
		log.WithError(err).Error("received error from external client")
		return nil, err
	}

	decoder := json.NewDecoder(res.Body)

	var result *facility.Reading
	if err = decoder.Decode(&result); err != nil {
		log.WithError(err).Error("unable to decode result body")
		return nil, err
	}

	return result, nil
}
