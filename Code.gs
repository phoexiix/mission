// ==========================================
// CONFIGURATION & DATABASE CONSTANTS
// ==========================================
const SPREADSHEET_ID = "1i7blSTnwv2ybDaOsgrmO1wAf617LaMhg0fwZeF1tbM0"; 
const SHEET_MISSIONS = "MISSIONS";
const SHEET_STATUS = "SYSTEM_STATUS";
const SHEET_SPY = "SPY_DATABASE";
const SHEET_DATA_CODE = "Data_code"; 

const ADMIN_DATABASE = {
  "11": { name: "potter", pass: "2588" },
  "22": { name: "hector", pass: "22" },
  "33": { name: "vectoe", pass: "33" }
};

const OP_DATA = {
  "สิงห์เหนือ": { en: "Northern Lion", prefix: "NL", group: "7", id: "1", type: "เป้าหมายลับ" },
  "เสือใต้": { en: "Southern Tiger", prefix: "ST", group: "7", id: "1", type: "เป้าหมายลับ" },
  "อสรพิษคราส": { en: "Eclipse Viper", prefix: "EV", group: "7", id: "1", type: "ยุติภัยลับ" },
  "จันทร์ดับ": { en: "Black Moon", prefix: "BM", group: "7", id: "1", type: "วิกฤต" },
  "เงาเดียว": { en: "Lone Shadow", prefix: "LS", group: "7", id: "1", type: "ลับเดี่ยว" },
  "พิทักษ์นภา": { en: "Sky Sentinel", prefix: "SS", group: "7", id: "2", type: "เฝ้าระวังถาวร" },
  "ปีกเงา": { en: "Shadow Wing", prefix: "SW", group: "7", id: "2", type: "ข่าวกรอง" },
  "ตาเหยี่ยว": { en: "Hawkeye", prefix: "HW", group: "7", id: "2", type: "วิเคราะห์" },
  "หมอกเทา": { en: "Grey Fog", prefix: "GF", group: "7", id: "2", type: "สังเกตการณ์" },
  "เรดาร์เงียบ": { en: "Silent Radar", prefix: "SR", group: "7", id: "2", type: "ตรวจจับ" },
  "บ่วงเหล็ก": { en: "Iron Snare", prefix: "IS", group: "7", id: "3", type: "จับกุม" },
  "มือเงียบ": { en: "Silent Hand", prefix: "SH", group: "7", id: "3", type: "ควบคุมลับ" },
  "กรงฟ้า": { en: "Blue Cage", prefix: "BC", group: "7", id: "3", type: "คุมพื้นที่" },
  "ตรึงเงา": { en: "Shadow Lock", prefix: "SL", group: "7", id: "3", type: "คุมสถานการณ์" },
  "สายรัดขาว": { en: "White Bind", prefix: "WB", group: "7", id: "3", type: "ควบคุมอ่อนไหว" },
  "ทางลับ": { en: "Backdoor", prefix: "BD", group: "7", id: "4", type: "แทรกซึม" },
  "เงาซ้อน": { en: "Double Shadow", prefix: "DS", group: "7", id: "4", type: "หลอกลวง" },
  "รอยเงียบ": { en: "Silent Trace", prefix: "ST", group: "7", id: "4", type: "แฝงตัว" },
  "ลมหาย": { en: "Vanish Wind", prefix: "VW", group: "7", id: "4", type: "ถอนตัว" },
  "ม่านหมอก": { en: "Mist Curtain", prefix: "MC", group: "7", id: "4", type: "ปกปิด" },
  "ม่านดำ": { en: "Black Veil", prefix: "BV", group: "7", id: "5", type: "ปกปิดข้อมูล" },
  "กุญแจเงา": { en: "Shadow Key", prefix: "SK", group: "7", id: "5", type: "สิทธิ์ลับ" },
  "แฟ้มศูนย์": { en: "Zero File", prefix: "ZF", group: "7", id: "5", type: "ลบร่องรอย" },
  "หมึกดำ": { en: "Black Ink", prefix: "BI", group: "7", id: "5", type: "เอกสารลับ" },
  "รหัสนิ่ง": { en: "Static Code", prefix: "SC", group: "7", id: "5", type: "แช่ข้อมูล" },
  "Black Crow": { en: "Black Crow", prefix: "BC", group: "7", id: "6", type: "ลับสุด" },
  "White Crow": { en: "White Crow", prefix: "WC", group: "7", id: "6", type: "อ่อนไหว" },
  "Grey Crow": { en: "Grey Crow", prefix: "GC", group: "7", id: "6", type: "ก้ำกึ่ง" },
  "Red Crow": { en: "Red Crow", prefix: "RC", group: "7", id: "6", type: "วิกฤต" },
  "Silent Crow": { en: "Silent Crow", prefix: "SC", group: "7", id: "6", type: "เฝ้าระวังลับ" }
};

