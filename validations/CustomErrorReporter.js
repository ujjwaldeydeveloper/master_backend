// import { errors } from '@vinejs/vine';

// export class CustomErrorReporter {
//   hasErrors = false;
//   errors = [];
//   report(message, rule, field, meta) {
//     this.hasErrors = true;
//     this.errors.push({
//       code: rule,
//       detail: message,
//       source: {
//         pointer: field.wildCardPath
//       },
//       ...(meta ? { meta } : {})
//     });
//   }
//   createError() {
//     return new errors.E_VALIDATION_ERROR(this.errors);
//   }
// }


import { errors } from "@vinejs/vine";
// import { ValidationError } from "@vinejs/vine";
// import {
//     FieldContext,
//     ErrorReporterContract,
// } from "@vinejs/vine/types";

export class CustomErrorReporter {
    
    hasErrors = false;

    errors = {};

    report(message,rule,field, meta) {
        this.hasErrors = true;
        
        this.errors[field.wildCardPath] = message;
    }
    

    createError()  {
        // if(this.hasErrors) {
        //     return new ValidationError(this.errors);
        // }
        // return null;
        return new errors.E_VALIDATION_ERROR(this.errors);
    }
}

// import vine, { errors } from '@vinejs/vine'

// try {
//   const validate = vine.compile(schema)
//   const output = await validate({ data })
// } catch (error) {
//   if (error instanceof errors.E_VALIDATION_ERROR) {
//     // array created by SimpleErrorReporter
//     console.log(error.messages)
//   }
// }



