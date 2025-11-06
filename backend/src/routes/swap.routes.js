import { Router } from "express";
import auth from "../middleware/auth.js";
import Event, { EVENT_STATUS } from "../models/Event.js";
import SwapRequest, { SWAP_STATUS } from "../models/SwapRequest.js";

const router = Router();
router.use(auth);


router.get("/swappable-slots", async (req, res) => {
  const slots = await Event.find({
    status: EVENT_STATUS.SWAPPABLE,
    owner: { $ne: req.user.id },
  }).sort({ startTime: 1 });
  res.json(slots);
});


router.get("/requests/incoming", async (req, res) => {
  const items = await SwapRequest.find({ responder: req.user.id })
    .populate("mySlot").populate("theirSlot")
    .populate("requester", "name email");
  res.json(items);
});

router.get("/requests/outgoing", async (req, res) => {
  const items = await SwapRequest.find({ requester: req.user.id })
    .populate("mySlot").populate("theirSlot")
    .populate("responder", "name email");
  res.json(items);
});



router.post("/swap-request", async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  if (!mySlotId || !theirSlotId) return res.status(400).json({ message: "mySlotId and theirSlotId are required" });

  const my = await Event.findOne({ _id: mySlotId, owner: req.user.id });
  const their = await Event.findById(theirSlotId);
  if (!my || !their) return res.status(404).json({ message: "Slot not found" });
  if (String(their.owner) === req.user.id) return res.status(400).json({ message: "Cannot swap with your own slot" });

  const bothSwappable = my.status === EVENT_STATUS.SWAPPABLE && their.status === EVENT_STATUS.SWAPPABLE;
  if (!bothSwappable) return res.status(409).json({ message: "Both slots must be SWAPPABLE" });

  const sr = await SwapRequest.create({
    requester: req.user.id,
    responder: their.owner,
    mySlot: my._id,
    theirSlot: their._id,
  });

  
  my.status = EVENT_STATUS.SWAP_PENDING;
  their.status = EVENT_STATUS.SWAP_PENDING;
  await my.save();
  await their.save();

  res.status(201).json(sr);
});



router.post("/swap-response/:id", async (req, res) => {
  const { accept } = req.body;
  const sr = await SwapRequest.findById(req.params.id).populate("mySlot").populate("theirSlot");
  if (!sr) return res.status(404).json({ message: "Request not found" });
  if (String(sr.responder) !== req.user.id) return res.status(403).json({ message: "Not your request" });
  if (sr.status !== SWAP_STATUS.PENDING) return res.status(409).json({ message: "Already finalized" });

  const a = await Event.findById(sr.mySlot._id);
  const b = await Event.findById(sr.theirSlot._id);
  if (!(a && b)) return res.status(404).json({ message: "Event missing" });

  if (accept === false) {
    sr.status = SWAP_STATUS.REJECTED; await sr.save();
    if (a.status === EVENT_STATUS.SWAP_PENDING) { a.status = EVENT_STATUS.SWAPPABLE; await a.save(); }
    if (b.status === EVENT_STATUS.SWAP_PENDING) { b.status = EVENT_STATUS.SWAPPABLE; await b.save(); }
    return res.json({ status: "REJECTED" });
  }

  const bothPending = a.status === EVENT_STATUS.SWAP_PENDING && b.status === EVENT_STATUS.SWAP_PENDING;
  if (!bothPending) return res.status(409).json({ message: "Slots not pending" });

  const ownerA = a.owner, ownerB = b.owner;
  a.owner = ownerB; a.status = EVENT_STATUS.BUSY;
  b.owner = ownerA; b.status = EVENT_STATUS.BUSY;
  await a.save(); await b.save();

  sr.status = SWAP_STATUS.ACCEPTED; await sr.save();
  res.json({ status: "ACCEPTED" });
});

export default router;