// ==========================================
// CORE WEB APP SERVICES & AUTHENTICATION
// ==========================================
function doGet(e) {
  if (e && e.parameter && e.parameter.bridge === '1') {
    var bridgeTemplate = HtmlService.createTemplateFromFile('Bridge');
    bridgeTemplate.bridgeOrigin = String(e.parameter.origin || '');
    bridgeTemplate.bridgeChannel = String(e.parameter.channel || '');
    return bridgeTemplate.evaluate()
      .setTitle('Phoenix Command Connector')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  checkAndInitSheets();
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('PHOENIX COMMAND CENTER')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function verifyAdmin(pass) { 
  if (!pass) return false;
  return Object.values(ADMIN_DATABASE).some(admin => admin.pass === pass.toString()); 
}

function checkAdminLogin(user, pass) { 
  return !!(ADMIN_DATABASE[user] && ADMIN_DATABASE[user].pass === pass); 
}

function getAdminName(user) { 
  return ADMIN_DATABASE[user] ? ADMIN_DATABASE[user].name.toUpperCase() : "AGENT UNKNOWN"; 
}

// ==========================================
// 1. MISSIONS MODULE (จัดการภารกิจ)
// ==========================================

// ดึงข้อมูลภารกิจทั้งหมดจากชีต MISSIONS
function getAllMissions() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const s = ss.getSheetByName(SHEET_MISSIONS);
    if (!s || s.getLastRow() < 2) return [];

    const data = s.getRange(2, 1, s.getLastRow() - 1, 10).getValues();
    return data.map(r => ({
      code: r[0],
      name: r[1],
      en: r[2],
      type: r[3],
      details: r[4],
      status: r[5],
      commander: r[6],
      security: r[7],
      target: r[8],
      isSpyMission: r[9] === "SPY"
    })).reverse();
  } catch (e) {
    Logger.log("Error in getAllMissions: " + e.toString());
    return [];
  }
}

// สร้างภารกิจใหม่ (รองรับทั้ง General Ops และ Spy Ops)
function deployMission(data, authPass) {
  // หากเป็น Auto Generate จะเว้นการยืนยันรหัสผ่าน
  if (!data.isAuto && !verifyAdmin(authPass)) return "AUTH_FAILED";

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const s = ss.getSheetByName(SHEET_MISSIONS);
    
    let prefix = "PX";
    let base = "00";
    let opEn = "Unknown Operation";
    let opType = data.isSpyMission ? "ภารกิจสายลับ" : "ปฏิบัติการทั่วไป";

    if (OP_DATA[data.opName]) {
      const op = OP_DATA[data.opName];
      prefix = op.prefix;
      base = op.group + op.id;
      opEn = op.en;
      opType = op.type;
    } else if (data.isSpyMission) {
      prefix = "SPY";
      base = "07";
      opEn = "Spy Mission: " + data.opName;
    }

    let maxSeq = 0;
    if (s.getLastRow() > 1) {
      const vals = s.getRange(2, 1, s.getLastRow() - 1, 1).getValues().flat();
      vals.forEach(v => {
        if (v && v.toString().startsWith(prefix + "-" + base)) {
          let seq = parseInt(v.toString().split("-")[1].substring(base.length));
          if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
        }
      });
    }

    const newCode = `${prefix}-${base}${(maxSeq + 1).toString().padStart(3, '0')}`;
    const status = data.forcedStatus || data.status || "เปิด";
    const missionTag = data.isSpyMission ? "SPY" : "GENERAL";

    s.appendRow([
      newCode,
      data.opName,
      opEn,
      opType,
      data.details || "-",
      status,
      data.commander,
      data.security,
      data.target,
      missionTag
    ]);

    // ถ้าเป็นภารกิจสายลับ ให้อัปเดตสถานะสายลับเป็น Active Duty
    if (data.isSpyMission && data.commander) {
      updateSpyStatusByName(data.commander, "🟢 Active Duty (ปฏิบัติภารกิจ)");
    }

    return "SUCCESS";
  } catch (e) {
    Logger.log("Error in deployMission: " + e.toString());
    return "ERROR";
  }
}

