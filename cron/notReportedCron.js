const cron = require("node-cron");
const TadipaarOrder = require("../models/TadipaarOrder");
const TadipaarRecord = require("../models/TadipaarRecord");

// ⏰ Runs every day at 20:00 (8 PM)
const startNotReportedCron = () => {
  cron.schedule("0 20 * * *", async () => {
    console.log("🔄 Running not-reported check...");

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // ✅ get all active orders
      const activeOrders = await TadipaarOrder.find({
        status: "active",
      });

      for (const order of activeOrders) {
        // check if record exists today
        const exists = await TadipaarRecord.findOne({
          criminalId: order.criminalId,
          date: today,
        });

        if (!exists) {
          await TadipaarRecord.create({
            orderId: order._id,
            criminalId: order.criminalId,
            date: today,
            status: "not_reported",
            violationReason: "Daily check-in not submitted",
          });

          console.log(
            `⚠️ Not reported marked for criminal ${order.criminalId}`
          );
        }
      }
    } catch (err) {
      console.error("Cron error:", err.message);
    }
  });
};

module.exports = startNotReportedCron;
