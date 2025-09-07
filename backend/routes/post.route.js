import express from 'express';

const router = express.Router();

router.get("/posts", (req, res) => {
    res.status(200).json({message: "Posts route"});
})

export default router;