import { Router } from 'express'
import userController from '~/controllers/user.controller'

const router: Router = Router()

// User routes
router.post('/', userController.createUser) // Create a new user
router.get('/', userController.getUsers)    // Get all users
router.get('/:id', userController.getUserById) // Get a user by ID
router.put('/:id', userController.updateUser) // Update a user by ID
router.delete('/:id', userController.deleteUser) // Delete a user by ID

export default router
