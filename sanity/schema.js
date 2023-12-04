import doctors from "./schema/doctors";
import employee from "./schema/employee";
import event from "./schema/event";
import services from "./schema/services";
import client from "./schema/user";

export const schema = {
  types: [employee, client, event, services, doctors],
};
