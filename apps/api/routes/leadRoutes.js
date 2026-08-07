const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const leadController = require("../controllers/leadController");
const protect = require("../middleware/auth");
const { Lead } = require("../models"); // Imported Lead model for Sequelize
const ExcelJS = require("exceljs");
const { Op } = require("sequelize");

// Path where the CSV file will be stored
const CSV_FOLDER_PATH = path.join(__dirname, "../public/exports");
const CSV_FILE_PATH = path.join(CSV_FOLDER_PATH, "lead.csv");

// Helper to ensure CSV folder and file exist with headers
const ensureCsvExists = () => {
  if (!fs.existsSync(CSV_FOLDER_PATH)) {
    fs.mkdirSync(CSV_FOLDER_PATH, { recursive: true });
  }

  if (!fs.existsSync(CSV_FILE_PATH)) {
    const headers = "ID,Business Name,Category,Status,Phone,Email,Date Added\n";
    fs.writeFileSync(CSV_FILE_PATH, headers, "utf8");
  }
};

// Route: Save Lead & Append to CSV File
router.post("/import-lead", async (req, res) => {
  try {
    const lead = req.body;

    // 1. Save to Database (Sequelize)
    let savedLead = null;
    try {
      savedLead = await Lead.create({
        businessName: lead.businessName || lead.name || "Untitled Lead",
        category: lead.category || lead.group || "General",
        status: lead.status || "New",
        phone: lead.phone || "",
        email: lead.email || "",
      });
    } catch (dbErr) {
      console.warn("Could not save to database, continuing CSV write:", dbErr.message);
    }

    // 2. Ensure CSV file exists
    ensureCsvExists();

    // 3. Format lead data into CSV row
    const id = savedLead?.id || lead.id || Date.now();
    const name = `"${(lead.businessName || lead.name || "").replace(/"/g, '""')}"`;
    const category = `"${(lead.category || lead.group || "General").replace(/"/g, '""')}"`;
    const status = `"${(lead.status || "New").replace(/"/g, '""')}"`;
    const phone = `"${(lead.phone || "").replace(/"/g, '""')}"`;
    const email = `"${(lead.email || "").replace(/"/g, '""')}"`;
    const dateAdded = `"${new Date().toLocaleDateString()}"`;

    const csvRow = `${id},${name},${category},${status},${phone},${email},${dateAdded}\n`;

    // 4. Append to CSV file on server
    fs.appendFileSync(CSV_FILE_PATH, csvRow, "utf8");

    return res.status(200).json({
      success: true,
      message: "Lead saved and appended to database lead.csv",
      data: savedLead || lead,
    });
  } catch (error) {
    console.error("CSV Write Error:", error);
    return res.status(500).json({ success: false, error: "Failed to write to CSV" });
  }
});

// Protected CRUD Routes
router.get("/", protect, leadController.getLeads);
router.post("/", protect, leadController.createLead);
router.post("/:id/notes", protect, leadController.addNote);
router.get("/:id", protect, leadController.getLead);
router.put("/:id", protect, leadController.updateLead);
router.delete("/:id", protect, leadController.deleteLead);

// Export Leads to Excel (.xlsx)
router.get("/export", protect, async (req, res) => {
  try {
    const workspaceId = req.workspaceId || req.query?.workspaceId || req.user?.workspaceId;

    const { range, startDate, endDate } = req.query;

    const where = {};
    if (workspaceId) where.workspaceId = workspaceId;

    if (range) {
      const now = new Date();
      let cutoff = new Date();
      if (String(range) === "7") cutoff.setDate(now.getDate() - 7);
      else if (String(range) === "15") cutoff.setDate(now.getDate() - 15);
      else if (String(range) === "30") cutoff.setDate(now.getDate() - 30);
      if (cutoff < now) where.createdAt = { [Op.gte]: cutoff };
    }

    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      if (!isNaN(s) && !isNaN(e)) {
        where.createdAt = { [Op.between]: [s, e] };
      }
    }

    const leads = await Lead.findAll({ where, order: [["createdAt", "DESC"]] });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Leads");

    sheet.columns = [
      { header: "ID", key: "id", width: 36 },
      { header: "Business Name", key: "businessName", width: 30 },
      { header: "Owner Name", key: "ownerName", width: 25 },
      { header: "Category", key: "category", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "Phone", key: "phone", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Website", key: "website", width: 30 },
      { header: "Address", key: "address", width: 40 },
      { header: "Assigned To", key: "assignedTo", width: 20 },
      { header: "Notes", key: "notes", width: 60 },
      { header: "Created At", key: "createdAt", width: 25 },
      { header: "Updated At", key: "updatedAt", width: 25 },
    ];

    leads.forEach((l) => {
      sheet.addRow({
        id: l.id,
        businessName: l.businessName,
        ownerName: l.ownerName,
        category: l.category,
        status: l.status,
        phone: l.phone,
        email: l.email,
        website: l.website,
        address: l.address,
        assignedTo: l.assignedTo,
        notes: l.notes,
        createdAt: l.createdAt,
        updatedAt: l.updatedAt,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const fileName = `leads_export_${Date.now()}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    return res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Export Error:", err);
    return res.status(500).json({ message: "Failed to export leads." });
  }
});

module.exports = router;