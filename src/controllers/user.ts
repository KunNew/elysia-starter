import { Context, Elysia } from "elysia";
import User from "../models/User";
import { mkdir } from 'node:fs/promises';


export const me = async (
  context: Context & {
    user: User.Schema;
  }
): Promise<any> => {
  return {
    message: "User details fetched successfully!",
    data: context.user,
  };
};

export const getUsers = async (context: Context) => {
  const page = Number(context.query?.page) || 1;
  const pageSize = Number(context.query?.pageSize) || 10;
  const search = context.query?.search || "";
  const skip = (page - 1) * pageSize;

  // search filter for name or email with case-insensitive option
  const searchFilter = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(searchFilter).skip(skip).limit(pageSize);

  const total = await User.countDocuments(searchFilter);

  return {
    message: "Users fetched successfully!",
    users,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

export const createUser = async ({ body }: { body: User.Schema & { profilePicture?: File } }) => {
  try {
    // Check if user with this email already exists
    const existingUser = await User.findByEmail(body.email);
    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists",
        status: 400,
      };
    }

    let profilePictureUrl = '';
    
    // Handle profile picture upload if provided
    if (body.profilePicture) {
      // Create uploads directory if it doesn't exist
      const uploadsDir = './public/uploads';
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (err) {
        console.error("Error creating uploads directory:", err);
      }
      
      // Generate a unique filename
      const fileName = `${Date.now()}-${body.profilePicture.name}`;
      const filePath = `${uploadsDir}/${fileName}`;
      
      // Write the file to disk
      await Bun.write(filePath, body.profilePicture);
      
      // Set the profile picture URL
      profilePictureUrl = `/uploads/${fileName}`;
    }

    // Create a new user using your model structure
    const newUser = new User({
      email: body.email,
      password: body.password,
      name: body.name,
      profilePicture: profilePictureUrl,
      role: body.role || "user",
      isActive: body.isActive !== undefined ? body.isActive : true,
    });

    // Save the user to database
    await newUser.save();

    return {
      success: true,
      message: "User created successfully",
      data: newUser,
    };
  } catch (error: any) {
    console.error("Error creating user:", error);
    return {
      success: false,
      message: error.message || "Failed to create user",
      status: 500,
    };
  }
};

export const updateUser = async (context: Context) => {
  try {
    const userId = context.params.id;
    const updateData = context.body as User.Schema;

    // Find user by ID and update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      context.set.status = 404;
      return {
        message: "User not found",
        status: 404,
      };
    }

    return {
      message: "User updated successfully",
      user: updatedUser,
    };
  } catch (error: any) {
    context.set.status = 500;
    return {
      message: error.message || "Failed to update user",
      status: 500,
    };
  }
};

export const getUser = async (context: Context) => {
  const user = await User.findById(context.params.id);
  if (!user) {
    context.set.status = 404;
    throw new Error("User not found");
  }
  return {
    message: "User fetched successfully!",
    user,
  };
};

export const deleteUser = async (context: Context) => {
  const user = await User.findByIdAndDelete(context.params.id);
  if (!user) {
    context.set.status = 404;
    throw new Error("User not found");
  }
  return {
    message: "User deleted successfully",
    user,
  };
};

