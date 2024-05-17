
/**
 * Singleton Timed Effect manager is a service that uses the simple calendar timekeeper
 * to manage the lifecycle effects based on the Foundry VTT concepts of
 * worldtime and combat time. 
 * 
 * It is important to note that the SimpleCalendar module handles the passage of time and definition
 * of time for a world.
 * 
 * Foundry VTT has defined Active Effect durations based on either combat or worldtime but has no implementation
 * for managing effect lifecycles.
 * 
 * The TimedEffectManger's API facilitates the creation of new effects in such a way that their lifecycle can be managed.
 * 
 */

/**
 * @typedef {import('../model/types.mjs').DurationDateTimeData} DurationDateTimeData
 */

/**
 * Source: [Foundry VTT Source Code Path for Effect Duration Data]{@link resources/app/common/documents/_types.mjs}
 * /**
 * @typedef {Object} EffectDurationData
 * @property {number} [startTime]         The world time when the active effect first started
 * @property {number} [seconds]           The maximum duration of the effect, in seconds
 * @property {string} [combat]            The _id of the CombatEncounter in which the effect first started
 * @property {number} [rounds]            The maximum duration of the effect, in combat rounds
 * @property {number} [turns]             The maximum duration of the effect, in combat turns
 * @property {number} [startRound]        The round of the CombatEncounter in which the effect first started
 * @property {number} [startTurn]         The turn of the CombatEncounter in which the effect first started
 */

/**
 * @typedef {Object} DateTimeParts
 * Source: [DateTimeParts from SimpleCalendar]{@link https://simplecalendar.info/docs/developing-with-sc/api/namespaces/SimpleCalendar#datetimeparts}
 * @property {number} [days]              The day value of the date. The day is index based, meaning the first day of the month will have a value of 0.
 * @property {number} [month]             The month value of the date. The month is index based, meaning the first month of a year will have a value of 0.
 * @property {number} [year]              The year value of the date.
 * @property {number} [hour]              The hour value of the time.  
 * @property {number} [minute]            The minute value of the time.
 * @property {number} [seconds]           The second value of the time.  
 */
export default class TimedEffectManger {

    static VALID_DURATION_TIME_DATA_KEYS = ["days","hours","minutes", "seconds", "rounds","turns"];

    /**
     * Creates an effect duration object based on a given
     * @param {DurationDateTimeData} durationTimeData 
     * @param {DurationDateTimeData} [startTimeDelayData] 
     * @param {string} [calendarId] 
     * @returns {EffectDurationData}
     */
    static buildEffectDuration(durationTimeData,startTimeDelayData,calendarId) {
        let interval = {...durationTimeData};
        if(!isValidDurationDateTimeData(durationTimeData)) {
            //TODO: Set a default duration delta or throw an error
        }
        let duration = {
            "startTime": null,
            "seconds": null,
            "rounds": null,
            "combat": null,
            "turns": null,
            "startRound": null,
            "startTurn": null
        };

        const startTimeStamp = SimpleCalendar.api.timestamp();
        const targetCalenderId = calendarId ?? SimpleCalendar.api.getCurrentCalendar().id;
        
        SimpleCalendar.api.timestampPlusInterval(startTimeStamp,interval,calendar);

    }

    /**
     * 
     * @param {DateTimeParts} simpleCalendarDateTime 
     */
    static buildDurationFromExpiryDateTime(simpleCalendarDateTime) {

    }

    /**
     * Checks to see if the given object contains at lest one
     * valid DurationDateTimeData field.
     * 
     * @param {DurationDateTimeData} durationTimeData 
     * @returns {boolean} True if at least one valid property exists
     */
    static isValidDurationDateTimeData(durationTimeData) {
        return VALID_DURATION_TIME_DATA_KEYS.some( (p) => Object.hasOwn(durationTimeData,p));
    }

};