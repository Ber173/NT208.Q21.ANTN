import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import userService from '~/services/user.service'

const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.createUser(req.body)

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User created successfully',
      data: user
    })
  } catch (error) {
    next(error)
  }
}

const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await userService.getAllUsers(req.query)

    res.status(StatusCodes.OK).json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.getUserById(req.params.id)

    res.status(StatusCodes.OK).json({
      success: true,
      data: user
    })
  } catch (error) {
    next(error)
  }
}

const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.updateUser(req.params.id, req.body)

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User updated successfully',
      data: user
    })
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await userService.deleteUser(req.params.id)

    res.status(StatusCodes.OK).json({
      success: true,
      message: result.message
    })
  } catch (error) {
    next(error)
  }
}

export default {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
}
