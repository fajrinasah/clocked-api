import { AttendanceLog } from "./attendanceLog.js";
import { Position } from "./position.js";
import { Role } from "./role.js";
import { Salary } from "./salary.js";
import { Shift } from "./shift.js";
import { User } from "./user.js";

// BETWEEN ROLE & USER
Role.hasMany(User, {
  foreignKey: "role_id",
});

User.belongsTo(Role, {
  foreignKey: "role_id",
});

// BETWEEN POSITION & USER
Position.hasMany(User, {
  foreignKey: "position_id",
});

User.belongsTo(Position, {
  foreignKey: "position_id",
});

// BETWEEN USER AS AN EMPLOYEE & SALARY
User.hasMany(Salary, {
  foreignKey: "employee_id",
});

Salary.belongsTo(User, {
  foreignKey: "employee_id",
});

// BETWEEN USER & ATTENDANCE LOG
User.hasMany(AttendanceLog, {
  foreignKey: "employee_id",
});

AttendanceLog.belongsTo(User, {
  foreignKey: "employee_id",
});

// BETWEEN SHIFT & ATTENDANCE LOG
Shift.hasMany(AttendanceLog, {
  foreignKey: "shift_id",
});

AttendanceLog.belongsTo(Shift, {
  foreignKey: "shift_id",
});

// EXPORT MODELS
export { AttendanceLog, Position, Role, Salary, Shift, User };
