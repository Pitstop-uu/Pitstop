# API Routes

## api/constructors
```
GET /api/constructors?from=startYear&to=endYear
```

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
            constructor_id: 'kick-sauber',
            points: 16,
            year: 2023 
        },
        { 
            constructor_id: 'mclaren',
            points: 302,
            year: 2023
        },
        { 
            constructor_id: 'kick-sauber', 
            points: 0,
            year: 2024
        },
        { 
            constructor_id: 'mclaren',
            points: 593,
            year: 2024
        }
    ]
}
```

## api/constructors/getRaceStandings

```
POST /api/constructors/getRaceStandings
```

### Example
#### Request body
```
{
    "year": 2024,
    "constructors: ["mclaren", "ferrari"]
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
            constructor_id: 'ferrari',
            points: 27,
            year: 2024,
            date: 2024-03-02T00:00:00.000Z,
            official_name: 'Formula 1 Gulf Air Bahrain Grand Prix 2024',
            circuit_id: 'bahrain',
            grand_prix_id: 'bahrain'
        },
        {
            constructor_id: 'mclaren',
            points: 12,
            year: 2024,
            date: 2024-03-02T00:00:00.000Z,
            official_name: 'Formula 1 Gulf Air Bahrain Grand Prix 2024',
            circuit_id: 'bahrain',
            grand_prix_id: 'bahrain'
        },
        {
            constructor_id: 'ferrari',
            points: 49,
            year: 2024,
            date: 2024-03-09T00:00:00.000Z,
            official_name: 'Formula 1 stc Saudi Arabian Grand Prix 2024',
            circuit_id: 'jeddah',
            grand_prix_id: 'saudi-arabia'
        },
        {
            constructor_id: 'mclaren',
            points: 28,
            year: 2024,
            date: 2024-03-09T00:00:00.000Z,
            official_name: 'Formula 1 stc Saudi Arabian Grand Prix 2024',
            circuit_id: 'jeddah',
            grand_prix_id: 'saudi-arabia'
        },
        ...
    ]
}
```

