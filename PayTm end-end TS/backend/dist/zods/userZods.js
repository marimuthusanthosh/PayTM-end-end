"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinBody = exports.signupBody = void 0;
const zod_1 = require("zod");
exports.signupBody = zod_1.z.object({
    username: zod_1.z.string(),
    firstName: zod_1.z.string().min(3).max(50),
    lastName: zod_1.z.string().min(3).max(50).nullable(),
    password: zod_1.z.string().min(3).max(50)
});
exports.signinBody = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string()
});
