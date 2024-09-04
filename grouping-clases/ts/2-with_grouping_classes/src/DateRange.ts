export class DateRange {
	constructor(
		readonly startDate: Date,
		readonly endDate: Date,
	) {
		if (startDate > endDate) {
			throw new Error("End date must be after start date");
		}
	}
}
