import latestConstructorMap from '../src/utils/api/latestConstructorMap';
import map from './__config__/constructorChronologies';

describe('latestConstructorMap.ts', () => {
    test('1980-2024', () => {
        const chronologyRecords = map["1980-2024"];
        const expectedResult = {
            'alfa-romeo': { other_constructor_id: 'kick-sauber', year_from: 2024 },
            alphatauri: { other_constructor_id: 'rb', year_from: 2024 },
            alpine: { other_constructor_id: 'alpine', year_from: 2021 },
            'andrea-moda': { other_constructor_id: 'andrea-moda', year_from: 1992 },
            arrows: { other_constructor_id: 'arrows', year_from: 1997 },
            'aston-martin': { other_constructor_id: 'aston-martin', year_from: 2021 },
            bar: { other_constructor_id: 'mercedes', year_from: 2010 },
            benetton: { other_constructor_id: 'alpine', year_from: 2021 },
            'bmw-sauber': { other_constructor_id: 'kick-sauber', year_from: 2024 },
            brawn: { other_constructor_id: 'mercedes', year_from: 2010 },
            caterham: { other_constructor_id: 'caterham', year_from: 2012 },
            coloni: { other_constructor_id: 'andrea-moda', year_from: 1992 },
            fondmetal: { other_constructor_id: 'fondmetal', year_from: 1991 },
            footwork: { other_constructor_id: 'arrows', year_from: 1997 },
            'force-india': { other_constructor_id: 'aston-martin', year_from: 2021 },
            honda: { other_constructor_id: 'mercedes', year_from: 2010 },
            jaguar: { other_constructor_id: 'red-bull', year_from: 2005 },
            jordan: { other_constructor_id: 'aston-martin', year_from: 2021 },
            'kick-sauber': { other_constructor_id: 'kick-sauber', year_from: 2024 },
            'leyton-house': { other_constructor_id: 'march', year_from: 1992 },
            ligier: { other_constructor_id: 'prost', year_from: 1997 },
            'lotus-f1': { other_constructor_id: 'alpine', year_from: 2021 },
            'lotus-racing': { other_constructor_id: 'caterham', year_from: 2012 },
            manor: { other_constructor_id: 'manor', year_from: 2016 },
            march: { other_constructor_id: 'march', year_from: 1992 },
            marussia: { other_constructor_id: 'manor', year_from: 2016 },
            mercedes: { other_constructor_id: 'mercedes', year_from: 2010 },
            midland: { other_constructor_id: 'aston-martin', year_from: 2021 },
            minardi: { other_constructor_id: 'rb', year_from: 2024 },
            osella: { other_constructor_id: 'fondmetal', year_from: 1991 },
            prost: { other_constructor_id: 'prost', year_from: 1997 },
            'racing-point': { other_constructor_id: 'aston-martin', year_from: 2021 },
            rb: { other_constructor_id: 'rb', year_from: 2024 },
            'red-bull': { other_constructor_id: 'red-bull', year_from: 2005 },
            renault: { other_constructor_id: 'alpine', year_from: 2021 },
            sauber: { other_constructor_id: 'kick-sauber', year_from: 2024 },
            spyker: { other_constructor_id: 'aston-martin', year_from: 2021 },
            stewart: { other_constructor_id: 'red-bull', year_from: 2005 },
            toleman: { other_constructor_id: 'alpine', year_from: 2021 },
            'toro-rosso': { other_constructor_id: 'rb', year_from: 2024 },
            tyrrell: { other_constructor_id: 'mercedes', year_from: 2010 },
            virgin: { other_constructor_id: 'manor', year_from: 2016 }
          }
        const result = latestConstructorMap(chronologyRecords);
        expect(result).toEqual(expectedResult);
    });
});