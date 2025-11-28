"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = exports.createUser = exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const hashPassword = async (password) => {
    const saltRounds = await bcryptjs_1.default.genSalt(10);
    return bcryptjs_1.default.hash(password, saltRounds);
};
exports.hashPassword = hashPassword;
const comparePassword = async (candidatePassword, storedPassword) => {
    return bcryptjs_1.default.compare(candidatePassword, storedPassword);
};
exports.comparePassword = comparePassword;
const createUser = async ({ username, email, password, }) => {
    const hashedPassword = await (0, exports.hashPassword)(password);
    const user = new User_1.default({ username, email, password: hashedPassword });
    await user.save();
    return user;
};
exports.createUser = createUser;
const findUserByEmail = async (email) => {
    return User_1.default.findOne({ email }).exec();
};
exports.findUserByEmail = findUserByEmail;