// อัปเดตสถานะภารกิจ
function updateMissionStatus(code, newStatus, authPass) {
  if (!verifyAdmin(authPass)) return "AUTH_FAILED";
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const s = ss.getSheetByName(SHEET_MISSIONS);
    if (s.getLastRow() < 2) return "NOT_FOUND";

    const data = s.getRange(2, 1, s.getLastRow() - 1, 1).getValues();
    for (let i = 0; i < data.length; i++) {
      if (data[i][0].toString() === code.toString()) {
        s.getRange(i + 2, 6).setValue(newStatus);
        return "SUCCESS";
      }
    }
    return "NOT_FOUND";
  } catch (e) {
    return "ERROR";
  }
}

// ระบบสุ่มสร้างภารกิจอัตโนมัติ
function autoGenerateMission() {
  const opKeys = Object.keys(OP_DATA);
  const randomOpName = opKeys[Math.floor(Math.random() * opKeys.length)];
  const opInfo = OP_DATA[randomOpName];
  const type = opInfo.type;

  let commander = "PHOENIX LEADER";
  let target = "พื้นที่เป้าหมายรหัสลับ";

  const swatTargets = ["แหล่งกบดานเขต 7", "โกดังร้างชายแดน", "อาคารพาณิชย์ต้องสงสัย", "พื้นที่ควบคุมพิเศษ A1"];
  const fbiTargets = ["สถานีส่งสัญญาณลับ", "เครือข่ายเซิร์ฟเวอร์ใต้ดิน", "จุดนัดพบสายลับ 03", "ท่าเรือส่งออกสินค้าข่าวกรอง"];
  const phoenixTargets = ["พิกัดเป้าหมายระดับ 0", "จุดพิกัดดาวเทียมทางนารี", "ฐานข้อมูลส่วนกลาง"];

  if (type.includes("จับกุม") || type.includes("คุมพื้นที่") || type.includes("วิกฤต") || type.includes("ยุติภัย")) {
    commander = "hector P.";
    target = swatTargets[Math.floor(Math.random() * swatTargets.length)];
  } else if (type.includes("ข่าวกรอง") || type.includes("สอดเนม") || type.includes("แทรกซึม") || type.includes("ตรวจจับ")) {
    commander = "victor R.";
    target = fbiTargets[Math.floor(Math.random() * fbiTargets.length)];
  } else {
    target = phoenixTargets[Math.floor(Math.random() * phoenixTargets.length)];
  }

  const statusList = ["เปิด", "เปิด", "เปิด", "พักภาระกิจ"];
  const randomStatus = statusList[Math.floor(Math.random() * statusList.length)];

  const autoData = {
    isSpyMission: false,
    isAuto: true,
    opName: randomOpName,
    target: target,
    details: `เข้าสู่สถานะเริ่มปฏิบัติการ ${opInfo.en} ตรวจพบความผิดปกติระดับ ${opInfo.id} แจ้งเจ้าหน้าที่เข้าดำเนินการตามลำดับ`,
    security: "Level 3: SECRET",
    commander: commander,
    forcedStatus: randomStatus
  };

  return deployMission(autoData, "");
}

// ==========================================
// 2. SPY DATABASE MODULE (จัดการสายลับ)
// ==========================================

function getSpyData() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let s = ss.getSheetByName(SHEET_SPY);
    if (!s || s.getLastRow() < 2) return [];

    return s.getRange(2, 1, s.getLastRow() - 1, 5).getValues().map(r => ({
      id: r[0], 
      name: r[1], 
      status: r[2], 
      skill: r[3], 
      field: r[4]
    }));
  } catch (e) {
    return [];
  }
}

function addNewSpyAgent(data, authPass) {
  if (!verifyAdmin(authPass)) return "AUTH_FAILED";
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let s = ss.getSheetByName(SHEET_SPY);
    if (!s) {
      s = ss.insertSheet(SHEET_SPY);
      s.appendRow(["ID", "Name", "Status", "Skill", "Field"]);
    }

    s.appendRow([
      data.id,
      data.name,
      data.status || "🔵 Available (ว่าง / พร้อมปฏิบัติการ)",
      data.skill || "-",
      data.field || "-"
    ]);
    return "SUCCESS";
  } catch (e) {
    return "ERROR";
  }
}

