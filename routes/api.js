import {Router} from 'express';
import AuthController from '../controllers/AuthController.js';
import authMiddleware from '../middleware/Authenticate.js';
import ProfileController from '../controllers/ProfileController.js';
import NewsController from '../controllers/NewsController.js';

const router = Router();

router.post('/auth/register', AuthController.register);

router.post('/auth/login', AuthController.login);

// * Profile routes
router.get("/profile", authMiddleware, ProfileController.index); // Private route
router.put("/profile/:id", authMiddleware, ProfileController.update);

// * News routes
router.get('/news', NewsController.index); // Private route
router.post('/news',authMiddleware, NewsController.store); // Private route
router.get('/news/:id', NewsController.show); // Private route
router.put('/news/:id', authMiddleware, NewsController.update); // Private route
router.delete('/news/:id', NewsController.destroy); // Private route

export default router;