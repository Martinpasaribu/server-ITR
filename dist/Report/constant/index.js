"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeBroken = exports.TypeReport = void 0;
// Jenis laporan
const TypeReport = (status) => {
    const map = {
        FK: "Fasilitas Kamar",
        FU: "Fasilitas Umum",
        K: "Komplain",
    };
    return map[status] || status; // fallback: tampilkan kode asli
};
exports.TypeReport = TypeReport;
// Jenis kerusakan
const TypeBroken = (status) => {
    const map = {
        R: "Ringan",
        S: "Sedang",
        B: "Berat",
    };
    return map[status] || status;
};
exports.TypeBroken = TypeBroken;
