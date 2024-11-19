# API Routes

## api/constructors
```
GET /api/constructors?from=startYear&to=endYear
```
Returns all constructors that have participated in at least one
of the seasons between startYear and endYear.

### Example
#### Request URL
```
/api/constructors?from=2023&to=2024
```
#### Response
```
{
    "success": true,
    "status": 200,
    "data": [
        {
            "id": "alfa-romeo",
            "full_name": "Alfa Romeo Racing"
        },
        {
            "id": "alphatauri",
            "full_name": "Scuderia AlphaTauri"
        },
        {
            "id": "alpine",
            "full_name": "Alpine F1 Team"
        },
        ...
    ]
}
```

## api/constructors/getStandings

```
POST /api/constructors/getStandings
```
Returns scores for specific constructors, over a span of seasons.

### Example
#### Request body
```
{
    "from": 2023,
    "to": 2024,
    "constructors: ["mclaren", "kick-sauber"]
}
```
The 'constructors' property is optional, and if it is excluded from the
request body, data will be fetched for all constructors.

#### Response
```
{
    "success": true,
    "status": 200,
    "data": [
        {
            "constructor_id": "kick-sauber",
            "total_points": "0",
            "year": 2024,
            "full_name": "Kick Sauber F1 Team"
        },
        {
            "constructor_id": "mclaren",
            "total_points": "302",
            "year": 2023,
            "full_name": "McLaren Racing"
        },
        {
            "constructor_id": "mclaren",
            "total_points": "593",
            "year": 2024,
            "full_name": "McLaren Racing"
        }
    ]
}
```

