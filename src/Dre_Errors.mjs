import { MODULE_ID } from "./constants.mjs"

class DreErrorBase extends Error {
    constructor(ErrorId="DRE_ERROR",message,...params) {
        super(message,params)
        this.name = `${MODULE_ID}.${ErrorId}`
    }
}

export class InvalidFunctionArgument extends DreErrorBase {
    static ID = "INVALID_FUNC_ARG"
    static BASE_MSG = "An argument provided to the function was invalid."
    constructor(argName,argValue,reason,...params) {
        super(
            InvalidFunctionArgument.ID,
            `${InvalidFunctionArgument.BASE_MSG} reason: ${reason} param: ${argName}, value: ${argValue}`,
            params
        )
    }
}