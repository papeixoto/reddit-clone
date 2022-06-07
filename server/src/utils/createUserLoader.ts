import DataLoader from "dataloader";
import { User } from "../entities/User";
import { In } from "typeorm";

// batches requests
// [1, 7, 8]
// [{id: 1, username: "tim"}, ...user7, ...user8]
export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findBy({ id: In(userIds as number[]) });
    const userIdToUser: Record<number, User> = {};
    users.forEach((u) => {
      userIdToUser[u.id] = u;
    });

    return userIds.map((userId) => userIdToUser[userId]);
  });