function updateSpyStatus(spyId, newStatus, authPass) {
  if (!verifyAdmin(authPass)) return "AUTH_FAILED";
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const s = ss.getSheetByName(SHEET_SPY);
    if (s.getLastRow() < 2) return "NOT_FOUND";

    const data = s.getRange(2, 1, s.getLastRow() - 1, 1).getValues();
    for (let i = 0; i < data.length; i++) {
      if (data[i][0].toString() === spyId.toString()) {
        s.getRange(i + 2, 3).setValue(newStatus);
        return "SUCCESS";
      }
    }
    return "NOT_FOUND";
  } catch (e) {
    return "ERROR";
  }
}

// Helper: อัปเดตสถานะสายลับตามชื่ออัตโนมัติ
function updateSpyStatusByName(spyName, newStatus) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const s = ss.getSheetByName(SHEET_SPY);
    if (!s || s.getLastRow() < 2) return;

    const data = s.getRange(2, 1, s.getLastRow() - 1, 2).getValues();
    for (let i = 0; i < data.length; i++) {
      if (data[i][1].toString() === spyName.toString()) {
        s.getRange(i + 2, 3).setValue(newStatus);
        break;
      }
    }
  } catch (e) {}
}

// ==========================================
// 3. SYSTEM STATUS & SITUATION MODULE
// ==========================================

function getFullStatus() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const s = ss.getSheetByName(SHEET_STATUS);
    if (!s || s.getLastRow() < 2) return { center: "🟢 Green Code", org: "⚪ White Code" };

    const data = s.getRange(2, 1, 1, 2).getValues()[0];
    return { center: data[0], org: data[1] };
  } catch (e) {
    return { center: "🟢 Green Code", org: "⚪ White Code" };
  }
}

function updateSystemStatus(type, statusCode, authPass) {
  if (!verifyAdmin(authPass)) return "AUTH_FAILED";
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const s = ss.getSheetByName(SHEET_STATUS);
    s.getRange(2, type === 'center' ? 1 : 2).setValue(statusCode);
    return "SUCCESS";
  } catch (e) {
    return "ERROR";
  }
}

function getCurrentSituation() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const s = ss.getSheetByName(SHEET_STATUS);
    if (!s || s.getLastRow() < 2) return {};

    const r = s.getRange(2, 4, 1, 5).getValues()[0];
    return { code: r[0], eng: r[1], th: r[2], des: r[3], note: r[4] };
  } catch (e) {
    return {};
  }
}

function updateCurrentSituation(sitData, authPass) {
  if (!verifyAdmin(authPass)) return "AUTH_FAILED";
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const s = ss.getSheetByName(SHEET_STATUS);
    s.getRange(2, 4, 1, 5).setValues([[sitData.code, sitData.eng, sitData.th, sitData.des, sitData.note]]);
    return "SUCCESS";
  } catch (e) {
    return "ERROR";
  }
}

function getSituationMasterData() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const s = ss.getSheetByName(SHEET_DATA_CODE);
    if (!s || s.getLastRow() < 2) return [];

    const data = s.getRange(2, 1, s.getLastRow() - 1, 4).getValues();
    return data.map(r => ({
      code: r[0],
      eng: r[1],
      th: r[2],
      des: r[3]
    }));
  } catch (e) {
    return [];
  }
}

// ==========================================
// 4. INITIALIZATION & CHECKER
// ==========================================
function checkAndInitSheets() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (!ss.getSheetByName(SHEET_STATUS)) {
      let s = ss.insertSheet(SHEET_STATUS);
      s.appendRow(["Center", "Org", "Update", "Sit_Code", "Sit_Eng", "Sit_Th", "Sit_Des", "Sit_Note"]);
      s.appendRow(["🟢 Green Code", "⚪ White Code", new Date(), "NR01", "STATUS-NORMAL", "สถานะปกติ", "การดำเนินงานเป็นปกติ", "-"]);
    }

    if (!ss.getSheetByName(SHEET_MISSIONS)) {
      let s = ss.insertSheet(SHEET_MISSIONS);
      s.appendRow(["Code", "Name", "En_Name", "Type", "Details", "Status", "Commander", "Security", "Target", "Tag"]);
    }

    if (!ss.getSheetByName(SHEET_SPY)) {
      let s = ss.insertSheet(SHEET_SPY);
      s.appendRow(["ID", "Name", "Status", "Skill", "Field"]);
    }
  } catch (e) {
    Logger.log("Init error: " + e.toString());
  }
}
