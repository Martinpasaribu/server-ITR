import AdminUserModel from "../AdminUser/models/models_admin_user";

export const verifyAdmin = async (req: any, res: any, next: any) => {
    console.log("👍🏼 Session verify Admin 👍🏼 :", req.session.userId);

    if (!req.session.userId) {
        return res.status(401).json({ message: "Session admin empty, Login again" });
    }

    const admin = await AdminUserModel.findOne({ _id: req.session.userId , active: true});

    if (!admin) {
        return res.status(404).json({ message: "User sessionID not found" });
    }

    // Perbaikan logika role
    if (admin.role !== "A" && admin.role !== "SA" && admin.role !== "CA") {
        return res.status(403).json({ message: "Access anda tidak di izinkan" });
    }

    req.role = admin.role;
    req.userAdmin = admin.username;
    
    next();
};

