const DELIMITER: string = ", ";
const NO_OF_TRAIL_CHARS: number = 2;
const START_POS = 0;
const INVALID_ARGUMENTS = "Invalid Argument(s) Specified!";

class ObjectFormatter {
    public static format(obj: any): string {
        if (!obj) {
            throw new Error(INVALID_ARGUMENTS);
        }

        let formattedMessage: string = "";

        for (let propertyIndex in obj) {
            let property = obj[propertyIndex];

            if (typeof property !== 'function') {
                formattedMessage += `${property}${DELIMITER}`;
            }
        }

        formattedMessage = formattedMessage.substr(START_POS,
            formattedMessage.length - NO_OF_TRAIL_CHARS);

        return formattedMessage;
    }
}

export {
    ObjectFormatter
};
