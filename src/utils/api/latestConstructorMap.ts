import { ConstructorChronologyRecord } from './constructorChronologies';

const latestConstructorMap = (constructorChronologyRecords: ConstructorChronologyRecord[]) => {  
  return constructorChronologyRecords.reduce((acc: any, record: ConstructorChronologyRecord) => {
    const { constructor_id, other_constructor_id, year_from } = record;
    if ((acc[constructor_id]?.year_from || 0) < year_from) {
      acc[constructor_id] = { other_constructor_id, year_from };
    }
    return acc;
  }, {});
}

export default latestConstructorMap;