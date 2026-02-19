const TadipaarOrder = require("../models/TadipaarOrder");
const Criminal = require("../models/Criminal");
const Area = require("../models/Area");


// ✅ Admin — create tadipaar order


exports.createOrder = async (req, res) => {
  try {
    const { criminalId, crimeType, startDate, endDate, restrictedAreaIds } =
      req.body;

    // ✅ basic validation
    if (!criminalId || !crimeType || !startDate || !endDate) {
      return res.status(400).json({
        msg: "criminalId, crimeType, startDate, endDate are required",
      });
    }

    // ✅ check criminal exists
    const criminal = await Criminal.findById(criminalId);
    if (!criminal) {
      return res.status(404).json({ msg: "Criminal not found" });
    }

    // ✅ ensure only one ACTIVE order at a time
    const existingActive = await TadipaarOrder.findOne({
      criminalId,
      status: "active",
    });

    

    // ✅ validate date logic
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        msg: "End date must be after start date",
      });
    }

    // ✅ normalize areas array
    let validAreaIds = [];

    if (Array.isArray(restrictedAreaIds) && restrictedAreaIds.length > 0) {
      const areas = await Area.find({
        _id: { $in: restrictedAreaIds },
      }).select("_id");

      if (areas.length !== restrictedAreaIds.length) {
        return res.status(400).json({
          msg: "One or more restricted areas are invalid",
        });
      }

      validAreaIds = areas.map((a) => a._id);
    }

    // ✅ create order (one order → many areas)
    const order = await TadipaarOrder.create({
      criminalId,
      crimeType,
      startDate,
      endDate,
      restrictedAreaIds: validAreaIds,
      status: "active",
    });

    res.status(201).json({
      success: true,
      msg: "Tadipaar order created successfully",
      order,
    });
  } catch (err) {
    console.error("Create order error:", err);
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


exports.getCriminalOrders = async (req, res) => {
  try {
    const { criminalId } = req.params;

    const orders = await TadipaarOrder.find({ criminalId })
      .populate("restrictedAreaIds")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};