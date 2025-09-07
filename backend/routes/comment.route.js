import express from 'express';

const router = express.Router();

router.get("/comments", (req, res) => {
    res.status(200).json({message: "comments route"});
})

export default router;