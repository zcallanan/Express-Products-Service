# Service
* Express app that offs a custom API response
* Serves as a middleman in order to mitigate inconsistent third party APIs
* Stores and makes available data via a Postgres DB and Redis

## Read API
* Offers a read API to this [Demo App](https://github.com/zcallanan/React-Product-List). 
* The JSON output is viewable when inserting /api/ into the URL such as [Gloves](https://reaktor-client.herokuapp.com/api/gloves)

## Third Party APIs
* Stays in sync with changing data via scheduled jobs
