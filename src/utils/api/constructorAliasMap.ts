import { ConstructorChronologyRecord } from './constructorChronologies';

const constructorAliasMap = (constructorChronologyRecords: ConstructorChronologyRecord[]) => {  
  return constructorChronologyRecords.reduce((acc: any, record: ConstructorChronologyRecord) => {
    const aliases = (acc[record.constructor_id] || [])
      .concat(record.other_constructor_id);
    return { ...acc, [record.constructor_id]: aliases };
  }, {});
}

export default constructorAliasMap;