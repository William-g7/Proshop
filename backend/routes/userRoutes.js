import express from 'express';
import { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile, getUsers, getUserById, deleteUser, updateUser } from '../controller/userController.js';

const router = express.Router();

router.post('/login', authUser);
router.route('/').get(getUsers);
router.post('/logout', logoutUser);
router.route('/register').post(registerUser);
router.route('/profile').get(getUserProfile).put(updateUserProfile);
router.route('/:id').delete(deleteUser).get(getUserById).put(updateUser);

export default router;