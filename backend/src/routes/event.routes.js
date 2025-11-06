import { Router } from "express";
import auth from "../middleware/auth.js";
import Event, { EVENT_STATUS } from "../models/Event.js";

const router = Router();
router.use(auth);


router.get("/", async (req, res) => {
  const items = await Event.find({ owner: req.user.id }).sort({ startTime: 1 });
  res.json(items);
});


router.post("/", async (req, res) => {
  const { title, startTime, endTime, status } = req.body;
  const created = await Event.create({
    owner: req.user.id,
    title,
    startTime,
    endTime,
    status: status || EVENT_STATUS.BUSY
  });
  res.status(201).json(created);
});


router.patch("/:id", async (req, res) => {
  const e = await Event.findOne({ _id: req.params.id, owner: req.user.id });
  if (!e) return res.status(404).json({ message: "Event not found" });
  Object.assign(e, req.body);
  await e.save();
  res.json(e);
});


router.delete("/:id", async (req, res) => {
  await Event.deleteOne({ _id: req.params.id, owner: req.user.id });
  res.json({ ok: true });
});

export default router;
