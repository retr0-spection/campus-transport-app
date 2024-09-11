import express from "express";

const router = express.Router();


let users = [
    {userId: "user1", deviceToken: null, deviceType: null}
];
let schedules = [
    { routeId: "1A", busId: "Bus_101", departureTime: "2024-09-11T14:35:00", status: "On Time" }
]

// Get the live schedule for all routes
router.get("/schedule", (req, res) => {
    if (schedules.length > 0) {
        res.status(200).json(schedules);
    } else {
        res.status(404).json({ message: "No schedules available" });
    }
});

// Get the live schedule for a specific route
router.get("/schedule/:routeId", (req, res) => {
    const { routeId } = req.params;
    const routeSchedule = schedules.filter(schedule => schedule.routeId == routeId);

    if (routeSchedule.length > 0) {
        res.status(200).json(routeSchedule);
    } else {
        res.status(404).json({ message: "No schedules found for this route" });
    }
});


// Subscribe to a bus route for live schedule updates
router.post("/users/:userId/subscribe", (req, res) => {
    const { userId } = req.params;
    const { routeId } = req.body;

    const user = users.find(user => user.userId == userId);

    if (user) {
        user.subscribedRoutes.push(routeId);
        res.status(200).json({ message: `Subscribed to route ${routeId} successfully` });
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

// Notify users of schedule changes due to events
router.post("/notifications/event", (req, res) => {
    const { eventId, message, affectedRoutes } = req.body;

    // Find all users subscribed to affected routes
    const affectedUsers = users.filter(user => user.subscribedRoutes.some(route => affectedRoutes.includes(route)));

    affectedUsers.forEach(user => {
        const newNotification = {
            id: notifications.length + 1,
            userId: user.userId,
            message: `${message} affecting routes: ${affectedRoutes.join(", ")}`,
            type: "event",
            status: 'scheduled',
            scheduleTime: null,
            createdAt: new Date().toISOString()
        };

        notifications.push(newNotification);
    });

    res.status(200).json({ message: "Event notifications sent to affected users", affectedUsers });
});

export default router;