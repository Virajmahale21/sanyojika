import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getDocuments,
  uploadDocument,
  reviewDocument,
  confirmOcrMetadata,
} from '../controllers/documentController';
import { authenticateJwt } from '../middleware/auth';

const uploadDir = process.env.VERCEL
  ? '/tmp/uploads'
  : path.join(__dirname, '../../uploads');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('Notice: uploadDir initialization in serverless environment:', err);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // Sanitize original filename (remove path traversal, spaces, special chars)
    const sanitizedBase = path.basename(file.originalname).replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${uniqueSuffix}-${sanitizedBase}`);
  },
});

const allowedMimes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
const allowedExts = ['.pdf', '.png', '.jpg', '.jpeg'];

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid document format. Only PDF, PNG, and JPEG documents are permitted.'));
    }
  },
});

const router = Router();

router.use(authenticateJwt);

router.get('/', getDocuments);
router.post('/upload', upload.single('file'), uploadDocument);
router.post('/:id/review', reviewDocument);
router.post('/:id/confirm-ocr', confirmOcrMetadata);

export default router;
