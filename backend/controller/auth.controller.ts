import { generateToken } from "../lib/utils.lib";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { collections } from "../lib/mongo.lib";

export const SignUp = async (req: any, res: any): Promise<void> => {
  const newUser = req.body;
  const newUsername = newUser.username.toLowerCase();
  const newEmail = newUser.email.toLowerCase();

  try {
    if (newUsername || newEmail || newUser.password) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }

    const hasLength = newUser.password.length >= 8
    const hasNumber = (/\d/).test(newUser.password);
    const hasCapital = (/[A-Z]/).test(newUser.password)
    const hasSymbol = (/[^\w\s]/).test(newUser.password);
    const hasSpaces = (/\s/).test(newUser.password);
    const userHasSpaces = (/\s/).test(newUsername);

    if (!hasLength) {
      return res.status(400).json({ success: false, msg: "Password must be at least 8 characters" });
    } else if (!hasNumber) {
      return res.status(400).json({ success: false, msg: "Password must have digit(s)" });
    } else if (!hasCapital) {
      return res.status(400).json({ success: false, msg: "Password must have uppercase character(s)" });
    } else if (!hasSymbol) {
      return res.status(400).json({ success: false, msg: "Password must have special character(s)" });
    } else if (hasSpaces) {
      return res.status(400).json({ success: false, msg: "Password must have no spaces" });
    } else if (userHasSpaces) {
      return res.status(400).json({ success: false, msg: "Username must have no spaces" });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = emailPattern.test(newEmail)

    if (!validEmail) {
      return res.status(400).json({ success: false, msg: "Invalid Email format" });
    }

    const userCollection = await collections.users();

    // Check if user already exists
    const userExists = await userCollection.findOne({
      $or: [
        { email: newEmail },
        { username: newUsername }
      ]
    });

    if (userExists) {
      if (userExists.email === newUser.email) {
        return res.status(400).json({ success: false, msg: "Email already exists" });
      }
      return res.status(400).json({ success: false, msg: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newUser.password, salt);

    // Create empty card count document
    const getCardCollection = await collections.cardCount();
    const createCardCollection = await getCardCollection.insertOne({
      breakfast: [],
      dinner: [],
      dessert: []
    });

    // Create empty trade list document
    const getTradeListCollection = await collections.tradeList();
    const SetTradeList = await getTradeListCollection.insertOne({
      sent: [],
      received: []
    });

    const date = new Date();

    // Prepare user document
    const userDocument = {
      username: newUsername,
      email: newEmail,
      password: hashPassword,
      friend_list: [],
      cards_unlocked: createCardCollection.insertedId,
      wins: 0,
      loss: 0,
      acorns: 100, // Starting with 100 acorns
      trade: SetTradeList.insertedId,
      createdAt: date,
      updatedAt: date.setDate(date.getDate() - 1)
    };

    // Insert user
    const result = await userCollection.insertOne(userDocument);

    if (result.insertedId) {
      // Return user data without password
      const { password, ...userData } = userDocument;

      return res.status(201).json({
        success: true,
        msg: "Account created successfully",
        data: userData
      });
    } else {
      return res.status(400).json({ success: false, msg: "Invalid user data" });
    }
  } catch (error) {
    console.error("SignUp error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const LogIn = async (req: any, res: any): Promise<void> => {
  const currUser = req.body;
  const currUsername = currUser.username.toLowerCase();

  try {
    if (!currUsername || !currUser.password) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }

    const userCollection = await collections.users();

    // Find user
    const userExists = await userCollection.findOne({ username: currUsername });

    if (userExists) {
      const isPassValid = await bcrypt.compare(currUser.password, userExists.password);

      if (isPassValid) {
        generateToken(userExists._id, res);

        // Don't include password in response
        const { password, ...userData } = userExists;

        return res.status(200).json({ success: true, data: userData });
      } else {
        return res.status(400).json({ success: false, msg: "Invalid credentials" });
      }
    } else {
      return res.status(400).json({ success: false, msg: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const LogOut = async (req: any, res: any): Promise<void> => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    return res.status(200).json({ success: true, msg: "Logged out successfully" });
  } catch (error) {
    console.error("LogOut error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const ChangeUsername = async (req: any, res: any): Promise<void> => {
  try {
    const userID = req.info._id;
    const { newUsername } = req.body;
    const newUserameLower = newUsername.toLowerCase();

    if (!newUserameLower) {
      return res.status(400).json({ success: false, msg: "New username is required" });
    }
    // Ensure new username has no spaces
    if ((/\s/).test(newUserameLower)) {
      return res.status(400).json({ success: false, msg: "Username must not contain spaces" });
    }

    const userCollection = await collections.users();

    // Check if another user already has this username
    const existingUser = await userCollection.findOne({
      username: newUserameLower,
      _id: { $ne: userID }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, msg: "Username already taken" });
    }

    const updateUserResult = await userCollection.findOneAndUpdate(
      { _id: userID },
      { $set: { username: newUserameLower } },
      { returnDocument: 'after' }
    );

    if (!updateUserResult) {
      return res.status(400).json({ success: false, msg: "Failed to update username" });
    }

    const { password, ...userData } = updateUserResult;
    return res.status(200).json({ success: true, msg: "Username updated successfully", data: userData });

  } catch (error) {
    console.error("ChangeUsername error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const ChangeEmail = async (req: any, res: any): Promise<void> => {
  try {
    const userID = req.info._id;
    const { newEmail } = req.body;
    const newEmailLower = newEmail.toLowerCase();

    if (!newEmailLower) {
      return res.status(400).json({ success: false, msg: "New username is required" });
    }
    // Ensure new email has no spaces
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = emailPattern.test(newEmailLower)

    if (!validEmail) {
      return res.status(400).json({ success: false, msg: "Invalid Email format" });
    }

    const userCollection = await collections.users();

    // Check if another user already has this username
    const existingUser = await userCollection.findOne({
      username: newEmailLower,
      _id: { $ne: userID }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, msg: "Email already taken" });
    }

    const updateUserResult = await userCollection.findOneAndUpdate(
      { _id: userID },
      { $set: { email: newEmailLower } },
      { returnDocument: 'after' }
    );

    if (!updateUserResult) {
      return res.status(400).json({ success: false, msg: "Failed to update email" });
    }

    const { password, ...userData } = updateUserResult;
    return res.status(200).json({ success: true, msg: "Email updated successfully", data: userData });

  } catch (error) {
    console.error("ChangeEmail error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const ChangePassword = async (req: any, res: any): Promise<void> => {
  try {
    const userID = req.info._id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, msg: "Old password and new password are required" });
    }

    // Validate new password criteria
    const hasLength = newPassword.length >= 8;
    const hasNumber = (/\d/).test(newPassword);
    const hasSymbol = (/[^\w\s]/).test(newPassword);
    const hasSpaces = (/\s/).test(newPassword);

    if (!hasLength) {
      return res.status(400).json({ success: false, msg: "New password must be at least 8 characters long" });
    }
    if (!hasNumber) {
      return res.status(400).json({ success: false, msg: "New password must contain at least one digit" });
    }
    if (!hasSymbol) {
      return res.status(400).json({ success: false, msg: "New password must contain at least one special character" });
    }
    if (hasSpaces) {
      return res.status(400).json({ success: false, msg: "New password must not contain spaces" });
    }

    const userCollection = await collections.users();
    const user = await userCollection.findOne({ _id: userID });

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Compare provided old password with stored hashed password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: "Old password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updateResult = await userCollection.updateOne(
      { _id: userID },
      { $set: { password: hashedPassword } }
    );

    if (updateResult.modifiedCount === 1) {
      return res.status(200).json({ success: true, msg: "Password updated successfully" });
    } else {
      return res.status(400).json({ success: false, msg: "Failed to update password" });
    }

  } catch (error) {
    console.error("ChangePassword error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const CheckAuth = (req: any, res: any) => {
  try {
    return res.status(200).json({ success: true, data: req.info });
  } catch (error) {
    console.error("CheckAuth error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const DeleteAccount = async (req: any, res: any): Promise<void> => {
  try {
    const userID = req.info._id;

    const userCollection = await collections.users();

    // Find the user first to get related document IDs
    const user = await userCollection.findOne({ _id: userID });

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Delete related documents
    const cardCountCollection = await collections.cardCount();
    await cardCountCollection.deleteOne({ _id: user.cards_unlocked });

    const tradeListCollection = await collections.tradeList();
    await tradeListCollection.deleteOne({ _id: user.trade });

    // Delete the user
    const deleteResult = await userCollection.deleteOne({ _id: userID });

    if (deleteResult.deletedCount === 1) {
      // Clear auth cookie
      res.cookie("token", "", { maxAge: 0 });
      return res.status(200).json({ success: true, msg: "Account deleted successfully" });
    } else {
      return res.status(400).json({ success: false, msg: "Failed to delete account" });
    }
  } catch (error) {
    console.error("DeleteAccount error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const AddFriend = async (req: any, res: any): Promise<void> => {
  try {
    const userID = req.info._id;
    const userNa = req.info.username;
    const { friendUsername } = req.body;
    const friendNa = friendUsername.toLowerCase();

    if (!friendNa) {
      return res.status(400).json({ success: false, msg: "Friend username is required" });
    }

    if (userNa === friendNa) return res.status(400).json({ success: false, msg: "You cannot friend yourself" });

    const userCollection = await collections.users();

    // Find the friend
    const friend = await userCollection.findOne({ username: friendNa });
    if (!friend) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Check if already friends
    const user = await userCollection.findOne({ _id: userID });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Convert friend IDs to strings for comparison
    // Checks if at least one element in an array satisfies a provided condition
    const alreadyFriends = user.friend_list.some((friendId: any) =>
      friendId.toString() === (friend._id).toString()
    );

    if (alreadyFriends) {
      return res.status(400).json({ success: false, msg: "Already friends with this user" });
    }

    // Add friend to user's friend list - use array to satisfy TypeScript
    await userCollection.updateOne(
      { _id: userID },
      { $push: { friend_list: friend._id as any } }
    );

    // Add user to friend's friend list - use array to satisfy TypeScript
    await userCollection.updateOne(
      { _id: friend._id as any },
      { $push: { friend_list: userID } }
    );

    return res.status(200).json({ success: true, msg: "Friend added successfully" });

  } catch (error) {
    console.error("AddFriend error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const RemoveFriend = async (req: any, res: any): Promise<void> => {
  try {
    const userID = req.info._id;
    const { friendId } = req.params;

    if (!friendId) {
      return res.status(400).json({ success: false, msg: "Friend ID is required" });
    }

    const userCollection = await collections.users();

    // Remove friend from user's friend list
    await userCollection.updateOne(
      { _id: userID },
      { $pull: { friend_list: ObjectId.createFromHexString(friendId) as any } }
    );

    // Remove user from friend's friend list
    await userCollection.updateOne(
      { _id: ObjectId.createFromHexString(friendId) },
      { $pull: { friend_list: userID } }
    );

    return res.status(200).json({ success: true, msg: "Friend removed successfully" });

  } catch (error) {
    console.error("RemoveFriend error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const GetFriendList = async (req: any, res: any): Promise<void> => {
  try {
    const userID = req.info._id;
    const userCollection = await collections.users();

    // Use aggregation to get populated friend list
    const result = await userCollection.aggregate([
      { $match: { _id: userID } },
      {
        $lookup: {
          from: "users",
          localField: "friend_list",
          foreignField: "_id",
          as: "friends"
        }
      },
      {
        $project: {
          "friends._id": 1,
          "friends.username": 1,
          "friends.wins": 1,
          "friends.loss": 1
        }
      }
    ]).toArray();

    if (result.length === 0) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    return res.status(200).json({ success: true, data: result[0].friends });

  } catch (error) {
    console.error("GetFriendList error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const UpdateGameStats = async (req: any, res: any): Promise<void> => {
  try {
    const userID = req.info._id;
    const { isWin, acornsEarned, gameType } = req.body;

    if (isWin === undefined || !acornsEarned) {
      return res.status(400).json({ success: false, msg: "Game result data is required" });
    }

    const userCollection = await collections.users();

    const user = await userCollection.findOne({ _id: userID });

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    if (user.updatedAt) {
      const lastUpdatedDate = new Date(user.updatedAt);
      const currentDate = new Date();

      // Check if it's the same day
      if (
        lastUpdatedDate.getUTCFullYear() === currentDate.getUTCFullYear() &&
        lastUpdatedDate.getUTCMonth() === currentDate.getUTCMonth() &&
        lastUpdatedDate.getUTCDate() === currentDate.getUTCDate()
      ) {
        return res.status(400).json({ success: false, msg: "Wait until the nex day" });
      }
    }

    // Update win/loss and acorns
    const updateData = {
      $inc: {
        acorns: 100,
        ...(gameType === 'battle' && {
          wins: (isWin === true) ? 1 : 0,
          loss: (isWin === true) ? 0 : 1
        })
      },
      $set: { 
        updatedAt: Date.now() 
      }
    };

    const updateResult = await userCollection.findOneAndUpdate(
      { _id: userID },
      updateData,
      { returnDocument: 'after' }
    );

    if (!updateResult) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Remove password from response
    const { password, ...updatedUserScore } = updateResult;

    return res.status(200).json({
      success: true,
      msg: "Game stats updated",
      data: updatedUserScore
    });

  } catch (error) {
    console.error("UpdateGameStats error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};
