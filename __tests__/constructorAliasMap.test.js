import constructorAliasMap from '../src/utils/api/constructorAliasMap';
import map from './__config__/constructorChronologies';

describe('constructorAliasMap.ts', () => {
    test('1980-2024', () => {
        const chronologyRecords = map['1980-2024'];
        const expectedResult = {
            "alfa-romeo":[
               "alfa-romeo",
               "bmw-sauber",
               "kick-sauber",
               "sauber",
               "sauber"
            ],
            "alphatauri":[
               "alphatauri",
               "minardi",
               "rb",
               "toro-rosso"
            ],
            "alpine":[
               "alpine",
               "benetton",
               "lotus-f1",
               "renault",
               "renault",
               "toleman"
            ],
            "andrea-moda":[
               "andrea-moda",
               "coloni"
            ],
            "arrows":[
               "arrows",
               "arrows",
               "footwork"
            ],
            "aston-martin":[
               "aston-martin",
               "force-india",
               "jordan",
               "midland",
               "racing-point",
               "spyker"
            ],
            "bar":[
               "bar",
               "brawn",
               "honda",
               "mercedes",
               "tyrrell"
            ],
            "benetton":[
               "alpine",
               "benetton",
               "lotus-f1",
               "renault",
               "renault",
               "toleman"
            ],
            "bmw-sauber":[
               "alfa-romeo",
               "bmw-sauber",
               "kick-sauber",
               "sauber",
               "sauber"
            ],
            "brawn":[
               "bar",
               "brawn",
               "honda",
               "mercedes",
               "tyrrell"
            ],
            "caterham":[
               "caterham",
               "lotus-racing"
            ],
            "coloni":[
               "andrea-moda",
               "coloni"
            ],
            "fondmetal":[
               "fondmetal",
               "osella"
            ],
            "footwork":[
               "arrows",
               "arrows",
               "footwork"
            ],
            "force-india":[
               "aston-martin",
               "force-india",
               "jordan",
               "midland",
               "racing-point",
               "spyker"
            ],
            "honda":[
               "bar",
               "brawn",
               "honda",
               "mercedes",
               "tyrrell"
            ],
            "jaguar":[
               "jaguar",
               "red-bull",
               "stewart"
            ],
            "jordan":[
               "aston-martin",
               "force-india",
               "jordan",
               "midland",
               "racing-point",
               "spyker"
            ],
            "kick-sauber":[
               "alfa-romeo",
               "bmw-sauber",
               "kick-sauber",
               "sauber",
               "sauber"
            ],
            "leyton-house":[
               "leyton-house",
               "march",
               "march"
            ],
            "ligier":[
               "ligier",
               "prost"
            ],
            "lotus-f1":[
               "alpine",
               "benetton",
               "lotus-f1",
               "renault",
               "renault",
               "toleman"
            ],
            "lotus-racing":[
               "caterham",
               "lotus-racing"
            ],
            "manor":[
               "manor",
               "marussia",
               "virgin"
            ],
            "march":[
               "leyton-house",
               "march",
               "march"
            ],
            "marussia":[
               "manor",
               "marussia",
               "virgin"
            ],
            "mercedes":[
               "bar",
               "brawn",
               "honda",
               "mercedes",
               "tyrrell"
            ],
            "midland":[
               "aston-martin",
               "force-india",
               "jordan",
               "midland",
               "racing-point",
               "spyker"
            ],
            "minardi":[
               "alphatauri",
               "minardi",
               "rb",
               "toro-rosso"
            ],
            "osella":[
               "fondmetal",
               "osella"
            ],
            "prost":[
               "ligier",
               "prost"
            ],
            "racing-point":[
               "aston-martin",
               "force-india",
               "jordan",
               "midland",
               "racing-point",
               "spyker"
            ],
            "rb":[
               "alphatauri",
               "minardi",
               "rb",
               "toro-rosso"
            ],
            "red-bull":[
               "jaguar",
               "red-bull",
               "stewart"
            ],
            "renault":[
               "alpine",
               "benetton",
               "lotus-f1",
               "renault",
               "renault",
               "toleman"
            ],
            "sauber":[
               "alfa-romeo",
               "bmw-sauber",
               "kick-sauber",
               "sauber",
               "sauber"
            ],
            "spyker":[
               "aston-martin",
               "force-india",
               "jordan",
               "midland",
               "racing-point",
               "spyker"
            ],
            "stewart":[
               "jaguar",
               "red-bull",
               "stewart"
            ],
            "toleman":[
               "alpine",
               "benetton",
               "lotus-f1",
               "renault",
               "renault",
               "toleman"
            ],
            "toro-rosso":[
               "alphatauri",
               "minardi",
               "rb",
               "toro-rosso"
            ],
            "tyrrell":[
               "bar",
               "brawn",
               "honda",
               "mercedes",
               "tyrrell"
            ],
            "virgin":[
               "manor",
               "marussia",
               "virgin"
            ]
        }
        const result = constructorAliasMap(chronologyRecords);
        expect(result).toEqual(expectedResult);
    });
});