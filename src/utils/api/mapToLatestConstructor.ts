import getLatestConstructorMap from "./latestConstructorMap";
import { ConstructorChronologyRecord } from "./constructorChronologies";

interface Record { constructor_id: string }

const mapToLatestConstructor = (
    records: Record[],
    chronologies: ConstructorChronologyRecord[]
) => {
	const latestConstructorMap = getLatestConstructorMap(chronologies);
	return records.map((record) => {
		const constructorMapping = latestConstructorMap[record.constructor_id];
		return constructorMapping
			? { ...record, constructor_id: constructorMapping.other_constructor_id }
			: record;
	}, []);
}

export default mapToLatestConstructor;