import {Router} from 'express';
import AuthController from '../controllers/AuthController.js';
import authMiddleware from '../middleware/Authenticate.js';
import ProfileController from '../controllers/ProfileController.js';

const router = Router();

router.post('/auth/register', AuthController.register);

router.post('/auth/login', AuthController.login);

// * Profile routes
router.get("/auth/profile", authMiddleware, ProfileController.index); // Private route

export default router;