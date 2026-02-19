const TadipaarOrder = require("../models/TadipaarOrder");
const Criminal = require("../models/Criminal");
const Area = require("../models/Area");


// ✅ Admin — create tadipaar order
exports.createOrder = async (req, res) => {
  try {
    const { criminalId, crimeType, startDate, endDate, restrictedAreaIds } =
      req.body;

    // check criminal exists
    const criminal = await Criminal.findById(criminalId);
    if (!criminal) {
      return res.status(404).json({ msg: "Criminal not found" });
    }

    // 🔥 check active order already exists
    const existingActive = await TadipaarOrder.findOne({
      criminalId,
      status: "active",
    });

    if (existingActive) {
      return res.status(400).json({
        msg: "Active tadipaar order already exists for this criminal",
      });
    }

    // optional: validate areas
    if (restrictedAreaIds?.length) {
      const count = await Area.countDocuments({
        _id: { $in: restrictedAreaIds },
      });

      if (count !== restrictedAreaIds.length) {
        return res.status(400).json({
          msg: "One or more restricted areas are invalid",
        });
      }
    }

    const order = await TadipaarOrder.create({
      criminalId,
      crimeType,
      startDate,
      endDate,
      restrictedAreaIds,
    });

    res.status(201).json({
      msg: "Tadipaar order created successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// ✅ Admin — get orders of a criminal
exports.getOrdersByCriminal = async (req, res) => {
  try {
    const orders = await TadipaarOrder.find({
      criminalId: req.params.criminalId,
    })
      .populate("restrictedAreaIds")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// ✅ Admin — update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await TadipaarOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// ✅ Criminal — get my active order
exports.getMyActiveOrder = async (req, res) => {
  try {
    const order = await TadipaarOrder.findOne({
      criminalId: req.user.id,
      status: "active",
    }).populate("restrictedAreaIds");

    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
