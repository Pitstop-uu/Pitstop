import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const openF1db = async () => {
	return open({
		filename: "./data/f1db.db",
		driver: sqlite3.Database,
	});
}